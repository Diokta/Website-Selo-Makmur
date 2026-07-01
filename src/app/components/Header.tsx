import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, ShoppingCart, User, Sprout, LogOut, Shield, MapPin, ChevronDown, Package } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { useWebsiteContent } from "../../hooks/useWebsiteContent";

export function Header() {
  const { getContent } = useWebsiteContent();
  const brandName = getContent("identity.name", "Gapoktan Selo Makmur");
  const logoUrl = getContent("identity.logo", "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const navigate = useNavigate();
  const { user, profile, role, signOut } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const navigation = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Toko Tani", href: "/shop" },
    { name: "Berita", href: "/news" },
    { name: "Laporan", href: "/reports" },
    { name: "Kontak", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }

    const fetchCount = async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("quantity")
        .eq("user_id", user.id);

      if (!error && data) {
        const totalQty = data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalQty);
      }
    };

    fetchCount();

    // Listen to local update events
    window.addEventListener("cart-updated", fetchCount);

    return () => {
      window.removeEventListener("cart-updated", fetchCount);
    };
  }, [user]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            {logoUrl ? (
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white rounded-full p-0.5 border border-border">
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain rounded-full" />
              </div>
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center">
                <Sprout className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            )}
            <span className="text-lg sm:text-xl text-primary hidden sm:block">
              {brandName}
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href}
                className={`text-base transition-colors ${isActive(item.href) ? "text-accent" : "text-foreground hover:text-accent"}`}>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/cart" className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              /* User sudah login */
              <div className="hidden sm:flex items-center gap-2 relative">
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-secondary rounded-lg transition-colors focus:outline-none"
                  >
                    <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {profile?.name?.charAt(0)?.toUpperCase() ?? "U"}
                      </span>
                    </div>
                    <span className="text-sm text-foreground hidden md:inline max-w-[100px] truncate">
                      {profile?.name ?? "Pengguna"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-secondary/20">
                        <p className="text-xs text-muted-foreground">Masuk sebagai</p>
                        <p className="text-sm font-semibold text-primary truncate">{profile?.name ?? "Pengguna"}</p>
                      </div>
                      
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary/40 transition-colors"
                      >
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span>Pesanan Saya</span>
                      </Link>

                      <Link 
                        to="/profile" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary/40 transition-colors"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>Profil Saya</span>
                      </Link>

                      <Link 
                        to="/addresses" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary/40 transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>Alamat Saya</span>
                      </Link>

                      {role === "super_admin" && (
                        <Link 
                          to="/admin-gapoktan" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary/40 border-t border-secondary/20 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-accent" />
                          <span className="font-medium text-accent">Dashboard Admin</span>
                        </Link>
                      )}

                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/5 border-t border-secondary/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Belum login */
              <Link to="/login" className="hidden sm:flex p-2 hover:bg-secondary rounded-lg transition-colors">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              </Link>
            )}

            <button className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-4 rounded-lg transition-colors ${isActive(item.href) ? "bg-accent text-white" : "text-foreground hover:bg-secondary"}`}>
                {item.name}
              </Link>
            ))}

            {user ? (
              <>
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-foreground">{profile?.name ?? "Pengguna"}</p>
                    <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 py-3 px-4 text-foreground hover:bg-muted rounded-lg transition-colors">
                    <Package className="w-5 h-5 text-muted-foreground" />
                    Pesanan Saya
                  </Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 py-3 px-4 text-foreground hover:bg-muted rounded-lg transition-colors pl-8">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Profil Saya
                  </Link>
                  <Link to="/addresses" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 py-3 px-4 text-foreground hover:bg-muted rounded-lg transition-colors pl-8">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Alamat Saya
                  </Link>
                  {role === "super_admin" && (
                    <Link to="/admin-gapoktan" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 py-3 px-4 text-foreground hover:bg-muted rounded-lg transition-colors">
                      <Shield className="w-5 h-5" />
                      Panel Admin
                    </Link>
                  )}
                  <button onClick={handleSignOut}
                    className="flex items-center gap-2 py-3 px-4 w-full text-left text-destructive hover:bg-muted rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" />
                    Keluar
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-3 px-4 mt-2 border-t border-border text-foreground hover:bg-muted rounded-lg transition-colors">
                  <User className="w-5 h-5" />
                  Masuk / Daftar
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
