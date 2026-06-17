import { useState } from "react";
import { CreditCard, MapPin, Truck, Wallet } from "lucide-react";

export function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [courier, setCourier] = useState("local");

  const cartSummary = {
    items: 3,
    subtotal: 185000,
    shipping: 0,
    total: 185000,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-accent py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl text-white mb-4">Pembayaran</h1>
          <p className="text-lg sm:text-xl text-white/90">
            Lengkapi data untuk menyelesaikan pesanan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-accent" />
                <h2 className="text-2xl text-primary">Alamat Pengiriman</h2>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-base mb-2 text-foreground">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-base mb-2 text-foreground">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    placeholder="08XX-XXXX-XXXX"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-base mb-2 text-foreground">
                    Alamat Lengkap
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Masukkan alamat lengkap dengan nama jalan, RT/RW, kelurahan, kecamatan"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base mb-2 text-foreground">
                      Kota/Kabupaten
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan kota"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-base mb-2 text-foreground">
                      Kode Pos
                    </label>
                    <input
                      type="text"
                      placeholder="Kode pos"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-6 h-6 text-accent" />
                <h2 className="text-2xl text-primary">Pilih Kurir</h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-4 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input
                    type="radio"
                    name="courier"
                    value="local"
                    checked={courier === "local"}
                    onChange={(e) => setCourier(e.target.value)}
                    className="w-5 h-5 text-accent"
                  />
                  <div className="flex-1">
                    <p className="text-lg text-primary">Kurir Lokal / Ojek</p>
                    <p className="text-sm text-muted-foreground">
                      Pengiriman area Bogor (1-2 hari)
                    </p>
                  </div>
                  <p className="text-lg text-accent">Gratis</p>
                </label>
                <label className="flex items-center gap-4 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input
                    type="radio"
                    name="courier"
                    value="jne"
                    checked={courier === "jne"}
                    onChange={(e) => setCourier(e.target.value)}
                    className="w-5 h-5 text-accent"
                  />
                  <div className="flex-1">
                    <p className="text-lg text-primary">JNE Regular</p>
                    <p className="text-sm text-muted-foreground">
                      Estimasi 2-3 hari
                    </p>
                  </div>
                  <p className="text-lg text-accent">Rp 15.000</p>
                </label>
                <label className="flex items-center gap-4 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input
                    type="radio"
                    name="courier"
                    value="jnt"
                    checked={courier === "jnt"}
                    onChange={(e) => setCourier(e.target.value)}
                    className="w-5 h-5 text-accent"
                  />
                  <div className="flex-1">
                    <p className="text-lg text-primary">J&T Express</p>
                    <p className="text-sm text-muted-foreground">
                      Estimasi 2-4 hari
                    </p>
                  </div>
                  <p className="text-lg text-accent">Rp 12.000</p>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-accent" />
                <h2 className="text-2xl text-primary">Metode Pembayaran</h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-4 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={paymentMethod === "transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-accent"
                  />
                  <div className="flex-1">
                    <p className="text-lg text-primary">Transfer Bank</p>
                    <p className="text-sm text-muted-foreground">
                      BCA, BNI, Mandiri, BRI
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-4 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="ewallet"
                    checked={paymentMethod === "ewallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-accent"
                  />
                  <div className="flex-1 flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    <div>
                      <p className="text-lg text-primary">E-Wallet</p>
                      <p className="text-sm text-muted-foreground">
                        GoPay, OVO, Dana, ShopeePay
                      </p>
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-4 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-accent"
                  />
                  <div className="flex-1">
                    <p className="text-lg text-primary">
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Bayar saat barang diterima (area Bogor saja)
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h2 className="text-2xl text-primary mb-6">Ringkasan Pesanan</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">
                    Subtotal ({cartSummary.items} item)
                  </span>
                  <span className="text-primary">
                    Rp {cartSummary.subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Ongkos Kirim</span>
                  <span className="text-accent">Gratis</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-2xl mb-6">
                    <span className="text-primary">Total</span>
                    <span className="text-accent">
                      Rp {cartSummary.total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-accent hover:bg-accent/90 text-white py-4 rounded-lg transition-colors text-lg mb-3">
                Buat Pesanan
              </button>
              <p className="text-sm text-muted-foreground text-center">
                Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang
                berlaku
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
