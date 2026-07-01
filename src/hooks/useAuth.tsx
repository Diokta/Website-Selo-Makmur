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
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (data: SignUpData) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
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

  // Ambil profil user dari tabel users
  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setProfile(data as UserRow);
  };

  useEffect(() => {
    // Cek sesi yang sudah ada
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Dengarkan perubahan status auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── signIn ────────────────────────────────────────────────

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  // ── signUp ────────────────────────────────────────────────

  const signUp = async ({ name, email, phone, password }: SignUpData) => {
    try {
      // 1. Daftarkan ke Supabase Auth dengan metadata nama & telepon
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/login",
          data: {
            name,
            phone,
          },
        },
      });
      if (error) return { error: error.message };
      if (!data.user) return { error: "Gagal membuat akun." };

      return { error: null };
    } catch (err: any) {
      console.error("signUp runtime error:", err);
      return { error: err?.message || JSON.stringify(err) || "Terjadi kesalahan sistem saat mendaftar." };
    }
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
