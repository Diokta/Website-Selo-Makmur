import { Link, useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export function Cart() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cart_items")
        .select("*, products(name, price, unit, image_url, stock), product_variants(size, price, stock)")
        .eq("user_id", user.id);

      if (data) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          name: item.products?.name ?? "Produk",
          variant: item.product_variants?.size ?? item.products?.unit ?? "Porsi",
          price: item.product_variants?.price ?? item.products?.price ?? 0,
          quantity: item.quantity,
          maxStock: item.product_variants?.stock ?? item.products?.stock ?? 99,
          image: item.products?.image_url ?? "https://images.unsplash.com/photo-1579113800032-c38bd7635818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBoYXJ2ZXN0JTIwb3JnYW5pYyUyMHByb2R1Y2V8ZW58MXx8fHwxNzgwNDYxMTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        }));
        setCartItems(mapped);
        setCheckedIds(mapped.map((item) => item.id));
      }
      setLoading(false);
    };

    fetchCart();
  }, [user, authLoading]);

  const updateQuantity = async (id: string, delta: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty < 1 || newQty > item.maxStock) return;

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("id", id);

    if (!error) {
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
      );
      window.dispatchEvent(new Event("cart-updated"));
    }
  };

  const removeItem = async (id: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", id);

    if (!error) {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
      setCheckedIds((prev) => prev.filter((item) => item !== id));
      window.dispatchEvent(new Event("cart-updated"));
    }
  };

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (checkedIds.length === cartItems.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(cartItems.map((item) => item.id));
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { selectedIds: checkedIds } });
  };

  // Subtotal using selected/checked items only
  const checkedItems = cartItems.filter((item) => checkedIds.includes(item.id));
  const subtotal = checkedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-md max-w-md w-full border border-border">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl text-primary mb-4">Akses Terbatas</h2>
          <p className="text-base text-muted-foreground mb-6">
            Silakan masuk terlebih dahulu untuk melihat dan mengelola keranjang belanja Anda.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg transition-colors text-base font-medium"
          >
            Masuk Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-accent py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl text-white mb-4">
            Keranjang Belanja
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            {cartItems.length} produk dalam keranjang
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl p-12 sm:p-16 text-center shadow-md">
            <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl text-primary mb-4">
              Keranjang Kosong
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              Belum ada produk dalam keranjang belanja Anda
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors text-base sm:text-lg"
            >
              Mulai Belanja
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {/* Select All Checkbox */}
              <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-3 border border-border">
                <input
                  type="checkbox"
                  checked={cartItems.length > 0 && checkedIds.length === cartItems.length}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 text-accent rounded focus:ring-accent border-border cursor-pointer accent-accent"
                />
                <span className="text-sm font-semibold text-primary">
                  Pilih Semua ({cartItems.length} Produk)
                </span>
              </div>

              {/* Cart List */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-md flex items-center gap-3 sm:gap-6 border border-border"
                >
                  {/* Item Checkbox */}
                  <input
                    type="checkbox"
                    checked={checkedIds.includes(item.id)}
                    onChange={() => toggleCheck(item.id)}
                    className="w-5 h-5 text-accent rounded focus:ring-accent border-border cursor-pointer accent-accent flex-shrink-0"
                  />
                  
                  <div className="w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl text-primary font-semibold mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Kemasan: {item.variant}
                      </p>
                      <p className="text-lg font-bold text-accent">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 bg-secondary hover:bg-muted rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Minus className="w-4 h-4 text-primary" />
                        </button>
                        <span className="text-lg font-bold text-primary min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 bg-secondary hover:bg-muted rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-primary" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                        title="Hapus dari Keranjang"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
                <h2 className="text-2xl text-primary mb-6">Ringkasan Belanja</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-base sm:text-lg">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-primary font-semibold">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 bg-amber-50/70 border border-amber-200 rounded-lg p-3 leading-relaxed">
                    Harga di atas belum termasuk ongkos kirim. Ongkos kirim akan dihitung saat Anda memilih kurir di halaman pembayaran.
                  </p>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-xl sm:text-2xl">
                      <span className="text-primary font-bold">Total</span>
                      <span className="text-accent font-bold">
                        Rp {total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkedIds.length === 0}
                  className="block w-full bg-accent hover:bg-accent/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-white py-3 sm:py-4 rounded-lg transition-colors text-center text-base sm:text-lg font-semibold cursor-pointer"
                >
                  Lanjut ke Pembayaran ({checkedIds.length})
                </button>
                <Link
                  to="/shop"
                  className="block w-full mt-3 text-center text-accent hover:text-accent/80 py-2 text-base sm:text-lg transition-colors"
                >
                  Lanjut Belanja
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
