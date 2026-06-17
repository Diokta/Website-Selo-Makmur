import { ShoppingCart, DollarSign, Package, Users, AlertCircle, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function GapoktanDashboard() {
  const stats = [
    {
      icon: ShoppingCart,
      label: "Total Transaksi",
      value: "156",
      sublabel: "Bulan ini",
      pending: "12 Menunggu",
      color: "var(--secondary)",
    },
    {
      icon: DollarSign,
      label: "Pendapatan Total",
      value: "Rp 85.450.000",
      sublabel: "Bulan ini",
      pending: "+18% vs bulan lalu",
      color: "var(--status-success)",
    },
    {
      icon: Package,
      label: "Produk Baru",
      value: "8",
      sublabel: "Menunggu approval",
      pending: "3 dari Poktan A",
      color: "var(--status-pending)",
    },
    {
      icon: Users,
      label: "Poktan Aktif",
      value: "24",
      sublabel: "Kelompok tani",
      pending: "150 petani total",
      color: "var(--primary)",
    },
  ];

  const poktanPerformance = [
    { id: "poktan-a", name: "Poktan A", omset: 12500000, produk: 15 },
    { id: "poktan-b", name: "Poktan B", omset: 9800000, produk: 12 },
    { id: "poktan-c", name: "Poktan C", omset: 11200000, produk: 10 },
    { id: "poktan-d", name: "Poktan D", omset: 8500000, produk: 9 },
    { id: "poktan-e", name: "Poktan E", omset: 10100000, produk: 11 },
    { id: "poktan-other", name: "Lainnya", omset: 33350000, produk: 45 },
  ];

  const notifications = [
    {
      icon: ShoppingCart,
      title: "5 Pesanan Menunggu Konfirmasi Pembayaran",
      subtitle: "Total nilai Rp 2.450.000",
      time: "1 jam lalu",
      color: "var(--primary)",
      action: "Lihat",
    },
    {
      icon: AlertCircle,
      title: "Stok Beras Organik Menipis",
      subtitle: "Poktan Maju Bersama - Sisa 25 kg",
      time: "2 jam lalu",
      color: "var(--status-error)",
      action: "Periksa",
    },
    {
      icon: Package,
      title: "3 Produk Baru Ditambahkan",
      subtitle: "Cabai, Tomat, Kangkung dari Poktan Berkah Tani",
      time: "3 jam lalu",
      color: "var(--status-success)",
      action: "Lihat",
    },
  ];

  const recentOrders = [
    { id: "ORD-2026-156", buyer: "Ibu Siti", total: 375000, status: "Menunggu Pembayaran", poktan: "Poktan A" },
    { id: "ORD-2026-155", buyer: "Toko Berkah", total: 1250000, status: "Diproses", poktan: "Poktan B" },
    { id: "ORD-2026-154", buyer: "Pasar Modern", total: 2800000, status: "Dikirim", poktan: "Poktan C" },
    { id: "ORD-2026-153", buyer: "Bapak Ahmad", total: 185000, status: "Selesai", poktan: "Poktan A" },
  ];

  const getStatusColor = (status: string) => {
    if (status === "Selesai") return "var(--status-success)";
    if (status === "Dikirim") return "var(--accent)";
    if (status === "Diproses") return "var(--status-info)";
    return "var(--status-pending)";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl text-primary mb-2">
          Pusat Kontrol Utama
        </h2>
        <p className="text-base text-muted-foreground">
          Monitor dan kelola seluruh operasional Gapoktan Selo Makmur
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
              <p className="text-xs text-accent">{stat.sublabel}</p>
              <p className="text-xs text-muted-foreground mt-2">{stat.pending}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl text-primary mb-6">
            Performa Penjualan Per Poktan
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={poktanPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "omset") {
                    return [`Rp ${value.toLocaleString("id-ID")}`, "Omset"];
                  }
                  return [value, "Jumlah Produk"];
                }}
              />
              <Legend />
              <Bar dataKey="omset" fill="#2d5016" name="Omset (Rp)" />
              <Bar dataKey="produk" fill="#5a8f3a" name="Jumlah Produk" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Notifications - Takes 1 column */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl text-primary mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Notifikasi Penting
          </h3>
          <div className="space-y-4">
            {notifications.map((notif, index) => {
              const Icon = notif.icon;
              return (
                <div
                  key={index}
                  className="flex gap-3 p-4 bg-background rounded-lg hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${notif.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: notif.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary mb-1">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {notif.subtitle}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{notif.time}</span>
                      <button
                        className="text-sm font-semibold px-3 py-1.5 rounded text-white"
                        style={{ backgroundColor: notif.color }}
                      >
                        {notif.action}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl text-primary">Pesanan Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "var(--background)" }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm text-foreground">ID Pesanan</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Pembeli</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Poktan</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Total</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-background"}
                >
                  <td className="px-6 py-4 text-sm text-primary">{order.id}</td>
                  <td className="px-6 py-4 text-sm">{order.buyer}</td>
                  <td className="px-6 py-4 text-sm">{order.poktan}</td>
                  <td className="px-6 py-4 text-sm text-accent">
                    Rp {order.total.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex px-3 py-1.5 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-sm font-semibold text-white bg-accent hover:bg-accent/80 px-3 py-1 rounded-lg transition-colors">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <button className="bg-primary hover:bg-primary/90 text-white p-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 text-left">
          <CheckCircle className="w-10 h-10 mb-4" />
          <p className="text-xl mb-2 font-medium">Validasi Produk</p>
          <p className="text-base font-semibold text-white">8 produk menunggu</p>
        </button>
        <button className="bg-primary hover:bg-primary/90 text-white p-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 text-left">
          <ShoppingCart className="w-10 h-10 mb-4" />
          <p className="text-xl mb-2 font-medium">Kelola Pesanan</p>
          <p className="text-base font-semibold text-white">12 perlu diproses</p>
        </button>
        <button className="bg-accent hover:bg-accent/90 text-white p-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 text-left">
          <DollarSign className="w-10 h-10 mb-4" />
          <p className="text-xl mb-2 font-medium">Laporan Keuangan</p>
          <p className="text-base font-semibold text-white">Lihat detail</p>
        </button>
        <button className="bg-white hover:bg-background text-foreground border-2 border-primary p-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 text-left">
          <Users className="w-10 h-10 mb-4 text-primary" />
          <p className="text-xl mb-2 font-medium text-primary">Kelola Poktan</p>
          <p className="text-base font-semibold text-foreground">24 kelompok aktif</p>
        </button>
      </div>
    </div>
  );
}
