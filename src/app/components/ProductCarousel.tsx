import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShoppingCart, TrendingUp, ArrowRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { LoadingSpinner } from "./ui/LoadingSpinner";

export function ProductCarousel() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, kelompok_tani(id, nama)")
          .eq("status", "Aktif")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);


  const settings = {
    dots: true,
    infinite: products.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, products.length),
    slidesToScroll: 1,
    autoplay: products.length > 1,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, products.length),
          slidesToScroll: 1,
          infinite: products.length > 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: products.length > 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-secondary">
        <div className="flex items-center justify-center min-h-[300px]">
          <LoadingSpinner message="Memuat produk unggulan..." />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl text-primary mb-4">
            Produk Unggulan
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Hasil panen terbaik dari petani lokal, segar dan berkualitas tinggi
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-border/50 max-w-lg mx-auto shadow-md mb-8">
            <TrendingUp className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
            <p className="text-lg font-semibold text-primary">Belum Ada Produk Unggulan</p>
            <p className="text-sm text-muted-foreground mt-1">Kami sedang mempersiapkan produk segar terbaik kami untuk Anda. Hubungi kami untuk informasi lebih lanjut.</p>
          </div>
        ) : (
          <div className={`product-carousel mb-8 mx-auto ${
            products.length === 1 ? "max-w-md" : 
            products.length === 2 ? "max-w-4xl" : "max-w-7xl"
          }`}>
            <Slider {...settings}>
              {products.map((product) => {
                const formattedPrice = `Rp ${Number(product.price).toLocaleString("id-ID")}/${product.unit}`;
                return (
                  <div key={product.id} className="px-2 sm:px-3 pb-4">
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-border/30 max-w-md mx-auto w-full flex flex-col h-[420px] sm:h-[480px]">
                      <Link to={`/product/${product.id}`} className="block relative h-48 sm:h-56 overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {product.badge && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-accent text-white px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                              {product.badge}
                            </span>
                          </div>
                        )}
                      </Link>
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <Link to={`/product/${product.id}`} className="block group">
                            <h3 className="text-base sm:text-lg text-primary font-bold mb-2 group-hover:text-accent transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-base sm:text-lg text-accent font-semibold">
                            {formattedPrice}
                          </span>
                          <Link to={`/product/${product.id}`} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold">
                            <ShoppingCart className="w-4 h-4" />
                            Detail
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors text-base sm:text-lg"
          >
            Lihat Semua Produk
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
