import { useState } from "react";
import { useParams, Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ShoppingCart, Minus, Plus, Package, Truck, ShieldCheck, ArrowLeft } from "lucide-react";

export function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("5kg");

  const product = {
    id: 1,
    name: "Beras Organik Premium",
    category: "Beras",
    poktan: "Poktan Harapan Jaya",
    description:
      "Beras organik premium yang ditanam tanpa pestisida kimia. Diproses dengan teknologi modern untuk menjaga kualitas dan kesegaran. Cocok untuk keluarga yang peduli kesehatan.",
    cultivation: "Organik 100%",
    variants: [
      { size: "5kg", price: 75000, stock: 100 },
      { size: "10kg", price: 145000, stock: 80 },
      { size: "25kg", price: 350000, stock: 50 },
    ],
    image: "https://images.unsplash.com/photo-1676281945404-4e1cb6eaf25e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Bebas pestisida kimia",
      "Sertifikasi organik",
      "Hasil panen terbaru",
      "Kualitas premium",
    ],
  };

  const currentVariant = product.variants.find((v) => v.size === selectedVariant);
  const totalPrice = currentVariant ? currentVariant.price * quantity : 0;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (currentVariant && newQuantity >= 1 && newQuantity <= currentVariant.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-base sm:text-lg">Kembali ke Toko</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-64 sm:h-96 lg:h-[500px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm sm:text-base text-accent mb-2">{product.category}</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-primary mb-3">
                {product.name}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Dari {product.poktan}
              </p>
            </div>

            <div className="bg-secondary p-4 sm:p-6 rounded-xl">
              <p className="text-sm text-muted-foreground mb-2">Metode Budidaya</p>
              <p className="text-lg sm:text-xl text-primary">{product.cultivation}</p>
            </div>

            <div>
              <p className="text-base sm:text-lg mb-3">Pilih Kemasan:</p>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.size}
                    onClick={() => {
                      setSelectedVariant(variant.size);
                      setQuantity(1);
                    }}
                    className={`px-6 py-3 rounded-lg transition-colors border-2 ${
                      selectedVariant === variant.size
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-white text-foreground hover:border-accent"
                    }`}
                  >
                    <div className="text-base sm:text-lg">{variant.size}</div>
                    <div className="text-xs sm:text-sm opacity-80">
                      Rp {variant.price.toLocaleString("id-ID")}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {currentVariant && (
              <>
                <div>
                  <p className="text-base sm:text-lg mb-3">Jumlah:</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-border rounded-lg flex items-center justify-center hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-2xl sm:text-3xl text-primary min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= currentVariant.stock}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-border rounded-lg flex items-center justify-center hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Stok tersedia: {currentVariant.stock} {selectedVariant}
                  </p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-2 border-accent">
                  <p className="text-base sm:text-lg text-muted-foreground mb-2">
                    Total Harga
                  </p>
                  <p className="text-3xl sm:text-4xl text-accent mb-4">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </p>
                  <button className="w-full bg-accent hover:bg-accent/90 text-white py-3 sm:py-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-base sm:text-lg">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    Tambah ke Keranjang
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md flex gap-4">
            <Package className="w-8 h-8 sm:w-10 sm:h-10 text-accent flex-shrink-0" />
            <div>
              <h3 className="text-lg sm:text-xl text-primary mb-2">Kualitas Terjamin</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Dipilih dan dikemas dengan standar kualitas tinggi
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex gap-4">
            <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-accent flex-shrink-0" />
            <div>
              <h3 className="text-lg sm:text-xl text-primary mb-2">Pengiriman Cepat</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Dikirim dalam 1-2 hari kerja untuk area Bogor
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex gap-4">
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-accent flex-shrink-0" />
            <div>
              <h3 className="text-lg sm:text-xl text-primary mb-2">Sertifikasi Organik</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Produk tersertifikasi organik resmi
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
          <h2 className="text-2xl sm:text-3xl text-primary mb-4">Deskripsi Produk</h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
            {product.description}
          </p>
          <h3 className="text-xl sm:text-2xl text-primary mb-4">Keunggulan Produk</h3>
          <ul className="space-y-3">
            {product.features.map((feature, index) => (
              <li key={index} className="flex gap-3 items-start">
                <span className="text-accent text-xl flex-shrink-0">✓</span>
                <span className="text-base sm:text-lg text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
