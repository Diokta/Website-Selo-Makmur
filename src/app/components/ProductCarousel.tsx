import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShoppingCart, TrendingUp, ArrowRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function ProductCarousel() {
  const products = [
    {
      id: 1,
      name: "Beras Organik Premium",
      description: "Beras organik berkualitas tinggi dari sawah lokal",
      price: "Rp 15.000/kg",
      image: "https://images.unsplash.com/photo-1676281945404-4e1cb6eaf25e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: "Terlaris",
    },
    {
      id: 2,
      name: "Sayuran Segar Harian",
      description: "Paket sayuran segar dipetik pagi hari",
      price: "Rp 35.000/paket",
      image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBoYXJ2ZXN0JTIwb3JnYW5pYyUyMHByb2R1Y2V8ZW58MXx8fHwxNzgwNDYxMTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: "Baru",
    },
    {
      id: 3,
      name: "Jagung Manis Organik",
      description: "Jagung manis tanpa pestisida",
      price: "Rp 12.000/kg",
      image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBoYXJ2ZXN0JTIwb3JnYW5pYyUyMHByb2R1Y2V8ZW58MXx8fHwxNzgwNDYxMTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: "Populer",
    },
    {
      id: 4,
      name: "Cabai Merah Segar",
      description: "Cabai merah pilihan dari kebun petani lokal",
      price: "Rp 45.000/kg",
      image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBoYXJ2ZXN0JTIwb3JnYW5pYyUyMHByb2R1Y2V8ZW58MXx8fHwxNzgwNDYxMTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: "Terlaris",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

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

        <div className="product-carousel mb-8">
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product.id} className="px-2 sm:px-3">
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <div className="relative h-48 sm:h-56">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-accent text-white px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        {product.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-lg sm:text-xl text-primary mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl text-accent">
                        {product.price}
                      </span>
                      <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base">
                        <ShoppingCart className="w-4 h-4" />
                        Pesan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

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
