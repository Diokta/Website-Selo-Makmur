import { useState, useEffect } from "react";
import { Wrench, Calendar, Info } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function GapoktanAssetsSection() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const { data, error } = await supabase
          .from("gapoktan_assets")
          .select("*")
          .order("nama", { ascending: true });

        if (!error && data) {
          setAssets(data);
        }
      } catch (err) {
        console.error("Error fetching gapoktan assets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const settings = {
    dots: true,
    infinite: assets.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, assets.length),
    slidesToScroll: 1,
    autoplay: assets.length > 1,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, assets.length),
          slidesToScroll: 1,
          infinite: assets.length > 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: assets.length > 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="flex items-center justify-center min-h-[300px]">
          <LoadingSpinner message="Memuat daftar aset..." />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl text-primary mb-4 font-bold">
            Aset & Fasilitas Gapoktan
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Alat mekanisasi pertanian, mesin pengolahan, dan fasilitas pendukung untuk produktivitas pertanian anggota Gapoktan Selo Makmur
          </p>
        </div>

        {assets.length === 0 ? (
          <div className="text-center py-12 px-6 bg-secondary/30 backdrop-blur-sm rounded-2xl border border-border/50 max-w-lg mx-auto shadow-sm">
            <Wrench className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
            <p className="text-lg font-semibold text-primary">Belum Ada Aset Terdaftar</p>
            <p className="text-sm text-muted-foreground mt-1">Daftar aset fasilitas saat ini sedang diperbarui oleh pengurus Gapoktan.</p>
          </div>
        ) : (
          <div className={`assets-carousel mb-8 mx-auto ${
            assets.length === 1 ? "max-w-md" : 
            assets.length === 2 ? "max-w-4xl" : "max-w-7xl"
          }`}>
            <Slider {...settings}>
              {assets.map((asset) => (
                <div key={asset.id} className="px-2 sm:px-3 pb-4">
                  <div
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border/40 flex flex-col h-[400px] sm:h-[430px]"
                  >
                    {/* Area Gambar */}
                    <div className="relative h-48 sm:h-52 w-full bg-muted overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={asset.image_url}
                        alt={asset.nama}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {asset.kategori && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-primary/95 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">
                            {asset.kategori}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Konten Detail */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-base sm:text-lg text-primary font-bold line-clamp-1" title={asset.nama}>
                          {asset.nama}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {asset.deskripsi || "Tidak ada deskripsi untuk aset ini."}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/50 mt-auto flex-shrink-0">
                        {asset.tahun_perolehan && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-accent" />
                            <span>Perolehan: {asset.tahun_perolehan}</span>
                          </div>
                        )}
                        {!asset.tahun_perolehan && (
                          <div className="flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-muted-foreground/60" />
                            <span>Umum</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </section>
  );
}
