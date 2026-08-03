import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ShoppingCart, Minus, Plus, Package, Truck, ShieldCheck, ArrowLeft, CheckCircle, AlertTriangle, ShoppingBag } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

export function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cart States
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [authAlertOpen, setAuthAlertOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      const { data } = await supabase
        .from('products')
        .select('*, kelompok_tani(id, nama), product_variants(*), product_features(*)')
        .eq('id', id)
        .single();
      setProduct(data);
      if (data?.product_variants?.length > 0) {
        setSelectedVariant(data.product_variants[0].size);
      } else if (data) {
        setSelectedVariant(data.unit || "Standar");
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setSuccessMsg("");
    setErrorMsg("");
    if (!user) {
      setAuthAlertOpen(true);
      return;
    }

    setAddingToCart(true);
    const productId = product.id;
    const variantId = currentVariant && currentVariant.id ? currentVariant.id : null;

    try {
      let query = supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (variantId) {
        query = query.eq("variant_id", variantId);
      } else {
        query = query.is("variant_id", null);
      }

      const { data: existing, error: fetchErr } = await query;
      if (fetchErr) throw fetchErr;

      if (existing && existing.length > 0) {
        const newQty = existing[0].quantity + quantity;
        const maxStock = currentVariant ? currentVariant.stock : (product.stock ?? 0);

        if (newQty > maxStock) {
          throw new Error(`Tidak dapat menambah. Batas stok maksimum adalah ${maxStock}.`);
        }

        const { error: updateErr } = await supabase
          .from("cart_items")
          .update({ quantity: newQty })
          .eq("id", existing[0].id);

        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: productId,
            variant_id: variantId,
            quantity: quantity
          });

        if (insertErr) throw insertErr;
      }

      setSuccessMsg(`Berhasil menambahkan "${product.name}" ke keranjang.`);
      window.dispatchEvent(new Event("cart-updated"));
      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);

    } catch (err: any) {
      console.error("Error adding to cart:", err);
      setErrorMsg(err.message || "Gagal menambahkan produk ke keranjang.");
    } finally {
      setAddingToCart(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg sm:text-xl text-muted-foreground">Produk tidak ditemukan</p>
      </div>
    );
  }

  const variants = product.product_variants ?? [];
  const features = product.product_features?.map((f: any) => f.feature) ?? [];

  // Jika produk tidak memiliki varian khusus di tabel product_variants, buatkan varian fallback dari kolom produk bawaan (price, unit, stock)
  const effectiveVariants = variants.length > 0 ? variants : [
    {
      id: null,
      size: product.unit || "Standar",
      price: product.price ?? 0,
      stock: product.stock ?? 0,
    }
  ];

  const currentVariant = effectiveVariants.find((v: any) => v.size === selectedVariant) || effectiveVariants[0];
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
              src={product.image_url}
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
                Dari {product.kelompok_tani?.nama || "Gapoktan Selo Makmur"}
              </p>
            </div>

            {product.cultivation_method && (
              <div className="bg-secondary p-4 sm:p-6 rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Metode Budidaya</p>
                <p className="text-lg sm:text-xl text-primary">{product.cultivation_method}</p>
              </div>
            )}

            <div>
              <p className="text-base sm:text-lg mb-3 font-semibold text-primary">Pilih Kemasan / Satuan:</p>
              <div className="flex flex-wrap gap-3">
                {effectiveVariants.map((variant: any, idx: number) => (
                  <button
                    key={variant.id || variant.size || idx}
                    onClick={() => {
                      setSelectedVariant(variant.size);
                      setQuantity(1);
                    }}
                    className={`px-6 py-3 rounded-lg transition-colors border-2 cursor-pointer ${
                      selectedVariant === variant.size
                        ? "border-accent bg-accent text-white shadow-md"
                        : "border-border bg-white text-foreground hover:border-accent"
                    }`}
                  >
                    <div className="text-base sm:text-lg font-semibold">{variant.size}</div>
                    <div className="text-xs sm:text-sm opacity-90">
                      Rp {Number(variant.price).toLocaleString("id-ID")}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {currentVariant && (
              <>
                <div>
                  <p className="text-base sm:text-lg mb-3 font-semibold text-primary">Jumlah:</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-border rounded-lg flex items-center justify-center hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-2xl sm:text-3xl text-primary min-w-[3rem] text-center font-bold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= currentVariant.stock}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-border rounded-lg flex items-center justify-center hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    Stok tersedia: <span className="font-bold text-foreground">{currentVariant.stock}</span> {currentVariant.size}
                  </p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-2 border-accent">
                  <p className="text-base sm:text-lg text-muted-foreground mb-2">
                    Total Harga
                  </p>
                  <p className="text-3xl sm:text-4xl text-accent mb-4 font-bold">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </p>
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || currentVariant.stock <= 0}
                    className="w-full bg-accent hover:bg-accent/90 text-white py-3 sm:py-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-base sm:text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-semibold"
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    {addingToCart ? "Memproses..." : currentVariant.stock <= 0 ? "Stok Habis" : "Tambah ke Keranjang"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>



        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
          <h2 className="text-2xl sm:text-3xl text-primary mb-4">Deskripsi Produk</h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
            {product.description}
          </p>
          <h3 className="text-xl sm:text-2xl text-primary mb-4">Keunggulan Produk</h3>
          <ul className="space-y-3">
            {features.map((feature: string, index: number) => (
              <li key={index} className="flex gap-3 items-start">
                <span className="text-accent text-xl flex-shrink-0">✓</span>
                <span className="text-base sm:text-lg text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating Success Notification Banner */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-slideIn">
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
          <span className="font-semibold text-sm sm:text-base">{successMsg}</span>
        </div>
      )}

      {/* Floating Error Notification Banner */}
      {errorMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-destructive text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-red-500 animate-slideIn">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <span className="font-semibold text-sm sm:text-base">{errorMsg}</span>
        </div>
      )}

      {/* AUTH LIMITATION WARNING MODAL */}
      {authAlertOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-border p-6 text-center transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary">Akses Terbatas</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Anda perlu masuk (login) ke dalam akun terlebih dahulu untuk menggunakan fitur keranjang belanja dan memesan produk.
                </p>
              </div>
              <div className="flex w-full gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthAlertOpen(false)}
                  className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <Link
                  to="/login"
                  className="flex-1 bg-accent hover:bg-accent/90 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center"
                >
                  Masuk Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
