import { useState, useEffect } from "react";
import { Link } from "react-router";
import { User, Phone, Mail, ShoppingBag } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState<any>({
    nama: "",
    phone: ""
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const loadProfileData = async () => {
      setLoading(true);
      try {
        const { data: profileData } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        if (profileData) {
          setProfile(profileData);
          setEditForm({
            nama: profileData.name || "",
            phone: profileData.phone || "",
          });
        }
      } catch (err) {
        console.error("Error loading profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user, authLoading]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: editForm.nama,
          phone: editForm.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      setProfile((prev: any) => ({
        ...prev,
        name: editForm.nama,
        phone: editForm.phone,
      }));
      setSuccessMsg("Profil berhasil diperbarui.");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-md max-w-md w-full border border-border">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl text-primary mb-4">Akses Terbatas</h2>
          <p className="text-base text-muted-foreground mb-6">
            Silakan masuk terlebih dahulu untuk melihat profil Anda.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg transition-colors text-base font-medium"
          >
            Masuk Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-accent py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl text-white mb-4">Profil Saya</h1>
          <p className="text-lg sm:text-xl text-white/90">
            Kelola informasi profil akun Anda
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {successMsg && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-lg mb-6 text-sm">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-destructive/10 border-l-4 border-destructive text-destructive p-4 rounded-lg mb-6 text-sm">
            {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md border border-border text-left">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center animate-pulse">
              <User className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">Informasi Pribadi</h3>
              <p className="text-xs text-muted-foreground">Perbarui informasi profil akun Gapoktan Anda</p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Alamat Email (Tidak dapat diubah)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  disabled
                  value={profile?.email || ""}
                  className="w-full pl-10 pr-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nama Lengkap</label>
              <input
                type="text"
                required
                value={editForm.nama}
                onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs"
                placeholder="Nama Lengkap Anda"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">No. Telepon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 bg-input-background border border-border rounded-lg text-xs"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-accent hover:bg-accent/90 disabled:bg-muted disabled:text-muted-foreground text-white px-6 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
