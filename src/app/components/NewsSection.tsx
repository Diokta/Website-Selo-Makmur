import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, ArrowRight } from "lucide-react";

export function NewsSection() {
  const news = [
    {
      id: 1,
      title: "Pelatihan Budidaya Organik untuk Petani",
      excerpt: "Gapoktan mengadakan pelatihan budidaya pertanian organik yang diikuti oleh 50 petani dari berbagai kelompok tani",
      date: "28 Mei 2026",
      image: "https://images.unsplash.com/photo-1673746759528-e48f0dce5896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 2,
      title: "Panen Raya Padi Musim Ini Meningkat 20%",
      excerpt: "Hasil panen padi periode ini mengalami peningkatan signifikan berkat penggunaan sistem irigasi modern dan pupuk organik",
      date: "22 Mei 2026",
      image: "https://images.unsplash.com/photo-1673746759526-375ad76cb399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 3,
      title: "Kerjasama dengan Pasar Modern Lokal",
      excerpt: "Gapoktan menjalin kemitraan dengan jaringan pasar modern untuk distribusi produk pertanian segar ke konsumen",
      date: "15 Mei 2026",
      image: "https://images.unsplash.com/photo-1602511706963-02ecf61637b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl text-primary mb-4">
            Berita & Kegiatan Terbaru
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Update terkini seputar kegiatan dan pencapaian Gapoktan
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-border"
            >
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-lg sm:text-xl text-primary mb-2 sm:mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-3">
                  {item.excerpt}
                </p>
                <button className="text-accent hover:text-accent/80 flex items-center gap-2 transition-colors text-sm sm:text-base">
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors text-base sm:text-lg"
          >
            Lihat Semua Berita
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
