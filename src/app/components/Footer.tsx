import { Link } from "react-router";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Sprout } from "lucide-react";
import { useWebsiteContent } from "../../hooks/useWebsiteContent";

const getMapSrc = (input: string) => {
  if (!input) return "";
  if (input.includes("<iframe")) {
    const match = input.match(/src=["']([^"']+)["']/);
    return match ? match[1] : "";
  }
  return input;
};

export function Footer() {
  const { getContent } = useWebsiteContent();

  const name = getContent("identity.name", "Gapoktan Selo Makmur");
  const subtitle = getContent("hero.subtitle", "Bersama membangun pertanian berkelanjutan untuk masa depan yang lebih hijau");
  const address = getContent("identity.address", "Jl. Letda Abdul Jalil, Selomartani, Kalasan, Sleman, DIY 55571");
  const phone = getContent("identity.phone", "+62 251 8123456");
  const email = getContent("identity.email", "info@gapoktansukamaju.id");
  const logoUrl = getContent("identity.logo", "");
  const mapInput = getContent("identity.map", "");
  const mapUrl = getMapSrc(mapInput);

  return (
    <footer className="text-white" style={{ backgroundColor: "var(--footer-background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {logoUrl ? (
                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full p-0.5 border border-white/10 flex-shrink-0">
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain rounded-full" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
              )}
              <h3 className="text-lg sm:text-xl font-bold">{name}</h3>
            </div>
            <p className="text-sm sm:text-base text-white/80 mb-4">
              {subtitle}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl mb-4">Navigasi</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors">Beranda</Link></li>
              <li><Link to="/about" className="text-white/80 hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link to="/shop" className="text-white/80 hover:text-white transition-colors">Toko Tani</Link></li>
              <li><Link to="/news" className="text-white/80 hover:text-white transition-colors">Berita</Link></li>
              <li><Link to="/reports" className="text-white/80 hover:text-white transition-colors">Laporan</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl mb-4">Layanan</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li><Link to="/shop" className="text-white/80 hover:text-white transition-colors">Belanja Produk</Link></li>
              <li><Link to="/cart" className="text-white/80 hover:text-white transition-colors">Keranjang</Link></li>
              <li><Link to="/dashboard" className="text-white/80 hover:text-white transition-colors">Akun Saya</Link></li>
              <li><Link to="/contact" className="text-white/80 hover:text-white transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm sm:text-base mb-4">
              <li className="flex gap-2 text-white/80">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex gap-2 text-white/80">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex gap-2 text-white/80">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
            {mapUrl && (
              <div className="h-28 rounded-lg overflow-hidden border border-white/10 relative">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Footer"
                  className="w-full h-full absolute inset-0"
                ></iframe>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm sm:text-base text-white/80">
          <p>© 2026 {name}. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
