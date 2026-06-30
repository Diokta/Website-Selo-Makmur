import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users, MapPin, Search, User, Mail, Shield, Phone, AlertTriangle } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../../hooks/useAuth";

const inputCls =
  "w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const emptyForm = { nama: "", ketua: "", dusun: "", jumlah_anggota: "", luas_lahan_ha: "", komoditas_utama: "", tahun_bergabung: "", kontak: "" };
const emptyUserForm = { name: "", email: "", phone: "", address: "", role: "user" };

export function GapoktanUsers() {
  const { user } = useAuth();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<"poktan" | "users">("poktan");

  // Error/Success Messages
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Kelompok Tani States
  const [poktanList, setPoktanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);

  // Akun Pengguna States
  const [usersList, setUsersList] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [editUserTargetId, setEditUserTargetId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState(emptyUserForm);

  // Delete Modal States
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetType, setDeleteTargetType] = useState<"poktan" | "user">("poktan");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState("");

  useEffect(() => {
    setErrorMsg("");
    setSuccessMsg("");
    if (activeTab === "users") {
      fetchUsers();
    } else {
      fetchPoktans();
    }
  }, [activeTab]);

  // --- KELOMPOK TANI ACTIONS ---
  const fetchPoktans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("kelompok_tani")
        .select("*")
        .order("nama", { ascending: true });

      if (error) throw error;
      if (data) setPoktanList(data);
    } catch (err: any) {
      console.error("Error fetching kelompok tani:", err);
      setErrorMsg(err.message || "Gagal memuat data kelompok tani.");
    } finally {
      setLoading(false);
    }
  };

  function openAdd() {
    setEditTargetId(null);
    setForm(emptyForm);
    setErrorMsg("");
    setShowForm(true);
  }

  function openEdit(p: any) {
    setEditTargetId(p.id);
    setForm({
      nama: p.nama || "",
      ketua: p.ketua || "",
      dusun: p.dusun || "",
      jumlah_anggota: p.jumlah_anggota !== undefined && p.jumlah_anggota !== null ? String(p.jumlah_anggota) : "",
      luas_lahan_ha: p.luas_lahan_ha !== undefined && p.luas_lahan_ha !== null ? String(p.luas_lahan_ha) : "",
      komoditas_utama: p.komoditas_utama || "",
      tahun_bergabung: p.tahun_bergabung !== undefined && p.tahun_bergabung !== null ? String(p.tahun_bergabung) : "",
      kontak: p.kontak || "",
    });
    setErrorMsg("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const parseNum = (val: string) => {
        const p = parseFloat(val);
        return isNaN(p) ? null : p;
      };
      const parseIntNum = (val: string) => {
        const p = parseInt(val);
        return isNaN(p) ? null : p;
      };

      const payload = {
        nama: form.nama,
        ketua: form.ketua || null,
        dusun: form.dusun || null,
        jumlah_anggota: parseIntNum(form.jumlah_anggota) || 0,
        luas_lahan_ha: parseNum(form.luas_lahan_ha),
        komoditas_utama: form.komoditas_utama || null,
        tahun_bergabung: parseIntNum(form.tahun_bergabung),
        kontak: form.kontak || null,
        updated_at: new Date().toISOString(),
      };

      if (editTargetId) {
        const { error } = await supabase
          .from("kelompok_tani")
          .update(payload)
          .eq("id", editTargetId);

        if (error) throw error;
        setSuccessMsg("Kelompok tani berhasil diperbarui.");
      } else {
        const { error } = await supabase
          .from("kelompok_tani")
          .insert({
            ...payload,
            created_at: new Date().toISOString(),
          });

        if (error) throw error;
        setSuccessMsg("Kelompok tani baru berhasil ditambahkan.");
      }

      setShowForm(false);
      fetchPoktans();
    } catch (err: any) {
      console.error("Error saving poktan:", err);
      setErrorMsg(err.message || "Gagal menyimpan data kelompok tani.");
    } finally {
      setLoading(false);
    }
  }

  function requestDeletePoktan(p: any) {
    setDeleteTargetType("poktan");
    setDeleteTargetId(p.id);
    setDeleteTargetName(p.nama);
    setDeleteConfirmOpen(true);
  }

  // --- AKUN PENGGUNA ACTIONS ---
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      if (data) setUsersList(data);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setErrorMsg(err.message || "Gagal memuat data akun pengguna.");
    } finally {
      setUsersLoading(false);
    }
  };

  function openEditUser(u: any) {
    setEditUserTargetId(u.id);
    setUserForm({
      name: u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      address: u.address || "",
      role: u.role || "user",
    });
    setErrorMsg("");
    setShowUserForm(true);
  }

  async function handleUserSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUsersLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (editUserTargetId) {
        const { error } = await supabase
          .from("users")
          .update({
            name: userForm.name,
            phone: userForm.phone || null,
            address: userForm.address || null,
            role: userForm.role,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editUserTargetId);

        if (error) throw error;
        setSuccessMsg("Profil akun pengguna berhasil diperbarui.");
        setShowUserForm(false);
        fetchUsers();
      }
    } catch (err: any) {
      console.error("Error saving user:", err);
      setErrorMsg(err.message || "Gagal memperbarui data pengguna.");
    } finally {
      setUsersLoading(false);
    }
  }

  function requestDeleteUser(u: any) {
    if (u.id === user?.id) {
      alert("Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.");
      return;
    }
    setDeleteTargetType("user");
    setDeleteTargetId(u.id);
    setDeleteTargetName(u.name || u.email);
    setDeleteConfirmOpen(true);
  }

  // --- GENERAL DELETE CONFIRMATION HANDLER ---
  async function handleConfirmDelete() {
    if (!deleteTargetId) return;
    
    setDeleteConfirmOpen(false);
    setErrorMsg("");
    setSuccessMsg("");
    
    if (deleteTargetType === "poktan") {
      setLoading(true);
      try {
        const { error } = await supabase.from("kelompok_tani").delete().eq("id", deleteTargetId);
        if (error) throw error;
        setSuccessMsg(`Kelompok tani "${deleteTargetName}" berhasil dihapus.`);
        fetchPoktans();
      } catch (err: any) {
        console.error("Error deleting poktan:", err);
        setErrorMsg(err.message || "Gagal menghapus kelompok tani.");
        setLoading(false);
      }
    } else {
      setUsersLoading(true);
      try {
        const { error } = await supabase.from("users").delete().eq("id", deleteTargetId);
        if (error) throw error;
        setSuccessMsg(`Akun pengguna "${deleteTargetName}" berhasil dihapus.`);
        fetchUsers();
      } catch (err: any) {
        console.error("Error deleting user:", err);
        setErrorMsg(err.message || "Gagal menghapus akun pengguna.");
        setUsersLoading(false);
      }
    }
  }

  // --- FILTERS & STATS ---
  const filteredPoktans = poktanList.filter((p) =>
    search
      ? p.nama.toLowerCase().includes(search.toLowerCase()) ||
        (p.ketua || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.dusun || "").toLowerCase().includes(search.toLowerCase())
      : true
  );

  const filteredUsers = usersList.filter((u) =>
    userSearch
      ? (u.name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.phone || "").toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.address || "").toLowerCase().includes(userSearch.toLowerCase())
      : true
  );

  const totalAnggota = poktanList.reduce((s, p) => s + (p.jumlah_anggota || 0), 0);
  const totalLahan = poktanList.reduce((s, p) => s + (p.luas_lahan_ha || 0), 0);

  const totalUsers = usersList.length;
  const adminCount = usersList.filter((u) => u.role === "super_admin").length;
  const buyerCount = usersList.filter((u) => u.role === "user").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-primary mb-2 font-semibold">Manajemen Pengguna & Kelompok</h2>
          <p className="text-base text-muted-foreground">
            Kelola data kelompok tani dan akun pengguna website Gapoktan Selo Makmur
          </p>
        </div>
        {activeTab === "poktan" && (
          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors font-medium cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Tambah Poktan
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("poktan")}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "poktan"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Kelompok Tani
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Daftar Akun Pengguna
        </button>
      </div>

      {/* Success Alert Banner */}
      {successMsg && (
        <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm font-medium animate-fadeIn">
          {successMsg}
        </div>
      )}

      {/* --- TAB 1: KELOMPOK TANI --- */}
      {activeTab === "poktan" && (
        <>
          {/* Ringkasan Poktan */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Poktan", value: poktanList.length, unit: "kelompok" },
              { label: "Total Anggota", value: totalAnggota, unit: "petani" },
              { label: "Total Lahan", value: `${totalLahan.toFixed(1)} Ha`, unit: "keseluruhan" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm text-center border border-border">
                <p className="text-2xl text-primary font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.unit}</p>
                <p className="text-xs text-muted-foreground font-semibold">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Form Poktan */}
          {showForm && (
            <div className="bg-white rounded-xl p-6 shadow-md border border-border space-y-4">
              <h3 className="text-xl text-primary font-semibold">
                {editTargetId ? "Edit Kelompok Tani" : "Tambah Poktan Baru"}
              </h3>
              {errorMsg && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm font-medium">
                  {errorMsg}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-foreground font-medium">Nama Poktan</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Poktan Harapan Baru"
                      value={form.nama}
                      onChange={(e) => setForm({ ...form, nama: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground font-medium">Nama Ketua</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama lengkap ketua"
                      value={form.ketua}
                      onChange={(e) => setForm({ ...form, ketua: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground font-medium">Dusun / Lokasi</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama dusun sekretariat"
                      value={form.dusun}
                      onChange={(e) => setForm({ ...form, dusun: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground font-medium">Jumlah Anggota (Petani)</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 25"
                      value={form.jumlah_anggota}
                      onChange={(e) => setForm({ ...form, jumlah_anggota: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground font-medium">Luas Lahan (Hektar)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="Contoh: 15.5"
                      value={form.luas_lahan_ha}
                      onChange={(e) => setForm({ ...form, luas_lahan_ha: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground font-medium">Komoditas Utama</label>
                    <input
                      type="text"
                      placeholder="Contoh: Padi, Jagung"
                      value={form.komoditas_utama}
                      onChange={(e) => setForm({ ...form, komoditas_utama: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground font-medium">Tahun Bergabung</label>
                    <input
                      type="number"
                      placeholder="Contoh: 2018"
                      value={form.tahun_bergabung}
                      onChange={(e) => setForm({ ...form, tahun_bergabung: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground font-medium">Nomor Kontak (Telepon)</label>
                    <input
                      type="text"
                      placeholder="Contoh: 0812XXXXXXXX"
                      value={form.kontak}
                      onChange={(e) => setForm({ ...form, kontak: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List Poktan */}
          {loading && poktanList.length === 0 ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <LoadingSpinner message="Memuat data kelompok tani..." />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-border">
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari Poktan, Ketua, Dusun..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent focus:outline-none text-base"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] border-collapse">
                  <thead style={{ backgroundColor: "var(--primary)" }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">No.</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Kelompok Tani</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Ketua</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Anggota</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Luas Lahan</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Komoditas</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Dusun / Lokasi</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Tahun Gabung</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Kontak</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-white">
                    {filteredPoktans.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-12 text-muted-foreground text-sm font-medium">
                          Tidak ada kelompok tani yang ditemukan.
                        </td>
                      </tr>
                    ) : (
                      filteredPoktans.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-background/25 transition-colors group">
                          <td className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            {idx + 1}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-primary">
                            <div className="flex items-center gap-2">
                              <Users className="w-4.5 h-4.5 text-accent flex-shrink-0" />
                              <span>{p.nama}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-foreground">
                            {p.ketua || "-"}
                          </td>
                          <td className="px-6 py-4 text-center text-sm">
                            <span className="bg-secondary/50 px-2.5 py-1 rounded-md text-xs font-semibold border border-border text-foreground">
                              {p.jumlah_anggota || 0} petani
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-sm">
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-md text-xs font-semibold">
                              {p.luas_lahan_ha ? `${p.luas_lahan_ha} Ha` : "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {p.komoditas_utama ? (
                              <span className="bg-accent/10 text-accent px-2.5 py-1 rounded-md text-xs font-semibold border border-accent/20">
                                {p.komoditas_utama}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" />
                              <span>{p.dusun || "-"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm font-medium text-foreground">
                            {p.tahun_bergabung || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground font-semibold">
                            {p.kontak || "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-1.5">
                              <button
                                onClick={() => openEdit(p)}
                                className="p-1.5 hover:bg-secondary rounded-md transition-colors text-primary hover:text-primary/80 cursor-pointer"
                                title="Edit Kelompok Tani"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => requestDeletePoktan(p)}
                                className="p-1.5 hover:bg-secondary rounded-md transition-colors text-destructive hover:text-destructive/80 cursor-pointer"
                                title="Hapus Kelompok Tani"
                              >
                                <Trash2 className="w-4 h-4" />
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
          )}
        </>
      )}

      {/* --- TAB 2: AKUN PENGGUNA --- */}
      {activeTab === "users" && (
        <>
          {/* Ringkasan Users */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Akun", value: totalUsers, unit: "terdaftar" },
              { label: "Pembeli / User", value: buyerCount, unit: "pengguna" },
              { label: "Super Admin", value: adminCount, unit: "pengurus" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm text-center border border-border">
                <p className="text-2xl text-primary font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.unit}</p>
                <p className="text-xs text-muted-foreground font-semibold">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Form Edit User */}
          {showUserForm && (
            <div className="bg-white rounded-xl p-6 shadow-md border border-border space-y-4">
              <h3 className="text-xl text-primary font-semibold">
                Edit Data Pengguna
              </h3>
              {errorMsg && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm font-medium">
                  {errorMsg}
                </div>
              )}
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-foreground font-medium">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground font-medium">Email (Tidak dapat diubah)</label>
                    <input
                      type="email"
                      disabled
                      value={userForm.email}
                      className={`${inputCls} bg-muted text-muted-foreground cursor-not-allowed`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground font-medium">Nomor Telepon</label>
                    <input
                      type="text"
                      placeholder="Contoh: 0812XXXXXXXX"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground font-medium">Peran / Hak Akses</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                      className={inputCls}
                    >
                      <option value="user">User / Pembeli</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm mb-2 text-foreground font-medium">Alamat Lengkap</label>
                    <textarea
                      rows={3}
                      placeholder="Alamat lengkap..."
                      value={userForm.address}
                      onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                      className={`${inputCls} h-auto`}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUserForm(false)}
                    className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List Users */}
          {usersLoading && usersList.length === 0 ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <LoadingSpinner message="Memuat data akun pengguna..." />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-border">
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari Nama, Email, Telepon, Alamat..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="flex-1 bg-transparent focus:outline-none text-base"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                {filteredUsers.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    Tidak ada akun pengguna yang ditemukan.
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      className="border border-border rounded-xl p-6 hover:shadow-md transition-shadow bg-white flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-accent/15 rounded-full flex items-center justify-center text-accent flex-shrink-0">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-primary">{u.name || "Tanpa Nama"}</h4>
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                                  u.role === "super_admin"
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "bg-secondary text-foreground border border-border"
                                }`}
                              >
                                {u.role === "super_admin" ? (
                                  <>
                                    <Shield className="w-3 h-3" />
                                    Super Admin
                                  </>
                                ) : (
                                  "User / Pembeli"
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => openEditUser(u)}
                              className="p-2 hover:bg-secondary rounded-lg transition-colors text-primary cursor-pointer"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            {u.id !== user?.id && (
                              <button
                                onClick={() => requestDeleteUser(u)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors text-destructive cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4 text-muted-foreground/75 flex-shrink-0" />
                            <span className="text-foreground font-semibold truncate">{u.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 text-muted-foreground/75 flex-shrink-0" />
                            <span className="text-foreground font-semibold">{u.phone || "-"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-muted-foreground pt-4 border-t border-secondary/20">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{u.address || "Alamat belum diisi"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}

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
                <h3 className="text-xl font-bold text-primary">
                  {deleteTargetType === "poktan" ? "Hapus Kelompok Tani?" : "Hapus Akun Pengguna?"}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Apakah Anda yakin ingin menghapus{" "}
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
