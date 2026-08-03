import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, CheckCircle, XCircle, PlusCircle, MinusCircle, AlertTriangle } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { supabase } from "../../../lib/supabase";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

type Variant = { size: string; price: string; stock: string };

export function GapoktanProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [poktans, setPoktans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Success / Error Alerts
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [poktanId, setPoktanId] = useState("");
  const [category, setCategory] = useState("");
  const [cultivationMethod, setCultivationMethod] = useState("Organik");
  const [price, setPrice] = useState("");
  const [gapoktanFee, setGapoktanFee] = useState("0");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("kg");
  const [harvestDate, setHarvestDate] = useState("");
  const [badge, setBadge] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("Aktif");
  const [variants, setVariants] = useState<Variant[]>([{ size: "", price: "", stock: "" }]);
  const [features, setFeatures] = useState<string[]>([""]);

  // Delete Modal States
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState("");

  // Custom Item Mode States
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomMethod, setIsCustomMethod] = useState(false);
  const [isCustomUnit, setIsCustomUnit] = useState(false);

  const defaultCategories = ["Beras", "Sayuran", "Palawija", "Bumbu", "Buah", "Bibit", "Pupuk Organik"];
  const defaultMethods = ["Organik", "Semi-Organik", "Konvensional"];
  const defaultUnits = ["kg", "ikat", "paket", "polybag", "karung", "buah"];

  const categories = Array.from(
    new Set([...defaultCategories, ...products.map((p) => p.category).filter(Boolean)])
  );
  const methods = Array.from(
    new Set([...defaultMethods, ...products.map((p) => p.cultivation_method).filter(Boolean)])
  );
  const units = Array.from(
    new Set([...defaultUnits, ...products.map((p) => p.unit).filter(Boolean)])
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch products
      const { data: prodData, error: prodError } = await supabase
        .from("products")
        .select("*, kelompok_tani(id, nama), product_variants(*), product_features(*)")
        .order("created_at", { ascending: false });

      if (prodError) throw prodError;
      if (prodData) setProducts(prodData);

      // 2. Fetch poktans
      const { data: poktanData, error: poktanError } = await supabase
        .from("kelompok_tani")
        .select("id, nama")
        .order("nama", { ascending: true });

      if (poktanError) throw poktanError;
      if (poktanData) setPoktans(poktanData);
    } catch (err: any) {
      console.error("Error loading products data:", err);
      setErrorMsg(err.message || "Gagal memuat data produk.");
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => setVariants([...variants, { size: "", price: "", stock: "" }]);
  const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, field: keyof Variant, value: string) =>
    setVariants(variants.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));

  const addFeature = () => setFeatures([...features, ""]);
  const removeFeature = (i: number) => setFeatures(features.filter((_, idx) => idx !== i));
  const updateFeature = (i: number, value: string) =>
    setFeatures(features.map((f, idx) => (idx === i ? value : f)));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
    } catch (err) {
      console.warn("Storage upload failed, falling back to base64 encoding:", err);
      // Fallback: encode as Base64 so it can still be displayed
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPoktanId("");
    setCategory("");
    setDescription("");
    setCultivationMethod("Organik");
    setPrice("");
    setGapoktanFee("0");
    setStock("");
    setUnit("kg");
    setHarvestDate("");
    setBadge("");
    setImageUrl("");
    setStatus("Aktif");
    setVariants([{ size: "", price: "", stock: "" }]);
    setFeatures([""]);
    setEditProductId(null);
    setShowForm(false);
    setErrorMsg("");
    setIsCustomCategory(false);
    setIsCustomMethod(false);
    setIsCustomUnit(false);
  };

  const handleEdit = (p: any) => {
    setErrorMsg("");
    setSuccessMsg("");
    setEditProductId(p.id);
    setName(p.name);
    setPoktanId(p.poktan_id || "");
    setCategory(p.category || "");
    setDescription(p.description || "");
    setCultivationMethod(p.cultivation_method || "Organik");
    setPrice(String(p.price));
    setGapoktanFee(p.gapoktan_fee !== undefined && p.gapoktan_fee !== null ? String(p.gapoktan_fee) : "0");
    setStock(String(p.stock));
    setUnit(p.unit || "kg");
    setHarvestDate(p.harvest_date ? p.harvest_date.substring(0, 10) : "");
    setBadge(p.badge || "");
    setImageUrl(p.image_url || "");
    setStatus(p.status || "Aktif");
    setIsCustomCategory(false);
    setIsCustomMethod(false);
    setIsCustomUnit(false);

    if (p.product_variants && p.product_variants.length > 0) {
      setVariants(p.product_variants.map((v: any) => ({
        size: v.size,
        price: String(v.price),
        stock: String(v.stock),
      })));
    } else {
      setVariants([{ size: "", price: "", stock: "" }]);
    }

    if (p.product_features && p.product_features.length > 0) {
      setFeatures(p.product_features.map((f: any) => f.feature));
    } else {
      setFeatures([""]);
    }

    setShowForm(true);
  };

  const requestDelete = (p: any) => {
    setDeleteTargetId(p.id);
    setDeleteTargetName(p.name);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteConfirmOpen(false);
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const { error } = await supabase.from("products").delete().eq("id", deleteTargetId);
      if (error) throw error;
      setSuccessMsg(`Produk "${deleteTargetName}" berhasil dihapus.`);
      setProducts(products.filter((p) => p.id !== deleteTargetId));
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setErrorMsg(err.message || "Gagal menghapus produk.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const productPayload = {
        name,
        poktan_id: poktanId || null,
        category: category || null,
        description: description || null,
        cultivation_method: cultivationMethod || null,
        price: parseFloat(price) || 0,
        gapoktan_fee: parseFloat(gapoktanFee) || 0,
        stock: parseInt(stock) || 0,
        unit,
        harvest_date: harvestDate || null,
        badge: badge || null,
        image_url: imageUrl || null,
        status: status as any,
      };

      let productId = editProductId;

      if (editProductId) {
        // Update product
        let { error } = await supabase
          .from("products")
          .update(productPayload)
          .eq("id", editProductId);

        if (error && (error.message?.includes("gapoktan_fee") || error.code === "PGRST204")) {
          delete (productPayload as any).gapoktan_fee;
          const retryRes = await supabase
            .from("products")
            .update(productPayload)
            .eq("id", editProductId);
          error = retryRes.error;
        }

        if (error) throw error;

        // Delete existing variants and features
        await supabase.from("product_variants").delete().eq("product_id", editProductId);
        await supabase.from("product_features").delete().eq("product_id", editProductId);
        setSuccessMsg("Produk berhasil diperbarui.");
      } else {
        // Insert product
        let { data, error } = await supabase
          .from("products")
          .insert(productPayload)
          .select()
          .single();

        if (error && (error.message?.includes("gapoktan_fee") || error.code === "PGRST204")) {
          delete (productPayload as any).gapoktan_fee;
          const retryRes = await supabase
            .from("products")
            .insert(productPayload)
            .select()
            .single();
          data = retryRes.data;
          error = retryRes.error;
        }

        if (error) throw error;
        productId = data?.id;
        setSuccessMsg("Produk baru berhasil ditambahkan.");
      }

      if (productId) {
        // Insert variants
        const validVariants = variants
          .filter((v) => v.size && v.price)
          .map((v) => ({
            product_id: productId!,
            size: v.size,
            price: parseFloat(v.price) || 0,
            stock: parseInt(v.stock) || 0,
          }));

        if (validVariants.length > 0) {
          const { error: varError } = await supabase.from("product_variants").insert(validVariants);
          if (varError) throw varError;
        }

        // Insert features
        const validFeatures = features
          .filter((f) => f.trim() !== "")
          .map((f, idx) => ({
            product_id: productId!,
            feature: f,
            sort_order: idx,
          }));

        if (validFeatures.length > 0) {
          const { error: featError } = await supabase.from("product_features").insert(validFeatures);
          if (featError) throw featError;
        }
      }

      resetForm();
      fetchData();
    } catch (err: any) {
      console.error("Error saving product:", err);
      setErrorMsg(err.message || "Gagal menyimpan produk.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (prodStatus: string) => {
    if (prodStatus === "Aktif") return <CheckCircle className="w-4 h-4" />;
    if (prodStatus === "Habis" || prodStatus === "Ditolak") return <XCircle className="w-4 h-4" />;
    return null;
  };

  const getStatusColor = (prodStatus: string) => {
    if (prodStatus === "Aktif") return "#5a8f3a";
    if (prodStatus === "Habis" || prodStatus === "Ditolak") return "#f44336";
    if (prodStatus === "Stok Menipis" || prodStatus === "Menunggu Validasi") return "#ff9800";
    return "#9e9e9e";
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner message="Memuat daftar produk..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-primary mb-2 font-semibold">
            Manajemen Produk & Stok
          </h2>
          <p className="text-base text-muted-foreground">
            Kelola seluruh produk dari semua kelompok tani
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else {
              setErrorMsg("");
              setShowForm(true);
            }
          }}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          {showForm ? "Batal" : "Tambah Produk"}
        </button>
      </div>

      {/* Success Alert Banner */}
      {successMsg && (
        <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm font-medium animate-fadeIn">
          {successMsg}
        </div>
      )}

      {/* General Deletion Error Alert */}
      {!showForm && errorMsg && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm font-medium animate-fadeIn">
          {errorMsg}
        </div>
      )}

      {/* Add/Edit Product Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-border space-y-4 animate-fadeIn">
          <h3 className="text-xl text-primary font-semibold">
            {editProductId ? "Edit Produk" : "Tambah Produk Baru"}
          </h3>
          
          {errorMsg && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informasi Dasar */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-3 pb-2 border-b border-border">Informasi Dasar</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground font-medium">Nama Produk</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Beras Putih Premium"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground font-medium">Kelompok Tani (Poktan)</label>
                  <select
                    value={poktanId}
                    onChange={(e) => setPoktanId(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Pilih Poktan (Atau Gapoktan)</option>
                    {poktans.map((p) => (
                      <option key={p.id} value={p.id}>{p.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-foreground font-medium">Kategori</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(!isCustomCategory);
                        setCategory("");
                      }}
                      className="text-xs text-accent hover:underline font-semibold cursor-pointer"
                    >
                      {isCustomCategory ? "← Pilih dari daftar" : "+ Tambah Kategori Baru"}
                    </button>
                  </div>
                  {isCustomCategory ? (
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Ketik nama kategori baru..."
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <select
                      required
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === "__NEW__") {
                          setIsCustomCategory(true);
                          setCategory("");
                        } else {
                          setCategory(e.target.value);
                        }
                      }}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__NEW__" className="font-bold text-accent">+ Tambah Kategori Baru...</option>
                    </select>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-foreground font-medium">Metode Budidaya</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomMethod(!isCustomMethod);
                        setCultivationMethod(isCustomMethod ? "Organik" : "");
                      }}
                      className="text-xs text-accent hover:underline font-semibold cursor-pointer"
                    >
                      {isCustomMethod ? "← Pilih dari daftar" : "+ Tambah Metode Baru"}
                    </button>
                  </div>
                  {isCustomMethod ? (
                    <input
                      type="text"
                      required
                      value={cultivationMethod}
                      onChange={(e) => setCultivationMethod(e.target.value)}
                      placeholder="Ketik metode budidaya baru (misal: Hidroponik)..."
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <select
                      value={cultivationMethod}
                      onChange={(e) => {
                        if (e.target.value === "__NEW__") {
                          setIsCustomMethod(true);
                          setCultivationMethod("");
                        } else {
                          setCultivationMethod(e.target.value);
                        }
                      }}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {methods.map((method) => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                      <option value="__NEW__" className="font-bold text-accent">+ Tambah Metode Baru...</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground font-medium">Tanggal Panen</label>
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground font-medium">Label / Badge Produk</label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Tidak ada</option>
                    <option value="Terlaris">Terlaris</option>
                    <option value="Baru">Baru</option>
                    <option value="Populer">Populer</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-foreground font-medium">Satuan Dasar</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomUnit(!isCustomUnit);
                        setUnit(isCustomUnit ? "kg" : "");
                      }}
                      className="text-xs text-accent hover:underline font-semibold cursor-pointer"
                    >
                      {isCustomUnit ? "← Pilih dari daftar" : "+ Tambah Satuan Baru"}
                    </button>
                  </div>
                  {isCustomUnit ? (
                    <input
                      type="text"
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="Ketik satuan dasar baru (misal: liter, botol, dll)..."
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <select
                      value={unit}
                      onChange={(e) => {
                        if (e.target.value === "__NEW__") {
                          setIsCustomUnit(true);
                          setUnit("");
                        } else {
                          setUnit(e.target.value);
                        }
                      }}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {units.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                      <option value="__NEW__" className="font-bold text-accent">+ Tambah Satuan Baru...</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground font-medium">Status Publikasi</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Aktif">Aktif (Tampil di Toko)</option>
                    <option value="Stok Menipis">Stok Menipis</option>
                    <option value="Habis">Habis</option>
                    <option value="Menunggu Validasi">Menunggu Validasi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-3 pb-2 border-b border-border">Deskripsi Produk</p>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan keunggulan produk, cara budidaya, dan informasi penting lainnya..."
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Harga & Stok */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-3 pb-2 border-b border-border">Harga, Biaya Admin Gapoktan & Stok (Utama)</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground font-medium">Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="15000"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground font-medium">Biaya Admin Gapoktan (Rp / Satuan)</label>
                  <input
                    type="number"
                    value={gapoktanFee}
                    onChange={(e) => setGapoktanFee(e.target.value)}
                    placeholder="Contoh: 2000"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Dipajang khusus laporan keuangan Gapoktan
                  </p>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground font-medium">Jumlah Stok</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Varian Kemasan */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                <p className="text-sm font-semibold text-muted-foreground">Varian Kemasan <span className="text-xs font-normal">(opsional — tampil di halaman detail produk)</span></p>
                <button type="button" onClick={addVariant} className="flex items-center gap-1 text-xs text-accent font-semibold hover:text-accent/80 cursor-pointer">
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
                      <button type="button" onClick={() => removeVariant(i)} className="text-destructive hover:text-destructive/80 cursor-pointer">
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
                <p className="text-sm font-semibold text-muted-foreground">Keunggulan Produk <span className="text-xs font-normal">(tampil di halaman detail produk)</span></p>
                <button type="button" onClick={addFeature} className="flex items-center gap-1 text-xs text-accent font-semibold hover:text-accent/80 cursor-pointer">
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
                      <button type="button" onClick={() => removeFeature(i)} className="text-destructive hover:text-destructive/80 cursor-pointer">
                        <MinusCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Foto Produk */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-3 pb-2 border-b border-border">Foto Produk</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-sm mb-2 text-foreground font-medium">URL Gambar</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Masukkan URL gambar atau upload di samping"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground font-medium">Atau Upload Gambar</label>
                  <div className="relative border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">
                      {uploading ? "Mengupload..." : "Klik untuk upload foto"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-border">
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
              >
                {editProductId ? "Simpan Perubahan" : "Simpan & Publikasikan"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-border">
        {products.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground">
            Belum ada produk terdaftar. Klik "Tambah Produk" untuk memulai.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "var(--primary)" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-white font-semibold">Produk</th>
                  <th className="px-6 py-4 text-left text-sm text-white font-semibold">Poktan</th>
                  <th className="px-6 py-4 text-left text-sm text-white font-semibold">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm text-white font-semibold">Harga</th>
                  <th className="px-6 py-4 text-left text-sm text-white font-semibold">Stok</th>
                  <th className="px-6 py-4 text-left text-sm text-white font-semibold">Metode</th>
                  <th className="px-6 py-4 text-left text-sm text-white font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm text-white font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    className="hover:bg-background/25 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Panen: {product.harvest_date ? new Date(product.harvest_date).toLocaleDateString("id-ID") : "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                      {product.kelompok_tani?.nama ?? "Gapoktan"}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-primary font-semibold">
                      Rp {product.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                      {product.stock} {product.unit || "kg"}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{product.cultivation_method}</td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: getStatusColor(product.status) }}
                      >
                        {getStatusIcon(product.status)}
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-5 h-5 text-primary" />
                        </button>
                        <button
                          onClick={() => requestDelete(product)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-border p-6 transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Warning Icon Banner */}
              <div className="w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
                <AlertTriangle className="w-7 h-7" />
              </div>

              {/* Title & Desc */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary">Hapus Produk?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Apakah Anda yakin ingin menghapus produk{" "}
                  <strong className="text-foreground font-semibold">"{deleteTargetName}"</strong>?
                  Tindakan ini permanen dan data yang dihapus tidak dapat dipulihkan.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
