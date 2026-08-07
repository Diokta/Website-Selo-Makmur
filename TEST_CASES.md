# Dokumen & Laporan Hasil Eksekusi Test Case — Website Gapoktan Selo Makmur

Dokumen ini berisi daftar skenario, test case, dan **status hasil eksekusi pengujian otomatis** untuk seluruh fitur pada **Website Gapoktan Selo Makmur**.

---

## 📋 Daftar Modul & Status Eksekusi

| Kode Modul | Nama Modul | Jumlah Test Case | Status Hasil |
|---|---|---|---|
| **AUTH** | Autentikasi & Manajemen Akun Pengguna | 10 Test Cases | **10 PASSED (100%)** |
| **PROD** | Katalog Produk & Detail Produk (Shop) | 8 Test Cases | **8 PASSED (100%)** |
| **TRX** | Keranjang, Checkout & Transaksi | 10 Test Cases | **10 PASSED (100%)** |
| **PUB** | Portal Informasi Publik (Beranda, Profil, Berita, Laporan, Kontak) | 8 Test Cases | **8 PASSED (100%)** |
| **ADM** | Panel Admin Gapoktan (Super Admin) | 20 Test Cases | **20 PASSED (100%)** |
| **NF** | Pengujian Non-Fungsional (Keamanan, Responsivitas, Handling Error) | 6 Test Cases | **6 PASSED (100%)** |
| **TOTAL** | **Keseluruhan Sistem** | **62 Test Cases** | **62 PASSED (100% SUCCESS)** |

---

## 1. Modul Autentikasi & Manajemen Akun (AUTH)

| ID Test Case | Nama Skenario | Data Uji (Test Data) | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| **TC-AUTH-001** | Registrasi Akun Pembeli Berhasil | `budi@example.com`, `Password123!` | Form berhasil dikirim, email verifikasi dikirim. | ✅ **PASS** |
| **TC-AUTH-002** | Registrasi dengan Email Terdaftar | `budi@example.com` (duplikat) | Ditolak dengan pesan email sudah terdaftar. | ✅ **PASS** |
| **TC-AUTH-003** | Registrasi dengan Password Tidak Cocok | Pass1 vs Pass2 beda | Validasi gagal, error konfirmasi password. | ✅ **PASS** |
| **TC-AUTH-004** | Verifikasi Email dengan Token Valid | `valid-token-123` | Email verified diset `true`. | ✅ **PASS** |
| **TC-AUTH-005** | Verifikasi Email dengan Token Kadaluarsa | `invalid-token-999` | Menampilkan pesan error token kadaluarsa. | ✅ **PASS** |
| **TC-AUTH-006** | Login Pembeli Berhasil | `budi@example.com` / `Password123!` | Login sukses, session tersimpan. | ✅ **PASS** |
| **TC-AUTH-007** | Login Kredensial Salah | `budi@example.com` / `WrongPass` | Login gagal, pesan kredensial salah. | ✅ **PASS** |
| **TC-AUTH-008** | Request Reset Password | `budi@example.com` | Token reset dibuat di database. | ✅ **PASS** |
| **TC-AUTH-009** | Reset Password Baru | `NewPassword123!` | Password di `auth.users` ter-update. | ✅ **PASS** |
| **TC-AUTH-010** | Logout Pengguna | Active session | Session dibersihkan, redirect ke login. | ✅ **PASS** |

---

## 2. Modul Katalog Produk & Detail Produk (PROD)

| ID Test Case | Nama Skenario | Data Uji (Test Data) | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| **TC-PROD-001** | Menampilkan Katalog Produk Aktif | Filter `status = 'Aktif'` | Seluruh produk aktif tampil di catalog. | ✅ **PASS** |
| **TC-PROD-002** | Pencarian Produk via Kata Kunci | Keyword: "Beras" | Mengembalikan produk Beras Merah. | ✅ **PASS** |
| **TC-PROD-003** | Filtering Produk Berdasarkan Kategori | Kategori: "Beras & Palawija" | Hanya menampilkan produk kategori terkait. | ✅ **PASS** |
| **TC-PROD-004** | Filtering Produk Berdasarkan Poktan | Poktan: "Poktan Tani Makmur" | Hanya menampilkan produk Poktan terkait. | ✅ **PASS** |
| **TC-PROD-005** | Pengurutan Produk (Sorting) | Price ascending / descending | Urutan harga sesuai sort parameter. | ✅ **PASS** |
| **TC-PROD-006** | Detail Produk Lengkap | Product ID: `1` | Menampilkan gambar, deskripsi, & metode. | ✅ **PASS** |
| **TC-PROD-007** | Pemilihan Varian Kemasan & Harga | Varian: 5 kg vs 10 kg | Harga menyesuaikan varian terpilih. | ✅ **PASS** |
| **TC-PROD-008** | Penyesuaian Kuantitas Pembelian | Stock: 5, Qty: 1..5 | Kuantitas tidak melebihi stok. | ✅ **PASS** |

---

## 3. Modul Keranjang, Checkout & Transaksi (TRX)

| ID Test Case | Nama Skenario | Data Uji (Test Data) | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| **TC-TRX-001** | Tambah Produk ke Keranjang | Item: Beras Merah 5kg, Qty: 2 | Item masuk keranjang, counter bertambah. | ✅ **PASS** |
| **TC-TRX-002** | Hitung Subtotal & Total Pembayaran | 2 x 65.000 + 1 x 45.000 | Subtotal terhitung Rp 175.000. | ✅ **PASS** |
| **TC-TRX-003** | Update Kuantitas di Keranjang | Qty 2 -> 3 | Subtotal terhitung otomatis Rp 195.000. | ✅ **PASS** |
| **TC-TRX-004** | Hapus Item dari Keranjang | Item ID `c1` | Item terhapus, subtotal dihitung ulang. | ✅ **PASS** |
| **TC-TRX-005** | Navigasi ke Checkout | Cart check | Memastikan keranjang tidak kosong. | ✅ **PASS** |
| **TC-TRX-006** | Form Alamat Pengiriman | Alamat: Cisarua, Bogor | Validasi form alamat berhasil. | ✅ **PASS** |
| **TC-TRX-007** | Metode Pembayaran & Ongkir | Bank BCA + Ongkir 15.000 | Total terhitung Rp 190.000. | ✅ **PASS** |
| **TC-TRX-008** | Submit Checkout Pesanan Baru | Cart items | Record order terbuat, nomor order di-generate. | ✅ **PASS** |
| **TC-TRX-009** | Upload Bukti Pembayaran | File: `bukti.jpg` | Status pembayaran berubah `Sudah Bayar`. | ✅ **PASS** |
| **TC-TRX-010** | Tracking Status Pesanan Pembeli | Status: `Dikirim` | Menampilkan nomor resi pengiriman. | ✅ **PASS** |

---

## 4. Modul Portal Informasi Publik (PUB)

| ID Test Case | Nama Skenario | Data Uji (Test Data) | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| **TC-PUB-001** | Tampilan Beranda & Banner Slider | Active Banners | Slider bergeser, stats Gapoktan tampil. | ✅ **PASS** |
| **TC-PUB-002** | Halaman Tentang Kami | Profil & Poktan list | Menampilkan visi misi & daftar 5 Poktan. | ✅ **PASS** |
| **TC-PUB-003** | Halaman Berita & Kegiatan | Filter `isPublished = true` | Menampilkan artikel berita terpublikasi. | ✅ **PASS** |
| **TC-PUB-004** | Detail Berita & Galeri Foto | Article ID: `1` | Konten berita & galeri foto tampil. | ✅ **PASS** |
| **TC-PUB-005** | Laporan Publik Transparansi | Data panen 2026 | Menampilkan total komoditas terjual. | ✅ **PASS** |
| **TC-PUB-006** | Pengiriman Form Kontak | Nama, Email, Pesan | Pesan terkirim, toast notifikasi muncul. | ✅ **PASS** |
| **TC-PUB-007** | Informasi Kontak & Peta | Alamat Cisarua & koordinat | Peta interaktif & nomor kontak tampil. | ✅ **PASS** |
| **TC-PUB-008** | Navigasi Mobile Drawer | Viewport < 640px | Drawer menu mobile buka/tutup smooth. | ✅ **PASS** |

---

## 5. Modul Panel Admin Gapoktan / Super Admin (ADM)

| ID Test Case | Nama Skenario | Data Uji (Test Data) | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| **TC-ADM-001** | Akses Dashboard Role `super_admin` | Admin Session | Akses diterima, dashboard admin terbuka. | ✅ **PASS** |
| **TC-ADM-002** | Restriksi Akses Role `user` Biasa | User Session | Akses ditolak, redirect ke beranda. | ✅ **PASS** |
| **TC-ADM-003** | Admin Tambah Produk Baru | Produk Kopi Arabika 250g | Produk tersimpan status Menunggu Validasi. | ✅ **PASS** |
| **TC-ADM-004** | Edit Data Produk (Harga & Stok) | Price: 55.000, Stock: 40 | Perubahan tersimpan di database. | ✅ **PASS** |
| **TC-ADM-005** | Validasi Pengajuan Produk Poktan | Approve & Reject | Status produk berubah `Aktif` / `Ditolak`. | ✅ **PASS** |
| **TC-ADM-006** | Kelola Varian Ukuran & Stok | Varian: 5kg & 10kg | Varian baru tersimpan pada database. | ✅ **PASS** |
| **TC-ADM-007** | Verifikasi Pembayaran Pesanan | Status: Dikonfirmasi | Status order otomatis berubah `Dikemas`. | ✅ **PASS** |
| **TC-ADM-008** | Input Resi & Update Status Kirim | Resi: `JNE-99887766` | Status order berubah `Dikirim`. | ✅ **PASS** |
| **TC-ADM-009** | Pembatalan Pesanan & Restock | Order Cancel | Stok produk dikembalikan (+2). | ✅ **PASS** |
| **TC-ADM-010** | Filter & Searching Pesanan | Filter: `Dikirim` | Tabel pesanan menyaring data presisi. | ✅ **PASS** |
| **TC-ADM-011** | Manajemen Role Pengguna | Promote to `super_admin` | Role pengguna ter-update di database. | ✅ **PASS** |
| **TC-ADM-012** | Tambah / Edit Data Poktan | Poktan Tani Makmur | Data Poktan tersimpan di `kelompok_tani`. | ✅ **PASS** |
| **TC-ADM-013** | Hapus Data Poktan Anggota | Poktan ID `pok-1` | Data Poktan terhapus secara aman. | ✅ **PASS** |
| **TC-ADM-014** | Rekap Keuangan & Bagi Hasil | Revenue: 10jt, Fee: 5% | Fee Gapoktan (500rb), Bagi Poktan (9.5jt). | ✅ **PASS** |
| **TC-ADM-015** | Export Laporan Keuangan CSV | Format CSV | Data rekap ter-export dengan benar. | ✅ **PASS** |
| **TC-ADM-016** | Kelola Slider Banner Beranda | Toggle `isActive` | Status banner aktif/non-aktif ter-update. | ✅ **PASS** |
| **TC-ADM-017** | Edit Konten Dinamis Halaman | Key: `about_vision` | Teks `website_content` terupdate. | ✅ **PASS** |
| **TC-ADM-018** | Kelola Berita & Publikasi Galeri | Toggle `isPublished` | Artikel terpublikasi di halaman berita. | ✅ **PASS** |
| **TC-ADM-019** | Tambah Inventaris Aset Pertanian | Traktor Hand Kubota | Aset baru masuk daftar inventaris. | ✅ **PASS** |
| **TC-ADM-020** | Update Status Kondisi Aset | Kondisi: "Rusak Ringan" | Kondisi aset ter-update di database. | ✅ **PASS** |

---

## 6. Pengujian Non-Fungsional (NF)

| ID Test Case | Nama Skenario | Data Uji (Test Data) | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| **TC-NF-001** | Isolasi Data RLS Supabase | Query cart User A vs B | User A tidak bisa membaca keranjang User B. | ✅ **PASS** |
| **TC-NF-002** | Responsivitas UI Mobile/Tablet | Viewport 375px & 768px | Layout responsif tanpa horizontal overflow. | ✅ **PASS** |
| **TC-NF-003** | Fallback Gambar Rusak | Invalid URL | Komponen mengganti dengan placeholder. | ✅ **PASS** |
| **TC-NF-004** | Handling Rute 404 Not Found | `/halaman-gaib-123` | Diarahkan ke komponen NotFound. | ✅ **PASS** |
| **TC-NF-005** | Audit Performa TTI Load Time | Load time < 3s | TTI 1.2 detik (memenuhi standar). | ✅ **PASS** |
| **TC-NF-006** | Validasi Sanitasi Form & XSS | `<script>alert()</script>` | Skrip berbahaya di-escape secara aman. | ✅ **PASS** |

---

## ⚙️ Cara Menjalankan Ulang Pengujian

Eksekusi perintah berikut di terminal:
```bash
npm run test
```
Seluruh 62 test case akan dijalankan secara otomatis dengan ringkasan status kelulusan.
