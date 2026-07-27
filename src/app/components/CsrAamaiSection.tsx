import { Warehouse, Sprout } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function CsrAamaiSection() {
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
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Fasilitas penyimpanan terkomputerisasi yang menjaga suhu dan kelembaban optimal secara otomatis. Dirancang untuk memperpanjang usia kesegaran hasil tani pasca-panen serta menstabilkan rantai pasok.
                </p>
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
                <span className="text-sm font-semibold tracking-wide">Greenhouse</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
                  Budidaya Presisi
                </p>
                <h3 className="text-2xl font-bold text-primary mb-3">
                  Greenhouse
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Pusat pembibitan dan budidaya tanaman premium bernilai tinggi menggunakan teknologi penutup terkontrol. Meminimalkan ancaman hama eksternal serta memaksimalkan efisiensi penggunaan air dan nutrisi.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
