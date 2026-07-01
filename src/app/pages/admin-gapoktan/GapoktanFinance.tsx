import { useState, useEffect } from "react";
import { Download, Filter, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "../../../lib/supabase";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export function GapoktanFinance() {
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    return `${now.getFullYear()}-${mm}`;
  });
  const [selectedPoktan, setSelectedPoktan] = useState("");
  const [poktans, setPoktans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [poktanRevenue, setPoktanRevenue] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    gapoktanFee: 0,
    poktanShare: 0,
    feePercentage: 5,
  });

  useEffect(() => {
    loadPoktans();
  }, []);

  useEffect(() => {
    loadFinanceData();
  }, [selectedPeriod, selectedPoktan]);

  const loadPoktans = async () => {
    try {
      const { data } = await supabase
        .from("kelompok_tani")
        .select("id, nama")
        .order("nama", { ascending: true });
      if (data) setPoktans(data);
    } catch (err) {
      console.error("Error loading poktans:", err);
    }
  };

  const loadFinanceData = async () => {
    setLoading(true);
    try {
      const [yearStr, monthStr] = selectedPeriod.split("-");
      const year = parseInt(yearStr) || new Date().getFullYear();
      const month = parseInt(monthStr) || new Date().getMonth() + 1;

      // Calculate start and end ISO strings for the month (local midnight to end of day)
      const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0).toISOString();
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

      // 1. Fetch current month's orders (filtered by poktan if selected)
      let query = supabase
        .from("orders")
        .select("*, kelompok_tani(id, nama)")
        .eq("payment_status", "Lunas")
        .gte("ordered_at", startOfMonth)
        .lte("ordered_at", endOfMonth);

      if (selectedPoktan) {
        query = query.eq("poktan_id", selectedPoktan);
      }

      const { data: monthRecords } = await query;

      // Calculate summary for current month
      let totalRevenue = 0;
      let gapoktanFee = 0;
      let poktanShare = 0;

      monthRecords?.forEach((r) => {
        totalRevenue += r.subtotal;
        gapoktanFee += r.subtotal * 0.05;
        poktanShare += r.subtotal * 0.95;
      });

      setSummary({
        totalRevenue,
        gapoktanFee,
        poktanShare,
        feePercentage: 5,
      });

      // 2. Fetch full year's data for the trend chart (monthly aggregate)
      const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0).toISOString();
      const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999).toISOString();

      let yearQuery = supabase
        .from("orders")
        .select("*")
        .eq("payment_status", "Lunas")
        .gte("ordered_at", startOfYear)
        .lte("ordered_at", endOfYear);

      if (selectedPoktan) {
        yearQuery = yearQuery.eq("poktan_id", selectedPoktan);
      }

      const { data: yearRecords } = await yearQuery;

      const monthsShort = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      const monthlyAgg = monthsShort.map((m, idx) => {
        let monthTotal = 0;
        let monthFee = 0;
        let monthShare = 0;

        yearRecords?.forEach((r) => {
          const ordDate = new Date(r.ordered_at);
          if (ordDate.getMonth() === idx) {
            monthTotal += r.subtotal;
            monthFee += r.subtotal * 0.05;
            monthShare += r.subtotal * 0.95;
          }
        });

        return {
          month: m,
          total: monthTotal,
          gapoktanFee: monthFee,
          poktanShare: monthShare,
        };
      });

      setMonthlyRevenue(monthlyAgg);

      // 3. Distribution per Poktan for current month (pie chart and table)
      const poktanMap: Record<string, { name: string; revenue: number }> = {};
      let totalMonthlyRevenue = 0;

      monthRecords?.forEach((r) => {
        if (r.kelompok_tani) {
          const name = r.kelompok_tani.nama;
          if (!poktanMap[name]) {
            poktanMap[name] = { name, revenue: 0 };
          }
          poktanMap[name].revenue += r.subtotal;
          totalMonthlyRevenue += r.subtotal;
        }
      });

      const colors = ["#2d5016", "#5a8f3a", "#7ca64c", "#9dc183", "#b8d4a8", "#b8965f", "#c8a2c8"];
      const dist = Object.values(poktanMap)
        .map((p, idx) => ({
          id: `poktan-${idx}`,
          name: p.name,
          value: totalMonthlyRevenue > 0 ? Math.round((p.revenue / totalMonthlyRevenue) * 100) : 0,
          revenue: p.revenue,
          color: colors[idx % colors.length],
        }))
        .sort((a, b) => b.revenue - a.revenue);

      setPoktanRevenue(dist.length > 0 ? dist : [
        { id: "empty", name: "Belum Ada Data", value: 100, revenue: 0, color: "#d1d5db" }
      ]);
    } catch (err) {
      console.error("Error loading financial reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatMonthName = (periodStr: string) => {
    const [y, m] = periodStr.split("-");
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  if (loading && poktanRevenue.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner message="Memuat laporan keuangan..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-primary mb-2 font-semibold">
            Laporan Keuangan & Bagi Hasil
          </h2>
          <p className="text-base text-muted-foreground">
            Konsolidasi keuangan dan distribusi hasil penjualan
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-md"
        >
          <Download className="w-5 h-5" />
          Cetak RAT / Laporan
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-2 text-foreground font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              Pilih Periode
            </label>
            <input
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-foreground font-medium flex items-center gap-2">
              <Filter className="w-4 h-4 text-accent" />
              Filter Poktan
            </label>
            <select
              value={selectedPoktan}
              onChange={(e) => setSelectedPoktan(e.target.value)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Semua Poktan</option>
              {poktans.map((p) => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={loadFinanceData}
              className="w-full bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-border">
          <p className="text-sm font-semibold text-muted-foreground mb-2">Total Pendapatan</p>
          <p className="text-3xl font-bold text-primary mb-1">
            Rp {summary.totalRevenue.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-accent font-medium">{formatMonthName(selectedPeriod)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-border">
          <p className="text-sm font-semibold text-muted-foreground mb-2">Biaya Admin Gapoktan ({summary.feePercentage}%)</p>
          <p className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
            Rp {summary.gapoktanFee.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-muted-foreground font-medium">Untuk kas operasional</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-border">
          <p className="text-sm font-semibold text-muted-foreground mb-2">Bagian Poktan</p>
          <p className="text-3xl font-bold" style={{ color: "#5a8f3a" }}>
            Rp {summary.poktanShare.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-muted-foreground font-medium">Didistribusikan ke Poktan</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-border">
          <h3 className="text-xl text-primary mb-6 font-semibold">Pendapatan Bulanan (Tahun {selectedPeriod.split("-")[0]})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`}
              />
              <Legend />
              <Bar dataKey="poktanShare" fill="#2d5016" name="Bagian Poktan" stackId="a" />
              <Bar dataKey="gapoktanFee" fill="#5a8f3a" name="Fee Gapoktan" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-border">
          <h3 className="text-xl text-primary mb-6 font-semibold">Distribusi Per Poktan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={poktanRevenue}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {poktanRevenue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-2 max-h-[150px] overflow-y-auto pr-1">
            {poktanRevenue.map((poktan, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: poktan.color }}
                  />
                  <span className="text-sm font-semibold text-muted-foreground">{poktan.name}</span>
                </div>
                <span className="text-sm text-primary font-bold">
                  Rp {poktan.revenue.toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl text-primary font-semibold">Detail Bagi Hasil Per Poktan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "var(--primary)" }}>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm text-white font-semibold">Poktan</th>
                <th className="px-6 py-4 text-left text-sm text-white font-semibold">Total Penjualan</th>
                <th className="px-6 py-4 text-left text-sm text-white font-semibold">Fee Gapoktan (5%)</th>
                <th className="px-6 py-4 text-left text-sm text-white font-semibold">Bagian Poktan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {poktanRevenue.filter(p => p.name !== "Belum Ada Data").map((poktan, index) => {
                const fee = poktan.revenue * 0.05;
                const share = poktan.revenue * 0.95;
                return (
                  <tr
                    key={index}
                    className="hover:bg-background/25 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-primary font-semibold">{poktan.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground font-semibold">Rp {poktan.revenue.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 text-sm font-bold" style={{ color: "var(--accent)" }}>
                      Rp {fee.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold" style={{ color: "#5a8f3a" }}>
                      Rp {share.toLocaleString("id-ID")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="bg-accent/10 rounded-xl p-6 border-l-4 border-accent">
        <h3 className="text-lg text-primary mb-2 font-semibold">Catatan Transparansi Keuangan</h3>
        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
          Laporan keuangan ini dipublikasikan setiap bulan sebagai bentuk transparansi
          kepada seluruh anggota Poktan. Biaya administrasi Gapoktan sebesar 5% digunakan
          untuk operasional, pemeliharaan website, dan pengembangan sistem. Laporan lengkap
          dapat diunduh untuk keperluan RAT (Rapat Anggota Tahunan).
        </p>
      </div>
    </div>
  );
}
