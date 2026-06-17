import { useState } from "react";
import { Upload, Image as ImageIcon, FileText, CheckCircle, Trash2, Edit } from "lucide-react";

export function GapoktanGallery() {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const galleries = [
    {
      id: 1,
      title: "Gotong Royong Perbaikan Irigasi",
      description: "Kegiatan gotong royong anggota poktan memperbaiki saluran irigasi sawah",
      date: "2026-05-28",
      poktan: "Poktan Harapan Jaya",
      images: 5,
      type: "Kegiatan",
      published: true,
    },
    {
      id: 2,
      title: "Pembagian Pupuk Subsidi Mei 2026",
      description: "Dokumentasi pembagian pupuk bersubsidi untuk anggota kelompok tani",
      date: "2026-05-20",
      poktan: "Poktan Maju Bersama",
      images: 3,
      type: "Kegiatan",
      published: true,
    },
    {
      id: 3,
      title: "Panen Raya Padi Musim Hujan",
      description: "Panen perdana padi organik dari lahan seluas 5 hektar",
      date: "2026-06-01",
      poktan: "Poktan Berkah Tani",
      images: 8,
      type: "Panen",
      published: false,
    },
    {
      id: 4,
      title: "Pelatihan Pembuatan Pupuk Kompos",
      description: "Workshop pembuatan pupuk kompos organik dari limbah pertanian",
      date: "2026-05-15",
      poktan: "Poktan Sumber Rezeki",
      images: 6,
      type: "Pelatihan",
      published: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-primary mb-2">
            Galeri & Berita
          </h2>
          <p className="text-base text-muted-foreground">
            Kelola dokumentasi kegiatan dan berita Gapoktan Selo Makmur
          </p>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Upload className="w-5 h-5" />
          Upload Kegiatan
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl text-primary mb-6">Upload Dokumentasi Kegiatan</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-foreground">Judul Kegiatan</label>
                <input
                  type="text"
                  placeholder="Contoh: Panen Raya Padi 2026"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Kelompok Tani</label>
                <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Pilih Poktan</option>
                  <option>Poktan Harapan Jaya</option>
                  <option>Poktan Maju Bersama</option>
                  <option>Poktan Berkah Tani</option>
                  <option>Poktan Sumber Rezeki</option>
                  <option>Poktan Tani Makmur</option>
                  <option>Poktan Subur Jaya</option>
                  <option>Poktan Mandiri</option>
                  <option>Poktan Sejahtera</option>
                  <option>Gapoktan (Umum)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Jenis Kegiatan</label>
                <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Pilih jenis</option>
                  <option value="kegiatan">Kegiatan Rutin</option>
                  <option value="panen">Panen Raya</option>
                  <option value="pelatihan">Pelatihan</option>
                  <option value="gotong-royong">Gotong Royong</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Tanggal Kegiatan</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2 text-foreground">Deskripsi</label>
              <textarea
                rows={3}
                placeholder="Jelaskan kegiatan yang didokumentasikan..."
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-foreground">Upload Foto (Maks 10 foto)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
                <p className="text-base text-muted-foreground mb-1">Klik untuk upload foto atau drag & drop</p>
                <p className="text-sm text-muted-foreground">JPG, PNG (Max 5MB per foto)</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors">
                Simpan & Publikasikan
              </button>
              <button type="submit" className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-lg transition-colors">
                Simpan sebagai Draft
              </button>
              <button type="button" onClick={() => setShowUploadForm(false)} className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-lg transition-colors">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {galleries.map((gallery) => (
          <div key={gallery.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {gallery.type === "Panen" ? (
                    <ImageIcon className="w-5 h-5 text-accent" />
                  ) : (
                    <FileText className="w-5 h-5 text-primary" />
                  )}
                  <span className="text-xs text-muted-foreground">{gallery.type}</span>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-white"
                  style={{ backgroundColor: gallery.published ? "var(--status-success)" : "var(--status-pending)" }}
                >
                  {gallery.published && <CheckCircle className="w-3 h-3" />}
                  {gallery.published ? "Dipublikasikan" : "Draft"}
                </span>
              </div>
              <h3 className="text-lg text-primary mb-1">{gallery.title}</h3>
              <p className="text-xs text-accent mb-2">{gallery.poktan}</p>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{gallery.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(gallery.date).toLocaleDateString("id-ID")}</span>
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" />
                  {gallery.images} foto
                </span>
              </div>
            </div>
            <div className="bg-background px-6 py-3 flex gap-2">
              <button className="flex items-center gap-1.5 flex-1 justify-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button className="flex items-center gap-1.5 flex-1 justify-center text-sm font-medium text-destructive hover:text-destructive/80 transition-colors">
                <Trash2 className="w-4 h-4" /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
