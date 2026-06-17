import { Download, Filter, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState } from "react";

export function GapoktanFinance() {
  const [selectedPeriod, setSelectedPeriod] = useState("2026-06");

  const monthlyRevenue = [
    { id: "jan", month: "Jan", total: 45000000, gapoktanFee: 2250000, poktanShare: 42750000 },
    { id: "feb", month: "Feb", total: 52000000, gapoktanFee: 2600000, poktanShare: 49400000 },
    { id: "mar", month: "Mar", total: 48000000, gapoktanFee: 2400000, poktanShare: 45600000 },
    { id: "apr", month: "Apr", total: 58000000, gapoktanFee: 2900000, poktanShare: 55100000 },
    { id: "may", month: "Mei", total: 63000000, gapoktanFee: 3150000, poktanShare: 59850000 },
    { id: "jun", month: "Jun", total: 55000000, gapoktanFee: 2750000, poktanShare: 52250000 },
  ];

  const poktanRevenue = [
    { id: "poktan-a", name: "Poktan A", value: 28, revenue: 15400000, color: "#2d5016" },
    { id: "poktan-b", name: "Poktan B", value: 22, revenue: 12100000, color: "#5a8f3a" },
    { id: "poktan-c", name: "Poktan C", value: 18, revenue: 9900000, color: "#7ca64c" },
    { id: "poktan-d", name: "Poktan D", value: 15, revenue: 8250000, color: "#9dc183" },
    { id: "poktan-other", name: "Lainnya", value: 17, revenue: 9350000, color: "#b8d4a8" },
  ];

  const summary = {
    totalRevenue: 55000000,
    gapoktanFee: 2750000,
    poktanShare: 52250000,
    feePercentage: 5,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-primary mb-2">
            Laporan Keuangan & Bagi Hasil
          </h2>
          <p className="text-base text-muted-foreground">
            Konsolidasi keuangan dan distribusi hasil penjualan
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors">
          <Download className="w-5 h-5" />
          Cetak RAT
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-2 text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
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
            <label className="block text-sm mb-2 text-foreground flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter Poktan
            </label>
            <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Semua Poktan</option>
              <option>Poktan Harapan Jaya</option>
              <option>Poktan Maju Bersama</option>
              <option>Poktan Berkah Tani</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg transition-colors">
              Terapkan Filter
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-muted-foreground mb-2">Total Pendapatan</p>
          <p className="text-3xl text-primary mb-1">
            Rp {summary.totalRevenue.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-accent">Juni 2026</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-muted-foreground mb-2">Biaya Admin Gapoktan ({summary.feePercentage}%)</p>
          <p className="text-3xl" style={{ color: "var(--accent)" }}>
            Rp {summary.gapoktanFee.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-muted-foreground">Untuk operasional</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-muted-foreground mb-2">Bagian Poktan</p>
          <p className="text-3xl" style={{ color: "var(--status-success)" }}>
            Rp {summary.poktanShare.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-muted-foreground">Untuk dibagikan</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl text-primary mb-6">Pendapatan Bulanan</h3>
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

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl text-primary mb-6">Distribusi Per Poktan</h3>
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
                dataKey="value"
              >
                {poktanRevenue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-2">
            {poktanRevenue.map((poktan, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: poktan.color }}
                  />
                  <span className="text-sm text-muted-foreground">{poktan.name}</span>
                </div>
                <span className="text-sm text-primary">
                  Rp {poktan.revenue.toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl text-primary">Detail Bagi Hasil Per Poktan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "var(--primary)" }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm text-white">Poktan</th>
                <th className="px-6 py-4 text-left text-sm text-white">Total Penjualan</th>
                <th className="px-6 py-4 text-left text-sm text-white">Fee Gapoktan (5%)</th>
                <th className="px-6 py-4 text-left text-sm text-white">Bagian Poktan</th>
              </tr>
            </thead>
            <tbody>
              {poktanRevenue.map((poktan, index) => {
                const fee = poktan.revenue * 0.05;
                const share = poktan.revenue * 0.95;
                return (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-background"}
                  >
                    <td className="px-6 py-4 text-sm text-primary">{poktan.name}</td>
                    <td className="px-6 py-4 text-sm">Rp {poktan.revenue.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: "var(--accent)" }}>
                      Rp {fee.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "var(--status-success)" }}>
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
      <div className="bg-accent/10 rounded-xl p-6 border-l-4" style={{ borderColor: "var(--accent)" }}>
        <h3 className="text-lg text-primary mb-2">Catatan Transparansi Keuangan</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Laporan keuangan ini dipublikasikan setiap bulan sebagai bentuk transparansi
          kepada seluruh anggota Poktan. Biaya administrasi Gapoktan sebesar 5% digunakan
          untuk operasional, pemeliharaan website, dan pengembangan sistem. Laporan lengkap
          dapat diunduh untuk keperluan RAT (Rapat Anggota Tahunan).
        </p>
      </div>
    </div>
  );
}
