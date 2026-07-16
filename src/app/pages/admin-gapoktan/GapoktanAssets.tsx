import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, CheckCircle, XCircle } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { supabase } from "../../../lib/supabase";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export function GapoktanAssets() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editAssetId, setEditAssetId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Success / Error Alerts
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");

  // Form states
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [tahunPerolehan, setTahunPerolehan] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  // Delete Modal States
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetNama, setDeleteTargetNama] = useState("");

  const categories = ["Alat & Mesin", "Bangunan", "Kendaraan", "Peralatan Kantor", "Lainnya"];

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gapoktan_assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setAssets(data);
    } catch (err: any) {
      console.error("Error loading assets data:", err);
      setErrorMsg(err.message || "Gagal memuat data aset.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `assets/${fileName}`;
      
      // Coba upload ke bucket 'product-images' yang sudah ada
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
      // Fallback: encode ke Base64 agar tetap bisa ditampilkan
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
    setNama("");
    setKategori("");
    setTahunPerolehan("");
    setImageUrl("");
    setDeskripsi("");
    setEditAssetId(null);
    setShowForm(false);
    setErrorMsg("");
  };

  const handleEdit = (a: any) => {
    setErrorMsg("");
    setSuccessMsg("");
    setEditAssetId(a.id);
    setNama(a.nama);
    setKategori(a.kategori || "");
    setTahunPerolehan(a.tahun_perolehan ? String(a.tahun_perolehan) : "");
    setImageUrl(a.image_url || "");
    setDeskripsi(a.deskripsi || "");
    setShowForm(true);
  };

  const requestDelete = (a: any) => {
    setDeleteTargetId(a.id);
    setDeleteTargetNama(a.nama);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteConfirmOpen(false);
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const { error } = await supabase
        .from("gapoktan_assets")
        .delete()
        .eq("id", deleteTargetId);
        
      if (error) throw error;
      setSuccessMsg(`Aset "${deleteTargetNama}" berhasil dihapus.`);
      setAssets(assets.filter((a) => a.id !== deleteTargetId));
    } catch (err: any) {
      console.error("Error deleting asset:", err);
      setErrorMsg(err.message || "Gagal menghapus aset.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!nama || !kategori) {
      setErrorMsg("Nama aset dan kategori wajib diisi.");
      return;
    }

    const payload = {
      nama,
      kategori,
      tahun_perolehan: tahunPerolehan ? parseInt(tahunPerolehan) : null,
      image_url: imageUrl || null,
      deskripsi: deskripsi || null,
    };

    setLoading(true);
    try {
      if (editAssetId) {
        // Edit Aset
        const { data, error } = await supabase
          .from("gapoktan_assets")
          .update(payload)
          .eq("id", editAssetId)
          .select();

        if (error) throw error;
        setSuccessMsg(`Aset "${nama}" berhasil diperbarui.`);
      } else {
        // Tambah Aset Baru
        const { data, error } = await supabase
          .from("gapoktan_assets")
          .insert([payload])
          .select();

        if (error) throw error;
        setSuccessMsg(`Aset "${nama}" berhasil ditambahkan.`);
      }
      resetForm();
      fetchAssets();
    } catch (err: any) {
      console.error("Error saving asset:", err);
      setErrorMsg(err.message || "Gagal menyimpan data aset.");
      setLoading(false);
    }
  };

  // Filter & Search logic
  const filteredAssets = assets.filter((a) => {
    const matchesSearch = a.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.deskripsi && a.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.kategori && a.kategori.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = filterCategory === "Semua" || a.kategori === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Kelola Aset & Fasilitas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manajemen data fasilitas mekanisasi, alat, mesin, dan infrastruktur kelompok tani
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Tambah Aset Baru
          </button>
        )}
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-green-50 text-green-800 rounded-xl border border-green-200">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-800 rounded-xl border border-red-200">
          <XCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Formulir Tambah/Edit Aset */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-3 border-border/50">
            {editAssetId ? "Edit Detail Aset" : "Daftarkan Aset Baru"}
          </h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sisi Kiri */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Nama Aset <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Traktor Kubota G1000"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Kategori <span className="text-destructive">*</span>
                  </label>
                  <select
                    required
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border/80 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-sm bg-white"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Tahun Perolehan
                  </label>
                  <input
                    type="number"
                    min="1980"
                    max={new Date().getFullYear()}
                    placeholder="Contoh: 2024"
                    value={tahunPerolehan}
                    onChange={(e) => setTahunPerolehan(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border/80 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Deskripsi Aset
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail spesifikasi, kondisi, atau deskripsi penggunaan aset..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-sm resize-none"
                />
              </div>
            </div>

            {/* Sisi Kanan: Foto Aset */}
            <div className="space-y-4 flex flex-col">
              <label className="block text-sm font-bold text-foreground mb-1">
                Foto Aset
              </label>

              <div className="border border-dashed border-border/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 bg-slate-50 flex-1 min-h-[220px]">
                {imageUrl ? (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-sm bg-white border">
                    <img src={imageUrl} alt="Preview Aset" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-colors text-xs font-semibold cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border text-muted-foreground/75 shadow-sm">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">Unggah Foto Aset</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG atau WEBP (Maksimal 5MB)</p>
                    </div>
                    <label className="bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">
                      Pilih Berkas
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                )}
                {uploading && <LoadingSpinner message="Mengunggah foto..." />}
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Atau tempel URL gambar jika foto sudah dihosting online:
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/foto-aset.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-sm"
                />
              </div>
            </div>

            {/* Tombol Aksi Form */}
            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {editAssetId ? "Simpan Perubahan" : "Daftarkan Aset"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Area Daftar Tabel Aset */}
      {!showForm && (
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
          {/* Filter & Search Bar */}
          <div className="p-4 sm:p-5 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
            <div className="w-full sm:max-w-xs relative">
              <input
                type="text"
                placeholder="Cari nama atau deskripsi aset..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border/80 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-sm bg-white"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">Filter Kategori:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-border/80 focus:outline-none focus:border-accent bg-white text-sm w-full sm:w-44"
              >
                <option value="Semua">Semua</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabel */}
          {loading && assets.length === 0 ? (
            <div className="py-20 text-center">
              <LoadingSpinner message="Memuat data aset..." />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              Tidak ditemukan data aset yang sesuai dengan pencarian.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50/50 text-xs sm:text-sm font-bold text-primary">
                    <th className="py-4 px-6 w-24">Foto</th>
                    <th className="py-4 px-6">Nama Aset</th>
                    <th className="py-4 px-6 w-36">Kategori</th>
                    <th className="py-4 px-6 w-32">Tahun Perolehan</th>
                    <th className="py-4 px-6">Deskripsi</th>
                    <th className="py-4 px-6 w-28 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs sm:text-sm text-foreground">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border bg-muted shadow-sm">
                          <ImageWithFallback
                            src={asset.image_url}
                            alt={asset.nama}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-primary block">{asset.nama}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-semibold">
                          {asset.kategori}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {asset.tahun_perolehan || "-"}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground max-w-xs truncate" title={asset.deskripsi}>
                        {asset.deskripsi || "-"}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2.5">
                          <button
                            onClick={() => handleEdit(asset)}
                            title="Edit Aset"
                            className="p-2 hover:bg-slate-100 rounded-lg text-primary hover:text-accent transition-colors cursor-pointer"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => requestDelete(asset)}
                            title="Hapus Aset"
                            className="p-2 hover:bg-red-50 rounded-lg text-primary hover:text-destructive transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
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
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border space-y-6">
            <div>
              <h3 className="text-lg font-bold text-primary">Konfirmasi Hapus Aset</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Apakah Anda yakin ingin menghapus aset <strong>"{deleteTargetNama}"</strong>? Tindakan ini permanen dan tidak bisa dibatalkan.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 border rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-destructive hover:bg-destructive/90 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              >
                Ya, Hapus Aset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
