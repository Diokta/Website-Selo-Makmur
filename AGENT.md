# AGENT.md — Panduan Agen AI untuk Proyek Gapoktan Selo Makmur

Dokumen ini memberikan konteks lengkap bagi agen AI yang bekerja di repositori ini.

## Gambaran Proyek

Website resmi **Gabungan Kelompok Tani (Gapoktan) Selo Makmur** — platform digital pertanian yang mencakup portal publik, e-commerce produk tani, dan sistem dashboard admin dua tingkat.

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS v4 + React Router v7 + Recharts

## Identitas & Branding

| Atribut | Nilai |
|---|---|
| Nama | Gapoktan Selo Makmur |
| Alamat | Jl. Letda Abdul Jalil, Salakan, Selomartani, Kalasan, Sleman, DIY 55571 |
| Tema visual | Alam pertanian — hijau gelap, hijau terang, tanah |
| Primary color | `#2d5016` (hijau gelap) |
| Accent color | `#7ca64c` (hijau sedang) |
| Secondary color | `#e8f5e9` (hijau sangat terang — hanya untuk latar, bukan teks putih) |

## Arsitektur Halaman

### Portal Publik (`/`)
| Route | Halaman | Deskripsi |
|---|---|---|
| `/` | Home | Hero, statistik, carousel produk, berita |
| `/about` | About | Sejarah, visi misi, struktur organisasi |
| `/shop` | Shop | Grid produk, filter kategori, pencarian |
| `/product/:id` | ProductDetail | Detail, varian kemasan, keunggulan |
| `/cart` | Cart | Keranjang belanja |
| `/checkout` | Checkout | Form & ringkasan pesanan |
| `/dashboard` | Dashboard | Akun & riwayat transaksi pengguna |
| `/news` | News | Berita & kegiatan |
| `/reports` | Reports | Laporan penjualan publik |
| `/contact` | Contact | Form kontak & info sekretariat |

### Admin Poktan (`/admin-poktan/*`)
Untuk ketua/pengurus kelompok tani tingkat dusun/desa.

| Route | Konten |
|---|---|
| `/admin-poktan` | Dashboard ringkasan poktan |
| `/admin-poktan/products` | Manajemen produk & stok |
| `/admin-poktan/sales` | Laporan penjualan poktan |
| `/admin-poktan/gallery` | Galeri & unggah berita |

### Super Admin Gapoktan (`/admin-gapoktan/*`)
Untuk pengurus pusat Gapoktan — akses penuh ke semua data.

| Route | Konten |
|---|---|
| `/admin-gapoktan` | Pusat kontrol utama + grafik |
| `/admin-gapoktan/validation` | Validasi & approval produk baru |
| `/admin-gapoktan/orders` | Manajemen semua pesanan |
| `/admin-gapoktan/users` | Manajemen anggota poktan |
| `/admin-gapoktan/finance` | Laporan keuangan & bagi hasil |
| `/admin-gapoktan/content` | Kelola konten website |

## Model Data Produk

Field produk yang harus konsisten antara form admin dan tampilan publik:

```ts
type Product = {
  name: string           // Tampil: toko, detail, admin
  category: string       // Tampil: toko (filter), detail, admin
  poktan: string         // Tampil: toko, detail (otomatis dari akun)
  description: string    // Tampil: halaman detail
  cultivation: string    // Tampil: detail ("Metode Budidaya")
  harvestDate: string    // Tampil: admin tabel
  price: number          // Tampil: toko, admin
  unit: string           // Tampil: toko, admin
  stock: number          // Tampil: toko (badge "Stok Terbatas" jika < 50)
  badge?: string         // Tampil: toko ("Terlaris" | "Baru" | "Populer")
  variants?: { size: string; price: number; stock: number }[]  // Tampil: detail
  features?: string[]    // Tampil: detail ("Keunggulan Produk")
  image: string          // Tampil: semua
  status: string         // Tampil: admin ("Aktif" | "Stok Menipis" | "Habis" | "Menunggu Validasi")
}
```

## Aturan Desain Penting

### Kontras Warna
`--secondary` (`#e8f5e9`) adalah hijau **sangat terang** — tidak boleh digunakan sebagai background dengan teks putih karena rasio kontras gagal WCAG. Selalu gunakan:
- `--accent` (`#7ca64c`) untuk CTA & badge menengah
- `--primary` (`#2d5016`) untuk elemen penting

### Status Badge
Gunakan variabel CSS status, bukan warna hardcode:
- `var(--status-success)` → Aktif / Selesai
- `var(--status-pending)` → Stok Menipis / Menunggu
- `var(--status-error)` → Habis / Ditolak
- `var(--status-info)` → Menunggu Validasi / Dikemas
- `var(--accent)` → Dikirim

### Responsivitas
Semua halaman mobile-first. Pola breakpoint standar:
- Default: stack vertikal, sidebar tersembunyi
- `sm:` (≥640px): 2 kolom, font lebih besar
- `lg:` (≥1024px): sidebar static, nav desktop
- `xl:` (≥1280px): 4 kolom grid toko

## State & Data

Saat ini **semua data adalah mock statis** di dalam komponen. Tidak ada API atau database. Jika diminta integrasi backend, rekomendasikan Supabase sesuai stack yang sudah ada di dependencies (`@supabase/supabase-js` belum diinstall).

## File Konfigurasi Kritis

| File | Fungsi | Jangan diubah |
|---|---|---|
| `vite.config.ts` | Plugin figma-virtual-modules | Plugin `figma-virtual-modules` |
| `src/styles/index.css` | Import semua CSS + kontrak token | Struktur `@theme inline` |
| `src/styles/theme.css` | Definisi semua CSS custom properties | Nama token yang ada |
| `__figma__entrypoint__.ts` | Entry khusus Figma Make | Seluruh file |

## Workflow Pengembangan

1. Jalankan `pnpm dev` untuk dev server
2. Edit file `.tsx` di `src/app/`
3. Hot reload otomatis
4. Jalankan `pnpm build` untuk verifikasi tidak ada TypeScript error sebelum commit
