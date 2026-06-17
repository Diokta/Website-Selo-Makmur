import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, Package, TrendingUp, Image, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

export function AdminPoktanLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Ringkasan", href: "/admin-poktan", icon: LayoutDashboard },
    { name: "Produk & Stok", href: "/admin-poktan/products", icon: Package },
    { name: "Laporan Penjualan", href: "/admin-poktan/sales", icon: TrendingUp },
    { name: "Galeri & Berita", href: "/admin-poktan/gallery", icon: Image },
  ];

  const isActive = (href: string) => {
    if (href === "/admin-poktan") return location.pathname === href;
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
                  Admin Poktan
                </h2>
                <p className="text-sm text-white/80 mt-1">Poktan Harapan Jaya</p>
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
                  <span>{item.name}</span>
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
              <span>Kembali ke Website</span>
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
                Dashboard Admin Poktan
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-foreground">Bapak Suparman</p>
                <p className="text-xs text-muted-foreground">Ketua Poktan</p>
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
