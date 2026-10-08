# 🌱 Website Platform Digital Gapoktan Selo Makmur

Platform digital resmi Gabungan Kelompok Tani (Gapoktan) Selo Makmur, Desa Selomartani, Kecamatan Kalasan, Kabupaten Sleman, D.I. Yogyakarta. Platform ini mengintegrasikan profil organisasi, katalog e-commerce produk pertanian lokal, berita & kegiatan, manajemen aset, laporan keuangan, serta dashboard administrasi terpadu.

---

## 🛠️ Fitur Utama

### 🌾 Publik & Petani (Customer Facing)
- **Profil & Beranda Gapoktan**: Informasi visi-misi, susunan pengurus, statistik kelompok tani, dan galeri kegiatan.
- **Toko Produk Pertanian (E-Commerce)**: Katalog produk hasil tani lokal (beras, sayuran organik, pupuk, bibit) dilengkapi fitur pencarian, filter kategori, keranjang belanja, dan checkout.
- **CSR & Berita**: Informasi program kemitraan (seperti CSR AAMAI) dan publikasi artikel/berita seputar pertanian Selomartani.
- **Autentikasi Pengguna**: Pendaftaran akun, login (Email & Google OAuth), verifikasi email otomatis via SMTP Edge Function, dan pemulihan kata sandi (Lupa Password).
- **Manajemen Profil & Pesanan**: Halaman riwayat pesanan, status verifikasi akun, dan alamat pengiriman pengguna.

### 🛡️ Dashboard Admin Gapoktan
- **Dashboard Ringkasan**: Statistik penjualan, total pesanan, jumlah produk aktif, dan pengguna terdaftar.
- **Manajemen Produk**: Tambah, ubah, hapus, dan atur stok serta harga produk pertanian.
- **Manajemen Pesanan**: Verifikasi bukti pembayaran, ubah status pengiriman (Diproses, Dikirim, Selesai, Dibatalkan).
- **Manajemen Laporan Keuangan**: Pencatatan arus kas masuk/keluar Gapoktan serta cetak ringkasan keuangan.
- **Manajemen Aset & Galeri**: Inventarisasi aset alat/mesin pertanian (ALSINTAN) dan pengolahan galeri foto kegiatan.
- **Manajemen User & Validasi**: Pengelolaan akun anggota/petani dan persetujuan verifikasi data.

---

## ⚡ Teknologi yang Digunakan

| Komponen | Teknologi |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Styling & UI Components** | [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI / Radix UI](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/) |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Storage, Auth) |
| **Serverless Functions** | [Supabase Edge Functions](https://supabase.com/docs/guides/functions) (Deno runtime + SMTP Client) |
| **Pengujian (Testing)** | [Vitest](https://vitest.dev/) + React Testing Library |
| **CI/CD & Deployment** | GitHub Actions (Auto FTP Deploy ke Hostinger) |

---

## 🚀 Panduan Memulai (Local Setup)

Prasyarat:
- [Node.js](https://nodejs.org/) (Versi 18 atau 20+)
- [npm](https://www.npmjs.com/) atau [pnpm](https://pnpm.io/)

### 1. Kloning Repositori
```bash
git clone https://github.com/Diokta/Website-Selo-Makmur.git
cd "Website Selo Makmur"
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Buka `.env.local` dan isi sesuai dengan kredensial proyek Supabase Anda:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 4. Jalankan Server Pengembang (Development)
```bash
npm run dev
```
Buka browser Anda di `http://localhost:5173`.

---

## 🧪 Pengujian (Unit & Integration Tests)

Proyek ini dilengkapi dengan *automated testing* menggunakan Vitest untuk memastikan alur autentikasi, transaksi, dan halaman admin berjalan dengan benar.

Jalankan perintah berikut untuk mengeksekusi suite pengujian:
```bash
npm run test
```

---

## 📦 Build Produksi & Deployment

### Build Lokal
```bash
npm run build
```
Hasil build akan dibuat otomatis di dalam folder `dist/`.

### Deployment Otomatis (GitHub Actions)
Setiap kali ada perubahan yang di-push ke branch `main`, GitHub Actions (`.github/workflows/deploy.yml`) akan secara otomatis:
1. Menjalankan proses build `npm run build`.
2. Mengunggah folder `dist/` ke server Hostinger melalui protokol FTP.

---

## 📁 Struktur Direktori Utama

```text
├── .github/workflows/    # Workflow CI/CD GitHub Actions
├── public/               # Asset statis publik (gambar, favicon, sitemap)
├── src/
│   ├── app/
│   │   ├── components/   # Komponen UI utama & Shadcn components
│   │   ├── pages/        # Halaman publik (Home, Shop, Cart, Login, dll)
│   │   └── pages/admin-gapoktan/  # Dashboard & modul admin Gapoktan
│   ├── hooks/            # Custom React hooks (useAuth, useWebsiteContent)
│   ├── lib/              # Inisialisasi klien Supabase
│   ├── test/             # Berkas unit test & integrasi (Vitest)
│   └── types/            # Definisi tipe TypeScript (Database schema)
├── supabase/
│   └── functions/        # Supabase Edge Functions (e.g. send-verification-email)
├── supabase_schema.sql   # Skema basis data PostgreSQL & Aturan RLS
├── .env.example          # Panduan variabel lingkungan
├── .gitignore            # Konfigurasi pengabaian Git
└── vite.config.ts        # Konfigurasi bundler Vite
```

---

## 🔒 Keamanan

- Kredensial sensitif diatur sepenuhnya menggunakan variabel lingkungan (`.env.local`) dan GitHub Secrets.
- Seluruh tabel PostgreSQL pada Supabase dilindungi dengan **Row Level Security (RLS)**.
- Token reset password & verifikasi email di-generate menggunakan fungsi PostgreSQL aman `gen_random_bytes`.

---

## 📝 Lisensi & Hak Cipta

© 2026 **Gapoktan Selo Makmur** — Selomartani, Kalasan, Sleman, D.I. Yogyakarta. All rights reserved.