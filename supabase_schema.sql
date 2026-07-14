-- =========================================================================
-- SKEMA DATABASE LENGKAP SUPABASE - GAPOKTAN SELO MAKMUR
-- =========================================================================
-- Jalankan skrip ini di SQL Editor Supabase Dashboard Anda.
-- Skrip ini akan membuat tabel, relasi, fungsi RPC, trigger, dan kebijakan RLS.
-- =========================================================================

-- Aktifkan ekstensi UUID jika belum ada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. PEMBUATAN TABEL ───────────────────────────────────────────────────

-- Tabel: users (Profil pengguna publik & admin, tersambung ke auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'super_admin')),
    password_hash TEXT DEFAULT '',
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel: kelompok_tani (Data Kelompok Tani anggota Gapoktan)
CREATE TABLE IF NOT EXISTS public.kelompok_tani (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    ketua TEXT,
    dusun TEXT,
    jumlah_anggota INTEGER DEFAULT 0 NOT NULL,
    luas_lahan_ha NUMERIC,
    komoditas_utama TEXT,
    tahun_bergabung INTEGER,
    kontak TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel: products (Katalog Produk Pertanian)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poktan_id UUID REFERENCES public.kelompok_tani(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    cultivation_method TEXT,
    price NUMERIC DEFAULT 0 NOT NULL,
    unit TEXT,
    stock INTEGER DEFAULT 0 NOT NULL,
    harvest_date DATE,
    badge TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'Menunggu Validasi' CHECK (status IN ('Aktif', 'Stok Menipis', 'Habis', 'Menunggu Validasi', 'Ditolak')),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel: product_variants (Varian ukuran/kemasan produk)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    size TEXT NOT NULL,
    price NUMERIC DEFAULT 0 NOT NULL,
    stock INTEGER DEFAULT 0 NOT NULL
);

-- Tabel: product_features (Keunggulan produk)
CREATE TABLE IF NOT EXISTS public.product_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    feature TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL
);

-- Tabel: orders (Transaksi pesanan e-commerce)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    buyer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    poktan_id UUID REFERENCES public.kelompok_tani(id) ON DELETE SET NULL,
    buyer_name TEXT NOT NULL,
    buyer_phone TEXT,
    shipping_address TEXT NOT NULL,
    subtotal NUMERIC DEFAULT 0 NOT NULL,
    shipping_cost NUMERIC DEFAULT 0 NOT NULL,
    total_amount NUMERIC DEFAULT 0 NOT NULL,
    payment_method TEXT,
    payment_proof_url TEXT,
    payment_status TEXT DEFAULT 'Belum Bayar' CHECK (payment_status IN ('Belum Bayar', 'Sudah Bayar', 'Dikonfirmasi', 'Gagal')),
    order_status TEXT DEFAULT 'Menunggu Pembayaran' CHECK (order_status IN ('Menunggu Pembayaran', 'Dikemas', 'Dikirim', 'Selesai', 'Dibatalkan')),
    shipping_resi TEXT,
    ordered_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel: order_items (Detail barang belanjaan dalam pesanan)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    price_per_unit NUMERIC DEFAULT 0 NOT NULL,
    subtotal NUMERIC DEFAULT 0 NOT NULL
);

-- Tabel: finance_records (Pencatatan keuangan & bagi hasil Gapoktan/Poktan)
CREATE TABLE IF NOT EXISTS public.finance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    poktan_id UUID REFERENCES public.kelompok_tani(id) ON DELETE SET NULL,
    period_year INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    gross_revenue NUMERIC DEFAULT 0 NOT NULL,
    gapoktan_fee_pct NUMERIC DEFAULT 0 NOT NULL,
    gapoktan_fee_amount NUMERIC DEFAULT 0 NOT NULL,
    poktan_share_amount NUMERIC DEFAULT 0 NOT NULL,
    record_type TEXT DEFAULT 'penjualan' CHECK (record_type IN ('penjualan', 'koreksi', 'bonus')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tabel: news_gallery (Berita, pengumuman, dan galeri kegiatan)
CREATE TABLE IF NOT EXISTS public.news_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poktan_id UUID REFERENCES public.kelompok_tani(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    category TEXT,
    type TEXT CHECK (type IN ('Kegiatan', 'Panen', 'Pelatihan', 'Pengumuman', 'Berita')),
    event_date DATE,
    author TEXT NOT NULL,
    is_published BOOLEAN DEFAULT false NOT NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel: gallery_images (Gambar pendukung berita/kegiatan)
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    news_gallery_id UUID REFERENCES public.news_gallery(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL
);

-- Tabel: website_content (Konten dinamis website: Tentang, Kontak, Visi Misi, dll)
CREATE TABLE IF NOT EXISTS public.website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT NOT NULL UNIQUE,
    label TEXT,
    value TEXT,
    value_type TEXT DEFAULT 'text' CHECK (value_type IN ('text', 'html', 'json', 'image_url', 'number')),
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Tabel: banners (Carousel promosi slider di halaman utama)
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    subtitle TEXT,
    image_url TEXT,
    cta_text TEXT,
    cta_link TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tabel: cart_items (Keranjang belanja e-commerce pengguna)
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 NOT NULL,
    added_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_user_product_variant UNIQUE (user_id, product_id, variant_id)
);

-- Tabel: gapoktan_assets (Daftar aset mesin/fasilitas pertanian)
CREATE TABLE IF NOT EXISTS public.gapoktan_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    deskripsi TEXT,
    kondisi TEXT DEFAULT 'Baik' CHECK (kondisi IN ('Baik', 'Rusak Ringan', 'Rusak Berat', 'Tidak Beroperasi')),
    tahun_perolehan INTEGER,
    image_url TEXT,
    kategori TEXT
);

-- Tabel: email_verifications (Penyimpanan token verifikasi email)
CREATE TABLE IF NOT EXISTS public.email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tabel: password_resets (Penyimpanan token pemulihan/reset password)
CREATE TABLE IF NOT EXISTS public.password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ── 2. HELPER FUNCTIONS & TRIGGERS ───────────────────────────────────────

-- Helper: Cek apakah user yang login memiliki role 'super_admin'
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger Function: Sinkronisasi data user dari auth.users ke public.users saat registrasi
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, phone, role, email_verified, password_hash)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', ''),
    new.email,
    new.raw_user_meta_data->>'phone',
    'user', -- Default role baru terdaftar
    false,  -- email_verified diset false sampai diverifikasi lewat link email
    ''
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Pasang Trigger handle_new_user di auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger Function: Menghapus data di auth.users otomatis jika data di public.users dihapus
CREATE OR REPLACE FUNCTION public.handle_delete_user_from_auth()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = auth, public;

-- Pasang Trigger handle_delete_user_from_auth di public.users
CREATE OR REPLACE TRIGGER tr_on_public_user_deleted
  AFTER DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_delete_user_from_auth();

-- ── 3. RPC FUNCTIONS (DIGUNAKAN OLEH APLIKASI / FRONTEND) ────────────────

-- RPC: create_verification_token (Membuat token verifikasi baru)
CREATE OR REPLACE FUNCTION public.create_verification_token(
  p_user_id UUID,
  p_email TEXT,
  p_token TEXT,
  p_expires_at TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.email_verifications (user_id, email, token, expires_at)
  VALUES (p_user_id, p_email, p_token, p_expires_at);
END;
$$;

-- RPC: delete_unverified_tokens (Menghapus token verifikasi yang belum terpakai milik email tertentu)
CREATE OR REPLACE FUNCTION public.delete_unverified_tokens(
  p_email TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.email_verifications
  WHERE email = p_email AND used_at IS NULL;
END;
$$;

-- RPC: verify_user_email (Menandai status verifikasi email user menjadi true)
CREATE OR REPLACE FUNCTION public.verify_user_email(
  p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET email_verified = true
  WHERE id = p_user_id;
END;
$$;

-- RPC: check_email_exists (Memeriksa keberadaan email terdaftar tanpa kena blokir RLS)
CREATE OR REPLACE FUNCTION public.check_email_exists(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users WHERE email = p_email
  );
END;
$$;

-- RPC: create_reset_token (Membuat token reset password baru)
CREATE OR REPLACE FUNCTION public.create_reset_token(
  p_user_id UUID,
  p_email TEXT,
  p_token TEXT,
  p_expires_at TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.password_resets (user_id, email, token, expires_at)
  VALUES (p_user_id, p_email, p_token, p_expires_at);
END;
$$;

-- RPC: delete_unverified_reset_tokens (Menghapus token pemulihan lama yang belum digunakan)
CREATE OR REPLACE FUNCTION public.delete_unverified_reset_tokens(
  p_email TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.password_resets
  WHERE email = p_email AND used_at IS NULL;
END;
$$;

-- RPC: request_password_reset (Mengamankan token reset dan info pengguna untuk alur lupa password tanpa memicu RLS)
CREATE OR REPLACE FUNCTION public.request_password_reset(
  p_email TEXT
)
RETURNS TABLE (
  r_token TEXT,
  r_name TEXT,
  r_user_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id UUID;
  v_name TEXT;
  v_token TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- 1. Cari user berdasarkan email (SECURITY DEFINER membypass RLS)
  SELECT id, name INTO v_user_id, v_name
  FROM public.users
  WHERE email = p_email;

  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  -- 2. Hapus token pemulihan lama
  DELETE FROM public.password_resets
  WHERE email = p_email AND used_at IS NULL;

  -- 3. Generate token baru
  v_token := encode(gen_random_bytes(16), 'hex') || '-' || to_hex(extract(epoch from now())::bigint);
  v_expires_at := now() + interval '24 hours';

  -- 4. Simpan token
  INSERT INTO public.password_resets (user_id, email, token, expires_at)
  VALUES (v_user_id, p_email, v_token, v_expires_at);

  -- 5. Kembalikan data
  r_token := v_token;
  r_name := v_name;
  r_user_id := v_user_id;
  RETURN NEXT;
END;
$$;

-- RPC: reset_password_with_token (Memvalidasi token kustom dan mengupdate password di auth.users)
CREATE OR REPLACE FUNCTION public.reset_password_with_token(
  p_token TEXT,
  p_new_password TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
BEGIN
  -- 1. Cari token di password_resets
  SELECT user_id, email INTO v_user_id, v_email
  FROM public.password_resets
  WHERE token = p_token
    AND used_at IS NULL
    AND expires_at > now();

  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- 2. Tandai token sebagai sudah digunakan
  UPDATE public.password_resets
  SET used_at = now()
  WHERE token = p_token;

  -- 3. Hapus token pemulihan lain yang belum digunakan milik email ini
  DELETE FROM public.password_resets
  WHERE email = v_email AND used_at IS NULL;

  -- 4. Update password di auth.users menggunakan bcrypt crypt
  UPDATE auth.users
  SET encrypted_password = crypt(p_new_password, gen_salt('bf')),
      updated_at = now()
  WHERE id = v_user_id;

  RETURN TRUE;
END;
$$;

-- ── 4. ROW LEVEL SECURITY (RLS) POLICIES ─────────────────────────────────

-- Aktifkan RLS di semua tabel
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kelompok_tani ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gapoktan_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

-- Kebijakan: public.users
CREATE POLICY "Users: read self or admin" ON public.users FOR SELECT USING (auth.uid() = id OR public.is_super_admin());
CREATE POLICY "Users: update self or admin" ON public.users FOR UPDATE USING (auth.uid() = id OR public.is_super_admin());
CREATE POLICY "Users: delete self or admin" ON public.users FOR DELETE USING (auth.uid() = id OR public.is_super_admin());
CREATE POLICY "Users: allow insert for anyone" ON public.users FOR INSERT WITH CHECK (true);

-- Kebijakan: public.kelompok_tani
CREATE POLICY "Poktan: read anyone" ON public.kelompok_tani FOR SELECT USING (true);
CREATE POLICY "Poktan: write admin" ON public.kelompok_tani FOR ALL USING (public.is_super_admin());

-- Kebijakan: public.products
CREATE POLICY "Products: read anyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products: write admin" ON public.products FOR ALL USING (public.is_super_admin());

-- Kebijakan: public.product_variants
CREATE POLICY "Variants: read anyone" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Variants: write admin" ON public.product_variants FOR ALL USING (public.is_super_admin());

-- Kebijakan: public.product_features
CREATE POLICY "Features: read anyone" ON public.product_features FOR SELECT USING (true);
CREATE POLICY "Features: write admin" ON public.product_features FOR ALL USING (public.is_super_admin());

-- Kebijakan: public.orders
CREATE POLICY "Orders: read self or admin" ON public.orders FOR SELECT USING (auth.uid() = buyer_id OR public.is_super_admin());
CREATE POLICY "Orders: insert anyone" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders: write admin" ON public.orders FOR ALL USING (public.is_super_admin());

-- Kebijakan: public.order_items
CREATE POLICY "OrderItems: read self or admin" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.buyer_id = auth.uid() OR public.is_super_admin()))
);
CREATE POLICY "OrderItems: insert anyone" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "OrderItems: write admin" ON public.order_items FOR ALL USING (public.is_super_admin());

-- Kebijakan: public.finance_records
CREATE POLICY "Finance: write admin" ON public.finance_records FOR ALL USING (public.is_super_admin());

-- Kebijakan: public.news_gallery
CREATE POLICY "News: read anyone" ON public.news_gallery FOR SELECT USING (true);
CREATE POLICY "News: write admin" ON public.news_gallery FOR ALL USING (public.is_super_admin());

-- Kebijakan: public.gallery_images
CREATE POLICY "Gallery: read anyone" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Gallery: write admin" ON public.gallery_images FOR ALL USING (public.is_super_admin());

-- Kebijakan: public.website_content
CREATE POLICY "Content: read anyone" ON public.website_content FOR SELECT USING (true);
CREATE POLICY "Content: write admin" ON public.website_content FOR ALL USING (public.is_super_admin());

-- Kebijakan: public.banners
CREATE POLICY "Banners: read anyone" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Banners: write admin" ON public.banners FOR ALL USING (public.is_super_admin());

-- Kebijakan: public.cart_items
CREATE POLICY "Cart: read self" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Cart: insert self" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Cart: update self" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Cart: delete self" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- Kebijakan: public.gapoktan_assets
CREATE POLICY "Assets: read anyone" ON public.gapoktan_assets FOR SELECT USING (true);
CREATE POLICY "Assets: write admin" ON public.gapoktan_assets FOR ALL USING (public.is_super_admin());

-- Kebijakan: public.email_verifications
CREATE POLICY "Verifications: select token" ON public.email_verifications FOR SELECT USING (true);
CREATE POLICY "Verifications: update token" ON public.email_verifications FOR UPDATE USING (true);
CREATE POLICY "Verifications: delete token" ON public.email_verifications FOR DELETE USING (true);
CREATE POLICY "Verifications: insert token" ON public.email_verifications FOR INSERT WITH CHECK (true);

-- Kebijakan: public.password_resets
CREATE POLICY "Resets: select token" ON public.password_resets FOR SELECT USING (true);
