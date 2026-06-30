import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export function NewsSection() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const { data } = await supabase
          .from("news_gallery")
          .select("*, gallery_images(*)")
          .eq("is_published", true)
          .order("published_at", { ascending: false })
          .limit(3);
        
        setNewsList(data ?? []);
      } catch (err) {
        console.error("Error fetching homepage news:", err);
        setNewsList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestNews();
  }, []);

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

        {newsList.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white rounded-2xl border border-border max-w-lg mx-auto shadow-md mb-8">
            <Calendar className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
            <p className="text-lg font-semibold text-primary">Belum Ada Berita & Kegiatan</p>
            <p className="text-sm text-muted-foreground mt-1">Kunjungi halaman ini secara berkala untuk mendapatkan update terbaru seputar kegiatan kami.</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 mx-auto ${
            newsList.length === 1 ? "max-w-md" : 
            newsList.length === 2 ? "max-w-4xl" : "max-w-7xl"
          }`}>
            {newsList.map((item) => {
              const articleImage = item.gallery_images?.[0]?.image_url || item.image_url || item.image || "https://images.unsplash.com/photo-1673746759526-375ad76cb399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";
              const articleDate = item.published_at ? new Date(item.published_at).toLocaleDateString("id-ID") : item.date || "-";
              const excerpt = item.description || item.excerpt || "";

              return (
                <article
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-border/30 max-w-md mx-auto w-full flex flex-col h-[420px] sm:h-[480px]"
                >
                  <div className="relative h-48 sm:h-56 overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={articleImage}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{articleDate}</span>
                      </div>
                      <h3 className="text-base sm:text-lg text-primary font-bold mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2 sm:line-clamp-3">
                        {excerpt}
                      </p>
                    </div>
                    <Link to="/news" className="text-accent hover:text-accent/80 flex items-center gap-2 transition-colors text-xs sm:text-sm font-semibold mt-auto">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

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
