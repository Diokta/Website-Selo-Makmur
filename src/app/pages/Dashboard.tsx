import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Package, Clock, CheckCircle, XCircle, ShoppingBag } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const loadOrdersData = async () => {
      setLoading(true);
      try {
        const { data: ordersData } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("buyer_id", user.id)
          .order("ordered_at", { ascending: false });

        if (ordersData) {
          setOrders(ordersData);
        }
      } catch (err) {
        console.error("Error loading dashboard orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrdersData();
  }, [user, authLoading]);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "Semua" || order.order_status === statusFilter;
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_items?.some((item: any) => 
        item.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      "Menunggu Konfirmasi": {
        icon: Clock,
        text: "Menunggu Konfirmasi",
        class: "bg-orange-100 text-orange-700 border border-orange-200",
      },
      "Diproses": {
        icon: Clock,
        text: "Diproses",
        class: "bg-blue-100 text-blue-700 border border-blue-200",
      },
      "Dikirim": {
        icon: Package,
        text: "Dikirim",
        class: "bg-yellow-100 text-yellow-700 border border-yellow-200",
      },
      "Selesai": {
        icon: CheckCircle,
        text: "Selesai",
        class: "bg-green-100 text-green-700 border border-green-200",
      },
      "Dibatalkan": {
        icon: XCircle,
        text: "Dibatalkan",
        class: "bg-red-100 text-red-700 border border-red-200",
      },
    };
    const badge = badges[status as keyof typeof badges] || {
      icon: Clock,
      text: status,
      class: "bg-gray-100 text-gray-700",
    };
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
        <Icon className="w-3.5 h-3.5" />
        {badge.text}
      </span>
    );
  };

  const totalOrders = orders.length;
  const processingCount = orders.filter(
    (o) => o.order_status === "Menunggu Konfirmasi" || o.order_status === "Diproses" || o.order_status === "Dikirim"
  ).length;
  const completedCount = orders.filter((o) => o.order_status === "Selesai").length;

  const stats = [
    { label: "Total Pesanan", value: String(totalOrders), icon: Package },
    { label: "Sedang Diproses", value: String(processingCount), icon: Clock },
    { label: "Selesai", value: String(completedCount), icon: CheckCircle },
  ];

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-md max-w-md w-full border border-border">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl text-primary mb-4">Akses Terbatas</h2>
          <p className="text-base text-muted-foreground mb-6">
            Silakan masuk terlebih dahulu untuk melihat dashboard pesanan Anda.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg transition-colors text-base font-medium"
          >
            Masuk Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-accent py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl text-white mb-4">Dashboard</h1>
          <p className="text-lg sm:text-xl text-white/90">
            Kelola pesanan dan transaksi belanja Anda
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {successMsg && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-lg mb-6 text-sm">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-destructive/10 border-l-4 border-destructive text-destructive p-4 rounded-lg mb-6 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md flex items-center gap-4 border border-border"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-3xl text-primary font-semibold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Riwayat Pesanan */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md border border-border">
          <h2 className="text-2xl text-primary mb-6">Riwayat Pesanan</h2>

          {/* Search & Filter Controls */}
          {orders.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center text-xs">
              <div className="relative w-full md:max-w-md">
                <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Cari nomor pesanan atau nama produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-input-background border border-border rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <label className="text-muted-foreground font-medium shrink-0">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full md:w-48 px-3 py-2 bg-white border border-border rounded-lg text-xs"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Dikirim">Dikirim</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>
            </div>
          )}
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground font-medium">Belum ada riwayat pesanan.</p>
              <Link to="/shop" className="text-accent hover:underline font-medium mt-2 inline-block">
                Mulai Belanja Sekarang
              </Link>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 border border-border border-dashed rounded-xl bg-secondary/5">
              <p className="text-base text-muted-foreground font-semibold">Pesanan tidak ditemukan</p>
              <p className="text-xs text-muted-foreground mt-1">Tidak ada pesanan yang sesuai dengan filter atau kata kunci Anda.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("Semua");
                }}
                className="text-xs font-semibold text-accent hover:underline mt-3"
              >
                Reset Filter & Pencarian
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-border rounded-xl p-5 hover:shadow-md transition-shadow bg-white text-left flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-primary">
                        {order.order_number}
                      </span>
                      {getStatusBadge(order.order_status)}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Tanggal Transaksi: {formatDate(order.ordered_at)}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {order.order_items?.length || 0} Item Produk — <span className="font-semibold text-accent">Total: Rp {order.total_amount.toLocaleString("id-ID")}</span>
                    </p>
                  </div>
                  
                  <div className="shrink-0 flex items-center justify-end">
                    <Link
                      to={`/order/${order.id}`}
                      className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      Lihat Detail →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
