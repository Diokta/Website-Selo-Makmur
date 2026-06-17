import { useState } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Search, Filter, ShoppingCart, TrendingUp } from "lucide-react";

export function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "Semua",
    "Beras",
    "Sayuran",
    "Buah",
    "Palawija",
    "Bumbu",
    "Bibit",
    "Pupuk Organik",
  ];

  const products = [
    {
      id: 1,
      name: "Beras Organik Premium",
      category: "Beras",
      poktan: "Poktan Harapan Jaya",
      price: 15000,
      unit: "kg",
      stock: 500,
      image: "https://images.unsplash.com/photo-1676281945404-4e1cb6eaf25e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: "Terlaris",
    },
    {
      id: 2,
      name: "Paket Sayuran Segar",
      category: "Sayuran",
      poktan: "Poktan Maju Bersama",
      price: 35000,
      unit: "paket",
      stock: 30,
      image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBoYXJ2ZXN0JTIwb3JnYW5pYyUyMHByb2R1Y2V8ZW58MXx8fHwxNzgwNDYxMTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: "Baru",
    },
    {
      id: 3,
      name: "Jagung Manis Organik",
      category: "Palawija",
      poktan: "Poktan Berkah Tani",
      price: 12000,
      unit: "kg",
      stock: 200,
      image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBoYXJ2ZXN0JTIwb3JnYW5pYyUyMHByb2R1Y2V8ZW58MXx8fHwxNzgwNDYxMTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: "Populer",
    },
    {
      id: 4,
      name: "Cabai Merah Segar",
      category: "Bumbu",
      poktan: "Poktan Berkah Tani",
      price: 45000,
      unit: "kg",
      stock: 50,
      image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBoYXJ2ZXN0JTIwb3JnYW5pYyUyMHByb2R1Y2V8ZW58MXx8fHwxNzgwNDYxMTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: "Terlaris",
    },
    {
      id: 5,
      name: "Beras Merah Organik",
      category: "Beras",
      poktan: "Poktan Tani Makmur",
      price: 18000,
      unit: "kg",
      stock: 150,
      image: "https://images.unsplash.com/photo-1673746759526-375ad76cb399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 6,
      name: "Kangkung Organik",
      category: "Sayuran",
      poktan: "Poktan Sejahtera",
      price: 8000,
      unit: "ikat",
      stock: 100,
      image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBoYXJ2ZXN0JTIwb3JnYW5pYyUyMHByb2R1Y2V8ZW58MXx8fHwxNzgwNDYxMTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 7,
      name: "Pupuk Kompos Organik",
      category: "Pupuk Organik",
      poktan: "Poktan Sumber Rezeki",
      price: 25000,
      unit: "karung 20kg",
      stock: 80,
      image: "https://images.unsplash.com/photo-1676281945191-4c0ed1a1784d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 8,
      name: "Bibit Cabai Rawit",
      category: "Bibit",
      poktan: "Poktan Subur Jaya",
      price: 5000,
      unit: "polybag",
      stock: 200,
      image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBoYXJ2ZXN0JTIwb3JnYW5pYyUyMHByb2R1Y2V8ZW58MXx8fHwxNzgwNDYxMTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "Semua" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-accent py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl text-white mb-4">Toko Tani</h1>
          <p className="text-lg sm:text-xl text-white/90">
            Produk segar langsung dari petani lokal
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-base sm:text-lg"
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
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
            Menampilkan {filteredProducts.length} produk
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
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
                  {product.stock < 50 && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-destructive text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                        Stok Terbatas
                      </span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4 sm:p-5">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg sm:text-xl text-primary mb-2 hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  {product.poktan}
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  Stok: {product.stock} {product.unit}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl sm:text-2xl text-accent">
                      Rp {product.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /{product.unit}
                    </span>
                  </div>
                  <button className="bg-primary hover:bg-primary/90 text-white p-2 sm:p-3 rounded-lg transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-lg sm:text-xl text-muted-foreground">
              Tidak ada produk yang ditemukan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
