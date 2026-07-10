import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Warehouse, Sprout, Cpu, Thermometer, Layers } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function CsrAamaiSection() {
  const [productCount, setProductCount] = useState<number>(0);
  const [totalStock, setTotalStock] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLumbungStats = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("stok")
          .eq("status", "Aktif");

        if (!error && data) {
          setProductCount(data.length);
          const sum = data.reduce((acc, item) => acc + (Number(item.stok) || 0), 0);
          setTotalStock(sum);
        }
      } catch (err) {
        console.error("Error fetching lumbung stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLumbungStats();
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-background to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Section */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-sm font-semibold tracking-wider uppercase text-accent bg-accent/10 px-3 py-1.5 rounded-full">
            CSR AAMAI & Universitas Gunadarma
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-primary font-bold mt-4 mb-4">
            Infrastruktur & Inovasi Tani
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Meningkatkan produktivitas dan kualitas pertanian lokal melalui penerapan teknologi penyimpanan modern dan budidaya terkontrol.
          </p>
        </div>

        {/* CSR Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Card 1: Lumbung Cerdas */}
          <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
            {/* Image Wrapper */}
            <div className="h-64 sm:h-72 w-full overflow-hidden relative">
              <ImageWithFallback
                src="/lumbung.jpg"
                alt="Lumbung Cerdas Modern"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-3 bg-primary/95 text-white px-4 py-2 rounded-xl backdrop-blur-sm shadow-md">
                <Warehouse className="w-5 h-5 text-accent" />
                <span className="text-sm font-semibold tracking-wide">Lumbung Cerdas</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
                  Teknologi Pengondisian Suhu
                </p>
                <h3 className="text-2xl font-bold text-primary mb-3">
                  Sistem Lumbung Cerdas
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                  Fasilitas penyimpanan terkomputerisasi yang menjaga suhu dan kelembaban optimal secara otomatis. Dirancang untuk memperpanjang usia kesegaran hasil tani pasca-panen serta menstabilkan rantai pasok.
                </p>
              </div>

              {/* Stats Box */}
              <div className="bg-background rounded-xl p-4 sm:p-5 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Informasi Kapasitas Penyimpanan
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Varian Produk</p>
                      <p className="text-lg font-bold text-primary">
                        {loading ? "..." : `${productCount} Komoditas`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Stok</p>
                      <p className="text-lg font-bold text-primary">
                        {loading ? "..." : `${totalStock.toLocaleString("id-ID")} unit`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Greenhouse */}
          <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
            {/* Image Wrapper */}
            <div className="h-64 sm:h-72 w-full overflow-hidden relative">
              <ImageWithFallback
                src="/greenhouse.jpg"
                alt="Greenhouse Modern Selo Makmur"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-3 bg-primary/95 text-white px-4 py-2 rounded-xl backdrop-blur-sm shadow-md">
                <Sprout className="w-5 h-5 text-accent" />
                <span className="text-sm font-semibold tracking-wide">Greenhouse CSR</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
                  Budidaya Presisi & IoT
                </p>
                <h3 className="text-2xl font-bold text-primary mb-3">
                  Greenhouse Terkontrol
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                  Pusat pembibitan dan budidaya tanaman premium bernilai tinggi menggunakan teknologi penutup terkontrol. Meminimalkan ancaman hama eksternal serta memaksimalkan efisiensi penggunaan air dan nutrisi.
                </p>
              </div>

              {/* Stats Box */}
              <div className="bg-background rounded-xl p-4 sm:p-5 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Spesifikasi & Parameter IoT
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Suhu Rata-rata</p>
                      <p className="text-lg font-bold text-primary">24°C - 28°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Sensor Irigasi</p>
                      <p className="text-lg font-bold text-primary">Drip Otomatis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
