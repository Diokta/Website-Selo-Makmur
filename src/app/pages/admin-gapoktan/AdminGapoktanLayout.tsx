import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  FileText,
  Image,
  Menu,
  X,
  LogOut,
  Bell,
} from "lucide-react";
import { useState } from "react";

export function AdminGapoktanLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard Utama", href: "/admin-gapoktan", icon: LayoutDashboard },
    { name: "Produk & Stok", href: "/admin-gapoktan/products", icon: Package },
    { name: "Manajemen Pesanan", href: "/admin-gapoktan/orders", icon: ShoppingCart },
    { name: "Anggota Poktan", href: "/admin-gapoktan/users", icon: Users },
    { name: "Laporan Keuangan", href: "/admin-gapoktan/finance", icon: DollarSign },
    { name: "Galeri & Berita", href: "/admin-gapoktan/gallery", icon: Image },
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
              <button className="relative p-2 hover:bg-muted rounded-lg">
                <Bell className="w-6 h-6 text-foreground" />
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  3
                </span>
              </button>
              <div className="hidden sm:block text-right">
                <p className="text-sm text-foreground">Bapak Sutrisno</p>
                <p className="text-xs text-muted-foreground">Ketua Gapoktan</p>
              </div>
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
