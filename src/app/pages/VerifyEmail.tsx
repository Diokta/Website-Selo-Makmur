import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { CheckCircle2, XCircle, Loader2, Sprout, Mail } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useWebsiteContent } from "../../hooks/useWebsiteContent";

export function VerifyEmail() {
  const { getContent } = useWebsiteContent();
  const brandName = getContent("identity.name", "Gapoktan Selo Makmur");
  const logoUrl   = getContent("identity.logo", "");
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmailToken } = useAuth();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Token verifikasi tidak ditemukan di URL.");
      return;
    }

    verifyEmailToken(token).then(({ error }) => {
      if (error) {
        setStatus("error");
        setMessage(error);
      } else {
        setStatus("success");
        setMessage("Email Anda berhasil diverifikasi! Akun Anda sekarang aktif.");
      }
    });
  }, []);

  // Countdown redirect ke login setelah sukses
  useEffect(() => {
    if (status !== "success") return;
    if (countdown <= 0) { navigate("/login"); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #f4f7f0 0%, #e8f0dc 100%)" }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {logoUrl ? (
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-0.5 border-2 shadow-md" style={{ borderColor: "var(--accent)" }}>
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-md"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))", borderColor: "var(--accent)" }}>
              <Sprout className="w-6 h-6 text-white" />
            </div>
          )}
          <span className="text-lg font-medium" style={{ color: "var(--primary)" }}>{brandName}</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Loading */}
          {status === "loading" && (
            <div className="p-10 flex flex-col items-center gap-5 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}>
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--primary)" }}>
                  Memverifikasi Email...
                </h2>
                <p style={{ color: "var(--muted-foreground)" }}>
                  Mohon tunggu, kami sedang memproses verifikasi akun Anda.
                </p>
              </div>
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div className="p-10 flex flex-col items-center gap-5 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.3)" }}>
                <CheckCircle2 className="w-10 h-10" style={{ color: "#16a34a" }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--primary)" }}>
                  Verifikasi Berhasil! 🎉
                </h2>
                <p className="text-base mb-4" style={{ color: "var(--muted-foreground)" }}>
                  {message}
                </p>
                <div className="p-3 rounded-xl text-sm mb-4"
                  style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)" }}>
                  Anda akan diarahkan ke halaman login dalam{" "}
                  <strong style={{ color: "var(--accent)" }}>{countdown} detik</strong>
                </div>
              </div>
              <button
                id="go-to-login-verified"
                onClick={() => navigate("/login")}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))", boxShadow: "0 4px 15px rgba(45,80,22,0.3)" }}
              >
                Masuk Sekarang
              </button>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="p-10 flex flex-col items-center gap-5 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "rgba(211,47,47,0.08)", border: "2px solid rgba(211,47,47,0.2)" }}>
                <XCircle className="w-10 h-10" style={{ color: "var(--destructive)" }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--destructive)" }}>
                  Verifikasi Gagal
                </h2>
                <p className="text-base mb-4" style={{ color: "var(--muted-foreground)" }}>
                  {message}
                </p>
                <div className="p-4 rounded-xl text-left text-sm mb-4"
                  style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)" }}>
                  <p className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>Yang bisa Anda lakukan:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Pastikan link diklik dalam <strong>24 jam</strong> setelah email diterima</li>
                    <li>Coba <strong>login</strong> dan gunakan tombol "Kirim Ulang Email Konfirmasi"</li>
                    <li>Jika masalah berlanjut, hubungi admin</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <button
                  id="go-to-login-error"
                  onClick={() => navigate("/login")}
                  className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))", boxShadow: "0 4px 15px rgba(45,80,22,0.3)" }}
                >
                  Ke Halaman Login
                </button>
                <Link
                  to="/register"
                  id="go-to-register-error"
                  className="w-full py-3 rounded-xl font-medium text-center border transition-all duration-200 hover:opacity-80"
                  style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                >
                  Daftar Akun Baru
                </Link>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-10 pb-6 text-center border-t" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-center gap-2 pt-4">
              <Mail className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Email dikirim oleh sistem Gapoktan Selo Makmur
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-4 text-sm">
          <Link to="/" className="transition-colors hover:underline" style={{ color: "var(--muted-foreground)" }}>
            ← Kembali ke Beranda
          </Link>
        </p>
      </div>
    </div>
  );
}
