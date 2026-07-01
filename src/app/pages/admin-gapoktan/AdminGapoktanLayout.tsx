import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  FileText,
  Menu,
  X,
  LogOut,
  Bell,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { supabase } from "../../../lib/supabase";

export function AdminGapoktanLayout() {
  const { user, role, loading: authLoading, profile, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const newNotifs: any[] = [];

      // 1. Fetch pending orders
      const { count: pendingOrderCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .in("order_status", ["Menunggu Pembayaran", "Dikemas"]);

      if (pendingOrderCount && pendingOrderCount > 0) {
        newNotifs.push({
          id: "pending-orders",
          title: "Pesanan Baru Masuk",
          description: `${pendingOrderCount} pesanan perlu diproses.`,
          path: "/admin-gapoktan/orders",
        });
      }

      // 3. Fetch low stock products
      const { data: lowStockProducts } = await supabase
        .from("products")
        .select("name, stock")
        .lt("stock", 20)
        .limit(2);

      lowStockProducts?.forEach((p, idx) => {
        newNotifs.push({
          id: `low-stock-${idx}`,
          title: "Stok Produk Menipis",
          description: `Stok ${p.name} sisa ${p.stock} unit.`,
          path: "/admin-gapoktan/products",
        });
      });

      setNotifications(newNotifs);
    } catch (err) {
      console.error("Gagal mengambil notifikasi:", err);
    }
  };

  useEffect(() => {
    if (user && role === "super_admin") {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, role]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || role !== "super_admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-md max-w-md w-full border border-border">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl text-primary mb-4">Akses Ditolak</h2>
          <p className="text-base text-muted-foreground mb-6">
            Halaman ini hanya dapat diakses oleh Admin Gapoktan.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg transition-colors text-base font-medium"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "Dashboard Utama", href: "/admin-gapoktan", icon: LayoutDashboard },
    { name: "Produk & Stok", href: "/admin-gapoktan/products", icon: Package },
    { name: "Manajemen Pesanan", href: "/admin-gapoktan/orders", icon: ShoppingCart },
    { name: "Anggota Poktan", href: "/admin-gapoktan/users", icon: Users },
    { name: "Laporan Keuangan", href: "/admin-gapoktan/finance", icon: DollarSign },
    { name: "Kelola Konten", href: "/admin-gapoktan/content", icon: FileText },
  ];

  const isActive = (href: string) => {
    if (href === "/admin-gapoktan") return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "var(--sidebar)" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl text-white">
                  Super Admin
                </h2>
                <p className="text-sm text-white/80 mt-1">Gapoktan Selo Makmur</p>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  style={
                    isActive(item.href)
                      ? { backgroundColor: "var(--sidebar-accent)" }
                      : {}
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Kembali ke Website</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-border sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:flex-none">
              <h1 className="text-xl sm:text-2xl text-primary ml-2 lg:ml-0">
                Super Admin Gapoktan
              </h1>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative">
                 <button
                   onClick={() => setIsNotifOpen(!isNotifOpen)}
                   className="relative p-2 hover:bg-muted rounded-lg transition-colors focus:outline-none cursor-pointer"
                 >
                   <Bell className="w-6 h-6 text-foreground" />
                   {notifications.length > 0 && (
                     <span
                       className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold"
                       style={{ backgroundColor: "var(--accent)" }}
                     >
                       {notifications.length}
                     </span>
                   )}
                 </button>

                 {isNotifOpen && (
                   <>
                     <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                     <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50">
                       <div className="p-4 border-b border-border bg-background flex justify-between items-center">
                         <h4 className="font-semibold text-primary text-sm">Notifikasi</h4>
                         {notifications.length > 0 && (
                           <span className="text-xs text-accent font-semibold">{notifications.length} Penting</span>
                         )}
                       </div>
                       <div className="divide-y divide-border max-h-72 overflow-y-auto">
                         {notifications.length === 0 ? (
                           <div className="p-6 text-center text-sm text-muted-foreground">
                             Tidak ada notifikasi baru
                           </div>
                         ) : (
                           notifications.map((notif) => (
                             <div
                               key={notif.id}
                               onClick={() => {
                                 navigate(notif.path);
                                 setIsNotifOpen(false);
                               }}
                               className={`p-4 cursor-pointer hover:bg-background transition-colors border-l-4 text-left ${
                                 notif.id.includes("low-stock")
                                   ? "border-l-destructive"
                                   : notif.id.includes("orders")
                                   ? "border-l-accent"
                                   : "border-l-primary"
                               }`}
                             >
                               <p className="text-xs font-bold text-primary mb-0.5">{notif.title}</p>
                               <p className="text-xs text-muted-foreground leading-tight">{notif.description}</p>
                             </div>
                           ))
                         )}
                       </div>
                       {notifications.length > 0 && (
                         <div className="p-2.5 bg-background text-center border-t border-border">
                           <button
                             onClick={() => {
                               fetchNotifications();
                               setIsNotifOpen(false);
                             }}
                             className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                           >
                             Perbarui Data
                           </button>
                         </div>
                       )}
                     </div>
                   </>
                 )}
               </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-foreground">{profile?.name ?? "Admin"}</p>
                <p className="text-xs text-muted-foreground">Super Admin</p>
              </div>
              <button
                onClick={async () => {
                  await signOut();
                  navigate("/login");
                }}
                className="flex items-center gap-2 text-sm text-destructive hover:bg-destructive/10 px-3 py-2 rounded-lg transition-colors font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
