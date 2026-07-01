import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { UserRole, UserRow } from "../types/database";

// ── Types ─────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  profile: UserRow | null;
  role: UserRole | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null; emailNotVerified?: boolean }>;
  signUp: (data: SignUpData) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<{ error: string | null }>;
  verifyEmailToken: (token: string) => Promise<{ error: string | null }>;
}

interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// ── Context ───────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserRow | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Safe UUID generator working in non-secure HTTP / older browsers / IP addresses
  const generateUUID = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Ambil profil user dari tabel users
  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setProfile(data as UserRow);
  };

  // Helper to handle sending verification email for OAuth/Google users
  const handleUnverifiedSession = async (currUser: User) => {
    try {
      // 1. Cek apakah sudah ada token aktif di email_verifications
      const { data: verData } = await supabase
        .from("email_verifications")
        .select("id")
        .eq("user_id", currUser.id)
        .is("used_at", null)
        .limit(1);

      if (verData && verData.length > 0) return;

      // 2. Generate token baru
      const token = generateUUID() + "-" + Date.now().toString(36);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      // 3. Simpan token via RPC
      await supabase.rpc("create_verification_token", {
        p_user_id: currUser.id,
        p_email: currUser.email,
        p_token: token,
        p_expires_at: expiresAt,
      });

      // 4. Kirim email
      const verificationUrl = `${window.location.origin}/verify-email?token=${token}`;
      await sendVerificationEmail({
        email: currUser.email!,
        name: currUser.user_metadata?.full_name || currUser.user_metadata?.name || "",
        token,
        verificationUrl,
      });
    } catch (e) {
      console.error("Error in handleUnverifiedSession:", e);
    }
  };

  useEffect(() => {
    // Cek sesi yang sudah ada
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Cek email_verified sebelum set user
        const { data: prof } = await supabase
          .from("users")
          .select("email_verified")
          .eq("id", session.user.id)
          .single();
        if (prof && prof.email_verified === false) {
          // Kirim email konfirmasi jika login lewat Google
          if (session.user.app_metadata?.provider === "google") {
            await handleUnverifiedSession(session.user);
          }
          // Belum verifikasi — paksa sign out, jangan set session
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
        setSession(session);
        setUser(session.user);
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Dengarkan perubahan status auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          // Cek email_verified sebelum set user ke state
          const { data: prof } = await supabase
            .from("users")
            .select("email_verified")
            .eq("id", session.user.id)
            .single();
          if (prof && prof.email_verified === false) {
            // Google OAuth: Kirim email & sign out langsung
            if (session.user.app_metadata?.provider === "google") {
              await handleUnverifiedSession(session.user);
              await supabase.auth.signOut();
              setSession(null);
              setUser(null);
              setProfile(null);
              setLoading(false);
              return;
            }
            // Email biasa: jangan panggil signOut langsung agar tidak race condition dengan signUp
            // Cukup kosongkan session di React state
            setSession(null);
            setUser(null);
            setProfile(null);
            setLoading(false);
            return;
          }
          setSession(session);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── signIn ────────────────────────────────────────────────

  const signIn = async (email: string, password: string): Promise<{ error: string | null; emailNotVerified?: boolean }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Cek error email not confirmed dari Supabase (jika Supabase confirm email aktif)
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return { error: "email_not_verified", emailNotVerified: true };
      }
      return { error: error.message };
    }
    // Cek email_verified di tabel public.users kita sendiri
    if (data.user) {
      const { data: profile } = await supabase
        .from("users")
        .select("email_verified")
        .eq("id", data.user.id)
        .single();
      if (profile && profile.email_verified === false) {
        // Sign out paksa — user belum verifikasi email
        await supabase.auth.signOut();
        return { error: "email_not_verified", emailNotVerified: true };
      }
    }
    return { error: null };
  };

  // ── signUp ────────────────────────────────────────────────

  const signUp = async ({ name, email, phone, password }: SignUpData) => {
    try {
      // 1. Daftarkan ke Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, phone } },
      });
      if (error) return { error: error.message };
      if (!data.user) return { error: "Gagal membuat akun." };

      // 2. Tandai email_verified = false di public.users
      await supabase
        .from("users")
        .update({ email_verified: false })
        .eq("id", data.user.id);

      // 3. Generate token verifikasi unik
      const token = generateUUID() + "-" + Date.now().toString(36);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      // 4. Simpan token via RPC (SECURITY DEFINER — bypass RLS)
      const { error: tokenError } = await supabase.rpc("create_verification_token", {
        p_user_id:   data.user.id,
        p_email:     email,
        p_token:     token,
        p_expires_at: expiresAt,
      });
      if (tokenError) {
        console.error("Gagal simpan token:", tokenError);
        return { error: "Gagal menyiapkan verifikasi email." };
      }

      // 5. Kirim email via Edge Function
      const verificationUrl = `${window.location.origin}/verify-email?token=${token}`;
      const { error: emailErr } = await sendVerificationEmail({ email, name, token, verificationUrl });
      if (emailErr) {
        console.warn("Email gagal terkirim:", emailErr);
      }

      // 6. Sign out agar user tidak langsung masuk (jika Supabase auto-login)
      if (data.session) {
        await supabase.auth.signOut();
      }

      return { error: null };
    } catch (err: any) {
      console.error("signUp runtime error:", err);
      return { error: err?.message || "Terjadi kesalahan sistem saat mendaftar." };
    }
  };

  // ── sendVerificationEmail (panggil Edge Function) ─────────

  const sendVerificationEmail = async ({
    email,
    name,
    token,
    verificationUrl,
  }: {
    email: string;
    name: string;
    token: string;
    verificationUrl: string;
  }): Promise<{ error: string | null }> => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
      const res = await fetch(
        `${supabaseUrl}/functions/v1/send-verification-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ email, name, token, verificationUrl }),
        }
      );
      const json = await res.json();
      if (!res.ok) return { error: json.error || "Gagal kirim email" };
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || "Gagal terhubung ke layanan email" };
    }
  };

  // ── resendConfirmationEmail ───────────────────────────────

  const resendConfirmationEmail = async (email: string): Promise<{ error: string | null }> => {
    // Cari user_id berdasarkan email dari tabel public.users
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (!userData) return { error: "Email ini belum terdaftar di sistem." };

    // Hapus token lama via RPC
    await supabase.rpc("delete_unverified_tokens", { p_email: email });

    // Buat token baru via RPC
    const newToken = generateUUID() + "-" + Date.now().toString(36);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await supabase.rpc("create_verification_token", {
      p_user_id:    userData.id,
      p_email:      email,
      p_token:      newToken,
      p_expires_at: expiresAt,
    });

    const verificationUrl = `${window.location.origin}/verify-email?token=${newToken}`;
    return sendVerificationEmail({ email, name: "", token: newToken, verificationUrl });
  };

  // ── verifyEmailToken ──────────────────────────────────────

  const verifyEmailToken = async (token: string): Promise<{ error: string | null }> => {
    const { data: verData, error: findErr } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("token", token)
      .single();

    if (findErr || !verData) return { error: "Token tidak valid atau sudah kedaluwarsa." };
    if (verData.used_at) return { error: "Token ini sudah pernah digunakan." };
    if (new Date(verData.expires_at) < new Date()) {
      return { error: "Token sudah kedaluwarsa (lebih dari 24 jam). Silakan minta kirim ulang." };
    }

    // Tandai token sebagai sudah digunakan
    await supabase
      .from("email_verifications")
      .update({ used_at: new Date().toISOString() })
      .eq("token", token);

    // Update email_verified = true via RPC (bypass RLS karena user belum login)
    const { error: updateErr } = await supabase.rpc("verify_user_email", {
      p_user_id: verData.user_id,
    });

    if (updateErr) {
      console.error("Update email_verified error:", updateErr);
      return { error: "Gagal memverifikasi akun. Hubungi admin." };
    }

    return { error: null };
  };

  // ── signInWithGoogle ──────────────────────────────────────

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  // ── signOut ───────────────────────────────────────────────

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const role = profile?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        session,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resendConfirmationEmail,
        verifyEmailToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus digunakan di dalam <AuthProvider>");
  return ctx;
}
