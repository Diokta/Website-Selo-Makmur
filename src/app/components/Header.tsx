import { Link, useLocation } from "react-router";
import { Menu, X, ShoppingCart, User, Sprout } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Toko Tani", href: "/shop" },
    { name: "Berita", href: "/news" },
    { name: "Laporan", href: "/reports" },
    { name: "Kontak", href: "/contact" },
  ];

  const adminLinks = [
    { name: "Admin Gapoktan", href: "/admin-gapoktan" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center">
              <Sprout className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="text-lg sm:text-xl text-primary hidden sm:block">
              Gapoktan Selo Makmur
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-base transition-colors ${
                  isActive(item.href)
                    ? "text-accent"
                    : "text-foreground hover:text-accent"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/cart"
              className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
            <Link
              to="/dashboard"
              className="hidden sm:flex p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </Link>
            <button
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-4 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-accent text-white"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 py-3 px-4 mt-2 border-t border-border text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
              Akun Saya
            </Link>
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground px-4 py-2">Area Admin</p>
              {adminLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 px-4 text-sm text-secondary hover:bg-muted rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
