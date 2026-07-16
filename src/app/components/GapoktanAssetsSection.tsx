import { useState, useEffect } from "react";
import { Wrench, Calendar, Info } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { LoadingSpinner } from "./ui/LoadingSpinner";

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border/40 flex flex-col h-[380px]"
              >
                {/* Area Gambar */}
                <div className="relative h-44 sm:h-48 w-full bg-muted overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={asset.image_url}
                    alt={asset.nama}
                    className="w-full h-full object-cover"
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
