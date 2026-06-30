import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Sprout, UserPlus, Wheat, Leaf, CheckCircle2, Mail } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useWebsiteContent } from "../../hooks/useWebsiteContent";

export function Register() {
  const { getContent } = useWebsiteContent();
  const brandName = getContent("identity.name", "Gapoktan Selo Makmur");
  const logoUrl = getContent("identity.logo", "");
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Nama lengkap wajib diisi.";
    if (!formData.email.trim()) e.email = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Format email tidak valid.";
    if (!formData.phone.trim()) e.phone = "Nomor telepon wajib diisi.";
    if (!formData.password) e.password = "Password wajib diisi.";
    else if (formData.password.length < 8) e.password = "Password minimal 8 karakter.";
    if (formData.password !== formData.confirmPassword) e.confirmPassword = "Password tidak cocok.";
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsLoading(true);
    const { error } = await signUp({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });
    setIsLoading(false);

    if (error) {
      console.error("Registrasi email gagal:", error);
      const errorMsg = typeof error === "string" ? error : JSON.stringify(error);
      if (errorMsg.includes("already registered") || errorMsg.includes("User already exists")) {
        setErrors({ email: "Email ini sudah terdaftar. Silakan login." });
      } else if (errorMsg.includes("rate limit")) {
        setErrors({ email: "Batas pengiriman email terlampaui. Silakan gunakan Google Login atau coba lagi nanti." });
      } else {
        setErrors({ email: errorMsg });
      }
      return;
    }

    setSuccess(true);
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    setIsLoading(false);
    if (error) {
      console.error("Google login gagal:", error);
      const errorMsg = typeof error === "string" ? error : JSON.stringify(error);
      setErrors({ email: errorMsg });
    }
  };

  const inputBase = { backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" };
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,166,76,0.15)"; };
  const handleBlur  = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; };

  const strength = Math.min(Math.floor(formData.password.length / 3), 4);

  return (
    <div className="min-h-screen flex">
      {/* Sisi Kiri */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-[45%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a3a0d 0%, var(--primary) 50%, #3d6b1f 100%)" }}>
        <div className="absolute top-24 right-10 opacity-20 animate-pulse"><Wheat className="w-16 h-16 text-white" /></div>
        <div className="absolute top-1/3 left-8 opacity-15" style={{ animation: "pulse 3.5s ease-in-out infinite 1s" }}><Leaf className="w-20 h-20 text-white" /></div>
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
          <h1 className="text-4xl xl:text-5xl text-white leading-tight mb-6">Bergabung &<br />Berkembang<br />Bersama Kami</h1>
          <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-xs">Daftarkan diri Anda dan mulai nikmati kemudahan belanja produk pertanian langsung dari petani.</p>
          <div className="space-y-3">
            {["Akses ribuan produk segar lokal", "Harga langsung dari petani", "Pengiriman cepat ke seluruh daerah", "Riwayat transaksi terkelola rapi"].map(item => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-white/80 flex-shrink-0" />
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-white/40 text-sm">© 2026 Gapoktan Selo Makmur</p>
      </div>

      {/* Sisi Kanan */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-background overflow-y-auto">
        <div className="w-full max-w-md">

          {/* 3 Logo */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-sm" style={{ backgroundColor: "var(--secondary)", borderColor: "var(--border)" }}><Wheat className="w-7 h-7" style={{ color: "var(--primary)" }} /></div>
              <span className="text-xs text-center leading-tight" style={{ color: "var(--muted-foreground)" }}>Kementan RI</span>
            </div>
            <div className="h-12 w-px" style={{ backgroundColor: "var(--border)" }} />
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-2" style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))", borderColor: "var(--accent)" }}><Sprout className="w-10 h-10 text-white" /></div>
              <span className="text-xs text-center leading-tight font-medium" style={{ color: "var(--primary)" }}>Gapoktan<br />Selo Makmur</span>
            </div>
            <div className="h-12 w-px" style={{ backgroundColor: "var(--border)" }} />
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-sm" style={{ backgroundColor: "var(--secondary)", borderColor: "var(--border)" }}><Leaf className="w-7 h-7" style={{ color: "var(--accent)" }} /></div>
              <span className="text-xs text-center leading-tight" style={{ color: "var(--muted-foreground)" }}>Dinas Pertanian<br />Sleman</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl mb-2" style={{ color: "var(--primary)" }}>Buat Akun Baru</h2>
            <p style={{ color: "var(--muted-foreground)" }}>Isi data diri Anda untuk mendaftar</p>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-5 py-8 px-6 rounded-2xl text-center bg-white border border-border shadow-md">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: "rgba(124,166,76,0.1)" }}>
                <Mail className="w-8 h-8 text-accent animate-bounce" />
              </div>
              <h3 className="text-2xl text-primary font-semibold">Verifikasi Email Anda</h3>
              <p className="text-base text-muted-foreground max-w-sm">
                Kami telah mengirimkan email konfirmasi ke <strong className="text-foreground">{formData.email}</strong>.
              </p>
              <div className="p-4 rounded-xl text-left text-sm text-foreground max-w-sm border border-border" style={{ backgroundColor: "var(--secondary)" }}>
                <p className="font-semibold mb-1 text-primary">Apa langkah berikutnya?</p>
                <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
                  <li>Buka kotak masuk (inbox) email Anda.</li>
                  <li>Periksa folder <strong>Spam/Promosi</strong> jika tidak ada di kotak masuk.</li>
                  <li>Klik tombol/tautan <strong>Konfirmasi Pendaftaran</strong> untuk mengaktifkan akun Anda.</li>
                </ol>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-xl font-medium transition-colors mt-2"
                style={{ backgroundColor: "var(--primary)", color: "white" }}
              >
                Sudah Verifikasi? Masuk Sekarang
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
              {/* Nama */}
              <div className="space-y-1.5">
                <label htmlFor="register-name" className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>Nama Lengkap</label>
                <input id="register-name" name="name" type="text" autoComplete="name" placeholder="Budi Santoso"
                  value={formData.name} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
                  className="w-full px-4 py-3 rounded-xl border transition-all outline-none" style={inputBase} />
                {errors.name && <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>{errors.name}</p>}
              </div>
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="register-email" className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>Alamat Email</label>
                <input id="register-email" name="email" type="email" autoComplete="email" placeholder="contoh@email.com"
                  value={formData.email} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
                  className="w-full px-4 py-3 rounded-xl border transition-all outline-none" style={inputBase} />
                {errors.email && <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>{errors.email}</p>}
              </div>
              {/* Telepon */}
              <div className="space-y-1.5">
                <label htmlFor="register-phone" className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>Nomor Telepon</label>
                <input id="register-phone" name="phone" type="tel" autoComplete="tel" placeholder="+62 812-3456-7890"
                  value={formData.phone} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
                  className="w-full px-4 py-3 rounded-xl border transition-all outline-none" style={inputBase} />
                {errors.phone && <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>{errors.phone}</p>}
              </div>
              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="register-password" className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>Password</label>
                <div className="relative">
                  <input id="register-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Minimal 8 karakter"
                    value={formData.password} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
                    className="w-full px-4 py-3 pr-12 rounded-xl border transition-all outline-none" style={inputBase} />
                  <button type="button" id="toggle-register-password" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted" style={{ color: "var(--muted-foreground)" }}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>{errors.password}</p>}
                {formData.password && (
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4].map(l => (
                      <div key={l} className="h-1.5 flex-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: l <= strength ? strength <= 1 ? "var(--destructive)" : strength === 2 ? "var(--status-pending)" : strength === 3 ? "var(--status-warning)" : "var(--status-success)" : "var(--muted)" }} />
                    ))}
                  </div>
                )}
              </div>
              {/* Konfirmasi */}
              <div className="space-y-1.5">
                <label htmlFor="register-confirm-password" className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>Konfirmasi Password</label>
                <div className="relative">
                  <input id="register-confirm-password" name="confirmPassword" type={showConfirm ? "text" : "password"} autoComplete="new-password" placeholder="Ulangi password Anda"
                    value={formData.confirmPassword} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
                    className="w-full px-4 py-3 pr-12 rounded-xl border transition-all outline-none"
                    style={{ ...inputBase, borderColor: formData.confirmPassword && formData.password !== formData.confirmPassword ? "var(--destructive)" : formData.confirmPassword && formData.password === formData.confirmPassword ? "var(--status-success)" : "var(--border)" }} />
                  <button type="button" id="toggle-confirm-password" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted" style={{ color: "var(--muted-foreground)" }}>
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>{errors.confirmPassword}</p>}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                Dengan mendaftar, Anda menyetujui <a href="#" className="underline" style={{ color: "var(--accent)" }}>Syarat & Ketentuan</a> dan <a href="#" className="underline" style={{ color: "var(--accent)" }}>Kebijakan Privasi</a> Gapoktan Selo Makmur.
              </p>
              <button id="register-submit-btn" type="submit" disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))", color: "white", boxShadow: "0 4px 15px rgba(45,80,22,0.3)" }}
                onMouseEnter={(e) => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}>
                {isLoading ? (
                  <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Mendaftarkan...</>
                ) : (
                  <><UserPlus className="w-5 h-5" />Daftar Sekarang</>
                )}
              </button>

              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                <span className="relative bg-background px-3 text-xs text-muted-foreground uppercase">Atau daftar dengan</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-xl font-medium transition-all duration-200 hover:opacity-90 text-foreground"
                style={{ backgroundColor: "var(--input-background)" }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google
              </button>
            </form>
          )}

          <p className="text-center mt-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Sudah punya akun?{" "}
            <Link id="go-to-login" to="/login" className="font-medium transition-colors hover:underline" style={{ color: "var(--accent)" }}>Masuk di sini</Link>
          </p>
          <p className="text-center mt-3 text-sm">
            <Link to="/" className="transition-colors hover:underline" style={{ color: "var(--muted-foreground)" }}>← Kembali ke Beranda</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
