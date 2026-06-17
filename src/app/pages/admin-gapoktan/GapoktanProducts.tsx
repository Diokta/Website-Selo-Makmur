import { useState } from "react";
import { Plus, Edit, Trash2, Upload, CheckCircle, XCircle, PlusCircle, MinusCircle } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

type Variant = { size: string; price: string; stock: string };

export function GapoktanProducts() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([{ size: "", price: "", stock: "" }]);
  const [features, setFeatures] = useState<string[]>([""]);

  const addVariant = () => setVariants([...variants, { size: "", price: "", stock: "" }]);
  const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, field: keyof Variant, value: string) =>
    setVariants(variants.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));

  const addFeature = () => setFeatures([...features, ""]);
  const removeFeature = (i: number) => setFeatures(features.filter((_, idx) => idx !== i));
  const updateFeature = (i: number, value: string) =>
    setFeatures(features.map((f, idx) => (idx === i ? value : f)));

  const products = [
    {
      id: 1,
      name: "Beras Organik Premium",
      category: "Beras",
      poktan: "Poktan Harapan Jaya",
      price: 15000,
      stock: 450,
      unit: "kg",
      status: "Aktif",
      statusColor: "var(--status-success)",
      harvestDate: "2026-05-15",
      method: "Organik",
      image: "https://images.unsplash.com/photo-1676281945404-4e1cb6eaf25e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: 2,
      name: "Sayuran Segar Campur",
      category: "Sayuran",
      poktan: "Poktan Maju Bersama",
      price: 35000,
      stock: 85,
      unit: "paket",
      status: "Aktif",
      statusColor: "var(--status-success)",
      harvestDate: "2026-06-01",
      method: "Organik",
      image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: 3,
      name: "Jagung Manis",
      category: "Palawija",
      poktan: "Poktan Berkah Tani",
      price: 12000,
      stock: 15,
      unit: "kg",
      status: "Stok Menipis",
      statusColor: "var(--status-pending)",
      harvestDate: "2026-05-28",
      method: "Semi-Organik",
      image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: 4,
      name: "Cabai Merah Keriting",
      category: "Bumbu",
      poktan: "Poktan Berkah Tani",
      price: 45000,
      stock: 0,
      unit: "kg",
      status: "Habis",
      statusColor: "var(--status-error)",
      harvestDate: "2026-05-20",
      method: "Organik",
      image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: 5,
      name: "Tomat Segar",
      category: "Sayuran",
      poktan: "Poktan Sumber Rezeki",
      price: 18000,
      stock: 120,
      unit: "kg",
      status: "Aktif",
      statusColor: "var(--status-success)",
      harvestDate: "2026-06-02",
      method: "Organik",
      image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
  ];

  const categories = ["Beras", "Sayuran", "Palawija", "Bumbu", "Buah", "Bibit", "Pupuk Organik"];
  const methods = ["Organik", "Semi-Organik", "Konvensional"];
  const poktanList = [
    "Poktan Harapan Jaya",
    "Poktan Maju Bersama",
    "Poktan Berkah Tani",
    "Poktan Sumber Rezeki",
    "Poktan Tani Makmur",
    "Poktan Subur Jaya",
    "Poktan Mandiri",
    "Poktan Sejahtera",
  ];

  const getStatusIcon = (status: string) => {
    if (status === "Aktif") return <CheckCircle className="w-4 h-4" />;
    if (status === "Habis") return <XCircle className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-primary mb-2">
            Manajemen Produk & Stok
          </h2>
          <p className="text-base text-muted-foreground">
            Kelola seluruh produk dari semua kelompok tani
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Produk
        </button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl text-primary mb-6">Tambah Produk Baru</h3>
          <form className="space-y-6">
            {/* Informasi Dasar */}
            <div>
              <p className="text-sm text-muted-foreground mb-3 pb-2 border-b border-border">Informasi Dasar</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground">Nama Produk</label>
                  <input
                    type="text"
                    placeholder="Contoh: Beras Putih Premium"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Kelompok Tani (Poktan)</label>
                  <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Pilih Poktan</option>
                    {poktanList.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Kategori</label>
                  <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Pilih kategori</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Metode Budidaya</label>
                  <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    {methods.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Tanggal Panen</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Label / Badge Produk</label>
                  <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Tidak ada</option>
                    <option value="Terlaris">Terlaris</option>
                    <option value="Baru">Baru</option>
                    <option value="Populer">Populer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Satuan Dasar</label>
                  <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>kg</option>
                    <option>ikat</option>
                    <option>paket</option>
                    <option>polybag</option>
                    <option>karung</option>
                    <option>buah</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <p className="text-sm text-muted-foreground mb-3 pb-2 border-b border-border">Deskripsi Produk</p>
              <textarea
                rows={3}
                placeholder="Jelaskan keunggulan produk, cara budidaya, dan informasi penting lainnya..."
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Harga & Stok */}
            <div>
              <p className="text-sm text-muted-foreground mb-3 pb-2 border-b border-border">Harga & Stok</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground">Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    placeholder="15000"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Jumlah Stok</label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Varian Kemasan */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                <p className="text-sm text-muted-foreground">Varian Kemasan <span className="text-xs">(opsional — tampil di halaman detail produk)</span></p>
                <button type="button" onClick={addVariant} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
                  <PlusCircle className="w-4 h-4" /> Tambah Varian
                </button>
              </div>
              <div className="space-y-3">
                {variants.map((v, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Ukuran (cth: 5kg)"
                      value={v.size}
                      onChange={(e) => updateVariant(i, "size", e.target.value)}
                      className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Harga (Rp)"
                      value={v.price}
                      onChange={(e) => updateVariant(i, "price", e.target.value)}
                      className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Stok"
                      value={v.stock}
                      onChange={(e) => updateVariant(i, "stock", e.target.value)}
                      className="w-20 px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(i)} className="text-destructive hover:text-destructive/80">
                        <MinusCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Keunggulan Produk */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                <p className="text-sm text-muted-foreground">Keunggulan Produk <span className="text-xs">(tampil di halaman detail produk)</span></p>
                <button type="button" onClick={addFeature} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
                  <PlusCircle className="w-4 h-4" /> Tambah Poin
                </button>
              </div>
              <div className="space-y-2">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="text-accent text-lg">✓</span>
                    <input
                      type="text"
                      placeholder="Contoh: Bebas pestisida kimia"
                      value={f}
                      onChange={(e) => updateFeature(i, e.target.value)}
                      className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {features.length > 1 && (
                      <button type="button" onClick={() => removeFeature(i)} className="text-destructive hover:text-destructive/80">
                        <MinusCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Foto Produk */}
            <div>
              <p className="text-sm text-muted-foreground mb-3 pb-2 border-b border-border">Foto Produk</p>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Klik untuk upload foto atau drag & drop</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG (Max 5MB)</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Simpan & Publikasikan
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setVariants([{ size: "", price: "", stock: "" }]);
                  setFeatures([""]);
                }}
                className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-lg transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "var(--primary)" }}>
              <tr>
                <th className="px-4 py-4 text-left text-sm text-white">Produk</th>
                <th className="px-4 py-4 text-left text-sm text-white">Poktan</th>
                <th className="px-4 py-4 text-left text-sm text-white">Kategori</th>
                <th className="px-4 py-4 text-left text-sm text-white">Harga</th>
                <th className="px-4 py-4 text-left text-sm text-white">Stok</th>
                <th className="px-4 py-4 text-left text-sm text-white">Metode</th>
                <th className="px-4 py-4 text-left text-sm text-white">Status</th>
                <th className="px-4 py-4 text-left text-sm text-white">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-background"}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-primary">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Panen: {new Date(product.harvestDate).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{product.poktan}</td>
                  <td className="px-4 py-4 text-sm">{product.category}</td>
                  <td className="px-4 py-4 text-sm">
                    Rp {product.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {product.stock} {product.unit}
                  </td>
                  <td className="px-4 py-4 text-sm">{product.method}</td>
                  <td className="px-4 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-white"
                      style={{ backgroundColor: product.statusColor }}
                    >
                      {getStatusIcon(product.status)}
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Edit className="w-5 h-5 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
