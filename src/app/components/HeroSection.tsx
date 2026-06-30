import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChevronRight } from "lucide-react";
import { useWebsiteContent } from "../../hooks/useWebsiteContent";

export function HeroSection() {
  const { getContent } = useWebsiteContent();
  const title = getContent("hero.title", "Gabungan Kelompok Tani Selo Makmur");
  const subtitle = getContent("hero.subtitle", "Bersama Membangun Pertanian Berkelanjutan untuk Masa Depan yang Lebih Hijau");

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1676281945191-4c0ed1a1784d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Petani bekerja di sawah"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      </div>

      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-4 sm:mb-6">
            {title}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 px-4">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link
              to="/shop"
              className="bg-accent hover:bg-accent/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              Belanja Produk Lokal
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/about"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors border border-white/30 shadow-lg"
            >
              Pelajari Selengkapnya
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
