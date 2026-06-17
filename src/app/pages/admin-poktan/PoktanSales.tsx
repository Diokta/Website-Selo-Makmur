import { Download, Calendar, Filter } from "lucide-react";
import { useState } from "react";

export function PoktanSales() {
  const [selectedMonth, setSelectedMonth] = useState("2026-06");

  const sales = [
    {
      id: "TRX-001-2026",
      date: "2026-06-01",
      product: "Beras Organik Premium",
      quantity: 25,
      unit: "kg",
      price: 15000,
      total: 375000,
      buyer: "Ibu Siti",
    },
    {
      id: "TRX-002-2026",
      date: "2026-06-02",
      product: "Sayuran Segar Campur",
      quantity: 5,
      unit: "paket",
      price: 35000,
      total: 175000,
      buyer: "Bapak Ahmad",
    },
    {
      id: "TRX-003-2026",
      date: "2026-06-02",
      product: "Beras Organik Premium",
      quantity: 50,
      unit: "kg",
      price: 15000,
      total: 750000,
      buyer: "Warung Berkah",
    },
    {
      id: "TRX-004-2026",
      date: "2026-06-03",
      product: "Jagung Manis",
      quantity: 10,
      unit: "kg",
      price: 12000,
      total: 120000,
      buyer: "Ibu Ratna",
    },
    {
      id: "TRX-005-2026",
      date: "2026-06-03",
      product: "Cabai Merah Keriting",
      quantity: 3,
      unit: "kg",
      price: 45000,
      total: 135000,
      buyer: "Pasar Modern Cisarua",
    },
  ];

  const summary = {
    totalTransactions: sales.length,
    totalRevenue: sales.reduce((sum, s) => sum + s.total, 0),
    totalQuantity: sales.reduce((sum, s) => sum + s.quantity, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-primary mb-2">
            Laporan Penjualan Internal
          </h2>
          <p className="text-base text-muted-foreground">
            Data penjualan produk Poktan Harapan Jaya
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors">
          <Download className="w-5 h-5" />
          Unduh Excel
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-muted-foreground mb-2">Total Transaksi</p>
          <p className="text-3xl text-primary">{summary.totalTransactions}</p>
          <p className="text-xs text-accent mt-2">Bulan ini</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-muted-foreground mb-2">Total Pendapatan</p>
          <p className="text-3xl text-primary">
            Rp {summary.totalRevenue.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-accent mt-2">Bulan ini</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-muted-foreground mb-2">Total Terjual</p>
          <p className="text-3xl text-primary">{summary.totalQuantity}</p>
          <p className="text-xs text-accent mt-2">Unit/Kg</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-2 text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Pilih Bulan
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-2 text-foreground flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter Produk
            </label>
            <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Semua Produk</option>
              <option value="beras">Beras Organik</option>
              <option value="sayur">Sayuran</option>
              <option value="jagung">Jagung Manis</option>
              <option value="cabai">Cabai Merah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "var(--primary)" }}>
              <tr>
                <th className="px-4 py-4 text-left text-sm text-white">ID Transaksi</th>
                <th className="px-4 py-4 text-left text-sm text-white">Tanggal</th>
                <th className="px-4 py-4 text-left text-sm text-white">Produk</th>
                <th className="px-4 py-4 text-left text-sm text-white">Pembeli</th>
                <th className="px-4 py-4 text-left text-sm text-white">Kuantitas</th>
                <th className="px-4 py-4 text-left text-sm text-white">Harga Satuan</th>
                <th className="px-4 py-4 text-left text-sm text-white">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr
                  key={sale.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-background"}
                >
                  <td className="px-4 py-4 text-sm text-primary">{sale.id}</td>
                  <td className="px-4 py-4 text-sm">
                    {new Date(sale.date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-4 text-sm">{sale.product}</td>
                  <td className="px-4 py-4 text-sm">{sale.buyer}</td>
                  <td className="px-4 py-4 text-sm">
                    {sale.quantity} {sale.unit}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    Rp {sale.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-4 text-sm text-accent">
                    Rp {sale.total.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot style={{ backgroundColor: "var(--background)" }}>
              <tr>
                <td colSpan={6} className="px-4 py-4 text-right text-base">
                  <strong>Total Pendapatan:</strong>
                </td>
                <td className="px-4 py-4 text-base text-accent">
                  <strong>Rp {summary.totalRevenue.toLocaleString("id-ID")}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Export Info */}
      <div className="bg-secondary/10 rounded-xl p-6 border-l-4" style={{ borderColor: "var(--secondary)" }}>
        <h3 className="text-lg text-primary mb-2">Catatan Laporan</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Laporan ini dapat diunduh dalam format Excel untuk digunakan sebagai bahan
          laporan kas kelompok tani saat rapat rutin tingkat dusun. Data yang
          ditampilkan adalah transaksi yang sudah berhasil dan terverifikasi.
        </p>
      </div>
    </div>
  );
}
