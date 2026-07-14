import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Sprout, LogIn, Wheat, ShieldCheck, Leaf, Mail, RefreshCw } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useWebsiteContent } from "../../hooks/useWebsiteContent";

export function Login() {
  const { getContent } = useWebsiteContent();
  const brandName = getContent("identity.name", "Gapoktan Selo Makmur");
  const logoUrl = getContent("identity.logo", "");
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, signOut, resendConfirmationEmail, sendPasswordResetEmail } = useAuth();

  // State untuk panel "email belum dikonfirmasi"
  const [unconfirmedEmail, setUnconfirmedEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

  // State untuk mode lupa password
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");

  useEffect(() => {
    // Bersihkan sesi lama saat masuk ke halaman login untuk menghindari sisa data cache
    signOut();
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    const { error: authError } = await signInWithGoogle();
    setIsLoading(false);
    if (authError) {
      setError(authError);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (!forgotEmail) {
      setForgotError("Alamat email wajib diisi.");
      return;
    }
    setForgotLoading(true);
    const { error: resetErr } = await sendPasswordResetEmail(forgotEmail);
    setForgotLoading(false);
    if (resetErr) {
      setForgotError(resetErr);
    } else {
      setForgotSuccess(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Email dan password wajib diisi."); return; }
    if (password.length < 6) { setError("Password minimal 6 karakter."); return; }

    setIsLoading(true);
    const { error: authError, emailNotVerified } = await signIn(email, password);
    setIsLoading(false);

    if (authError) {
      if (authError.includes("Invalid login credentials")) {
        setError("Email atau password salah. Periksa kembali dan coba lagi.");
      } else if (emailNotVerified || authError === "email_not_verified") {
        setUnconfirmedEmail(email);
        setError("email_not_confirmed");
      } else {
        setError(authError);
      }
      return;
    }

    // Redirect berdasarkan role — ambil profil setelah login
    // useAuth akan update profile secara async, jadi cek email admin sebagai fallback
    const adminEmails = ["admin@gapoktan.id", "pengurus@gapoktan.id", "ketua@gapoktan.id"];
    if (adminEmails.includes(email.toLowerCase()) || email.toLowerCase().includes("@gapoktan.id")) {
      navigate("/admin-gapoktan");
    } else {
      navigate("/dashboard");
    }
  };

  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--accent)";
    e.target.style.boxShadow = "0 0 0 3px rgba(124,166,76,0.15)";
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "none";
  };

  const handleResendEmail = async () => {
    if (!unconfirmedEmail) return;
    setResendLoading(true);
    setResendError("");
    setResendSuccess(false);
    const { error } = await resendConfirmationEmail(unconfirmedEmail);
    setResendLoading(false);
    if (error) {
      if (error.toLowerCase().includes("rate limit")) {
        setResendError("Batas pengiriman email tercapai. Tunggu beberapa menit lalu coba lagi.");
      } else {
        setResendError(error);
      }
    } else {
      setResendSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Sisi Kiri: Dekorasi ── */}
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
        <div className="absolute top-20 left-16 opacity-20 animate-pulse"><Wheat className="w-20 h-20 text-white" /></div>
        <div className="absolute bottom-32 right-16 opacity-20" style={{ animation: "pulse 3s ease-in-out infinite 1s" }}><Leaf className="w-16 h-16 text-white" /></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
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
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <h1 className="text-4xl xl:text-5xl text-white leading-tight mb-6">Platform Digital<br />Pertanian Terpadu</h1>
          <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">Bergabunglah dengan ribuan petani yang telah memanfaatkan platform kami untuk memasarkan hasil tani secara digital.</p>
          <div className="space-y-4">
            {[
              { icon: ShieldCheck, text: "Sistem keamanan transaksi terpercaya" },
              { icon: Wheat, text: "Produk segar langsung dari petani" },
              { icon: Leaf, text: "Mendukung pertanian berkelanjutan" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-white/50 text-sm">© 2026 Gapoktan Selo Makmur. Selomartani, Kalasan, Sleman, DIY.</p>
        </div>
      </div>

      {/* ── Sisi Kanan: Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-background overflow-y-auto">
        <div className="w-full max-w-md">

          {/* 3 Logo */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8">
            {/* Logo Kiri: Universitas Gunadarma */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-sm overflow-hidden bg-white" style={{ borderColor: "var(--border)" }}>
                <img src="https://upload.wikimedia.org/wikipedia/id/1/19/Logo_Gunadarma.jpg" alt="Logo Gunadarma" className="w-full h-full object-contain p-0.5" />
              </div>
              <span className="text-xs text-center leading-tight font-medium" style={{ color: "var(--muted-foreground)" }}>Universitas Gunadarma</span>
            </div>

            <div className="h-12 w-px" style={{ backgroundColor: "var(--border)" }} />

            {/* Logo Tengah: Gapoktan Selo Makmur */}
            <div className="flex flex-col items-center gap-1.5">
              {logoUrl ? (
                <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-2 overflow-hidden bg-white" style={{ borderColor: "var(--accent)" }}>
                  <img src={logoUrl} alt="Logo Gapoktan" className="w-full h-full object-contain p-1" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-2" style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))", borderColor: "var(--accent)" }}>
                  <Sprout className="w-10 h-10 text-white" />
                </div>
              )}
              <span className="text-xs text-center leading-tight font-semibold" style={{ color: "var(--primary)" }}>Gapoktan<br />Selo Makmur</span>
            </div>

            <div className="h-12 w-px" style={{ backgroundColor: "var(--border)" }} />

            {/* Logo Kanan: AAMAI */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-sm overflow-hidden bg-white" style={{ borderColor: "var(--border)" }}>
                <img src="https://aamai.or.id/web/wp-content/uploads/2019/09/logo_large@3x.png" alt="Logo AAMAI" className="w-full h-full object-contain p-1" />
              </div>
              <span className="text-xs text-center leading-tight font-medium" style={{ color: "var(--muted-foreground)" }}>AAMAI</span>
            </div>
          </div>

          {isForgotPassword ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl mb-2" style={{ color: "var(--primary)" }}>Lupa Password?</h2>
                <p style={{ color: "var(--muted-foreground)" }}>Masukkan email Anda untuk menerima link reset password.</p>
              </div>

              {forgotSuccess ? (
                <div className="space-y-6">
                  <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "rgba(124,166,76,0.06)", border: "1px solid rgba(124,166,76,0.25)" }}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-accent/15">
                        <Mail className="w-5 h-5" style={{ color: "var(--accent)" }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1" style={{ color: "var(--primary)" }}>Email Pemulihan Terkirim</p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                          Kami telah mengirimkan instruksi pemulihan ke <strong className="text-foreground">{forgotEmail}</strong>. Silakan periksa inbox (dan kotak spam) Anda, lalu klik tautan yang tersedia untuk mereset password.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={() => { setIsForgotPassword(false); setForgotSuccess(false); setForgotEmail(""); }}
                    className="w-full py-3.5 rounded-xl font-medium transition-colors hover:opacity-90 text-white"
                    style={{ backgroundColor: "var(--primary)" }}>
                    Kembali ke Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="forgot-email" className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>Alamat Email</label>
                    <input id="forgot-email" type="email" placeholder="contoh@email.com" required
                      value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                      onFocus={inputFocus} onBlur={inputBlur}
                      className="w-full px-4 py-3 rounded-xl border transition-all outline-none"
                      style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                  </div>

                  {forgotError && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                      style={{ backgroundColor: "rgba(211,47,47,0.08)", color: "var(--destructive)", border: "1px solid rgba(211,47,47,0.2)" }}>
                      <span>⚠</span> {forgotError}
                    </div>
                  )}

                  <button type="submit" disabled={forgotLoading}
                    className="w-full py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 text-white"
                    style={{ backgroundColor: "var(--primary)" }}>
                    {forgotLoading ? "Mengirim..." : "Kirim Link Pemulihan"}
                  </button>

                  <button type="button" onClick={() => { setIsForgotPassword(false); setForgotError(""); }}
                    className="w-full py-3.5 rounded-xl font-medium transition-colors border border-border text-center hover:bg-muted"
                    style={{ color: "var(--foreground)" }}>
                    Batal
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl mb-2" style={{ color: "var(--primary)" }}>Selamat Datang</h2>
                <p style={{ color: "var(--muted-foreground)" }}>Masuk ke akun Anda untuk melanjutkan</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
                <div className="space-y-2">
                  <label htmlFor="login-email" className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>Alamat Email</label>
                  <input id="login-email" type="email" autoComplete="email" placeholder="contoh@email.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    onFocus={inputFocus} onBlur={inputBlur}
                    className="w-full px-4 py-3 rounded-xl border transition-all outline-none"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-password" className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>Password</label>
                    <button type="button" onClick={() => { setIsForgotPassword(true); setError(""); }} className="text-sm transition-colors hover:underline font-medium" style={{ color: "var(--accent)" }}>Lupa password?</button>
                  </div>
                  <div className="relative">
                    <input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Masukkan password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      onFocus={inputFocus} onBlur={inputBlur}
                      className="w-full px-4 py-3 pr-12 rounded-xl border transition-all outline-none"
                      style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                    <button type="button" id="toggle-password-visibility" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors hover:bg-muted" style={{ color: "var(--muted-foreground)" }}>
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && error !== "email_not_confirmed" && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                    style={{ backgroundColor: "rgba(211,47,47,0.08)", color: "var(--destructive)", border: "1px solid rgba(211,47,47,0.2)" }}>
                    <span>⚠</span> {error}
                  </div>
                )}

                {/* Panel email belum dikonfirmasi */}
                {error === "email_not_confirmed" && (
                  <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "rgba(124,166,76,0.06)", border: "1px solid rgba(124,166,76,0.25)" }}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-accent/15">
                        <Mail className="w-5 h-5" style={{ color: "var(--accent)" }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1" style={{ color: "var(--primary)" }}>Email belum dikonfirmasi</p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                          Kami telah mengirimkan link konfirmasi ke <strong className="text-foreground">{unconfirmedEmail}</strong>. Buka email Anda dan klik tautan tersebut untuk mengaktifkan akun.
                        </p>
                      </div>
                    </div>
                    <div className="text-xs p-3 rounded-xl" style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)" }}>
                      <p className="font-medium mb-1" style={{ color: "var(--foreground)" }}>Tidak menemukan email?</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>Periksa folder <strong>Spam</strong> atau <strong>Promosi</strong></li>
                        <li>Pastikan alamat email yang didaftarkan sudah benar</li>
                        <li>Klik tombol di bawah untuk kirim ulang</li>
                      </ul>
                    </div>
                    {resendSuccess && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.25)" }}>
                        <span>✓</span> Email konfirmasi berhasil dikirim ulang! Periksa inbox Anda.
                      </div>
                    )}
                    {resendError && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{ backgroundColor: "rgba(211,47,47,0.08)", color: "var(--destructive)", border: "1px solid rgba(211,47,47,0.2)" }}>
                        <span>⚠</span> {resendError}
                      </div>
                    )}
                    <button
                      type="button"
                      id="resend-confirmation-btn"
                      onClick={handleResendEmail}
                      disabled={resendLoading || resendSuccess}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "var(--accent)", color: "white" }}
                    >
                      {resendLoading ? (
                        <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Mengirim...</>
                      ) : resendSuccess ? (
                        <>✓ Email Terkirim</>
                      ) : (
                        <><RefreshCw className="w-4 h-4" />Kirim Ulang Email Konfirmasi</>
                      )}
                    </button>
                  </div>
                )}

                <button id="login-submit-btn" type="submit" disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))", color: "white", boxShadow: "0 4px 15px rgba(45,80,22,0.3)" }}
                  onMouseEnter={(e) => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}>
                  {isLoading ? (
                    <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Memverifikasi...</>
                  ) : (
                    <><LogIn className="w-5 h-5" />Masuk</>
                  )}
                </button>

                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                  <span className="relative bg-background px-3 text-xs text-muted-foreground uppercase">Atau masuk dengan</span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
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

              <p className="text-center mt-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
                Belum punya akun?{" "}
                <Link id="go-to-register" to="/register" className="font-medium transition-colors hover:underline" style={{ color: "var(--accent)" }}>Daftar sekarang</Link>
              </p>
              <p className="text-center mt-3 text-sm">
                <Link to="/" className="transition-colors hover:underline" style={{ color: "var(--muted-foreground)" }}>← Kembali ke Beranda</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
