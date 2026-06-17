import { Package, DollarSign, Weight, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function PoktanDashboard() {
  const stats = [
    {
      icon: Package,
      label: "Produk Aktif",
      value: "12",
      change: "+2 bulan ini",
      color: "var(--primary)",
    },
    {
      icon: DollarSign,
      label: "Omset Bulan Ini",
      value: "Rp 8.450.000",
      change: "+15% dari bulan lalu",
      color: "var(--status-success)",
    },
    {
      icon: Weight,
      label: "Total Terjual",
      value: "1.250 Kg",
      change: "Bulan ini",
      color: "var(--secondary)",
    },
    {
      icon: TrendingUp,
      label: "Produk Terlaris",
      value: "Beras Organik",
      change: "650 kg terjual",
      color: "var(--accent)",
    },
  ];

  const weeklyData = [
    { id: "week-1", week: "Minggu 1", beras: 120, sayur: 85, jagung: 45 },
    { id: "week-2", week: "Minggu 2", beras: 150, sayur: 95, jagung: 55 },
    { id: "week-3", week: "Minggu 3", beras: 180, sayur: 110, jagung: 60 },
    { id: "week-4", week: "Minggu 4", beras: 200, sayur: 120, jagung: 70 },
  ];

  const recentProducts = [
    { name: "Beras Organik Premium", stok: 450, status: "Aktif", statusColor: "var(--status-success)" },
    { name: "Sayuran Segar", stok: 85, status: "Aktif", statusColor: "var(--status-success)" },
    { name: "Jagung Manis", stok: 15, status: "Stok Menipis", statusColor: "var(--status-pending)" },
    { name: "Cabai Merah", stok: 0, status: "Habis", statusColor: "var(--status-error)" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl text-primary mb-2">
          Selamat Datang, Poktan Harapan Jaya
        </h2>
        <p className="text-base text-muted-foreground">
          Ringkasan kinerja kelompok tani Anda
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-3xl text-primary mb-2">{stat.value}</p>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-xs text-accent">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl text-primary mb-6">
            Tren Penjualan Mingguan
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="beras"
                stroke="#2d5016"
                strokeWidth={2}
                name="Beras (Kg)"
              />
              <Line
                type="monotone"
                dataKey="sayur"
                stroke="#5a8f3a"
                strokeWidth={2}
                name="Sayur (Kg)"
              />
              <Line
                type="monotone"
                dataKey="jagung"
                stroke="#7ca64c"
                strokeWidth={2}
                name="Jagung (Kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Products Status */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl text-primary mb-6">Status Produk Terkini</h3>
          <div className="space-y-4">
            {recentProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-background rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-base text-primary mb-1">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Stok: {product.stok} kg
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-sm text-white"
                  style={{ backgroundColor: product.statusColor }}
                >
                  {product.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-xl text-primary mb-6">Aksi Cepat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <button className="flex flex-col items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white px-6 py-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105">
            <Package className="w-8 h-8" />
            <span className="text-lg font-semibold">Tambah Produk Baru</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-3 bg-white hover:bg-background text-primary border-2 border-secondary px-6 py-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105">
            <TrendingUp className="w-8 h-8 text-primary" />
            <span className="text-lg font-semibold">Update Stok</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-white px-6 py-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105">
            <DollarSign className="w-8 h-8" />
            <span className="text-lg font-semibold">Lihat Laporan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
