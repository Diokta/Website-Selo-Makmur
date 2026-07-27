import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Package, Clock, CheckCircle, XCircle, ShoppingBag, Upload, ArrowLeft, Phone, MapPin, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useWebsiteContent } from "../../hooks/useWebsiteContent";
import { supabase } from "../../lib/supabase";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const { getContent } = useWebsiteContent();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || !id) {
      setLoading(false);
      return;
    }

    const fetchOrderDetail = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("id", id)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (err: any) {
        console.error("Gagal memuat detail pesanan:", err);
        setErrorMsg(err.message || "Gagal memuat detail pesanan.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id, user, authLoading]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleUploadProof = async (file: File) => {
    if (!file || !order) return;
    setUploading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const compressedBase64 = await compressImage(file);
      let finalUrl = compressedBase64;

      try {
        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `${order.id}-${Date.now()}.${fileExt}`;
        const filePath = `proofs/${fileName}`;

        const response = await fetch(compressedBase64);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from("payment-proofs")
          .upload(filePath, blob, {
            contentType: "image/jpeg",
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from("payment-proofs")
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          finalUrl = data.publicUrl;
        }
      } catch (storageErr) {
        console.warn("Supabase Storage upload failed, using fallback Base64 data:", storageErr);
      }

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_proof_url: finalUrl,
          payment_status: "Menunggu Konfirmasi",
          order_status: "Menunggu Konfirmasi",
          updated_at: new Date().toISOString()
        })
        .eq("id", order.id);

      if (updateError) throw updateError;

      setOrder((prev: any) => ({
        ...prev,
        payment_proof_url: finalUrl,
        payment_status: "Menunggu Konfirmasi",
        order_status: "Menunggu Konfirmasi",
      }));

      setSuccessMsg("Bukti transfer berhasil diunggah dan sedang menunggu konfirmasi.");
    } catch (err: any) {
      console.error("Gagal mengunggah bukti transfer:", err);
      setErrorMsg(err.message || "Gagal mengunggah bukti transfer.");
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      "Menunggu Konfirmasi": {
        icon: Clock,
        text: "Menunggu Konfirmasi",
        class: "bg-orange-100 text-orange-700 border border-orange-200",
      },
      "Diproses": {
        icon: Clock,
        text: "Diproses",
        class: "bg-blue-100 text-blue-700 border border-blue-200",
      },
      "Dikirim": {
        icon: Package,
        text: "Dikirim",
        class: "bg-yellow-100 text-yellow-700 border border-yellow-200",
      },
      "Selesai": {
        icon: CheckCircle,
        text: "Selesai",
        class: "bg-green-100 text-green-700 border border-green-200",
      },
      "Dibatalkan": {
        icon: XCircle,
        text: "Dibatalkan",
        class: "bg-red-100 text-red-700 border border-red-200",
      },
    };
    const badge = badges[status as keyof typeof badges] || {
      icon: Clock,
      text: status,
      class: "bg-gray-100 text-gray-700",
    };
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${badge.class}`}>
        <Icon className="w-4 h-4" />
        {badge.text}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-md max-w-md w-full border border-border">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl text-primary mb-4">Akses Terbatas</h2>
          <p className="text-base text-muted-foreground mb-6">
            Silakan masuk terlebih dahulu untuk melihat detail pesanan Anda.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg transition-colors text-base font-medium"
          >
            Masuk Sekarang
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 text-center shadow-md max-w-md w-full border border-border">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-primary mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Detail transaksi pesanan yang Anda cari tidak ditemukan atau bukan milik Anda.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center w-full bg-accent hover:bg-accent/90 text-white py-2.5 rounded-lg transition-colors text-xs font-semibold shadow-sm"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-accent py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-white/95 hover:text-white text-xs font-semibold mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Detail Pesanan</h1>
              <p className="text-sm text-white/80">
                Nomor: <span className="font-semibold text-white">{order.order_number}</span> — Dibuat tanggal {formatDate(order.ordered_at)}
              </p>
            </div>
            <div className="shrink-0">
              {getStatusBadge(order.order_status)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {successMsg && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-lg mb-6 text-sm">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-destructive/10 border-l-4 border-destructive text-destructive p-4 rounded-lg mb-6 text-sm">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Rincian Produk */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md border border-border text-left">
              <h3 className="text-lg font-bold text-primary mb-4 pb-2 border-b border-border">Rincian Produk Belanja</h3>
              
              <div className="divide-y divide-border">
                {order.order_items?.map((item: any, index: number) => (
                  <div key={index} className="py-4 flex justify-between items-center gap-4">
                    <div>
                      <h4 className="font-bold text-primary text-sm">{item.product_name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Harga Satuan: Rp {item.price_per_unit.toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-muted-foreground">Kuantitas: {item.quantity}x</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary text-sm">
                        Rp {(item.price_per_unit * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border mt-2 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal Belanja</span>
                  <span>Rp {order.total_amount.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Ongkos Kirim</span>
                  <span>Rp 0</span>
                </div>
                <div className="flex justify-between text-base font-bold text-primary pt-2 border-t border-dashed border-border mt-2">
                  <span>Total Pembayaran</span>
                  <span className="text-accent">Rp {order.total_amount.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Pengiriman & Pembayaran */}
          <div className="space-y-6">
            {/* Tujuan Pengiriman */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-border text-left">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                <MapPin className="w-5 h-5 text-accent" />
                <h3 className="text-base font-bold text-primary">Tujuan Pengiriman</h3>
              </div>
              <div className="text-xs space-y-2">
                <div>
                  <p className="font-bold text-primary">{order.shipping_name || "Nama Tidak Tersedia"}</p>
                  <p className="text-muted-foreground font-semibold flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" /> {order.shipping_phone || "-"}
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {order.shipping_address || "Alamat Tidak Tersedia"}
                </p>
                {order.shipping_address && order.shipping_address !== "Ambil di Lokasi - Kantor Gapoktan Selo Makmur" && (
                  <div className="pt-1">
                    <a
                      href={`https://www.google.com/maps?q=${encodeURIComponent(order.shipping_address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-accent font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      📍 Buka di Google Maps ↗
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Status & Info Pembayaran */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-border text-left">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                <ImageIcon className="w-5 h-5 text-accent" />
                <h3 className="text-base font-bold text-primary">Informasi Pembayaran</h3>
              </div>

              <div className="text-xs space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Metode Pembayaran:</span>
                  <span className="font-semibold text-primary">{order.payment_method}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status Pembayaran:</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium border text-[10px] ${
                    order.payment_status === "Lunas"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : order.payment_status === "Menunggu Konfirmasi"
                      ? "bg-amber-50 text-amber-750 border-amber-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    {order.payment_status || "Belum Lunas"}
                  </span>
                </div>

                {order.resi_number && (
                  <div className="bg-secondary/45 p-2.5 rounded-lg border border-border flex justify-between items-center mt-2">
                    <span className="text-muted-foreground font-semibold">Nomor Resi:</span>
                    <span className="font-mono text-primary font-bold">{order.resi_number}</span>
                  </div>
                )}

                {/* Rekening Transfer (jika metode Transfer Bank) */}
                {order.payment_method !== "COD" && order.payment_status !== "Lunas" && (
                  <div className="bg-accent/5 p-3 rounded-lg border border-accent/20 mt-2 space-y-1.5">
                    <p className="font-bold text-primary">Rekening Transfer Bank:</p>
                    <p className="text-[11px] text-muted-foreground">Silakan transfer tepat sebesar nominal di atas ke:</p>
                    <div className="font-semibold text-primary text-[11px] space-y-0.5">
                      <p>🏦 Bank: <span className="font-bold">{getContent("payment.bank_name", "Bank Mandiri / BRI")}</span></p>
                      <p>💳 No. Rekening: <span className="font-mono font-bold text-accent">{getContent("payment.bank_account", "137-00-1234567-8")}</span></p>
                      <p className="text-muted-foreground text-[10px]">a.n. <span className="font-bold">{getContent("payment.account_holder", "Gapoktan Selo Makmur")}</span></p>
                      {getContent("payment.bank_info") && (
                        <p className="text-[10px] text-muted-foreground whitespace-pre-line mt-1 pt-1 border-t border-accent/15 italic">
                          {getContent("payment.bank_info")}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Upload Bukti */}
                {order.payment_method !== "COD" && (
                  <div className="pt-2">
                    {order.payment_proof_url ? (
                      <div className="space-y-2">
                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5" /> Bukti Pembayaran Telah Dikirim:
                        </span>
                        <div 
                          onClick={() => setSelectedProofUrl(order.payment_proof_url)}
                          className="relative w-full h-40 rounded-xl border border-border overflow-hidden bg-muted group cursor-pointer"
                        >
                          <img
                            src={order.payment_proof_url}
                            alt="Bukti Transfer"
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                            Lihat Gambar Penuh
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 bg-secondary/10 hover:bg-secondary/20 transition-colors relative">
                          <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                          <p className="text-xs text-muted-foreground mb-1 text-center font-medium">
                            Kirim Bukti Pembayaran (Screenshot / Foto)
                          </p>
                          <p className="text-[10px] text-muted-foreground/80 mb-3 text-center">
                            Mendukung format JPG, PNG (Maksimal 5MB)
                          </p>
                          <label className="cursor-pointer bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors mt-1 inline-flex items-center gap-1.5">
                            {uploading ? (
                              <>
                                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Mengunggah...
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" /> Pilih File Bukti
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadProof(file);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pratinjau Gambar Bukti Pembayaran */}
      {selectedProofUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProofUrl(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProofUrl(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors z-10"
              aria-label="Tutup"
            >
              ✕
            </button>
            <img
              src={selectedProofUrl}
              alt="Pratinjau Bukti Pembayaran"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="py-2 text-center">
              <a
                href={selectedProofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline font-semibold"
              >
                Buka di Tab Baru ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
