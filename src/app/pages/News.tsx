import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Calendar, User, Tag, Search } from "lucide-react";
import { useState } from "react";

export function News() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "Semua",
    "Penyuluhan",
    "Kegiatan",
    "Panen Raya",
    "Pelatihan",
    "Kemitraan",
  ];

  const newsArticles = [
    {
      id: 1,
      title: "Pelatihan Budidaya Organik untuk Petani",
      excerpt:
        "Gapoktan mengadakan pelatihan budidaya pertanian organik yang diikuti oleh 50 petani dari berbagai kelompok tani. Pelatihan ini menghadirkan narasumber dari Dinas Pertanian Provinsi Jawa Barat.",
      date: "28 Mei 2026",
      author: "Admin Gapoktan",
      category: "Pelatihan",
      image: "https://images.unsplash.com/photo-1673746759528-e48f0dce5896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 2,
      title: "Panen Raya Padi Musim Ini Meningkat 20%",
      excerpt:
        "Hasil panen padi periode ini mengalami peningkatan signifikan berkat penggunaan sistem irigasi modern dan pupuk organik. Total produksi mencapai 850 ton dari target 700 ton.",
      date: "22 Mei 2026",
      author: "Admin Gapoktan",
      category: "Panen Raya",
      image: "https://images.unsplash.com/photo-1673746759526-375ad76cb399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 3,
      title: "Kerjasama dengan Pasar Modern Lokal",
      excerpt:
        "Gapoktan menjalin kemitraan dengan jaringan pasar modern untuk distribusi produk pertanian segar ke konsumen. Kerjasama ini meliputi 5 cabang supermarket di wilayah Bogor dan sekitarnya.",
      date: "15 Mei 2026",
      author: "Admin Gapoktan",
      category: "Kemitraan",
      image: "https://images.unsplash.com/photo-1602511706963-02ecf61637b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 4,
      title: "Penyuluhan Penggunaan Pupuk Bersubsidi",
      excerpt:
        "Dinas Pertanian Kabupaten Bogor memberikan penyuluhan tentang tata cara penggunaan pupuk bersubsidi yang efektif dan efisien. Kegiatan dihadiri oleh seluruh pengurus dan anggota poktan.",
      date: "10 Mei 2026",
      author: "Admin Gapoktan",
      category: "Penyuluhan",
      image: "https://images.unsplash.com/photo-1676281945191-4c0ed1a1784d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 5,
      title: "Gotong Royong Perbaikan Irigasi Sawah",
      excerpt:
        "Seluruh anggota Gapoktan bergotong royong memperbaiki saluran irigasi yang rusak akibat hujan deras. Kegiatan ini melibatkan 150 petani dan berhasil memperbaiki 2 km saluran irigasi.",
      date: "5 Mei 2026",
      author: "Admin Gapoktan",
      category: "Kegiatan",
      image: "https://images.unsplash.com/photo-1676281945404-4e1cb6eaf25e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 6,
      title: "Workshop Pembuatan Pupuk Kompos Organik",
      excerpt:
        "Workshop pembuatan pupuk kompos dari limbah pertanian diselenggarakan untuk meningkatkan kemandirian petani dalam memproduksi pupuk organik berkualitas.",
      date: "1 Mei 2026",
      author: "Admin Gapoktan",
      category: "Pelatihan",
      image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBoYXJ2ZXN0JTIwb3JnYW5pYyUyMHByb2R1Y2V8ZW58MXx8fHwxNzgwNDYxMTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const filteredNews = newsArticles.filter((article) => {
    const matchesCategory =
      selectedCategory === "Semua" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-accent py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl text-white mb-4">
            Berita & Kegiatan
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            Update terkini seputar kegiatan dan pencapaian Gapoktan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-base sm:text-lg"
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-base sm:text-lg text-foreground">
              Kategori:
            </span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                  selectedCategory === category
                    ? "bg-accent text-white"
                    : "bg-white text-foreground hover:bg-secondary border border-border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-base sm:text-lg text-muted-foreground">
            Menampilkan {filteredNews.length} berita
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredNews.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <ImageWithFallback
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-accent text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap gap-3 mb-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl text-primary mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <button className="text-accent hover:text-accent/80 transition-colors text-sm sm:text-base">
                  Baca Selengkapnya →
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-lg sm:text-xl text-muted-foreground">
              Tidak ada berita yang ditemukan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
