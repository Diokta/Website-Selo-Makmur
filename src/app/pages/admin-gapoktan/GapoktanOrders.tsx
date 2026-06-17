import { Package, Truck, CheckCircle, XCircle, Printer } from "lucide-react";

export function GapoktanOrders() {
  const orders = [
    {
      id: "ORD-2026-156",
      buyer: "Ibu Siti Rahayu",
      phone: "08123456789",
      address: "Jl. Raya Cisarua No. 45, Bogor",
      total: 375000,
      payment: "Transfer BCA",
      status: "Menunggu Pembayaran",
      date: "2026-06-03",
      items: [{ name: "Beras Organik 5kg", qty: 2, price: 75000 }, { name: "Sayuran Segar", qty: 1, price: 35000 }],
      poktan: "Poktan Harapan Jaya",
    },
    {
      id: "ORD-2026-155",
      buyer: "Toko Berkah Jaya",
      phone: "08129876543",
      address: "Pasar Cisarua Blok A No. 12, Bogor",
      total: 1250000,
      payment: "Transfer Mandiri",
      paymentProof: "bukti_transfer.jpg",
      status: "Dikemas",
      date: "2026-06-02",
      items: [{ name: "Beras Organik 10kg", qty: 10, price: 145000 }],
      poktan: "Poktan Maju Bersama",
    },
    {
      id: "ORD-2026-154",
      buyer: "Pasar Modern Cisarua",
      phone: "08213456789",
      address: "Jl. Raya Puncak KM 12, Cisarua, Bogor",
      total: 2800000,
      payment: "Transfer BNI",
      paymentProof: "transfer_bni.jpg",
      status: "Dikirim",
      resi: "JNE1234567890",
      date: "2026-06-01",
      items: [{ name: "Sayuran Mix", qty: 50, price: 35000 }, { name: "Cabai Merah 1kg", qty: 20, price: 45000 }],
      poktan: "Poktan Berkah Tani",
    },
  ];

  const getStatusColor = (status: string) => {
    if (status === "Selesai") return "var(--status-success)";
    if (status === "Dikirim") return "var(--accent)";
    if (status === "Dikemas") return "var(--status-info)";
    return "var(--status-pending)";
  };

  const getStatusIcon = (status: string) => {
    if (status === "Selesai") return <CheckCircle className="w-4 h-4" />;
    if (status === "Dikirim") return <Truck className="w-4 h-4" />;
    if (status === "Dikemas") return <Package className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl text-primary mb-2">
          Manajemen Pesanan & Logistik
        </h2>
        <p className="text-base text-muted-foreground">
          Kelola dan proses pesanan dari pembeli
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-muted-foreground mb-2">Menunggu Pembayaran</p>
          <p className="text-3xl" style={{ color: "var(--status-pending)" }}>12</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-muted-foreground mb-2">Perlu Dikemas</p>
          <p className="text-3xl" style={{ color: "var(--status-info)" }}>8</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-muted-foreground mb-2">Dalam Pengiriman</p>
          <p className="text-3xl" style={{ color: "var(--accent)" }}>15</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-muted-foreground mb-2">Selesai</p>
          <p className="text-3xl" style={{ color: "var(--status-success)" }}>145</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl text-primary mb-1">{order.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.date).toLocaleDateString("id-ID")} • {order.poktan}
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm text-white"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Informasi Pembeli</p>
                  <p className="text-sm text-primary mb-1">{order.buyer}</p>
                  <p className="text-sm text-muted-foreground">{order.phone}</p>
                  <p className="text-sm text-muted-foreground">{order.address}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Pembayaran</p>
                  <p className="text-sm text-primary mb-1">{order.payment}</p>
                  <p className="text-sm text-accent">Total: Rp {order.total.toLocaleString("id-ID")}</p>
                  {order.paymentProof && (
                    <button className="text-sm text-accent hover:text-accent/80 underline mt-2">
                      Lihat Bukti Transfer
                    </button>
                  )}
                  {order.resi && (
                    <p className="text-sm text-muted-foreground mt-2">Resi: {order.resi}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Item Pesanan</p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm bg-background p-3 rounded-lg">
                      <span>{item.qty}x {item.name}</span>
                      <span className="text-accent">Rp {(item.qty * item.price).toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-background px-6 py-4 flex flex-wrap gap-3">
              {order.status === "Menunggu Pembayaran" && (
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors">
                  Konfirmasi Pembayaran
                </button>
              )}
              {order.status === "Dikemas" && (
                <>
                  <button className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Input Resi
                  </button>
                  <button className="bg-muted hover:bg-muted/80 text-foreground px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    Cetak Label
                  </button>
                </>
              )}
              {order.status === "Dikirim" && (
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Tandai Selesai
                </button>
              )}
              <button className="bg-muted hover:bg-muted/80 text-foreground px-6 py-2 rounded-lg transition-colors">
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
