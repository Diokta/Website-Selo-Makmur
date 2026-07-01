import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Calendar, User, Tag, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import type { NewsGalleryRow } from "../../types/database";

export function News() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["Semua", "Penyuluhan", "Kegiatan", "Panen Raya", "Pelatihan", "Kemitraan", "Berita", "Pengumuman"];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("news_gallery")
        .select("*, gallery_images(*)")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      setNewsArticles(data ?? []);
      setLoading(false);
    };
    fetchNews();
  }, []);

  const filteredNews = newsArticles.filter((article) => {
    const matchesCategory = selectedCategory === "Semua" || article.category === selectedCategory || article.type === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

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
          {filteredNews.map((article) => {
            const articleImage = article.gallery_images?.[0]?.image_url ?? "https://images.unsplash.com/photo-1673746759526-375ad76cb399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";
            const articleDate = article.published_at ? new Date(article.published_at).toLocaleDateString("id-ID") : "-";

            return (
              <article
                key={article.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-border"
              >
                <Link to={`/news/${article.id}`} className="relative h-48 sm:h-52 overflow-hidden block">
                  <ImageWithFallback
                    src={articleImage}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-accent text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                      {article.category}
                    </span>
                  </div>
                </Link>
                <div className="p-4 sm:p-5">
                  <div className="flex flex-wrap gap-3 mb-3 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{articleDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                  </div>
                  <Link to={`/news/${article.id}`} className="group block">
                    <h3 className="text-lg sm:text-xl text-primary font-bold mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  <Link to={`/news/${article.id}`} className="text-accent hover:text-accent/80 font-semibold transition-colors text-sm sm:text-base inline-flex items-center gap-1">
                    Baca Selengkapnya →
                  </Link>
                </div>
              </article>
            );
          })}
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
