import { Plus, Edit, Trash2, Users, MapPin, Search } from "lucide-react";
import { useState } from "react";

const initialPoktanList = [
  { id: 1, nama: "Poktan Harapan Jaya", ketua: "Bapak Suparman", dusun: "Dusun Salakan", anggota: 28, luasLahan: "32.5", komoditas: "Padi, Jagung", tahunBergabung: "2015" },
  { id: 2, nama: "Poktan Maju Bersama", ketua: "Ibu Siti Aminah", dusun: "Dusun Ngasem", anggota: 21, luasLahan: "25.0", komoditas: "Sayuran, Padi", tahunBergabung: "2015" },
  { id: 3, nama: "Poktan Berkah Tani", ketua: "Bapak Ahmad Yani", dusun: "Dusun Karangnongko", anggota: 18, luasLahan: "20.8", komoditas: "Padi", tahunBergabung: "2016" },
  { id: 4, nama: "Poktan Sumber Rezeki", ketua: "Bapak Darmawan", dusun: "Dusun Blekik", anggota: 15, luasLahan: "18.0", komoditas: "Jagung, Singkong", tahunBergabung: "2016" },
  { id: 5, nama: "Poktan Tani Makmur", ketua: "Ibu Ratna Dewi", dusun: "Dusun Sambisari", anggota: 24, luasLahan: "28.3", komoditas: "Sayuran, Buah", tahunBergabung: "2017" },
  { id: 6, nama: "Poktan Subur Jaya", ketua: "Bapak Hendra", dusun: "Dusun Candi", anggota: 19, luasLahan: "22.1", komoditas: "Padi, Cabai", tahunBergabung: "2017" },
  { id: 7, nama: "Poktan Mandiri", ketua: "Bapak Widodo", dusun: "Dusun Jetis", anggota: 12, luasLahan: "14.5", komoditas: "Cabai, Tomat", tahunBergabung: "2018" },
  { id: 8, nama: "Poktan Sejahtera", ketua: "Ibu Nurhasanah", dusun: "Dusun Purwomartani", anggota: 22, luasLahan: "26.0", komoditas: "Padi, Sayuran", tahunBergabung: "2018" },
];

const inputCls =
  "w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

type Poktan = typeof initialPoktanList[number];

const emptyForm = { nama: "", ketua: "", dusun: "", anggota: "", luasLahan: "", komoditas: "", tahunBergabung: "" };

export function GapoktanUsers() {
  const [poktanList, setPoktanList] = useState(initialPoktanList);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Poktan | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);

  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(p: Poktan) {
    setEditTarget(p);
    setForm({ nama: p.nama, ketua: p.ketua, dusun: p.dusun, anggota: String(p.anggota), luasLahan: p.luasLahan, komoditas: p.komoditas, tahunBergabung: p.tahunBergabung });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editTarget) {
      setPoktanList((prev) =>
        prev.map((p) => p.id === editTarget.id ? { ...p, ...form, anggota: Number(form.anggota) } : p)
      );
    } else {
      const newId = Math.max(...poktanList.map((p) => p.id)) + 1;
      setPoktanList((prev) => [...prev, { id: newId, ...form, anggota: Number(form.anggota) }]);
    }
    setShowForm(false);
  }

  function deletePoktan(id: number) {
    setPoktanList((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = poktanList.filter((p) =>
    search
      ? p.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.ketua.toLowerCase().includes(search.toLowerCase()) ||
        p.dusun.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const totalAnggota = poktanList.reduce((s, p) => s + p.anggota, 0);
  const totalLahan = poktanList.reduce((s, p) => s + parseFloat(p.luasLahan), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-primary mb-2">Anggota Poktan Gapoktan</h2>
          <p className="text-base text-muted-foreground">
            Daftar kelompok tani yang tergabung dalam Gapoktan Selo Makmur
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Poktan
        </button>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Poktan", value: poktanList.length, unit: "kelompok" },
          { label: "Total Anggota", value: totalAnggota, unit: "petani" },
          { label: "Total Lahan", value: `${totalLahan.toFixed(1)} Ha`, unit: "keseluruhan" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl text-primary">{item.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.unit}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Form Tambah / Edit */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl text-primary mb-6">
            {editTarget ? "Edit Data Poktan" : "Tambah Poktan Baru"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm mb-2 text-foreground">Nama Kelompok Tani</label>
                <input type="text" required placeholder="contoh: Poktan Harapan Jaya" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Nama Ketua</label>
                <input type="text" required placeholder="Nama ketua poktan" value={form.ketua} onChange={(e) => setForm({ ...form, ketua: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Dusun / Lokasi</label>
                <input type="text" placeholder="contoh: Dusun Salakan" value={form.dusun} onChange={(e) => setForm({ ...form, dusun: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Jumlah Anggota</label>
                <input type="number" min="1" placeholder="contoh: 20" value={form.anggota} onChange={(e) => setForm({ ...form, anggota: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Luas Lahan (Ha)</label>
                <input type="number" step="0.1" min="0" placeholder="contoh: 25.5" value={form.luasLahan} onChange={(e) => setForm({ ...form, luasLahan: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Komoditas Utama</label>
                <input type="text" placeholder="contoh: Padi, Jagung" value={form.komoditas} onChange={(e) => setForm({ ...form, komoditas: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm mb-2 text-foreground">Tahun Bergabung</label>
                <input type="number" min="2000" max="2099" placeholder="contoh: 2016" value={form.tahunBergabung} onChange={(e) => setForm({ ...form, tahunBergabung: e.target.value })} className={inputCls} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors text-sm">
                {editTarget ? "Simpan Perubahan" : "Tambah Poktan"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-lg transition-colors text-sm">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama poktan, ketua, atau dusun..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "var(--primary)" }}>
              <tr>
                <th className="px-4 py-4 text-left text-sm text-white">Kelompok Tani</th>
                <th className="px-4 py-4 text-left text-sm text-white">Lokasi</th>
                <th className="px-4 py-4 text-left text-sm text-white">Anggota</th>
                <th className="px-4 py-4 text-left text-sm text-white">Lahan / Komoditas</th>
                <th className="px-4 py-4 text-left text-sm text-white">Bergabung</th>
                <th className="px-4 py-4 text-left text-sm text-white">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground text-sm">
                    Tidak ada poktan ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((poktan, index) => (
                  <tr key={poktan.id} className={index % 2 === 0 ? "bg-white" : "bg-background"}>
                    <td className="px-4 py-4">
                      <p className="text-sm text-primary">{poktan.nama}</p>
                      <p className="text-xs text-muted-foreground">Ketua: {poktan.ketua}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {poktan.dusun || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 text-sm text-foreground">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        {poktan.anggota} petani
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-foreground">{poktan.luasLahan} Ha</p>
                      <p className="text-xs text-muted-foreground">{poktan.komoditas || "—"}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{poktan.tahunBergabung}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(poktan)} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-primary" />
                        </button>
                        <button onClick={() => deletePoktan(poktan.id)} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
