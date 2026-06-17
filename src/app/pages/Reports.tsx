import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, Package, DollarSign, Users } from "lucide-react";
import { useState } from "react";

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("2026");

  const monthlySales = [
    { id: "jan", month: "Jan", omset: 45000000, terjual: 3200 },
    { id: "feb", month: "Feb", omset: 52000000, terjual: 3800 },
    { id: "mar", month: "Mar", omset: 48000000, terjual: 3500 },
    { id: "apr", month: "Apr", omset: 58000000, terjual: 4200 },
    { id: "may", month: "Mei", omset: 63000000, terjual: 4600 },
    { id: "jun", month: "Jun", omset: 55000000, terjual: 4000 },
  ];

  const poktanContribution = [
    { id: "poktan-1", name: "Poktan Harapan Jaya", value: 28, color: "#7ca64c" },
    { id: "poktan-2", name: "Poktan Maju Bersama", value: 22, color: "#5a8f3a" },
    { id: "poktan-3", name: "Poktan Berkah Tani", value: 18, color: "#9dc183" },
    { id: "poktan-4", name: "Poktan Tani Makmur", value: 15, color: "#d4a373" },
    { id: "poktan-other", name: "Lainnya", value: 17, color: "#b8965f" },
  ];

  const topProducts = [
    { rank: 1, product: "Beras Organik Premium", sales: "1,250 kg", revenue: "Rp 18.750.000" },
    { rank: 2, product: "Paket Sayuran Segar", sales: "850 paket", revenue: "Rp 29.750.000" },
    { rank: 3, product: "Jagung Manis Organik", sales: "680 kg", revenue: "Rp 8.160.000" },
    { rank: 4, product: "Cabai Merah Segar", sales: "420 kg", revenue: "Rp 18.900.000" },
    { rank: 5, product: "Beras Merah Organik", sales: "380 kg", revenue: "Rp 6.840.000" },
  ];

  const stats = [
    {
      icon: DollarSign,
      label: "Total Omset Juni 2026",
      value: "Rp 55.000.000",
      trend: "+12%",
      color: "text-green-600",
    },
    {
      icon: Package,
      label: "Produk Terjual",
      value: "4.000 unit",
      trend: "+8%",
      color: "text-blue-600",
    },
    {
      icon: Users,
      label: "Poktan Aktif",
      value: "24 Kelompok",
      trend: "Stabil",
      color: "text-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Pertumbuhan",
      value: "15,2%",
      trend: "YoY",
      color: "text-orange-600",
    },
  ];

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
