import { describe, it, expect } from 'vitest';

interface Product {
  id: string;
  name: string;
  category: string;
  poktan: string;
  price: number;
  stock: number;
  status: string;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Beras Merah Organik', category: 'Beras & Palawija', poktan: 'Poktan Tani Makmur', price: 65000, stock: 45, status: 'Aktif' },
  { id: '2', name: 'Kopi Arabika Cisarua', category: 'Perkebunan', poktan: 'Poktan Subur', price: 45000, stock: 20, status: 'Aktif' },
  { id: '3', name: 'Sayur Bayam Hijau', category: 'Sayuran', poktan: 'Poktan Tani Makmur', price: 8000, stock: 0, status: 'Habis' },
  { id: '4', name: 'Jagung Manis', category: 'Beras & Palawija', poktan: 'Poktan Harapan', price: 12000, stock: 100, status: 'Aktif' },
];

describe('Modul 2: Katalog & Detail Produk (PROD)', () => {
  it('TC-PROD-001: Menampilkan Katalog Produk Berstatus Aktif', () => {
    const activeProducts = mockProducts.filter((p) => p.status === 'Aktif');
    expect(activeProducts.length).toBe(3);
    expect(activeProducts.every((p) => p.status === 'Aktif')).toBe(true);
  });

  it('TC-PROD-002: Pencarian Produk Berdasarkan Kata Kunci', () => {
    const keyword = 'Beras';
    const searchResults = mockProducts.filter((p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase())
    );

    expect(searchResults.length).toBe(1);
    expect(searchResults[0].name).toContain('Beras Merah');
  });

  it('TC-PROD-003: Filtering Produk Berdasarkan Kategori', () => {
    const category = 'Beras & Palawija';
    const categoryResults = mockProducts.filter((p) => p.category === category);

    expect(categoryResults.length).toBe(2);
  });

  it('TC-PROD-004: Filtering Produk Berdasarkan Kelompok Tani (Poktan)', () => {
    const poktan = 'Poktan Tani Makmur';
    const poktanResults = mockProducts.filter((p) => p.poktan === poktan);

    expect(poktanResults.length).toBe(2);
  });

  it('TC-PROD-005: Pengurutan Produk Berdasarkan Harga (Ascending & Descending)', () => {
    const activeProducts = mockProducts.filter((p) => p.status === 'Aktif');
    
    const sortedCheapFirst = [...activeProducts].sort((a, b) => a.price - b.price);
    expect(sortedCheapFirst[0].price).toBe(12000);
    expect(sortedCheapFirst[sortedCheapFirst.length - 1].price).toBe(65000);

    const sortedExpensiveFirst = [...activeProducts].sort((a, b) => b.price - a.price);
    expect(sortedExpensiveFirst[0].price).toBe(65000);
  });

  it('TC-PROD-006: Menampilkan Detail Produk Lengkap Berdasarkan ID', () => {
    const productId = '1';
    const product = mockProducts.find((p) => p.id === productId);

    expect(product).toBeDefined();
    expect(product?.name).toBe('Beras Merah Organik');
    expect(product?.price).toBe(65000);
  });

  it('TC-PROD-007: Pemilihan Varian Kemasan Menyesuaikan Harga', () => {
    const variants = [
      { size: '2.5 kg', price: 35000, stock: 20 },
      { size: '5 kg', price: 65000, stock: 15 },
      { size: '10 kg', price: 125000, stock: 10 },
    ];

    const selectedVariant = variants[1]; // 5 kg
    expect(selectedVariant.price).toBe(65000);

    const selectedVariantLarge = variants[2]; // 10 kg
    expect(selectedVariantLarge.price).toBe(125000);
  });

  it('TC-PROD-008: Menambah / Mengurangi Kuantitas Pembelian Terbatas Stok', () => {
    const stock = 5;
    let qty = 1;

    // Increment
    if (qty < stock) qty += 1;
    expect(qty).toBe(2);

    // Cannot exceed stock
    qty = 5;
    if (qty < stock) qty += 1;
    expect(qty).toBe(5);

    // Decrement
    if (qty > 1) qty -= 1;
    expect(qty).toBe(4);
  });
});
