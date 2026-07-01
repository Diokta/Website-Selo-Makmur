// ============================================================
// TypeScript types untuk semua tabel Supabase
// Sesuai dengan supabase_migration.sql
// ============================================================

export type UserRole = "user" | "super_admin";
export type ProductStatus = "Aktif" | "Stok Menipis" | "Habis" | "Menunggu Validasi" | "Ditolak";
export type PaymentStatus = "Belum Bayar" | "Sudah Bayar" | "Dikonfirmasi" | "Gagal";
export type OrderStatus = "Menunggu Pembayaran" | "Dikemas" | "Dikirim" | "Selesai" | "Dibatalkan";
export type FinanceRecordType = "penjualan" | "koreksi" | "bonus";
export type NewsType = "Kegiatan" | "Panen" | "Pelatihan" | "Pengumuman" | "Berita";
export type ContentValueType = "text" | "html" | "json" | "image_url" | "number";
export type AssetKondisi = "Baik" | "Rusak Ringan" | "Rusak Berat" | "Tidak Beroperasi";

// ── Row types (data yang dibaca dari DB) ──────────────────────

export interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: UserRole;
  password_hash: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface EmailVerificationRow {
  id: string;
  user_id: string;
  email: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export interface KelompokTaniRow {
  id: string;
  nama: string;
  ketua: string | null;
  dusun: string | null;
  jumlah_anggota: number;
  luas_lahan_ha: number | null;
  komoditas_utama: string | null;
  tahun_bergabung: number | null;
  kontak: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ProductRow {
  id: string;
  poktan_id: string | null;
  name: string;
  category: string | null;
  description: string | null;
  cultivation_method: string | null;
  price: number;
  unit: string | null;
  stock: number;
  harvest_date: string | null;
  badge: string | null;
  image_url: string | null;
  status: ProductStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string | null;
  // JOIN
  kelompok_tani?: Pick<KelompokTaniRow, "id" | "nama" | "ketua">;
}

export interface ProductVariantRow {
  id: string;
  product_id: string;
  size: string;
  price: number;
  stock: number;
}

export interface ProductFeatureRow {
  id: string;
  product_id: string;
  feature: string;
  sort_order: number;
}

export interface OrderRow {
  id: string;
  order_number: string;
  buyer_id: string | null;
  poktan_id: string | null;
  buyer_name: string;
  buyer_phone: string | null;
  shipping_address: string;
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  payment_method: string | null;
  payment_proof_url: string | null;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  shipping_resi: string | null;
  ordered_at: string;
  updated_at: string | null;
  // JOIN
  order_items?: OrderItemRow[];
  kelompok_tani?: Pick<KelompokTaniRow, "id" | "nama">;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price_per_unit: number;
  subtotal: number;
}

export interface FinanceRecordRow {
  id: string;
  order_id: string | null;
  poktan_id: string | null;
  period_year: number;
  period_month: number;
  gross_revenue: number;
  gapoktan_fee_pct: number;
  gapoktan_fee_amount: number;
  poktan_share_amount: number;
  record_type: FinanceRecordType;
  created_at: string;
}

export interface NewsGalleryRow {
  id: string;
  poktan_id: string | null;
  title: string;
  description: string | null;
  content: string | null;
  category: string | null;
  type: NewsType | null;
  event_date: string | null;
  author: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
  // JOIN
  gallery_images?: GalleryImageRow[];
  kelompok_tani?: Pick<KelompokTaniRow, "id" | "nama">;
}

export interface GalleryImageRow {
  id: string;
  news_gallery_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface WebsiteContentRow {
  id: string;
  section_key: string;
  label: string | null;
  value: string | null;
  value_type: ContentValueType;
  updated_at: string | null;
  updated_by: string | null;
}

export interface BannerRow {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CartItemRow {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  added_at: string;
  // JOIN
  products?: Pick<ProductRow, "id" | "name" | "price" | "unit" | "image_url" | "stock">;
  product_variants?: Pick<ProductVariantRow, "id" | "size" | "price">;
}

export interface GapoktanAssetRow {
  id: string;
  nama: string;
  deskripsi: string | null;
  kondisi: AssetKondisi;
  tahun_perolehan: number | null;
  image_url: string | null;
  kategori: string | null;
}

// ── Insert types (data yang dikirim ke DB) ─────────────────────

export type UserInsert = Omit<UserRow, "id" | "created_at" | "updated_at">;
export type KelompokTaniInsert = Omit<KelompokTaniRow, "id" | "created_at" | "updated_at">;
export type ProductInsert = Omit<ProductRow, "id" | "created_at" | "updated_at" | "kelompok_tani">;
export type OrderInsert = Omit<OrderRow, "id" | "ordered_at" | "updated_at" | "order_items" | "kelompok_tani">;
export type OrderItemInsert = Omit<OrderItemRow, "id">;
export type NewsGalleryInsert = Omit<NewsGalleryRow, "id" | "created_at" | "updated_at" | "gallery_images" | "kelompok_tani">;
export type CartItemInsert = Omit<CartItemRow, "id" | "added_at" | "products" | "product_variants">;
export type GapoktanAssetInsert = Omit<GapoktanAssetRow, "id">;

// ── Database type untuk Supabase client ───────────────────────

export type Database = {
  public: {
    Tables: {
      users: { Row: UserRow; Insert: UserInsert; Update: Partial<UserInsert> };
      kelompok_tani: { Row: KelompokTaniRow; Insert: KelompokTaniInsert; Update: Partial<KelompokTaniInsert> };
      products: { Row: ProductRow; Insert: ProductInsert; Update: Partial<ProductInsert> };
      product_variants: { Row: ProductVariantRow; Insert: Omit<ProductVariantRow, "id">; Update: Partial<Omit<ProductVariantRow, "id">> };
      product_features: { Row: ProductFeatureRow; Insert: Omit<ProductFeatureRow, "id">; Update: Partial<Omit<ProductFeatureRow, "id">> };
      orders: { Row: OrderRow; Insert: OrderInsert; Update: Partial<OrderInsert> };
      order_items: { Row: OrderItemRow; Insert: OrderItemInsert; Update: Partial<OrderItemInsert> };
      finance_records: { Row: FinanceRecordRow; Insert: Omit<FinanceRecordRow, "id" | "created_at">; Update: Partial<Omit<FinanceRecordRow, "id" | "created_at">> };
      news_gallery: { Row: NewsGalleryRow; Insert: NewsGalleryInsert; Update: Partial<NewsGalleryInsert> };
      gallery_images: { Row: GalleryImageRow; Insert: Omit<GalleryImageRow, "id">; Update: Partial<Omit<GalleryImageRow, "id">> };
      website_content: { Row: WebsiteContentRow; Insert: Omit<WebsiteContentRow, "id">; Update: Partial<Omit<WebsiteContentRow, "id">> };
      banners: { Row: BannerRow; Insert: Omit<BannerRow, "id" | "created_at">; Update: Partial<Omit<BannerRow, "id" | "created_at">> };
      cart_items: { Row: CartItemRow; Insert: CartItemInsert; Update: Partial<CartItemInsert> };
      gapoktan_assets: { Row: GapoktanAssetRow; Insert: GapoktanAssetInsert; Update: Partial<GapoktanAssetInsert> };
      email_verifications: {
        Row: EmailVerificationRow;
        Insert: Omit<EmailVerificationRow, "id" | "created_at" | "used_at">;
        Update: Partial<Pick<EmailVerificationRow, "used_at">>;
      };
    };
  };
};
