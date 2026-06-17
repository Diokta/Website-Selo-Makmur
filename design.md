# Design Document — Website Gapoktan Sukamaju

Dokumen ini merangkum seluruh keputusan desain, token warna, tipografi, komponen, struktur halaman, dan pola navigasi yang digunakan pada website Gabungan Kelompok Tani (Gapoktan) Sukamaju.

---

## 1. Identitas & Tema

| Atribut | Nilai |
|---|---|
| Nama Organisasi | Gapoktan Sukamaju |
| Lokasi | Desa Sukamaju, Cisarua, Bogor |
| Tagline | Bersama membangun pertanian berkelanjutan |
| Tema Visual | Alam pertanian — hijau gelap, hijau terang, tanah |
| Logo | Ikon `Sprout` (lucide-react) dalam lingkaran hijau primer |

---

## 2. Token Warna (CSS Custom Properties)

Semua token didefinisikan di `src/styles/theme.css` dalam `:root`.

### Palet Utama

| Token | Nilai | Kegunaan |
|---|---|---|
| `--primary` | `#2d5016` | Warna utama — hijau gelap, judul, tombol primer, sidebar |
| `--secondary` | `#e8f5e9` | Latar belakang lembut — hover state, seksi info |
| `--accent` | `#7ca64c` | Aksen — CTA kedua, badge, link aktif |
| `--background` | `#f9faf7` | Latar belakang halaman — putih kehijauan |
| `--foreground` | `#1a2e1a` | Teks utama |

### Palet Pendukung

| Token | Nilai | Kegunaan |
|---|---|---|
| `--muted` | `#e8ede0` | Latar elemen netral, tombol batal |
| `--muted-foreground` | `#5a6b4d` | Teks sekunder, placeholder |
| `--card` | `#ffffff` | Kartu produk, panel |
| `--border` | `rgba(45,80,22,0.15)` | Garis pemisah — transparan hijau |
| `--input-background` | `#f5f8f3` | Latar input form |
| `--destructive` | `#d32f2f` | Peringatan, hapus, error |
| `--ring` | `#7ca64c` | Focus ring elemen interaktif |

### Sidebar (Admin)

| Token | Nilai |
|---|---|
| `--sidebar` | `#2d5016` |
| `--sidebar-accent` | `#3d6b1f` (item aktif) |
| `--sidebar-border` | `#1a3a0d` |
| `--sidebar-foreground` | `#ffffff` |

### Footer

| Token | Nilai |
|---|---|
| `--footer-background` | `#1b3a0f` (hijau sangat gelap) |

### Status Badge

| Token | Warna | Label |
|---|---|---|
| `--status-success` | `#4caf50` | Aktif |
| `--status-pending` | `#fb8c00` | Stok Menipis / Menunggu |
| `--status-error` | `#d32f2f` | Habis |
| `--status-info` | `#2196f3` | Menunggu Validasi |
| `--status-warning` | `#ffa726` | Peringatan |

### Palet Chart (Recharts)

Lima gradasi hijau dari gelap ke terang:
`#2d5016` → `#5a8f3a` → `#7ca64c` → `#9dc183` → `#b8d4a8`

---

## 3. Tipografi

| Elemen | Ukuran | Weight |
|---|---|---|
| `h1` | `text-2xl` (2rem) | 500 (medium) |
| `h2` | `text-xl` (1.25rem) | 500 |
| `h3` | `text-lg` (1.125rem) | 500 |
| `h4` | `text-base` (1rem) | 500 |
| `label` | `text-base` | 500 |
| `button` | `text-base` | 500 |
| `input` | `text-base` | 400 (normal) |
| Body | `16px` base | 400 |

> Catatan: Tidak menggunakan custom font family — mengandalkan font sistem. Jika menggunakan Tailwind untuk override ukuran font, class seperti `text-lg`, `text-4xl` dll. tetap valid.

---

## 4. Spacing & Radius

| Properti | Nilai |
|---|---|
| `--radius` | `0.75rem` (12px) |
| `--radius-sm` | `0.5rem` (8px) |
| `--radius-md` | `0.625rem` (10px) |
| `--radius-lg` | `0.75rem` (12px) |
| `--radius-xl` | `1rem` (16px) |
| Padding halaman | `px-4 sm:px-6 lg:px-8` |
| Max-width konten | `max-w-7xl mx-auto` |
| Gap grid kartu | `gap-6` |
| Padding kartu | `p-4 sm:p-5` atau `p-6` |

---

## 5. Komponen Desain

### 5.1 Header / Navbar

- **Posisi**: `sticky top-0 z-50`, latar putih, shadow-md
- **Tinggi**: `h-16 sm:h-20`
- **Logo**: Lingkaran `bg-primary` + ikon `Sprout` putih + teks "Gapoktan Sukamaju"
- **Nav desktop**: Link horizontal, aktif = `text-accent`, hover = `text-accent`
- **Nav mobile**: Hamburger menu, drawer vertikal fullwidth, item aktif = `bg-accent text-white`
- **Icon aksi**: Keranjang (badge counter `bg-accent`), icon User

### 5.2 Hero Section

- Gradient: `from-primary to-accent` (diagonal)
- Teks judul besar putih di atas gambar
- Tombol CTA utama: `bg-accent` putih
- Tinggi: `min-h-[70vh]` atau serupa

### 5.3 Kartu Produk (Shop)

- Sudut: `rounded-xl`
- Shadow: `shadow-md` → `shadow-xl` (hover)
- Gambar: `h-48 sm:h-52 object-cover`, scale-105 saat hover
- Badge posisi: `absolute top-3 right-3`, `bg-accent` rounded-full
- "Stok Terbatas": `absolute top-3 left-3`, `bg-destructive`
- Harga: `text-accent` (ukuran besar)
- Tombol keranjang: `bg-primary` icon only, `rounded-lg`

### 5.4 Tombol

| Varian | Style |
|---|---|
| Primer | `bg-primary text-white hover:bg-primary/90 rounded-lg` |
| Aksen | `bg-accent text-white hover:bg-accent/90 rounded-lg` |
| Muted / Batal | `bg-muted text-foreground hover:bg-muted/80 rounded-lg` |
| Outline | `border-2 border-border hover:border-accent` |
| Destructive | `text-destructive` (ikon saja) |

### 5.5 Form Input

- Padding: `px-4 py-3`
- Latar: `bg-input-background` (`#f5f8f3`)
- Border: `border border-border`
- Focus: `focus:outline-none focus:ring-2 focus:ring-primary`
- Sudut: `rounded-lg`
- Textarea: `resize-none`

### 5.6 Tabel Admin

- Header: `background-color: var(--primary)`, teks putih
- Baris alternating: putih / `bg-background`
- Cell: `px-4 py-4 text-sm`
- Status badge: pill `rounded-full` dengan warna status

### 5.7 Status Badge

```tsx
<span
  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-white"
  style={{ backgroundColor: product.statusColor }}
>
  {icon} {label}
</span>
```

### 5.8 Footer

- Latar: `--footer-background` (`#1b3a0f`)
- Teks: putih / `white/80`
- Grid: 4 kolom (brand, navigasi, layanan, kontak)
- Sosial media: lingkaran `bg-white/10 hover:bg-white/20`
- Border atas: `border-t border-white/20`

---

## 6. Layout Admin

### Pola Umum (kedua level admin)

```
┌─────────────────────────────────────────────┐
│  Sidebar (w-64, bg-primary)    │  Top Bar    │
│  - Logo / nama admin           │  (bg-white) │
│  - Navigation links            │─────────────│
│  - Logout / kembali            │  <main>     │
│                                │  p-4→p-8   │
└────────────────────────────────┴─────────────┘
```

- **Sidebar**: fixed di mobile (overlay + drawer), static di `lg:`
- **Overlay mobile**: `bg-black/50 z-40`
- **Item aktif**: `bg-sidebar-accent text-white`
- **Item tidak aktif**: `text-white/70 hover:bg-white/10 hover:text-white`

### Admin Poktan — Menu Navigasi

| Menu | Route | Icon |
|---|---|---|
| Ringkasan | `/admin-poktan` | LayoutDashboard |
| Produk & Stok | `/admin-poktan/products` | Package |
| Laporan Penjualan | `/admin-poktan/sales` | TrendingUp |
| Galeri & Berita | `/admin-poktan/gallery` | Image |

### Super Admin Gapoktan — Menu Navigasi

| Menu | Route | Icon |
|---|---|---|
| Dashboard Utama | `/admin-gapoktan` | LayoutDashboard |
| Validasi Produk | `/admin-gapoktan/validation` | CheckSquare |
| Manajemen Pesanan | `/admin-gapoktan/orders` | ShoppingCart |
| Anggota Poktan | `/admin-gapoktan/users` | Users |
| Laporan Keuangan | `/admin-gapoktan/finance` | DollarSign |
| Kelola Konten | `/admin-gapoktan/content` | FileText |

---

## 7. Struktur Halaman & Routing

### Publik (dengan Header + Footer)

| Path | Komponen | Deskripsi |
|---|---|---|
| `/` | `Home` | Beranda: hero, profil & statistik, carousel produk, berita |
| `/about` | `About` | Tentang Kami: sejarah, visi misi, struktur organisasi |
| `/shop` | `Shop` | Toko Tani: grid produk, filter kategori, pencarian |
| `/product/:id` | `ProductDetail` | Detail produk: varian kemasan, deskripsi, keunggulan |
| `/cart` | `Cart` | Keranjang belanja |
| `/checkout` | `Checkout` | Form checkout & ringkasan pesanan |
| `/dashboard` | `Dashboard` | Akun pengguna & riwayat transaksi |
| `/news` | `News` | Berita & kegiatan Gapoktan |
| `/reports` | `Reports` | Laporan penjualan publik |
| `/contact` | `Contact` | Formulir kontak & peta lokasi |

### Admin Poktan (layout terpisah, tanpa Header/Footer publik)

| Path | Komponen |
|---|---|
| `/admin-poktan` | `PoktanDashboard` |
| `/admin-poktan/products` | `PoktanProducts` |
| `/admin-poktan/sales` | `PoktanSales` |
| `/admin-poktan/gallery` | `PoktanGallery` |

### Super Admin Gapoktan (layout terpisah)

| Path | Komponen |
|---|---|
| `/admin-gapoktan` | `GapoktanDashboard` |
| `/admin-gapoktan/validation` | `GapoktanValidation` |
| `/admin-gapoktan/orders` | `GapoktanOrders` |
| `/admin-gapoktan/users` | `GapoktanUsers` |
| `/admin-gapoktan/finance` | `GapoktanFinance` |
| `/admin-gapoktan/content` | `GapoktanContent` |

---

## 8. Model Data Produk

Data produk mengalir dari form admin poktan → toko publik → halaman detail.

### Field Lengkap

| Field | Tipe | Tampil di |
|---|---|---|
| `name` | string | Toko, Detail, Admin tabel |
| `category` | string | Toko (filter), Detail, Admin tabel |
| `poktan` | string | Toko, Detail (otomatis dari akun admin) |
| `description` | string | Detail (deskripsi produk) |
| `cultivation` / `method` | string | Detail (metode budidaya), Admin tabel |
| `harvestDate` | date | Admin tabel (sub-info) |
| `price` | number | Toko, Admin tabel |
| `unit` | string | Toko (satuan dasar) |
| `stock` | number | Toko (badge "Stok Terbatas" jika < 50), Admin tabel |
| `badge` | string? | Toko (Terlaris / Baru / Populer) |
| `variants` | `{size, price, stock}[]` | Detail (pilih kemasan) |
| `features` | `string[]` | Detail (keunggulan produk) |
| `image` | string (URL) | Toko, Detail, Admin tabel |
| `status` | string | Admin tabel (Aktif/Stok Menipis/Habis/Menunggu Validasi) |

### Status Produk & Warna

| Status | Warna Token | Trigger |
|---|---|---|
| Aktif | `--status-success` | Tervalidasi & stok > 0 |
| Stok Menipis | `--status-pending` | Stok rendah (misal < 20) |
| Habis | `--status-error` | Stok = 0 |
| Menunggu Validasi | `--status-info` | Baru ditambah, belum divalidasi Super Admin |

---

## 9. Komponen Khusus

### ImageWithFallback

Wrapper `<img>` dengan fallback graceful — digunakan di seluruh tampilan gambar produk.
Lokasi: `src/app/components/figma/ImageWithFallback.tsx`

### Carousel Produk (Beranda)

Komponen `ProductCarousel` di `src/app/components/ProductCarousel.tsx` — menampilkan produk unggulan dengan geser horizontal.

### Grafik (Admin)

Menggunakan library **Recharts**:
- Dashboard Poktan: grafik penjualan mingguan / bulanan
- Dashboard Gapoktan: grafik keuangan, komparasi poktan
- Warna chart mengikuti token `--chart-1` s/d `--chart-5`

---

## 10. Responsivitas

Seluruh halaman mengikuti pola **mobile-first** Tailwind:

| Breakpoint | Lebar | Perilaku |
|---|---|---|
| default | < 640px | Stack vertikal, sidebar tersembunyi (drawer) |
| `sm:` | ≥ 640px | 2-kolom grid, font sedikit lebih besar |
| `lg:` | ≥ 1024px | Sidebar tampil static, navigasi desktop tampil |
| `xl:` | ≥ 1280px | Grid 4 kolom di halaman toko |

---

## 11. Ikon

Seluruh ikon menggunakan library **`lucide-react`**.
Ukuran standar: `w-5 h-5` (body) atau `w-6 h-6` (header/tombol utama).

---

## 12. Teknologi

| Layer | Teknologi |
|---|---|
| Framework | React 18+ |
| Routing | React Router v7 (file `src/app/routes.tsx`) |
| Styling | Tailwind CSS v4 |
| Ikon | lucide-react |
| Chart | Recharts |
| Build | Vite |
| Bahasa | TypeScript (.tsx) |
