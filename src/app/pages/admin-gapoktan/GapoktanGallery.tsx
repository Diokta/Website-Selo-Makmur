import { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, FileText, CheckCircle, Trash2, Edit, Plus } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export function GapoktanGallery() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [poktans, setPoktans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [poktanId, setPoktanId] = useState("");
  const [category, setCategory] = useState("Kegiatan");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [uploading, setUploading] = useState(false);

  const categories = ["Penyuluhan", "Kegiatan", "Panen Raya", "Pelatihan", "Kemitraan", "Berita", "Pengumuman"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch news gallery
      const { data: galleryData } = await supabase
        .from("news_gallery")
        .select("*, kelompok_tani(id, nama), gallery_images(*)")
        .order("created_at", { ascending: false });

      if (galleryData) setGalleries(galleryData);

      // 2. Fetch poktans
      const { data: poktanData } = await supabase
        .from("kelompok_tani")
        .select("id, nama")
        .order("nama", { ascending: true });

      if (poktanData) setPoktans(poktanData);
    } catch (err) {
      console.error("Error loading gallery data:", err);
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
      const filePath = `gallery/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("gallery-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("gallery-images")
        .getPublicUrl(filePath);

      setMainImageUrl(data.publicUrl);
    } catch (err) {
      console.warn("Storage upload failed, falling back to base64 encoding:", err);
      // Fallback
      const reader = new FileReader();
      reader.onload = () => {
        setMainImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setPoktanId("");
    setCategory("Kegiatan");
    setEventDate("");
    setDescription("");
    setMainImageUrl("");
    setIsPublished(true);
    setEditTargetId(null);
    setShowUploadForm(false);
  };

  const handleEdit = (g: any) => {
    setEditTargetId(g.id);
    setTitle(g.title);
    setPoktanId(g.poktan_id || "");
    setCategory(g.category || "Kegiatan");
    setEventDate(g.event_date ? g.event_date.substring(0, 10) : "");
    setDescription(g.description || "");
    setMainImageUrl(g.gallery_images?.[0]?.image_url || "");
    setIsPublished(g.is_published);
    setShowUploadForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus dokumentasi ini?")) return;
    try {
      const { error } = await supabase.from("news_gallery").delete().eq("id", id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error("Error deleting gallery:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent, asDraft = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title,
        poktan_id: poktanId || null,
        category,
        type: "Galeri" as any, // This is for gallery/activities
        event_date: eventDate || null,
        description,
        is_published: !asDraft,
        published_at: !asDraft ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      let galleryId = editTargetId;

      if (editTargetId) {
        // Update
        const { error } = await supabase
          .from("news_gallery")
          .update(payload)
          .eq("id", editTargetId);
        if (error) throw error;

        // Delete old images
        await supabase.from("gallery_images").delete().eq("news_gallery_id", editTargetId);
      } else {
        // Insert
        const { data, error } = await supabase
          .from("news_gallery")
          .insert({
            ...payload,
            author: "Admin Gapoktan",
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
        if (error) throw error;
        galleryId = data.id;
      }

      // Insert new main image to gallery_images table
      if (galleryId && mainImageUrl) {
        const { error: imgError } = await supabase
          .from("gallery_images")
          .insert({
            news_gallery_id: galleryId,
            image_url: mainImageUrl,
            caption: title,
            sort_order: 0,
          });
        if (imgError) throw imgError;
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.error("Error saving gallery entry:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && galleries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner message="Memuat berita dan galeri..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-primary mb-2 font-semibold">
            Galeri & Berita
          </h2>
          <p className="text-base text-muted-foreground">
            Kelola dokumentasi kegiatan dan berita Gapoktan Selo Makmur
          </p>
        </div>
        <button
          onClick={() => {
            if (showUploadForm) resetForm();
            else setShowUploadForm(true);
          }}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-md"
        >
          <Upload className="w-5 h-5" />
          {showUploadForm ? "Batal" : "Upload Kegiatan"}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-border">
          <h3 className="text-xl text-primary mb-6 font-semibold">
            {editTargetId ? "Edit Kegiatan" : "Upload Dokumentasi Kegiatan"}
          </h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-foreground font-medium">Judul Kegiatan / Berita</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Panen Raya Padi 2026"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground font-medium">Kelompok Tani</label>
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
                <label className="block text-sm mb-2 text-foreground font-medium">Jenis / Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground font-medium">Tanggal Kegiatan</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2 text-foreground font-medium">Deskripsi Singkat</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan kegiatan yang didokumentasikan..."
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            
            {/* Foto Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm mb-2 text-foreground font-medium">URL Gambar Utama</label>
                <input
                  type="text"
                  value={mainImageUrl}
                  onChange={(e) => setMainImageUrl(e.target.value)}
                  placeholder="Masukkan URL gambar atau upload di bawah"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground font-medium font-medium">Upload File Foto</label>
                <div className="relative border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground font-semibold">
                    {uploading ? "Mengupload..." : "Klik untuk upload foto"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Simpan & Publikasikan
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Simpan sebagai Draft
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Grid */}
      {galleries.length === 0 ? (
        <div className="text-center py-12 bg-white border border-border rounded-xl text-muted-foreground">
          Belum ada dokumentasi atau berita. Klik "Upload Kegiatan" untuk memulai.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-border flex flex-col justify-between">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-xs text-muted-foreground font-semibold uppercase">{gallery.category}</span>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: gallery.is_published ? "#5a8f3a" : "#ff9800" }}
                  >
                    {gallery.is_published && <CheckCircle className="w-3 h-3" />}
                    {gallery.is_published ? "Dipublikasikan" : "Draft"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-1">{gallery.title}</h3>
                <p className="text-xs text-accent font-semibold mb-2">{gallery.kelompok_tani?.nama ?? "Gapoktan"}</p>
                
                {gallery.gallery_images?.[0] && (
                  <div className="h-48 w-full rounded-lg overflow-hidden my-3">
                    <ImageWithFallback
                      src={gallery.gallery_images[0].image_url}
                      alt={gallery.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground font-medium mb-4 line-clamp-2 leading-relaxed">{gallery.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span>{gallery.event_date ? new Date(gallery.event_date).toLocaleDateString("id-ID") : "-"}</span>
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-4 h-4" />
                    {gallery.gallery_images?.length || 0} foto
                  </span>
                </div>
              </div>
              <div className="bg-background border-t border-border px-6 py-3 flex gap-2">
                <button
                  onClick={() => handleEdit(gallery)}
                  className="flex items-center gap-1.5 flex-1 justify-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(gallery.id)}
                  className="flex items-center gap-1.5 flex-1 justify-center text-sm font-semibold text-destructive hover:text-destructive/80 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
