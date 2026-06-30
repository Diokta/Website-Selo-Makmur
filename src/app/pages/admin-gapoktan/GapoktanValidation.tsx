import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Edit, Eye, MessageSquare } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { supabase } from "../../../lib/supabase";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export function GapoktanValidation() {
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvedToday, setApprovedToday] = useState(0);
  const [rejectedToday, setRejectedToday] = useState(0);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchValidationData();
  }, []);

  const fetchValidationData = async () => {
    setLoading(true);
    try {
      // 1. Fetch pending products
      const { data: pendingData } = await supabase
        .from("products")
        .select("*, kelompok_tani(id, nama, ketua)")
        .eq("status", "Menunggu Validasi")
        .order("created_at", { ascending: false });

      if (pendingData) setPendingProducts(pendingData);

      // 2. Fetch stats for today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { count: approvedCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "Aktif")
        .gte("updated_at", todayStart.toISOString());

      const { count: rejectedCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "Ditolak")
        .gte("updated_at", todayStart.toISOString());

      setApprovedToday(approvedCount || 0);
      setRejectedToday(rejectedCount || 0);
    } catch (err) {
      console.error("Error fetching validation data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menyetujui produk ini?")) return;
    try {
      const { error } = await supabase
        .from("products")
        .update({
          status: "Aktif",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
      fetchValidationData();
    } catch (err) {
      console.error("Error approving product:", err);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId || !rejectReason.trim()) return;

    try {
      const { error } = await supabase
        .from("products")
        .update({
          status: "Ditolak",
          rejection_reason: rejectReason,
          updated_at: new Date().toISOString(),
        })
        .eq("id", rejectingId);

      if (error) throw error;
      setRejectingId(null);
      setRejectReason("");
      fetchValidationData();
    } catch (err) {
      console.error("Error rejecting product:", err);
    }
  };

  if (loading && pendingProducts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner message="Memuat pengajuan produk baru..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl text-primary mb-2 font-semibold">
          Validasi Produk Baru
        </h2>
        <p className="text-base text-muted-foreground">
          Review dan setujui produk yang diajukan oleh ketua kelompok tani
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md border border-border">
          <p className="text-sm font-semibold text-muted-foreground mb-2">Menunggu Review</p>
          <p className="text-3xl font-bold text-primary">{pendingProducts.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-border">
          <p className="text-sm font-semibold text-muted-foreground mb-2">Disetujui Hari Ini</p>
          <p className="text-3xl font-bold" style={{ color: "#5a8f3a" }}>{approvedToday}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-border">
          <p className="text-sm font-semibold text-muted-foreground mb-2">Ditolak Hari Ini</p>
          <p className="text-3xl font-bold" style={{ color: "#f44336" }}>{rejectedToday}</p>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full border border-border">
            <h3 className="text-xl font-bold text-primary mb-4">Tolak Pengajuan Produk</h3>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Alasan Penolakan</label>
                <textarea
                  required
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Masukkan alasan penolakan agar kelompok tani dapat memperbaikinya..."
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Kirim & Tolak
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRejectingId(null);
                    setRejectReason("");
                  }}
                  className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pending Products */}
      <div className="space-y-6">
        {pendingProducts.length === 0 ? (
          <div className="text-center py-12 bg-white border border-border rounded-xl text-muted-foreground">
            Tidak ada produk baru yang menunggu validasi saat ini.
          </div>
        ) : (
          pendingProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-border">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-primary mb-2">{product.name}</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1 font-semibold text-primary">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--primary)" }} />
                            {product.kelompok_tani?.nama ?? "Gapoktan"}
                          </span>
                          <span>•</span>
                          <span>Diajukan oleh {product.kelompok_tani?.ketua ?? "Ketua Poktan"}</span>
                          <span>•</span>
                          <span>{product.created_at ? new Date(product.created_at).toLocaleDateString("id-ID") : "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 bg-secondary/20 p-3 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Kategori</p>
                        <p className="text-sm font-semibold text-primary">{product.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Harga</p>
                        <p className="text-sm font-bold text-accent">Rp {product.price.toLocaleString("id-ID")}/{product.unit || "kg"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Stok</p>
                        <p className="text-sm font-semibold text-primary">{product.stock} {product.unit || "kg"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Metode</p>
                        <p className="text-sm font-semibold text-primary">{product.cultivation_method}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Deskripsi</p>
                      <p className="text-sm text-foreground font-medium leading-relaxed">{product.description || "-"}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Tanggal Panen</p>
                      <p className="text-sm font-semibold text-primary">
                        {product.harvest_date ? new Date(product.harvest_date).toLocaleDateString("id-ID") : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background border-t border-border px-6 py-4 flex flex-wrap gap-3">
                <button
                  onClick={() => handleApprove(product.id)}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Setujui
                </button>
                <button
                  onClick={() => setRejectingId(product.id)}
                  className="flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Tolak
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="bg-secondary/10 rounded-xl p-6 border-l-4 border-primary">
        <h3 className="text-lg text-primary mb-2 font-semibold">Panduan Review Produk</h3>
        <ul className="space-y-2 text-sm text-muted-foreground font-medium">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Periksa kualitas foto - pastikan foto jelas dan menampilkan produk dengan baik</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Verifikasi harga - pastikan harga wajar dan sesuai dengan standar pasar</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Cek deskripsi - pastikan informasi lengkap dan tidak menyesatkan</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Jika menolak, berikan alasan yang jelas kepada pengaju produk</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
