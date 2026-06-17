import {
  FileText,
  Image as ImageIcon,
  Users,
  Info,
  Save,
  Eye,
  Building2,
  BarChart2,
  Upload,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";

const defaultStats = [
  { label: "Kelompok Tani", nilai: "24", satuan: "Poktan Aktif" },
  { label: "Luas Lahan", nilai: "850", satuan: "Hektar" },
  { label: "Komoditas", nilai: "12+", satuan: "Hasil Panen" },
];

type Berita = {
  id: number;
  title: string;
  date: string;
  status: "Published" | "Draft";
  content: string;
  image: string;
};

const initialBerita: Berita[] = [
  { id: 1, title: "Pelatihan Budidaya Organik untuk Petani", date: "2026-05-28", status: "Published", content: "Gapoktan Selo Makmur mengadakan pelatihan budidaya organik yang diikuti oleh lebih dari 80 petani dari berbagai kelompok tani. Pelatihan ini bertujuan meningkatkan kualitas hasil panen sekaligus menjaga kelestarian lingkungan.", image: "" },
  { id: 2, title: "Panen Raya Padi Musim Ini Meningkat 20%", date: "2026-05-22", status: "Published", content: "Hasil panen padi pada musim tanam kali ini mengalami peningkatan signifikan sebesar 20% dibandingkan musim sebelumnya. Keberhasilan ini tidak terlepas dari penerapan teknologi pertanian modern dan pendampingan intensif dari tim Gapoktan.", image: "" },
  { id: 3, title: "Kerjasama dengan Pasar Modern Lokal", date: "2026-05-15", status: "Draft", content: "Gapoktan Selo Makmur menjalin kerjasama strategis dengan jaringan pasar modern lokal untuk memasarkan produk-produk unggulan petani secara lebih luas.", image: "" },
];

const emptyForm = { title: "", date: "", status: "Draft" as "Published" | "Draft", content: "", image: "" };

const inputCls =
  "w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

export function GapoktanContent() {
  const [activeTab, setActiveTab] = useState("identitas");
  const [stats, setStats] = useState(defaultStats);
  const [beritaList, setBeritaList] = useState(initialBerita);
  const [beritaMode, setBeritaMode] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<Berita | null>(null);
  const [form, setForm] = useState(emptyForm);

  function updateStat(index: number, field: "nilai", value: string) {
    setStats((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm);
    setBeritaMode("add");
  }

  function openEdit(b: Berita) {
    setEditTarget(b);
    setForm({ title: b.title, date: b.date, status: b.status, content: b.content, image: b.image });
    setBeritaMode("edit");
  }

  function handleBeritaSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (beritaMode === "edit" && editTarget) {
      setBeritaList((prev) => prev.map((b) => b.id === editTarget.id ? { ...b, ...form } : b));
    } else {
      const newId = Math.max(...beritaList.map((b) => b.id)) + 1;
      setBeritaList((prev) => [...prev, { id: newId, ...form }]);
    }
    setBeritaMode("list");
  }

  function deleteBerita(id: number) {
    setBeritaList((prev) => prev.filter((b) => b.id !== id));
  }

  const tabs = [
    { id: "identitas", name: "Identitas", icon: Building2 },
    { id: "hero", name: "Banner / Hero", icon: ImageIcon },
    { id: "statistik", name: "Statistik", icon: BarChart2 },
    { id: "visi-misi", name: "Visi & Misi", icon: Info },
    { id: "struktur", name: "Struktur Organisasi", icon: Users },
    { id: "berita", name: "Berita", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl text-primary mb-2">Kelola Konten Website</h2>
        <p className="text-base text-muted-foreground">
          Edit semua informasi dan konten yang ditampilkan di website utama
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Tab Bar */}
        <div className="border-b border-border overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setBeritaMode("list"); }}
                  className={`flex items-center gap-2 px-5 py-4 text-sm whitespace-nowrap transition-colors border-b-2 ${
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
              <p className="text-sm text-muted-foreground">
                Informasi dasar Gapoktan yang tampil di header, footer, halaman kontak, dan seluruh website.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm mb-2 text-foreground">Nama Gapoktan</label>
                  <input type="text" defaultValue="Gapoktan Selo Makmur" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm mb-2 text-foreground">Alamat Lengkap</label>
                  <textarea rows={2} defaultValue="Jl. Letda Abdul Jalil, Salakan, Selomartani, Kalasan, Sleman, Daerah Istimewa Yogyakarta 55571" className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Email</label>
                  <input type="email" defaultValue="info@gapoktanselolomakmur.id" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">No. Telepon</label>
                  <input type="tel" defaultValue="+62 251 8123456" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Link Facebook</label>
                  <input type="url" placeholder="https://facebook.com/..." className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Link Instagram</label>
                  <input type="url" placeholder="https://instagram.com/..." className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Link YouTube</label>
                  <input type="url" placeholder="https://youtube.com/..." className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Tahun Berdiri</label>
                  <input type="number" defaultValue="2015" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Logo / Ikon Gapoktan</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl">🌱</span>
                  </div>
                  <div className="border-2 border-dashed border-border rounded-lg px-6 py-4 flex items-center gap-3 hover:border-primary transition-colors cursor-pointer flex-1">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-foreground">Upload logo baru</p>
                      <p className="text-xs text-muted-foreground">PNG transparan, min. 200×200px</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── HERO / BANNER ── */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Konten yang tampil di bagian atas (hero) halaman Beranda.
              </p>
              <div>
                <label className="block text-sm mb-2 text-foreground">Foto Banner Utama</label>
                <div className="relative rounded-xl overflow-hidden mb-3 h-48 bg-background">
                  <img
                    src="https://images.unsplash.com/photo-1676281945191-4c0ed1a1784d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                    alt="Banner saat ini"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-sm">Banner saat ini</span>
                  </div>
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Upload foto banner baru</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG/PNG, rasio 16:9, min. 1280×720px</p>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Judul Utama Hero</label>
                <input type="text" defaultValue="Gabungan Kelompok Tani" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Subjudul / Tagline</label>
                <textarea rows={2} defaultValue="Bersama Membangun Pertanian Berkelanjutan untuk Masa Depan yang Lebih Hijau" className={`${inputCls} resize-none`} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground">Teks Tombol Utama (CTA)</label>
                  <input type="text" defaultValue="Belanja Produk Lokal" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Teks Tombol Kedua</label>
                  <input type="text" defaultValue="Pelajari Selengkapnya" className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {/* ── STATISTIK ── */}
          {activeTab === "statistik" && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Angka-angka statistik yang tampil di bagian "Tentang Gapoktan Kami" pada halaman Beranda.
              </p>
              <div>
                <label className="block text-sm mb-2 text-foreground">Judul Seksi</label>
                <input type="text" defaultValue="Tentang Gapoktan Kami" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Deskripsi Seksi</label>
                <textarea rows={2} defaultValue="Gabungan Kelompok Tani yang berkomitmen menghadirkan produk pertanian berkualitas tinggi langsung dari petani lokal ke meja Anda" className={`${inputCls} resize-none`} />
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground pb-2 border-b border-border">Kartu Statistik</p>
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-lg">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-0.5">Label</p>
                      <p className="text-sm text-foreground">{stat.label}</p>
                    </div>
                    <div className="w-36">
                      <label className="block text-xs text-muted-foreground mb-1">Nilai</label>
                      <input
                        type="text"
                        value={stat.nilai}
                        onChange={(e) => updateStat(i, "nilai", e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-0.5">Keterangan</p>
                      <p className="text-sm text-foreground">{stat.satuan}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── VISI & MISI ── */}
          {activeTab === "visi-misi" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-foreground">Visi</label>
                <textarea rows={4} defaultValue="Menjadi organisasi kelompok tani yang mandiri, profesional, dan berkelanjutan dalam menghasilkan produk pertanian berkualitas tinggi untuk meningkatkan kesejahteraan petani dan masyarakat." className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Misi (satu poin per baris)</label>
                <textarea rows={6} defaultValue={`• Meningkatkan kualitas produksi pertanian melalui teknologi modern\n• Membangun kemitraan strategis dengan berbagai pihak\n• Memberdayakan petani melalui pelatihan dan pendampingan\n• Menjaga kelestarian lingkungan dan pertanian berkelanjutan`} className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Sejarah Singkat</label>
                <textarea rows={6} defaultValue="Gabungan Kelompok Tani (Gapoktan) Selo Makmur didirikan pada tahun 2015 atas inisiatif para petani di wilayah Kecamatan Kalasan, Sleman. Berawal dari 8 kelompok tani kecil, kami berkembang menjadi wadah bagi 24 kelompok tani yang tersebar di berbagai dusun." className={`${inputCls} resize-none`} />
              </div>
            </div>
          )}

          {/* ── STRUKTUR ORGANISASI ── */}
          {activeTab === "struktur" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Data pengurus yang ditampilkan di halaman Tentang Kami.
                </p>
                <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  <Plus className="w-4 h-4" /> Tambah Pengurus
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { jabatan: "Ketua Gapoktan", nama: "Bapak Sutrisno" },
                  { jabatan: "Wakil Ketua", nama: "Ibu Sumiati" },
                  { jabatan: "Sekretaris", nama: "Bapak Darmawan" },
                  { jabatan: "Bendahara", nama: "Ibu Widya Sari" },
                  { jabatan: "Kepala Seksi Usaha", nama: "Bapak Hendra" },
                  { jabatan: "Kepala Seksi Produksi", nama: "Ibu Ratna" },
                ].map((pengurus, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-background rounded-lg items-center">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-muted-foreground mb-1">Jabatan</label>
                      <input type="text" defaultValue={pengurus.jabatan} className={inputCls} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-muted-foreground mb-1">Nama</label>
                      <input type="text" defaultValue={pengurus.nama} className={inputCls} />
                    </div>
                    <div className="flex gap-2 items-end">
                      <button className="flex-1 bg-muted hover:bg-muted/80 text-foreground px-3 py-3 rounded-lg transition-colors text-sm">Foto</button>
                      <button className="p-3 hover:bg-muted rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BERITA ── */}
          {activeTab === "berita" && (
            <div className="space-y-6">

              {/* List */}
              {beritaMode === "list" && (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Berita yang ditampilkan di halaman Beranda dan halaman Berita.
                    </p>
                    <button
                      onClick={openAdd}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" /> Tambah Berita
                    </button>
                  </div>
                  <div className="space-y-3">
                    {beritaList.map((berita) => (
                      <div key={berita.id} className="flex items-center justify-between p-4 bg-background rounded-lg gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base text-primary mb-1 truncate">{berita.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(berita.date).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span
                            className="px-3 py-1 rounded-full text-xs text-white"
                            style={{ backgroundColor: berita.status === "Published" ? "var(--status-success)" : "var(--status-pending)" }}
                          >
                            {berita.status}
                          </span>
                          <button
                            onClick={() => openEdit(berita)}
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-primary" />
                          </button>
                          <button
                            onClick={() => deleteBerita(berita.id)}
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Form Tambah / Edit */}
              {(beritaMode === "add" || beritaMode === "edit") && (
                <form onSubmit={handleBeritaSubmit} className="space-y-5">
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <button
                      type="button"
                      onClick={() => setBeritaMode("list")}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <h3 className="text-lg text-primary">
                      {beritaMode === "edit" ? "Edit Berita" : "Tambah Berita Baru"}
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-foreground">Judul Berita</label>
                    <input
                      type="text"
                      required
                      placeholder="Tulis judul berita..."
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className={inputCls}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 text-foreground">Tanggal Terbit</label>
                      <input
                        type="date"
                        required
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-foreground">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as "Published" | "Draft" })}
                        className={inputCls}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-foreground">Isi Berita</label>
                    <textarea
                      required
                      rows={8}
                      placeholder="Tulis isi berita di sini..."
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-foreground">Foto Berita</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Upload foto berita</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG/PNG, maks. 2MB</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors text-sm">
                      <Save className="w-4 h-4" />
                      {beritaMode === "edit" ? "Simpan Perubahan" : "Terbitkan Berita"}
                    </button>
                    <button type="button" onClick={() => setBeritaMode("list")} className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-lg transition-colors text-sm">
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Action Buttons — hanya tampil saat bukan di form berita */}
          {!(activeTab === "berita" && (beritaMode === "add" || beritaMode === "edit")) && (
            <div className="flex gap-3 pt-6 border-t border-border mt-6">
              <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
              <button className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
