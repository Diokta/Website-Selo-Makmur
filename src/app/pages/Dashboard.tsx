import { Package, Clock, CheckCircle, XCircle, User, MapPin, Phone } from "lucide-react";

export function Dashboard() {
  const orders = [
    {
      id: "ORD-2026-001",
      date: "1 Juni 2026",
      total: 185000,
      status: "delivered",
      items: [
        { name: "Beras Organik Premium 5kg", qty: 2 },
        { name: "Paket Sayuran Segar", qty: 1 },
      ],
    },
    {
      id: "ORD-2026-002",
      date: "28 Mei 2026",
      total: 145000,
      status: "shipping",
      items: [{ name: "Beras Organik Premium 10kg", qty: 1 }],
    },
    {
      id: "ORD-2026-003",
      date: "25 Mei 2026",
      total: 92000,
      status: "processing",
      items: [
        { name: "Jagung Manis Organik", qty: 2 },
        { name: "Cabai Merah Segar 1kg", qty: 1 },
      ],
    },
    {
      id: "ORD-2026-004",
      date: "20 Mei 2026",
      total: 75000,
      status: "cancelled",
      items: [{ name: "Beras Merah Organik 5kg", qty: 1 }],
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      processing: {
        icon: Clock,
        text: "Diproses",
        class: "bg-blue-100 text-blue-700",
      },
      shipping: {
        icon: Package,
        text: "Dikirim",
        class: "bg-yellow-100 text-yellow-700",
      },
      delivered: {
        icon: CheckCircle,
        text: "Selesai",
        class: "bg-green-100 text-green-700",
      },
      cancelled: {
        icon: XCircle,
        text: "Dibatalkan",
        class: "bg-red-100 text-red-700",
      },
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${badge.class}`}
      >
        <Icon className="w-4 h-4" />
        {badge.text}
      </span>
    );
  };

  const stats = [
    { label: "Total Pesanan", value: "4", icon: Package },
    { label: "Sedang Diproses", value: "2", icon: Clock },
    { label: "Selesai", value: "1", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-accent py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl text-white mb-4">Dashboard</h1>
          <p className="text-lg sm:text-xl text-white/90">
            Kelola akun dan pesanan Anda
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-3xl text-primary mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md mb-8">
              <h2 className="text-2xl text-primary mb-6">Riwayat Pesanan</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-border rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg text-primary mb-1">
                          {order.id}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {order.date}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          {item.qty}x {item.name}
                        </p>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-base text-muted-foreground">
                        Total
                      </span>
                      <span className="text-xl text-accent">
                        Rp {order.total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-accent" />
                <h2 className="text-2xl text-primary">Profil Saya</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Nama</label>
                  <p className="text-base text-primary">Budi Santoso</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="text-base text-primary">
                    budi.santoso@email.com
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Telepon
                    </label>
                    <p className="text-base text-primary">+62 812-3456-7890</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Alamat
                    </label>
                    <p className="text-base text-primary">
                      Jl. Letda Abdul Jalil, Salakan, Selomartani, Kalasan,
                      Sleman, Daerah Istimewa Yogyakarta 55571
                    </p>
                  </div>
                </div>
                <button className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg transition-colors mt-4">
                  Edit Profil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
