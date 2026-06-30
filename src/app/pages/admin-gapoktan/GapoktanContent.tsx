import { useState, useEffect } from "react";
import {
  FileText,
  Image as ImageIcon,
  Users,
  Info,
  Save,
  Building2,
  BarChart2,
  Upload,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

const inputCls =
  "w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

export function GapoktanContent() {
  const [activeTab, setActiveTab] = useState("identitas");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // website_content state map
  const [contentMap, setContentMap] = useState<Record<string, string>>({});

  // Berita (News) states
  const [beritaList, setBeritaList] = useState<any[]>([]);
  const [beritaMode, setBeritaMode] = useState<"list" | "add" | "edit">("list");
  const [editBeritaId, setEditBeritaId] = useState<string | null>(null);
  const [beritaForm, setBeritaForm] = useState({ title: "", description: "", content: "", category: "Berita", is_published: true });
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setContentMap((prev) => ({ ...prev, "identity.logo": data.publicUrl }));
    } catch (err) {
      console.warn("Storage upload failed, falling back to base64 encoding:", err);
      const reader = new FileReader();
      reader.onload = () => {
        setContentMap((prev) => ({ ...prev, "identity.logo": reader.result as string }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingLogo(false);
    }
  };

  useEffect(() => {
    fetchContentAndNews();
  }, []);

  const fetchContentAndNews = async () => {
    setLoading(true);
    try {
      // 1. Fetch website content
      const { data: contentData } = await supabase
        .from("website_content")
        .select("*");

      if (contentData) {
        const map: Record<string, string> = {};
        contentData.forEach((item) => {
          map[item.section_key] = item.value || "";
        });
        setContentMap(map);
      }

      // 2. Fetch news (where type = 'Berita')
      const { data: newsData } = await supabase
        .from("news_gallery")
        .select("*")
        .eq("type", "Berita")
        .order("created_at", { ascending: false });

      if (newsData) {
        setBeritaList(newsData);
      }
    } catch (err) {
      console.error("Error fetching content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveValue = async (key: string, value: string) => {
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const { error } = await supabase
        .from("website_content")
        .upsert({
          section_key: key,
          value,
          updated_at: new Date().toISOString(),
        }, { onConflict: "section_key" });

      if (error) throw error;
      setContentMap((prev) => ({ ...prev, [key]: value }));
      setSuccessMsg("Konten berhasil disimpan.");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan konten.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAllTabContent = async (keys: string[]) => {
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      for (const key of keys) {
        const value = contentMap[key] || "";
        const { error } = await supabase
          .from("website_content")
          .upsert({
            section_key: key,
            value,
            updated_at: new Date().toISOString(),
          }, { onConflict: "section_key" });
        if (error) throw error;
      }
      setSuccessMsg("Semua perubahan pada tab ini berhasil disimpan.");
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const handleBeritaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: beritaForm.title,
        description: beritaForm.description,
        content: beritaForm.content,
        category: beritaForm.category,
        type: "Berita" as any,
        is_published: beritaForm.is_published,
        published_at: beritaForm.is_published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      if (editBeritaId) {
        const { error } = await supabase
          .from("news_gallery")
          .update(payload)
          .eq("id", editBeritaId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("news_gallery")
          .insert({
            ...payload,
            author: "Admin Gapoktan",
            created_at: new Date().toISOString(),
          });
        if (error) throw error;
      }

      setBeritaMode("list");
      setEditBeritaId(null);
      setBeritaForm({ title: "", description: "", content: "", category: "Berita", is_published: true });
      fetchContentAndNews();
    } catch (err) {
      console.error("Error saving news:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleEditBerita = (b: any) => {
    setEditBeritaId(b.id);
    setBeritaForm({
      title: b.title || "",
      description: b.description || "",
      content: b.content || "",
      category: b.category || "Berita",
      is_published: b.is_published,
    });
    setBeritaMode("edit");
  };

  const handleDeleteBerita = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;
    try {
      const { error } = await supabase.from("news_gallery").delete().eq("id", id);
      if (error) throw error;
      fetchContentAndNews();
    } catch (err) {
      console.error("Error deleting news:", err);
    }
  };

  const tabs = [
    { id: "identitas", name: "Identitas", icon: Building2 },
    { id: "hero", name: "Banner / Hero", icon: ImageIcon },
    { id: "statistik", name: "Statistik", icon: BarChart2 },
    { id: "visi-misi", name: "Visi & Misi", icon: Info },
    { id: "berita", name: "Berita & Pengumuman", icon: FileText },
  ];

  if (loading && Object.keys(contentMap).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner message="Memuat konten website..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-2xl sm:text-3xl text-primary mb-2 font-semibold">Kelola Konten Website</h2>
        <p className="text-base text-muted-foreground">
          Edit semua informasi dan konten yang ditampilkan di website utama
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-lg">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-destructive/10 border-l-4 border-destructive text-destructive p-4 rounded-lg">
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-border">
        {/* Tab Bar */}
        <div className="border-b border-border overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setBeritaMode("list");
                    setSuccessMsg("");
                    setErrorMsg("");
                  }}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "text-white border-accent"
                      : "text-muted-foreground hover:bg-background border-transparent"
                  }`}
                  style={activeTab === tab.id ? { backgroundColor: "var(--primary)" } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* ── IDENTITAS ── */}
          {activeTab === "identitas" && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground font-medium">
                Informasi dasar Gapoktan yang tampil di header, footer, halaman kontak, dan seluruh website.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm mb-2 text-foreground font-semibold">Nama Gapoktan</label>
                  <input
                    type="text"
                    value={contentMap["identity.name"] || ""}
                    onChange={(e) => setContentMap({ ...contentMap, "identity.name": e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm mb-2 text-foreground font-semibold">Alamat Lengkap Sekretariat</label>
                  <textarea
                    rows={2}
                    value={contentMap["identity.address"] || ""}
                    onChange={(e) => setContentMap({ ...contentMap, "identity.address": e.target.value })}
                    className={`${inputCls} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground font-semibold">Email Resmi</label>
                  <input
                    type="email"
                    value={contentMap["identity.email"] || ""}
                    onChange={(e) => setContentMap({ ...contentMap, "identity.email": e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground font-semibold">No. Telepon Sekretariat</label>
                  <input
                    type="tel"
                    value={contentMap["identity.phone"] || ""}
                    onChange={(e) => setContentMap({ ...contentMap, "identity.phone": e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-end border-t border-secondary/10 pt-4 mt-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2 text-foreground font-semibold">Logo Gapoktan (URL)</label>
                    <input
                      type="text"
                      placeholder="Masukkan URL logo atau gunakan uploader di samping"
                      value={contentMap["identity.logo"] || ""}
                      onChange={(e) => setContentMap({ ...contentMap, "identity.logo": e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground font-semibold">Upload File Logo</label>
                    <label className="flex items-center justify-center gap-2 border border-dashed border-border rounded-lg p-3 bg-secondary/20 hover:bg-secondary/40 cursor-pointer transition-colors text-sm font-medium">
                      <Upload className="w-4 h-4 text-muted-foreground" />
                      <span>{uploadingLogo ? "Mengupload..." : "Upload Logo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={uploadingLogo}
                      />
                    </label>
                  </div>
                  {contentMap["identity.logo"] && (
                    <div className="sm:col-span-3 flex items-center gap-3 bg-secondary/10 p-3 rounded-lg mt-2">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 border border-border">
                        <img src={contentMap["identity.logo"]} alt="Pratinjau Logo" className="w-full h-full object-contain rounded-full" />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-foreground">Pratinjau Logo</p>
                        <p className="text-muted-foreground truncate max-w-[200px] sm:max-w-md">{contentMap["identity.logo"]}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setContentMap({ ...contentMap, "identity.logo": "" })}
                        className="ml-auto text-destructive hover:text-destructive/80 text-xs font-semibold"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleSaveAllTabContent(["identity.name", "identity.address", "identity.email", "identity.phone", "identity.logo"])}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Simpan Identitas
              </button>
            </div>
          )}

          {/* ── HERO ── */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground font-medium">
                Konten teks utama yang tampil di area Banner/Hero halaman Beranda utama.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground font-semibold">Judul Banner Utama (Headline)</label>
                  <input
                    type="text"
                    value={contentMap["hero.title"] || ""}
                    onChange={(e) => setContentMap({ ...contentMap, "hero.title": e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground font-semibold">Subjudul Banner Utama (Subheadline)</label>
                  <textarea
                    rows={3}
                    value={contentMap["hero.subtitle"] || ""}
                    onChange={(e) => setContentMap({ ...contentMap, "hero.subtitle": e.target.value })}
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>
              <button
                onClick={() => handleSaveAllTabContent(["hero.title", "hero.subtitle"])}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Simpan Konten Hero
              </button>
            </div>
          )}

          {/* ── STATISTIK ── */}
          {activeTab === "statistik" && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground font-medium">
                Ubah data angka statistik utama yang dipajang di halaman Beranda.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground font-semibold">Jumlah Poktan</label>
                  <input
                    type="number"
                    value={contentMap["stats.total_poktan"] || ""}
                    onChange={(e) => setContentMap({ ...contentMap, "stats.total_poktan": e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground font-semibold">Total Petani</label>
                  <input
                    type="number"
                    value={contentMap["stats.total_farmers"] || ""}
                    onChange={(e) => setContentMap({ ...contentMap, "stats.total_farmers": e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground font-semibold">Jumlah Produk</label>
                  <input
                    type="number"
                    value={contentMap["stats.total_products"] || ""}
                    onChange={(e) => setContentMap({ ...contentMap, "stats.total_products": e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground font-semibold">Luas Lahan (Ha)</label>
                  <input
                    type="number"
                    value={contentMap["stats.luas_lahan"] || ""}
                    onChange={(e) => setContentMap({ ...contentMap, "stats.luas_lahan": e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>
              <button
                onClick={() => handleSaveAllTabContent(["stats.total_poktan", "stats.total_farmers", "stats.total_products", "stats.luas_lahan"])}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Simpan Statistik
              </button>
            </div>
          )}

          {/* ── VISI & MISI ── */}
          {activeTab === "visi-misi" && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground font-medium">
                Ubah visi dan misi resmi Gapoktan Selo Makmur (tampil di halaman Tentang Kami).
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground font-semibold">Visi Gapoktan</label>
                  <textarea
                    rows={4}
                    value={contentMap["visi"] || ""}
                    onChange={(e) => setContentMap({ ...contentMap, visi: e.target.value })}
                    className={`${inputCls} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground font-semibold">Misi Gapoktan</label>
                  <textarea
                    rows={6}
                    value={contentMap["misi"] || ""}
                    onChange={(e) => setContentMap({ ...contentMap, misi: e.target.value })}
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>
              <button
                onClick={() => handleSaveAllTabContent(["visi", "misi"])}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Simpan Visi & Misi
              </button>
            </div>
          )}

          {/* ── BERITA ── */}
          {activeTab === "berita" && (
            <div className="space-y-6">
              {beritaMode === "list" ? (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground font-medium">Daftar artikel berita dan pengumuman.</p>
                    <button
                      onClick={() => setBeritaMode("add")}
                      className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Tambah Berita
                    </button>
                  </div>

                  {beritaList.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
                      Belum ada berita terbit. Klik Tambah Berita.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {beritaList.map((berita) => (
                        <div
                          key={berita.id}
                          className="flex items-center justify-between p-4 border border-border rounded-xl hover:shadow-md transition-shadow"
                        >
                          <div>
                            <h4 className="text-base font-bold text-primary mb-1">{berita.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {berita.created_at ? new Date(berita.created_at).toLocaleDateString("id-ID") : ""} • {berita.category} •{" "}
                              <span className={berita.is_published ? "text-emerald-600 font-bold" : "text-orange-500 font-bold"}>
                                {berita.is_published ? "Published" : "Draft"}
                              </span>
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditBerita(berita)}
                              className="p-2 hover:bg-secondary rounded-lg transition-colors text-primary"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBerita(berita.id)}
                              className="p-2 hover:bg-secondary rounded-lg transition-colors text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <form onSubmit={handleBeritaSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setBeritaMode("list");
                        setEditBeritaId(null);
                        setBeritaForm({ title: "", description: "", content: "", category: "Berita", is_published: true });
                      }}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-lg font-bold text-primary">
                      {editBeritaId ? "Edit Berita" : "Tambah Berita Baru"}
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-foreground font-semibold">Judul Berita</label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan judul berita"
                      value={beritaForm.title}
                      onChange={(e) => setBeritaForm({ ...beritaForm, title: e.target.value })}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-foreground font-semibold">Kategori</label>
                    <select
                      value={beritaForm.category}
                      onChange={(e) => setBeritaForm({ ...beritaForm, category: e.target.value })}
                      className={inputCls}
                    >
                      <option value="Berita">Berita Utama</option>
                      <option value="Pengumuman">Pengumuman</option>
                      <option value="Kegiatan">Kegiatan Kelompok</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-foreground font-semibold">Deskripsi Pendek</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Masukkan ringkasan berita pendek untuk kartu berita"
                      value={beritaForm.description}
                      onChange={(e) => setBeritaForm({ ...beritaForm, description: e.target.value })}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-foreground font-semibold">Konten Lengkap Berita</label>
                    <textarea
                      rows={6}
                      required
                      placeholder="Tulis seluruh isi berita di sini..."
                      value={beritaForm.content}
                      onChange={(e) => setBeritaForm({ ...beritaForm, content: e.target.value })}
                      className={inputCls}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={beritaForm.is_published}
                      onChange={(e) => setBeritaForm({ ...beritaForm, is_published: e.target.checked })}
                      className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
                    />
                    <label htmlFor="is_published" className="text-sm font-semibold text-foreground">
                      Langsung terbitkan berita ini (Aktif)
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Simpan Berita
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBeritaMode("list");
                        setEditBeritaId(null);
                        setBeritaForm({ title: "", description: "", content: "", category: "Berita", is_published: true });
                      }}
                      className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
