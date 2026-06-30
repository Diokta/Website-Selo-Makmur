import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, XCircle, Printer } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export function GapoktanOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeResiOrderId, setActiveResiOrderId] = useState<string | null>(null);
  const [resiInput, setResiInput] = useState("");
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [confirmingOrder, setConfirmingOrder] = useState<any | null>(null);
  const [printingLabelOrder, setPrintingLabelOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*), kelompok_tani(id, nama)")
        .order("ordered_at", { ascending: false });

      if (data) setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (order: any) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: "Lunas",
          order_status: "Diproses",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (error) throw error;
      fetchOrders();
    } catch (err) {
      console.error("Error confirming payment:", err);
    }
  };

  const handleShipOrder = async (orderId: string) => {
    if (!resiInput.trim()) return;
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          order_status: "Dikirim",
          shipping_resi: resiInput,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;
      setActiveResiOrderId(null);
      setResiInput("");
      fetchOrders();
    } catch (err) {
      console.error("Error shipping order:", err);
    }
  };

  const handleCompleteOrder = async (order: any) => {
    try {
      // 1. Update order status to Selesai
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          order_status: "Selesai",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (orderError) throw orderError;

      // 2. Insert into finance records for reporting
      const recordYear = new Date(order.ordered_at).getFullYear();
      const recordMonth = new Date(order.ordered_at).getMonth() + 1;
      const feePct = 5;
      const feeAmount = order.subtotal * 0.05;
      const shareAmount = order.subtotal * 0.95;

      const { error: financeError } = await supabase
        .from("finance_records")
        .insert({
          order_id: order.id,
          poktan_id: order.poktan_id,
          period_year: recordYear,
          period_month: recordMonth,
          gross_revenue: order.subtotal,
          gapoktan_fee_pct: feePct,
          gapoktan_fee_amount: feeAmount,
          poktan_share_amount: shareAmount,
          record_type: "Penjualan",
        });

      if (financeError) throw financeError;

      fetchOrders();
    } catch (err) {
      console.error("Error completing order:", err);
    }
  };

  const handlePrintLabel = (order: any) => {
    setPrintingLabelOrder(order);
    setTimeout(() => {
      window.print();
      setPrintingLabelOrder(null);
    }, 150);
  };

  const getStatusColor = (status: string) => {
    if (status === "Selesai") return "#5a8f3a"; // success
    if (status === "Dikirim") return "var(--accent)"; // accent
    if (status === "Diproses") return "#2196f3"; // info
    if (status === "Dibatalkan") return "#f44336"; // error
    return "#ff9800"; // pending (Menunggu Pembayaran)
  };

  const getStatusIcon = (status: string) => {
    if (status === "Selesai") return <CheckCircle className="w-4 h-4" />;
    if (status === "Dikirim") return <Truck className="w-4 h-4" />;
    if (status === "Diproses") return <Package className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  // Stats calculation
  const pendingPayment = orders.filter(
    (o) => o.order_status === "Menunggu Konfirmasi" || o.payment_status === "Menunggu Konfirmasi"
  ).length;
  const needPacking = orders.filter((o) => o.order_status === "Diproses").length;
  const inTransit = orders.filter((o) => o.order_status === "Dikirim").length;
  const completed = orders.filter((o) => o.order_status === "Selesai").length;

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner message="Memuat daftar pesanan..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl text-primary mb-2 font-semibold">
          Manajemen Pesanan & Logistik
        </h2>
        <p className="text-base text-muted-foreground">
          Kelola dan proses pesanan dari pembeli
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-border rounded-xl p-6 shadow-md">
          <p className="text-sm font-medium text-muted-foreground mb-2">Perlu Verifikasi</p>
          <p className="text-3xl font-bold" style={{ color: "#ff9800" }}>{pendingPayment}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-6 shadow-md">
          <p className="text-sm font-medium text-muted-foreground mb-2">Perlu Dikemas</p>
          <p className="text-3xl font-bold" style={{ color: "#2196f3" }}>{needPacking}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-6 shadow-md">
          <p className="text-sm font-medium text-muted-foreground mb-2">Dalam Pengiriman</p>
          <p className="text-3xl font-bold" style={{ color: "var(--accent)" }}>{inTransit}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-6 shadow-md">
          <p className="text-sm font-medium text-muted-foreground mb-2">Selesai</p>
          <p className="text-3xl font-bold" style={{ color: "#5a8f3a" }}>{completed}</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white border border-border rounded-xl text-muted-foreground">
            Belum ada pesanan masuk.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-border">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-1">{order.order_number}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.ordered_at).toLocaleDateString("id-ID")} • {order.kelompok_tani?.nama ?? "Gapoktan"}
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: getStatusColor(order.order_status) }}
                  >
                    {getStatusIcon(order.order_status)}
                    {order.order_status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  {/* Informasi Pembeli */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Informasi Pembeli</p>
                    <p className="text-sm font-bold text-primary mb-1">{order.buyer_name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      📞 {order.buyer_phone}
                    </p>
                  </div>

                  {/* Informasi Pengiriman */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Informasi Pengiriman</p>
                    {(() => {
                      const match = order.shipping_address?.match(/(.*)\s*\(Titik Google Maps: (https:\/\/www\.google\.com\/maps\?q=[^\)]+)\)/);
                      if (match) {
                        const addressText = match[1];
                        const mapUrl = match[2];
                        return (
                          <div className="space-y-1">
                            <p className="text-sm text-primary font-medium">{addressText}</p>
                            <a
                              href={mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline font-semibold bg-accent/5 border border-accent/25 rounded px-2 py-0.5 mt-0.5"
                            >
                              📍 Buka di Google Maps ↗
                            </a>
                          </div>
                        );
                      }
                      return <p className="text-sm text-primary font-medium mb-1.5">{order.shipping_address}</p>;
                    })()}
                    {order.shipping_resi ? (
                      <div className="mt-1 bg-accent/5 border border-accent/20 rounded-lg p-2 flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">No. Resi Pengiriman</span>
                        <span className="text-xs text-accent font-bold font-mono">{order.shipping_resi}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600 font-medium">⚠️ Menunggu pengisian nomor resi</p>
                    )}
                  </div>

                  {/* Pembayaran */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Pembayaran & Status</p>
                    <p className="text-sm font-semibold text-primary mb-1 flex items-center gap-1.5">
                      💳 {order.payment_method}
                    </p>
                    <p className="text-sm font-bold text-accent mb-2">
                      Total: Rp {order.total_amount.toLocaleString("id-ID")}
                    </p>
                    
                    {order.payment_proof_url && (
                      <div className="mt-2">
                        <p className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Bukti Transfer:</p>
                        <div 
                          onClick={() => setSelectedProofUrl(order.payment_proof_url)}
                          className="relative w-28 h-28 rounded-lg border border-border overflow-hidden bg-muted group cursor-pointer"
                        >
                          <img
                            src={order.payment_proof_url}
                            alt="Bukti Transfer"
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-semibold">
                            Lihat Gambar
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Item Pesanan</p>
                  <div className="space-y-2">
                    {order.order_items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm bg-background p-3 rounded-lg border border-border">
                        <span className="font-medium text-foreground">{item.quantity}x {item.product_name}</span>
                        <span className="text-accent font-semibold">Rp {item.subtotal.toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="bg-background border-t border-border px-6 py-4 flex flex-wrap gap-3 items-center justify-between">
                <div>
                  {activeResiOrderId === order.id && (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Masukkan Nomor Resi"
                        value={resiInput}
                        onChange={(e) => setResiInput(e.target.value)}
                        className="px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <button
                        onClick={() => handleShipOrder(order.id)}
                        className="bg-accent text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-accent/90"
                      >
                        Kirim
                      </button>
                      <button
                        onClick={() => setActiveResiOrderId(null)}
                        className="bg-muted text-foreground px-3 py-1.5 rounded-lg text-xs font-medium"
                      >
                        Batal
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {(order.order_status === "Menunggu Konfirmasi" || order.payment_status === "Menunggu Konfirmasi") && (
                    <button
                      onClick={() => setConfirmingOrder(order)}
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Konfirmasi Pembayaran
                    </button>
                  )}
                  {order.order_status === "Diproses" && !activeResiOrderId && (
                    <>
                      <button
                        onClick={() => setActiveResiOrderId(order.id)}
                        className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                      >
                        <Truck className="w-4 h-4" />
                        Input Resi
                      </button>
                      <button
                        onClick={() => handlePrintLabel(order)}
                        className="bg-muted hover:bg-muted/80 text-foreground px-6 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Cetak Label
                      </button>
                    </>
                  )}
                  {order.order_status === "Dikirim" && (
                    <button
                      onClick={() => handleCompleteOrder(order)}
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Tandai Selesai
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
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

      {/* Modal Konfirmasi Pembayaran */}
      {confirmingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border">
            <h3 className="text-lg font-bold text-primary mb-3">Konfirmasi Pembayaran</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Apakah Anda yakin ingin mengonfirmasi pembayaran untuk pesanan{" "}
              <span className="font-semibold text-primary">{confirmingOrder.order_number}</span> sebesar{" "}
              <span className="font-semibold text-accent">Rp {confirmingOrder.total_amount.toLocaleString("id-ID")}</span>? 
              Status pesanan akan diubah menjadi <span className="font-semibold text-primary">"Diproses"</span> dan status pembayaran menjadi <span className="font-semibold text-primary">"Lunas"</span>.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmingOrder(null)}
                className="bg-secondary hover:bg-muted text-foreground px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  const orderToConfirm = confirmingOrder;
                  setConfirmingOrder(null);
                  await handleConfirmPayment(orderToConfirm);
                }}
                className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Ya, Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Container Khusus Cetak Label */}
      {printingLabelOrder && (
        <div className="hidden print:block print:fixed print:inset-0 print:bg-white print:z-50 p-8 text-black" id="print-label-area">
          <div className="border-2 border-black p-6 rounded-lg max-w-md mx-auto space-y-4">
            <div className="flex justify-between items-center border-b-2 border-black pb-3">
              <div>
                <h2 className="text-xl font-bold tracking-wider">LABEL PENGIRIMAN</h2>
                <p className="text-sm font-semibold">{printingLabelOrder.order_number}</p>
              </div>
              <div className="text-right text-xs">
                Tanggal: {new Date(printingLabelOrder.ordered_at).toLocaleDateString("id-ID")}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold text-xs uppercase text-gray-500 mb-0.5">Pengirim:</p>
                <p className="font-bold">{printingLabelOrder.kelompok_tani?.nama ?? "Gapoktan Selo Makmur"}</p>
                <p className="text-xs text-gray-600">Dusun: {printingLabelOrder.kelompok_tani?.dusun ?? "Selo Makmur"}</p>
                <p className="text-xs text-gray-600">Kontak: {printingLabelOrder.kelompok_tani?.kontak ?? "-"}</p>
              </div>
              <div>
                <p className="font-bold text-xs uppercase text-gray-500 mb-0.5">Penerima:</p>
                <p className="font-bold">{printingLabelOrder.buyer_name}</p>
                <p className="text-xs text-gray-600">Telp: {printingLabelOrder.buyer_phone}</p>
                {(() => {
                  const match = printingLabelOrder.shipping_address?.match(/(.*)\s*\(Titik Google Maps: https:\/\/www\.google\.com\/maps\?q=([^\)]+)\)/);
                  if (match) {
                    const addressText = match[1];
                    const coords = match[2];
                    return (
                      <div className="text-xs text-gray-700 font-medium leading-relaxed">
                        <p>{addressText}</p>
                        <p className="text-[10px] text-gray-500 font-semibold mt-0.5">📍 Koordinat Peta: {coords}</p>
                      </div>
                    );
                  }
                  return <p className="text-xs text-gray-700 font-medium">{printingLabelOrder.shipping_address}</p>;
                })()}
              </div>
            </div>

            {/* Barcode Visual Placeholder */}
            <div className="border-t border-b border-black py-2 my-2 flex flex-col items-center justify-center">
              <div className="flex items-center gap-0.5 h-10 w-48 mb-1">
                <div className="bg-black w-[2px] h-full"></div>
                <div className="bg-black w-[4px] h-full"></div>
                <div className="bg-black w-[1px] h-full"></div>
                <div className="bg-black w-[3px] h-full"></div>
                <div className="bg-black w-[1px] h-full"></div>
                <div className="bg-black w-[5px] h-full"></div>
                <div className="bg-black w-[2px] h-full"></div>
                <div className="bg-black w-[1px] h-full"></div>
                <div className="bg-black w-[4px] h-full"></div>
                <div className="bg-black w-[2px] h-full"></div>
                <div className="bg-black w-[1px] h-full"></div>
                <div className="bg-black w-[3px] h-full"></div>
                <div className="bg-black w-[1px] h-full"></div>
                <div className="bg-black w-[4px] h-full"></div>
                <div className="bg-black w-[1px] h-full"></div>
                <div className="bg-black w-[2px] h-full"></div>
                <div className="bg-black w-[3px] h-full"></div>
              </div>
              <span className="text-[10px] tracking-[4px] font-mono">{printingLabelOrder.order_number}</span>
            </div>

            <div className="border-t border-dashed border-gray-400 pt-3">
              <p className="font-bold text-xs uppercase text-gray-500 mb-1">Daftar Barang:</p>
              <div className="space-y-1 text-xs">
                {printingLabelOrder.order_items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.quantity}x {item.product_name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-black pt-3 flex justify-between items-center text-sm font-bold">
              <span>Metode: {printingLabelOrder.payment_method}</span>
              <span className="text-base">TOTAL: Rp {printingLabelOrder.total_amount.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      )}

      {printingLabelOrder && (
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * {
              visibility: hidden !important;
            }
            #print-label-area, #print-label-area * {
              visibility: visible !important;
            }
            #print-label-area {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: 100% !important;
              background: white !important;
              z-index: 99999 !important;
              display: block !important;
            }
          }
        `}} />
      )}
    </div>
  );
}
