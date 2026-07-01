import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Calendar, User, Tag, ArrowLeft, MapPin, Image as ImageIcon } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    const fetchArticleDetail = async () => {
      try {
        const { data, error } = await supabase
          .from("news_gallery")
          .select("*, gallery_images(*), kelompok_tani(id, nama)")
          .eq("id", id)
          .single();

        if (!error && data) {
          setArticle(data);
          const firstImage = data.gallery_images?.[0]?.image_url || data.image_url || data.image || "https://images.unsplash.com/photo-1673746759526-375ad76cb399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800";
          setActiveImage(firstImage);
        }
      } catch (err) {
        console.error("Error fetching article detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticleDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner message="Memuat artikel berita..." />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center py-12 px-6 bg-white rounded-2xl border border-border max-w-md mx-auto shadow-md">
          <Calendar className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-primary mb-2">Artikel Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-6">Artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
          <Link to="/news" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Berita
          </Link>
        </div>
      </div>
    );
  }

  const publishedDate = article.published_at 
    ? new Date(article.published_at).toLocaleDateString("id-ID", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "-";

  // Split content by newlines to render as paragraphs
  const paragraphs = article.content 
    ? article.content.split("\n").filter((p: string) => p.trim() !== "") 
    : [article.description || "Tidak ada konten artikel."];

  return (
    <div className="min-h-screen bg-background pb-12 sm:pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-primary to-accent py-10 sm:py-14 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/news" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Berita & Kegiatan
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {article.category || "Berita"}
            </span>
            {article.type && (
              <span className="bg-accent-foreground/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {article.type}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {article.title}
          </h1>
          <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{publishedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Ditulis oleh: {article.author || "Admin"}</span>
            </div>
            {article.kelompok_tani && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Poktan: {article.kelompok_tani.nama}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content & Gallery */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
        <div className="bg-white rounded-2xl border border-border/50 overflow-hidden shadow-sm p-5 sm:p-8">
          {/* Main Cover Image */}
          <div className="relative rounded-xl overflow-hidden mb-8 aspect-video max-h-[480px]">
            <ImageWithFallback
              src={activeImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image Gallery Thumbnails */}
          {article.gallery_images && article.gallery_images.length > 1 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground font-semibold">
                <ImageIcon className="w-4 h-4" />
                <span>Galeri Foto ({article.gallery_images.length})</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {article.gallery_images.map((img: any, idx: number) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImage(img.image_url)}
                    className={`relative w-20 sm:w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === img.image_url 
                        ? "border-accent scale-95 shadow-md" 
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <ImageWithFallback
                      src={img.image_url}
                      alt={img.caption || `Galeri ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Article Text Content */}
          <div className="prose prose-lg max-w-none text-foreground leading-relaxed space-y-6">
            {paragraphs.map((para: string, idx: number) => (
              <p key={idx} className="text-base sm:text-lg text-muted-foreground whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>

          {/* Footer of the Card */}
          <div className="border-t border-border mt-10 pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Kategori: <strong className="text-primary font-semibold">{article.category || "Umum"}</strong></span>
            </div>
            <Link to="/news" className="bg-secondary hover:bg-secondary/80 text-primary px-5 py-2.5 rounded-lg transition-colors text-sm font-semibold flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Semua Berita
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
