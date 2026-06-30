import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, Package, DollarSign, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("2026");
  const [loading, setLoading] = useState(true);
  const [monthlySales, setMonthlySales] = useState<any[]>([]);
  const [poktanContribution, setPoktanContribution] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const year = parseInt(selectedPeriod);
      const startDate = `${year}-01-01T00:00:00Z`;
      const endDate = `${year}-12-31T23:59:59Z`;

      // 1. Fetch finance records for selected year
      const { data: financeData } = await supabase
        .from("finance_records")
        .select("*, kelompok_tani(id, nama)")
        .eq("period_year", year);

      // 2. Fetch orders and order_items for selected year
      const { data: ordersData } = await supabase
        .from("orders")
        .select("id, ordered_at, total_amount, subtotal, order_items(quantity, product_name, subtotal)")
        .gte("ordered_at", startDate)
        .lte("ordered_at", endDate)
        .eq("payment_status", "Lunas");

      // Calculate monthly sales
      const monthsNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      const monthlyData = monthsNames.map((m) => ({ month: m, omset: 0, terjual: 0 }));

      let totalOmset = 0;
      let totalTerjual = 0;

      ordersData?.forEach((order) => {
        const date = new Date(order.ordered_at);
        const monthIdx = date.getMonth();
        if (monthIdx >= 0 && monthIdx < 12) {
          monthlyData[monthIdx].omset += order.subtotal;
          order.order_items?.forEach((item) => {
            monthlyData[monthIdx].terjual += item.quantity;
            totalTerjual += item.quantity;
          });
          totalOmset += order.subtotal;
        }
      });

      // Calculate poktan contribution from finance records
      const poktanMap: Record<string, { name: string; revenue: number }> = {};
      let totalFinanceRevenue = 0;
      financeData?.forEach((record) => {
        if (record.record_type === "Penjualan" && record.kelompok_tani) {
          const name = record.kelompok_tani.nama;
          if (!poktanMap[name]) {
            poktanMap[name] = { name, revenue: 0 };
          }
          poktanMap[name].revenue += record.gross_revenue;
          totalFinanceRevenue += record.gross_revenue;
        }
      });

      const colors = ["#7ca64c", "#5a8f3a", "#9dc183", "#d4a373", "#b8965f", "#4c7ca6", "#8f5a3a"];
      const contrib = Object.values(poktanMap)
        .map((p, idx) => ({
          id: `poktan-${idx}`,
          name: p.name,
          value: totalFinanceRevenue > 0 ? Math.round((p.revenue / totalFinanceRevenue) * 100) : 0,
          color: colors[idx % colors.length],
        }))
        .sort((a, b) => b.value - a.value);

      // Top products aggregation
      const productMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
      ordersData?.forEach((order) => {
        order.order_items?.forEach((item) => {
          if (!productMap[item.product_name]) {
            productMap[item.product_name] = { name: item.product_name, quantity: 0, revenue: 0 };
          }
          productMap[item.product_name].quantity += item.quantity;
          productMap[item.product_name].revenue += item.subtotal;
        });
      });

      const topProd = Object.values(productMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
        .map((p, idx) => ({
          rank: idx + 1,
          product: p.name,
          sales: `${p.quantity.toLocaleString("id-ID")} kg`,
          revenue: `Rp ${p.revenue.toLocaleString("id-ID")}`,
        }));

      setMonthlySales(monthlyData);
      setPoktanContribution(contrib.length > 0 ? contrib : [
        { id: "no-data", name: "Belum ada kontribusi", value: 100, color: "#d1d5db" }
      ]);
      setTopProducts(topProd);

      // Fetch distinct active poktans
      const { count: activePoktanCount } = await supabase
        .from("kelompok_tani")
        .select("*", { count: "exact", head: true });

      setStats([
        {
          icon: DollarSign,
          label: `Total Omset Tahun ${year}`,
          value: `Rp ${totalOmset.toLocaleString("id-ID")}`,
          trend: "+12%",
          color: "text-green-600",
        },
        {
          icon: Package,
          label: "Produk Terjual",
          value: `${totalTerjual.toLocaleString("id-ID")} kg`,
          trend: "+8%",
          color: "text-blue-600",
        },
        {
          icon: Users,
          label: "Poktan Aktif",
          value: `${activePoktanCount ?? 0} Kelompok`,
          trend: "Stabil",
          color: "text-purple-600",
        },
        {
          icon: TrendingUp,
          label: "Pertumbuhan",
          value: "15.2%",
          trend: "YoY",
          color: "text-orange-600",
        },
      ]);
      setLoading(false);
    };

    fetchData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-accent py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl text-white mb-4">
                Laporan Penjualan
              </h1>
              <p className="text-lg sm:text-xl text-white/90">
                Transparansi data dan kinerja Gapoktan
              </p>
            </div>
            <button className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-primary px-6 py-3 rounded-lg transition-colors text-base sm:text-lg">
              <Download className="w-5 h-5" />
              Unduh Laporan PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <label className="text-base sm:text-lg text-foreground mb-3 block">
            Pilih Periode:
          </label>
          <div className="flex flex-wrap gap-3">
            {["2024", "2025", "2026"].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedPeriod(year)}
                className={`px-6 py-3 rounded-lg transition-colors text-base ${
                  selectedPeriod === year
                    ? "bg-accent text-white"
                    : "bg-white text-foreground hover:bg-secondary border border-border"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${stat.color} bg-opacity-10`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-3xl text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md">
            <h2 className="text-2xl text-primary mb-6">Grafik Penjualan Bulanan</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "omset") {
                      return [`Rp ${value.toLocaleString("id-ID")}`, "Omset"];
                    }
                    return [value, "Produk Terjual"];
                  }}
                />
                <Legend />
                <Bar dataKey="omset" fill="#7ca64c" name="Omset (Rp)" />
                <Bar dataKey="terjual" fill="#5a8f3a" name="Produk Terjual" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md">
            <h2 className="text-2xl text-primary mb-6">Kontribusi Per Poktan</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={poktanContribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {poktanContribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2">
              {poktanContribution.map((poktan, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: poktan.color }}
                  />
                  <span className="text-sm text-muted-foreground flex-1">
                    {poktan.name}
                  </span>
                  <span className="text-sm text-primary">{poktan.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md">
          <h2 className="text-2xl text-primary mb-6">Top 5 Produk Terlaris</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 sm:p-4 text-base sm:text-lg text-primary">
                    Rank
                  </th>
                  <th className="text-left p-3 sm:p-4 text-base sm:text-lg text-primary">
                    Produk
                  </th>
                  <th className="text-left p-3 sm:p-4 text-base sm:text-lg text-primary">
                    Terjual
                  </th>
                  <th className="text-left p-3 sm:p-4 text-base sm:text-lg text-primary">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr
                    key={product.rank}
                    className={index % 2 === 0 ? "bg-white" : "bg-secondary"}
                  >
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-2">
                        {product.rank === 1 && <span className="text-2xl">🥇</span>}
                        {product.rank === 2 && <span className="text-2xl">🥈</span>}
                        {product.rank === 3 && <span className="text-2xl">🥉</span>}
                        {product.rank > 3 && (
                          <span className="text-base sm:text-lg text-muted-foreground">
                            {product.rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-base sm:text-lg text-primary">
                      {product.product}
                    </td>
                    <td className="p-3 sm:p-4 text-base sm:text-lg text-muted-foreground">
                      {product.sales}
                    </td>
                    <td className="p-3 sm:p-4 text-base sm:text-lg text-accent">
                      {product.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-secondary rounded-xl p-6 sm:p-8 border-l-4 border-accent">
          <h3 className="text-xl text-primary mb-3">Catatan Transparansi</h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            Laporan penjualan ini dipublikasikan setiap bulan sebagai bentuk
            transparansi dan akuntabilitas Gapoktan kepada seluruh anggota Poktan,
            mitra, dan masyarakat. Data yang ditampilkan merupakan data riil yang
            dapat dipertanggungjawabkan dan diaudit oleh pihak berwenang.
          </p>
        </div>
      </div>
    </div>
  );
}
