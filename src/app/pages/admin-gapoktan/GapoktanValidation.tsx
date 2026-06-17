import { CheckCircle, XCircle, Edit, Eye } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export function GapoktanValidation() {
  const pendingProducts = [
    {
      id: 1,
      name: "Tomat Segar Organik",
      poktan: "Poktan Harapan Jaya",
      category: "Sayuran",
      price: 18000,
      stock: 120,
      unit: "kg",
      harvestDate: "2026-06-02",
      method: "Organik",
      submittedBy: "Bapak Suparman",
      submittedDate: "2026-06-03",
      image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      description: "Tomat segar hasil panen terbaru dari lahan seluas 0.5 hektar",
    },
    {
      id: 2,
      name: "Beras Merah Organik Premium",
      poktan: "Poktan Maju Bersama",
      category: "Beras",
      price: 18000,
      stock: 350,
      unit: "kg",
      harvestDate: "2026-05-28",
      method: "Organik",
      submittedBy: "Ibu Siti Aminah",
      submittedDate: "2026-06-02",
      image: "https://images.unsplash.com/photo-1673746759526-375ad76cb399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      description: "Beras merah organik dengan kualitas premium untuk kesehatan",
    },
    {
      id: 3,
      name: "Kangkung Segar",
      poktan: "Poktan Sejahtera",
      category: "Sayuran",
      price: 8000,
      stock: 150,
      unit: "ikat",
      harvestDate: "2026-06-03",
      method: "Semi-Organik",
      submittedBy: "Ibu Nurhasanah",
      submittedDate: "2026-06-03",
      image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      description: "Kangkung segar dari kebun hidroponik",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl text-primary mb-2">
          Validasi Produk Baru
        </h2>
        <p className="text-base text-muted-foreground">
          Review dan setujui produk yang diajukan oleh Admin Poktan
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-muted-foreground mb-2">Menunggu Review</p>
          <p className="text-3xl text-primary">{pendingProducts.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-muted-foreground mb-2">Disetujui Hari Ini</p>
          <p className="text-3xl" style={{ color: "var(--status-success)" }}>12</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-muted-foreground mb-2">Ditolak Hari Ini</p>
          <p className="text-3xl" style={{ color: "var(--status-error)" }}>2</p>
        </div>
      </div>

      {/* Pending Products */}
      <div className="space-y-6">
        {pendingProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl text-primary mb-2">{product.name}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--primary)" }} />
                          {product.poktan}
                        </span>
                        <span>•</span>
                        <span>Diajukan oleh {product.submittedBy}</span>
                        <span>•</span>
                        <span>{new Date(product.submittedDate).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Kategori</p>
                      <p className="text-sm text-primary">{product.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Harga</p>
                      <p className="text-sm text-accent">Rp {product.price.toLocaleString("id-ID")}/{product.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Stok</p>
                      <p className="text-sm text-primary">{product.stock} {product.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Metode</p>
                      <p className="text-sm text-primary">{product.method}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Deskripsi</p>
                    <p className="text-sm text-foreground">{product.description}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Tanggal Panen</p>
                    <p className="text-sm text-primary">{new Date(product.harvestDate).toLocaleDateString("id-ID")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background px-6 py-4 flex flex-wrap gap-3">
              <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors">
                <CheckCircle className="w-4 h-4" />
                Setujui
              </button>
              <button className="flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-white px-6 py-2 rounded-lg transition-colors">
                <XCircle className="w-4 h-4" />
                Tolak
              </button>
              <button className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
                Edit Info
              </button>
              <button className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-6 py-2 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-secondary/10 rounded-xl p-6 border-l-4" style={{ borderColor: "var(--secondary)" }}>
        <h3 className="text-lg text-primary mb-2">Panduan Review Produk</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Periksa kualitas foto - pastikan foto jelas dan menampilkan produk dengan baik</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Verifikasi harga - pastikan harga wajar dan sesuai dengan standar pasar</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Cek deskripsi - pastikan informasi lengkap dan tidak menyesatkan</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Jika menolak, berikan alasan yang jelas kepada Admin Poktan</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
