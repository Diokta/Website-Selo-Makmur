import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useState } from "react";

export function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Beras Organik Premium",
      variant: "5kg",
      price: 75000,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1676281945404-4e1cb6eaf25e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 2,
      name: "Paket Sayuran Segar",
      variant: "1 paket",
      price: 35000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBoYXJ2ZXN0JTIwb3JnYW5pYyUyMHByb2R1Y2V8ZW58MXx8fHwxNzgwNDYxMTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100000 ? 0 : 10000;
  const total = subtotal + shipping;

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
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-md flex gap-4 sm:gap-6"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl text-primary mb-2">
                        {item.name}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-3">
                        Kemasan: {item.variant}
                      </p>
                      <p className="text-lg sm:text-xl text-accent">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 bg-secondary hover:bg-muted rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg sm:text-xl text-primary min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 bg-secondary hover:bg-muted rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
                    <span className="text-primary">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg">
                    <span className="text-muted-foreground">Ongkir</span>
                    <span className="text-primary">
                      {shipping === 0 ? (
                        <span className="text-accent">Gratis</span>
                      ) : (
                        `Rp ${shipping.toLocaleString("id-ID")}`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Gratis ongkir untuk belanja di atas Rp 100.000
                    </p>
                  )}
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-xl sm:text-2xl">
                      <span className="text-primary">Total</span>
                      <span className="text-accent">
                        Rp {total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="block w-full bg-accent hover:bg-accent/90 text-white py-3 sm:py-4 rounded-lg transition-colors text-center text-base sm:text-lg"
                >
                  Lanjut ke Pembayaran
                </Link>
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
