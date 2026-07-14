-- =========================================================================
-- MIGRATION: CEK EMAIL TERDAFTAR (SECURITY DEFINER)
-- =========================================================================
-- Jalankan skrip ini di SQL Editor Supabase Dashboard Anda.
-- Ini memungkinkan pengecekan apakah suatu email terdaftar tanpa terkena block RLS.
-- =========================================================================

CREATE OR REPLACE FUNCTION public.check_email_exists(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Berjalan dengan hak akses penuh (bypass RLS)
SET search_path = public -- Keamanan skema pencarian
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users WHERE email = p_email
  );
END;
$$;
