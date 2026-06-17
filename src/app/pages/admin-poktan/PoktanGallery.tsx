import { useState } from "react";
import { Upload, Image as ImageIcon, FileText, Clock, CheckCircle } from "lucide-react";

export function PoktanGallery() {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const galleries = [
    {
      id: 1,
      title: "Gotong Royong Perbaikan Irigasi",
      description: "Kegiatan gotong royong anggota poktan memperbaiki saluran irigasi sawah",
      date: "2026-05-28",
      status: "Disetujui",
      statusColor: "var(--status-success)",
      images: 5,
      type: "Kegiatan",
    },
    {
      id: 2,
      title: "Pembagian Pupuk Subsidi Mei 2026",
      description: "Dokumentasi pembagian pupuk bersubsidi untuk anggota kelompok tani",
      date: "2026-05-20",
      status: "Disetujui",
      statusColor: "var(--status-success)",
      images: 3,
      type: "Kegiatan",
    },
    {
      id: 3,
      title: "Panen Raya Padi Musim Hujan",
      description: "Panen perdana padi organik dari lahan seluas 5 hektar",
      date: "2026-06-01",
      status: "Menunggu Review",
      statusColor: "var(--status-pending)",
      images: 8,
      type: "Panen",
    },
    {
      id: 4,
      title: "Pelatihan Pembuatan Pupuk Kompos",
      description: "Workshop pembuatan pupuk kompos organik dari limbah pertanian",
      date: "2026-05-15",
      status: "Disetujui",
      statusColor: "var(--status-success)",
      images: 6,
      type: "Pelatihan",
    },
  ];

  const getStatusIcon = (status: string) => {
    if (status === "Disetujui") return <CheckCircle className="w-4 h-4" />;
    if (status === "Menunggu Review") return <Clock className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-primary mb-2">
            Galeri & Berita Poktan
          </h2>
          <p className="text-base text-muted-foreground">
            Upload dokumentasi kegiatan kelompok tani
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
            <div>
              <label className="block text-sm mb-2 text-foreground">
                Judul Kegiatan
              </label>
              <input
                type="text"
                placeholder="Contoh: Panen Raya Padi 2026"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-foreground">
                Jenis Kegiatan
              </label>
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
              <label className="block text-sm mb-2 text-foreground">
                Deskripsi
              </label>
              <textarea
                rows={4}
                placeholder="Jelaskan kegiatan yang didokumentasikan..."
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-foreground">
                Tanggal Kegiatan
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-foreground">
                Upload Foto (Maks 10 foto)
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
                <p className="text-base text-muted-foreground mb-1">
                  Klik untuk upload foto atau drag & drop
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG (Max 5MB per foto)
                </p>
              </div>
            </div>
            <div className="bg-secondary/10 rounded-lg p-4 border-l-4" style={{ borderColor: "var(--secondary)" }}>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Catatan:</strong> Semua dokumentasi
                yang Anda upload akan di-review oleh Admin Gapoktan sebelum
                ditampilkan di website utama. Pastikan foto berkualitas baik dan relevan
                dengan kegiatan.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Upload & Kirim untuk Review
              </button>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-lg transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {galleries.map((gallery) => (
          <div key={gallery.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {gallery.type === "Kegiatan" && <FileText className="w-5 h-5 text-primary" />}
                  {gallery.type === "Panen" && <ImageIcon className="w-5 h-5 text-accent" />}
                  {gallery.type === "Pelatihan" && <FileText className="w-5 h-5 text-secondary" />}
                  <span className="text-xs text-muted-foreground">{gallery.type}</span>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-white"
                  style={{ backgroundColor: gallery.statusColor }}
                >
                  {getStatusIcon(gallery.status)}
                  {gallery.status}
                </span>
              </div>
              <h3 className="text-lg text-primary mb-2">{gallery.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {gallery.description}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(gallery.date).toLocaleDateString("id-ID")}</span>
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" />
                  {gallery.images} foto
                </span>
              </div>
            </div>
            <div className="bg-background px-6 py-3 flex gap-2">
              <button className="flex-1 text-base font-semibold text-primary hover:text-primary/80 transition-colors">
                Lihat Detail
              </button>
              <button className="flex-1 text-base font-semibold text-accent hover:text-accent/80 transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="bg-primary/10 rounded-xl p-6 border-l-4" style={{ borderColor: "var(--primary)" }}>
        <h3 className="text-lg text-primary mb-2">Panduan Upload Dokumentasi</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Gunakan foto berkualitas baik dengan pencahayaan yang cukup</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Pastikan foto menunjukkan aktivitas yang sebenarnya terjadi</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Berikan deskripsi yang jelas tentang kegiatan yang didokumentasikan</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Review biasanya dilakukan dalam 1-2 hari kerja oleh Admin Gapoktan</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
