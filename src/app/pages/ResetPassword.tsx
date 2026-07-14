import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useWebsiteContent } from "../../hooks/useWebsiteContent";
import { Eye, EyeOff, Lock, CheckCircle2, Sprout } from "lucide-react";

export function ResetPassword() {
  const { getContent } = useWebsiteContent();
  const brandName = getContent("identity.name", "Gapoktan Selo Makmur");
  const logoUrl = getContent("identity.logo", "");
  const navigate = useNavigate();
  const { updatePassword, signOut, session } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Memastikan session pemulihan terdeteksi
  useEffect(() => {
    // Jika tidak ada hash token di URL dan tidak ada session aktif,
    // mungkin link sudah kedaluwarsa atau salah akses.
    const hasHash = window.location.hash || window.location.search.includes("code=");
    const timer = setTimeout(() => {
      if (!session && !hasHash) {
        setError("Sesi pemulihan tidak terdeteksi atau sudah kedaluwarsa. Silakan ajukan ulang link Lupa Password.");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [session]);

  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--accent)";
    e.target.style.boxShadow = "0 0 0 3px rgba(124,166,76,0.15)";
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "none";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal terdiri dari 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok.");
      return;
    }

    setIsLoading(true);
    const { error: resetErr } = await updatePassword(password);
    setIsLoading(false);

    if (resetErr) {
      setError(resetErr);
    } else {
      setSuccess(true);
      // Bersihkan sesi di client agar user harus login secara normal dengan password barunya
      await signOut();
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sisi Kiri: Dekoratif */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--primary) 0%, #3d6b1f 45%, var(--accent) 100%)" }}
      >
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white"
              style={{ width: `${120 + i * 80}px`, height: `${120 + i * 80}px`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          ))}
        </div>
        <div className="relative z-10 flex items-center gap-3">
          {logoUrl ? (
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-0.5 border border-white/30 flex-shrink-0">
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 flex-shrink-0">
              <Sprout className="w-7 h-7 text-white" />
            </div>
          )}
          <span className="text-white text-xl font-medium">{brandName}</span>
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <h1 className="text-4xl xl:text-5xl text-white leading-tight mb-6">Setel Ulang<br />Password Anda</h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-md">Amankan kembali akun Anda dengan membuat password baru yang kuat.</p>
        </div>
        <p className="relative z-10 text-white/50 text-sm">© 2026 Gapoktan Selo Makmur.</p>
      </div>

      {/* Sisi Kanan: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8">
            {logoUrl ? (
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1 border-2 shadow-md" style={{ borderColor: "var(--accent)" }}>
                <img src={logoUrl} alt="Logo Gapoktan" className="w-full h-full object-contain rounded-full" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-md"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))", borderColor: "var(--accent)" }}>
                <Sprout className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          {success ? (
            <div className="space-y-6 text-center">
              <div className="flex flex-col items-center gap-3 p-6 rounded-2xl" style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-green-500/10 text-green-600 mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-primary">Password Diubah!</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Password Anda berhasil diperbarui. Silakan login kembali menggunakan password baru Anda.
                </p>
              </div>
              <button onClick={() => navigate("/login")}
                className="w-full py-3.5 rounded-xl font-medium transition-colors hover:opacity-90 text-white"
                style={{ backgroundColor: "var(--primary)" }}>
                Masuk ke Akun Anda
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl mb-2 font-bold" style={{ color: "var(--primary)" }}>Password Baru</h2>
                <p style={{ color: "var(--muted-foreground)" }}>Buat password baru yang berbeda dengan password lama.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="new-password" className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>Password Baru</label>
                  <div className="relative">
                    <input id="new-password" type={showPassword ? "text" : "password"} placeholder="Minimal 6 karakter" required
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      onFocus={inputFocus} onBlur={inputBlur}
                      className="w-full px-4 py-3 pr-12 rounded-xl border transition-all outline-none"
                      style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors hover:bg-muted" style={{ color: "var(--muted-foreground)" }}>
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirm-new-password" className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>Konfirmasi Password Baru</label>
                  <input id="confirm-new-password" type={showPassword ? "text" : "password"} placeholder="Masukkan ulang password" required
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={inputFocus} onBlur={inputBlur}
                    className="w-full px-4 py-3 rounded-xl border transition-all outline-none"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>

                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                    style={{ backgroundColor: "rgba(211,47,47,0.08)", color: "var(--destructive)", border: "1px solid rgba(211,47,47,0.2)" }}>
                    <span>⚠</span> {error}
                  </div>
                )}

                <button type="submit" disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 text-white"
                  style={{ backgroundColor: "var(--primary)" }}>
                  {isLoading ? "Menyimpan..." : "Setel Ulang Password"}
                </button>
              </form>
            </>
          )}

          <p className="text-center mt-6 text-sm">
            <Link to="/login" className="transition-colors hover:underline" style={{ color: "var(--muted-foreground)" }}>Batal & Kembali ke Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
