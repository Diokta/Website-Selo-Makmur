import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Search, Filter, ShoppingCart, TrendingUp, Plus, Minus, X, AlertTriangle, ShoppingBag, CheckCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

export function Shop() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Cart Modal States
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalSelectedVariant, setModalSelectedVariant] = useState<any | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // Success / Error Alerts
  const [cartSuccessMsg, setCartSuccessMsg] = useState("");
  const [cartErrorMsg, setCartErrorMsg] = useState("");
  const [authAlertOpen, setAuthAlertOpen] = useState(false);

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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, kelompok_tani(id, nama)')
        .eq('status', 'Aktif')
        .order('created_at', { ascending: false });
      if (error) setFetchError(error.message);
      else setProducts(data ?? []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleAddToCartClick = async (product: any) => {
    setCartSuccessMsg("");
    setCartErrorMsg("");
    if (!user) {
      setAuthAlertOpen(true);
      return;
    }
    
    setSelectedProduct(product);
    setCartModalOpen(true);
    setModalLoading(true);
    setModalQuantity(1);
    setModalSelectedVariant(null);
    
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .eq("id", product.id)
        .single();
        
      if (error) throw error;
      if (data) {
        setSelectedProduct(data);
        if (data.product_variants && data.product_variants.length > 0) {
          setModalSelectedVariant(data.product_variants[0]);
        }
      }
    } catch (err: any) {
      console.error("Error loading product variants:", err);
      setCartErrorMsg("Gagal memuat varian produk.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmAddToCart = async () => {
    if (!user || !selectedProduct) return;
    
    setCartSuccessMsg("");
    setCartErrorMsg("");
    setAddingToCart(true);
    
    const productId = selectedProduct.id;
    const variantId = modalSelectedVariant ? modalSelectedVariant.id : null;
    const quantity = modalQuantity;
    
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
        const maxStock = modalSelectedVariant ? modalSelectedVariant.stock : selectedProduct.stock;
        
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
      
      setCartSuccessMsg(`Berhasil menambahkan "${selectedProduct.name}" ke keranjang.`);
      setCartModalOpen(false);
      window.dispatchEvent(new Event("cart-updated"));
      
      setTimeout(() => {
        setCartSuccessMsg("");
      }, 4000);
      
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      setCartErrorMsg(err.message || "Gagal menambahkan produk ke keranjang.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleModalQuantityChange = (delta: number) => {
    const newQuantity = modalQuantity + delta;
    const maxStock = modalSelectedVariant ? modalSelectedVariant.stock : (selectedProduct?.stock || 0);
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setModalQuantity(newQuantity);
    }
  };

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
        {/* Floating Success Notification Banner */}
        {cartSuccessMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-slideIn">
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <span className="font-semibold text-sm sm:text-base">{cartSuccessMsg}</span>
          </div>
        )}

        {/* Floating Error Notification Banner */}
        {cartErrorMsg && !cartModalOpen && (
          <div className="fixed bottom-6 right-6 z-50 bg-destructive text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-red-500 animate-slideIn">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <span className="font-semibold text-sm sm:text-base">{cartErrorMsg}</span>
          </div>
        )}

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
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base cursor-pointer ${
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

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : fetchError ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-lg sm:text-xl text-destructive">{fetchError}</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-base sm:text-lg text-muted-foreground">
                Menampilkan {filteredProducts.length} produk
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between"
                >
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative h-48 sm:h-52 overflow-hidden">
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
                      {product.stock < 50 && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-destructive text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                            Stok Terbatas
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-lg sm:text-xl text-primary mb-2 hover:text-accent transition-colors font-semibold">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                        {product.kelompok_tani?.nama ?? 'Gapoktan'}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Stok: {product.stock} {product.unit}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="text-xl sm:text-2xl text-accent font-bold">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          /{product.unit}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCartClick(product);
                        }}
                        className="bg-primary hover:bg-primary/90 text-white p-2.5 sm:p-3 rounded-lg transition-colors cursor-pointer"
                        title="Tambah ke Keranjang"
                      >
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
          </>
        )}
      </div>

      {/* ADD TO CART MODAL */}
      {cartModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-border overflow-hidden flex flex-col md:flex-row transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Left: Image Side */}
            <div className="w-full md:w-1/2 h-48 md:h-auto relative overflow-hidden bg-background">
              <ImageWithFallback
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setCartModalOpen(false)}
                className="absolute top-4 left-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-foreground transition-colors cursor-pointer md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Right: Info & Form Side */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-6">
              {/* Header */}
              <div className="relative">
                <button
                  onClick={() => setCartModalOpen(false)}
                  className="absolute -top-2 -right-2 bg-secondary hover:bg-muted p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer hidden md:block"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-xs font-semibold text-accent uppercase tracking-wider bg-accent/10 px-2.5 py-1 rounded-md">
                  {selectedProduct.category}
                </span>
                <h3 className="text-xl sm:text-2xl text-primary font-bold mt-3 leading-tight">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Oleh: {selectedProduct.kelompok_tani?.nama ?? "Gapoktan"}
                </p>
              </div>

              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <LoadingSpinner />
                  <p className="text-xs text-muted-foreground mt-2">Memuat varian...</p>
                </div>
              ) : (
                <div className="space-y-4 flex-1">
                  {/* Error Alert inside Modal */}
                  {cartErrorMsg && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-lg text-xs font-medium">
                      {cartErrorMsg}
                    </div>
                  )}

                  {/* Cultivation Info */}
                  <div className="text-xs bg-secondary px-3 py-2 rounded-lg inline-block text-primary font-medium">
                    Budidaya: {selectedProduct.cultivation_method || "Organik"}
                  </div>

                  {/* Varian Kemasan */}
                  {selectedProduct.product_variants && selectedProduct.product_variants.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pilih Kemasan:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedProduct.product_variants.map((v: any) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => {
                              setModalSelectedVariant(v);
                              setModalQuantity(1);
                            }}
                            className={`p-2 rounded-lg border-2 text-left transition-colors cursor-pointer ${
                              modalSelectedVariant?.id === v.id
                                ? "border-accent bg-accent/5 text-accent"
                                : "border-border bg-white text-foreground hover:border-accent"
                            }`}
                          >
                            <p className="text-xs font-bold">{v.size}</p>
                            <p className="text-xxs opacity-85 mt-0.5">Rp {v.price.toLocaleString("id-ID")}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Jumlah Pembelian:</p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleModalQuantityChange(-1)}
                        disabled={modalQuantity <= 1}
                        className="w-9 h-9 bg-secondary hover:bg-muted border border-border rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Minus className="w-4 h-4 text-primary" />
                      </button>
                      <span className="text-lg font-bold text-primary min-w-[2rem] text-center">
                        {modalQuantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleModalQuantityChange(1)}
                        disabled={modalQuantity >= (modalSelectedVariant ? modalSelectedVariant.stock : selectedProduct.stock)}
                        className="w-9 h-9 bg-secondary hover:bg-muted border border-border rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-primary" />
                      </button>
                      <span className="text-xs text-muted-foreground">
                        Stok: {modalSelectedVariant ? modalSelectedVariant.stock : selectedProduct.stock} {modalSelectedVariant ? modalSelectedVariant.size : selectedProduct.unit}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing & Footer Actions */}
              {!modalLoading && (
                <div className="border-t border-border pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xxs font-semibold text-muted-foreground uppercase tracking-wider">Total Harga</p>
                      <p className="text-2xl font-bold text-accent">
                        Rp {((modalSelectedVariant ? modalSelectedVariant.price : selectedProduct.price) * modalQuantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="text-xxs text-muted-foreground text-right">
                      Harga Satuan: Rp {(modalSelectedVariant ? modalSelectedVariant.price : selectedProduct.price).toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCartModalOpen(false)}
                      className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmAddToCart}
                      disabled={addingToCart || (modalSelectedVariant ? modalSelectedVariant.stock : selectedProduct.stock) <= 0}
                      className="flex-2 bg-accent hover:bg-accent/90 text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {addingToCart ? "Memproses..." : "Tambah"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
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
