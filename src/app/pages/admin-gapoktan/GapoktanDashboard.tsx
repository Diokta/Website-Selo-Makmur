import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ShoppingCart, DollarSign, Package, Users, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { supabase } from "../../../lib/supabase";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export function GapoktanDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [poktanPerformance, setPoktanPerformance] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [pendingOrdersCountState, setPendingOrdersCountState] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch total transactions
        const { count: totalOrdersCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });

        const { count: pendingOrdersCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("order_status", "Menunggu Konfirmasi");
        
        setPendingOrdersCountState(pendingOrdersCount || 0);

        // 2. Fetch total revenue
        const { data: revenueData } = await supabase
          .from("orders")
          .select("total_amount")
          .eq("payment_status", "Lunas");
        const totalRevenue = revenueData?.reduce((sum, o) => sum + o.total_amount, 0) ?? 0;

        // 3. Fetch active poktans count
        const { count: activePoktansCount } = await supabase
          .from("kelompok_tani")
          .select("*", { count: "exact", head: true });

        // Calculate total farmers (sum of kelompok_tani.jumlah_anggota)
        const { data: poktanData } = await supabase
          .from("kelompok_tani")
          .select("nama, jumlah_anggota, products(count)");
        const totalFarmers = poktanData?.reduce((sum, p) => sum + (p.jumlah_anggota || 0), 0) ?? 0;

        // Set stats
        setStats([
          {
            icon: ShoppingCart,
            label: "Total Transaksi",
            value: String(totalOrdersCount ?? 0),
            sublabel: "Seluruh waktu",
            pending: `${pendingOrdersCount ?? 0} Menunggu Konfirmasi`,
            color: "#4c7ca6",
            actionPath: "/admin-gapoktan/orders",
          },
          {
            icon: DollarSign,
            label: "Pendapatan Lunas",
            value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
            sublabel: "Omset berbayar",
            pending: "Update otomatis",
            color: "#5a8f3a",
            actionPath: "/admin-gapoktan/finance",
          },
          {
            icon: Users,
            label: "Kelompok Tani",
            value: String(activePoktansCount ?? 0),
            sublabel: "Poktan Aktif",
            pending: `${totalFarmers} petani terdaftar`,
            color: "#7ca64c",
            actionPath: "/admin-gapoktan/users",
          },
        ]);

        // 5. Fetch poktan performance (revenue grouped by poktan)
        const { data: salesData } = await supabase
          .from("orders")
          .select("total_amount, kelompok_tani(id, nama)")
          .eq("payment_status", "Lunas");

        const performanceMap: Record<string, { name: string; omset: number; produk: number }> = {};
        salesData?.forEach((o) => {
          const name = o.kelompok_tani?.nama || "Gapoktan";
          if (!performanceMap[name]) {
            performanceMap[name] = { name, omset: 0, produk: 0 };
          }
          performanceMap[name].omset += o.total_amount;
        });

        // Add product counts per poktan
        const { data: productsWithPoktan } = await supabase
          .from("products")
          .select("*, kelompok_tani(nama)");

        productsWithPoktan?.forEach((p) => {
          const name = p.kelompok_tani?.nama || "Gapoktan";
          if (!performanceMap[name]) {
            performanceMap[name] = { name, omset: 0, produk: 0 };
          }
          performanceMap[name].produk += 1;
        });

        const performanceList = Object.values(performanceMap)
          .map((p) => ({
            name: p.name,
            omset: p.omset,
            produk: p.produk,
          }))
          .sort((a, b) => b.omset - a.omset);

        setPoktanPerformance(performanceList.length > 0 ? performanceList : [
          { name: "Belum Ada", omset: 0, produk: 0 }
        ]);

        // 6. Notifications
        const dynamicNotifications = [];
        if (pendingOrdersCount && pendingOrdersCount > 0) {
          dynamicNotifications.push({
            icon: ShoppingCart,
            title: `${pendingOrdersCount} Pesanan Menunggu Konfirmasi`,
            subtitle: "Harap periksa dan ubah status pesanan",
            time: "Baru saja",
            color: "#4c7ca6",
            action: "Lihat",
            path: "/admin-gapoktan/orders",
          });
        }

        // Fetch low stock products
        const { data: lowStockData } = await supabase
          .from("products")
          .select("name, stock, kelompok_tani(nama)")
          .lt("stock", 20)
          .limit(2);

        lowStockData?.forEach((p) => {
          dynamicNotifications.push({
            icon: AlertCircle,
            title: `Stok ${p.name} Menipis`,
            subtitle: `${p.kelompok_tani?.nama || "Gapoktan"} - Sisa ${p.stock} kg`,
            time: "Hari ini",
            color: "#d32f2f",
            action: "Periksa",
            path: "/admin-gapoktan/products",
          });
        });

        setNotifications(dynamicNotifications);

        // 7. Recent orders
        const { data: recentOrdersData } = await supabase
          .from("orders")
          .select("*, kelompok_tani(nama)")
          .order("ordered_at", { ascending: false })
          .limit(5);

        if (recentOrdersData) {
          setRecentOrders(
            recentOrdersData.map((order) => ({
              id: order.order_number,
              buyer: order.buyer_name,
              total: order.total_amount,
              status: order.order_status,
              poktan: order.kelompok_tani?.nama ?? "Gapoktan",
            }))
          );
        }
      } catch (err) {
        console.error("Error loading dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "Selesai") return "#5a8f3a"; // success
    if (status === "Dikirim") return "var(--accent)"; // accent
    if (status === "Diproses") return "#2196f3"; // info
    if (status === "Dibatalkan") return "#f44336"; // error
    return "#ff9800"; // pending (Menunggu Konfirmasi)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner message="Memuat metrik dashboard..." />
      </div>
    );
  }

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(stat.actionPath)}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-border cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-xs text-accent">{stat.sublabel}</p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{stat.pending}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md border border-border">
          <h3 className="text-xl text-primary mb-6 font-semibold">
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
        <div className="bg-white rounded-xl p-6 shadow-md border border-border">
          <h3 className="text-xl text-primary mb-6 flex items-center gap-2 font-semibold">
            <AlertCircle className="w-5 h-5 text-accent" />
            Notifikasi Penting
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Semua sistem berjalan normal, tidak ada notifikasi baru.
              </div>
            ) : (
              notifications.map((notif, index) => {
                const Icon = notif.icon;
                return (
                  <div
                    key={index}
                    className="flex gap-3 p-4 bg-background border border-border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${notif.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: notif.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary mb-1 leading-tight">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {notif.subtitle}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{notif.time}</span>
                        <button
                          onClick={() => navigate(notif.path)}
                          className="text-xs font-semibold px-3 py-1.5 rounded text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: notif.color }}
                        >
                          {notif.action}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-border">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-xl text-primary font-semibold">Pesanan Terbaru</h3>
          <button
            onClick={() => navigate("/admin-gapoktan/orders")}
            className="text-sm font-medium text-accent hover:underline"
          >
            Lihat Semua
          </button>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            Belum ada pesanan masuk.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "var(--background)" }}>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-sm text-foreground font-semibold">ID Pesanan</th>
                  <th className="px-6 py-4 text-left text-sm text-foreground font-semibold">Pembeli</th>
                  <th className="px-6 py-4 text-left text-sm text-foreground font-semibold">Poktan</th>
                  <th className="px-6 py-4 text-left text-sm text-foreground font-semibold">Total</th>
                  <th className="px-6 py-4 text-left text-sm text-foreground font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm text-foreground font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-background/25 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-primary font-semibold">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{order.buyer}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{order.poktan}</td>
                    <td className="px-6 py-4 text-sm text-accent font-semibold">
                      Rp {order.total.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate("/admin-gapoktan/orders")}
                        className="text-xs font-semibold text-white bg-accent hover:bg-accent/90 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <button
          onClick={() => navigate("/admin-gapoktan/orders")}
          className="bg-primary hover:bg-primary/95 text-white p-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.03] text-left animate-fadeIn"
        >
          <ShoppingCart className="w-10 h-10 mb-4" />
          <p className="text-xl mb-2 font-medium">Kelola Pesanan</p>
          <p className="text-base font-semibold text-white/95">{pendingOrdersCountState} perlu diproses</p>
        </button>
        <button
          onClick={() => navigate("/admin-gapoktan/finance")}
          className="bg-accent hover:bg-accent/95 text-white p-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.03] text-left"
        >
          <DollarSign className="w-10 h-10 mb-4" />
          <p className="text-xl mb-2 font-medium">Laporan Keuangan</p>
          <p className="text-base font-semibold text-white/95">Lihat detail keuangan</p>
        </button>
        <button
          onClick={() => navigate("/admin-gapoktan/users")}
          className="bg-white hover:bg-background text-foreground border-2 border-primary p-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.03] text-left"
        >
          <Users className="w-10 h-10 mb-4 text-primary" />
          <p className="text-xl mb-2 font-medium text-primary">Kelola Poktan</p>
          <p className="text-base font-semibold text-foreground">Lihat daftar kelompok</p>
        </button>
      </div>
    </div>
  );
}
