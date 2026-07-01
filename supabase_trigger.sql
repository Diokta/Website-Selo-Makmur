-- =========================================================================
-- TRIGGER UNTUK MENGHAPUS USER SUPABASE AUTH SAAT DATA DI TABLE USERS DIHAPUS
-- =========================================================================
-- Jalankan skrip ini di SQL Editor Supabase Dashboard Anda.
-- =========================================================================

-- 1. Buat fungsi trigger untuk menghapus auth.users secara otomatis
CREATE OR REPLACE FUNCTION public.handle_delete_user_from_auth()
RETURNS TRIGGER 
SECURITY DEFINER -- Berjalan dengan hak akses penuh admin (bypass RLS)
SET search_path = auth, public -- Menetapkan schema pencarian aman
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 2. Pasang trigger pada tabel public.users
CREATE OR REPLACE TRIGGER tr_on_public_user_deleted
  AFTER DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_delete_user_from_auth();
