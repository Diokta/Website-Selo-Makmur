import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { CreditCard, MapPin, Truck, Wallet, ShoppingBag, ArrowRight, AlertTriangle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const selectedIds = location.state?.selectedIds as string[] | undefined;
  
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [courier, setCourier] = useState("local");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showDeliveryWarningModal, setShowDeliveryWarningModal] = useState(false);

  // Form states
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [kelurahan, setKelurahan] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [provinsi, setProvinsi] = useState("");

  // Saved addresses states
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState<any>({
    label: "Rumah",
    receiver_name: "",
    receiver_phone: "",
    address: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    postal_code: "",
    latitude: -7.7318,
    longitude: 110.4623,
    is_default: false
  });
  const [addressSaving, setAddressSaving] = useState(false);

  // Load Leaflet dynamically when showAddressModal is true
  useEffect(() => {
    if (!showAddressModal) return;

    let link: HTMLLinkElement | null = null;
    let script: HTMLScriptElement | null = null;

    const loadLeaflet = () => {
      // 1. CSS
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      // 2. JS
      script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => {
        setTimeout(() => {
          initAddressMap();
        }, 150);
      };
      document.body.appendChild(script);
    };

    loadLeaflet();

    return () => {
      if (link && document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
      const existingAddressMap = (window as any).checkoutAddressMapInstance;
      if (existingAddressMap) {
        existingAddressMap.remove();
        (window as any).checkoutAddressMapInstance = null;
      }
    };
  }, [showAddressModal]);

  // Handle map re-initialization when modal shows after leaflet is already loaded
  useEffect(() => {
    if (!showAddressModal) return;
    const L = (window as any).L;
    if (L) {
      setTimeout(() => {
        initAddressMap();
      }, 200);
    }
  }, [showAddressModal]);

  const initAddressMap = () => {
    const L = (window as any).L;
    if (!L) return;

    const initialLat = addressForm.latitude || -7.7318;
    const initialLng = addressForm.longitude || 110.4623;

    const mapContainer = document.getElementById("checkout-address-map");
    if (!mapContainer) return;

    const existingMap = (window as any).checkoutAddressMapInstance;
    if (existingMap) {
      existingMap.remove();
    }

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const map = L.map("checkout-address-map").setView([initialLat, initialLng], 13);
    (window as any).checkoutAddressMapInstance = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);

    marker.on("dragend", () => {
      const position = marker.getLatLng();
      setAddressForm((prev: any) => ({
        ...prev,
        latitude: position.lat,
        longitude: position.lng
      }));
    });

    map.on("click", (e: any) => {
      marker.setLatLng(e.latlng);
      setAddressForm((prev: any) => ({
        ...prev,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      }));
    });
  };

  const handleSelectAddress = (addr: any) => {
    setSelectedAddressId(addr.id);
    setBuyerName(addr.receiver_name || "");
    setBuyerPhone(addr.receiver_phone || "");
    setAddress(addr.address || "");
    setCity(addr.kabupaten || "");
    setPostalCode(addr.postal_code || "");
    setLatitude(addr.latitude || null);
    setLongitude(addr.longitude || null);
    setKelurahan(addr.kelurahan || "");
    setKecamatan(addr.kecamatan || "");
    setProvinsi(addr.provinsi || "");
  };

  const openAddressModal = () => {
    setAddressForm({
      label: "Rumah",
      receiver_name: buyerName || "",
      receiver_phone: buyerPhone || "",
      address: "",
      kelurahan: "",
      kecamatan: "",
      kabupaten: "",
      provinsi: "",
      postal_code: "",
      latitude: -7.731814460656464,
      longitude: 110.46229639761255,
      is_default: addresses.length === 0
    });
    setShowAddressModal(true);
  };

  const handleAddressSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAddressSaving(true);
    try {
      if (addressForm.is_default) {
        await supabase
          .from("user_addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      const { data, error } = await supabase
        .from("user_addresses")
        .insert({
          user_id: user.id,
          label: addressForm.label,
          receiver_name: addressForm.receiver_name,
          receiver_phone: addressForm.receiver_phone,
          address: addressForm.address,
          kelurahan: addressForm.kelurahan,
          kecamatan: addressForm.kecamatan,
          kabupaten: addressForm.kabupaten,
          provinsi: addressForm.provinsi,
          postal_code: addressForm.postal_code,
          latitude: addressForm.latitude,
          longitude: addressForm.longitude,
          is_default: addressForm.is_default
        })
        .select()
        .single();

      if (error) throw error;

      const updatedAddresses = [data, ...addresses].sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0));
      setAddresses(updatedAddresses);
      handleSelectAddress(data);
      setShowAddressModal(false);
    } catch (err) {
      console.error("Gagal menyimpan alamat baru:", err);
    } finally {
      setAddressSaving(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch user profile to prefill
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        // Fetch user addresses
        const { data: addressesData } = await supabase
          .from("user_addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false });

        let defaultAddr = null;
        if (addressesData && addressesData.length > 0) {
          setAddresses(addressesData);
          defaultAddr = addressesData.find((addr: any) => addr.is_default) || addressesData[0];
          setSelectedAddressId(defaultAddr.id);
        }

        if (defaultAddr) {
          setBuyerName(defaultAddr.receiver_name || "");
          setBuyerPhone(defaultAddr.receiver_phone || "");
          setAddress(defaultAddr.address || "");
          setCity(defaultAddr.kabupaten || "");
          setPostalCode(defaultAddr.postal_code || "");
          setLatitude(defaultAddr.latitude || null);
          setLongitude(defaultAddr.longitude || null);
          setKelurahan(defaultAddr.kelurahan || "");
          setKecamatan(defaultAddr.kecamatan || "");
          setProvinsi(defaultAddr.provinsi || "");
        } else if (profile) {
          setBuyerName(profile.name || "");
          setBuyerPhone(profile.phone || "");
          setAddress("");
          setCity("");
          setPostalCode("");
          setLatitude(null);
          setLongitude(null);
          setKelurahan("");
          setKecamatan("");
          setProvinsi("");
        }

        // Fetch cart items (filtered if selectedIds is provided)
        let query = supabase
          .from("cart_items")
          .select("*, products(id, name, price, unit, image_url, poktan_id), product_variants(id, size, price)")
          .eq("user_id", user.id);

        if (selectedIds && selectedIds.length > 0) {
          query = query.in("id", selectedIds);
        }

        const { data: cartData, error: cartErr } = await query;
        if (cartErr) throw cartErr;

        if (cartData) {
          setCartItems(
            cartData.map((item: any) => ({
              id: item.id,
              product_id: item.product_id,
              poktan_id: item.products?.poktan_id,
              variant_id: item.variant_id,
              name: item.products?.name ?? "Produk",
              variant: item.product_variants?.size ?? item.products?.unit ?? "Porsi",
              price: item.product_variants?.price ?? item.products?.price ?? 0,
              quantity: item.quantity,
            }))
          );
        }
      } catch (err: any) {
        console.error("Error loading checkout data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, authLoading]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const shippingCost = 0;
  const total = subtotal + shippingCost;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const checkLocalCourierEligibility = () => {
    if (courier !== "local") return true;

    // 1. Check coordinates if available
    if (latitude !== null && longitude !== null) {
      const TARGET_LAT = -7.731814460656464;
      const TARGET_LNG = 110.46229639761255;
      
      const R = 6371; // Earth radius in km
      const dLat = (TARGET_LAT - latitude) * Math.PI / 180;
      const dLon = (TARGET_LNG - longitude) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(latitude * Math.PI / 180) * Math.cos(TARGET_LAT * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;

      if (distance <= 5.0) {
        return true;
      }
    }

    // 2. Fallback: check text in city (kabupaten), kecamatan, kelurahan, or address
    const hasSelomartaniText = 
      city.toLowerCase().includes("selomartani") || 
      kecamatan.toLowerCase().includes("selomartani") || 
      kelurahan.toLowerCase().includes("selomartani") || 
      address.toLowerCase().includes("selomartani");

    return hasSelomartaniText;
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!buyerName || !buyerPhone || (courier !== "pickup" && (!address || !city || !kelurahan || !kecamatan || !provinsi))) {
      setErrorMsg("Harap lengkapi semua bidang alamat pengiriman.");
      return;
    }
    if (courier === "local" && !checkLocalCourierEligibility()) {
      setShowDeliveryWarningModal(true);
      return;
    }
    if (cartItems.length === 0) {
      setErrorMsg("Keranjang belanja kosong.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const orderNumber = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const fullAddress = courier === "pickup"
        ? "Ambil di Lokasi - Kantor Gapoktan Selo Makmur"
        : `${address}, Kel. ${kelurahan}, Kec. ${kecamatan}, ${city}, Prov. ${provinsi}${postalCode ? `, Kode Pos ${postalCode}` : ""}${latitude && longitude ? ` (Titik Google Maps: https://www.google.com/maps?q=${latitude},${longitude})` : ""}`;

      // Pick poktan_id from the first item if all items belong to the same poktan
      const firstPoktanId = cartItems[0]?.poktan_id;
      const allSamePoktan = cartItems.every((item) => item.poktan_id === firstPoktanId);
      const orderPoktanId = allSamePoktan ? firstPoktanId : null;

      // 1. Insert into orders
      const { data: orderResult, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          buyer_id: user.id,
          poktan_id: orderPoktanId,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          shipping_address: fullAddress,
          subtotal,
          shipping_cost: shippingCost,
          total_amount: total,
          payment_method: "Transfer Bank",
          payment_status: "Menunggu Pembayaran",
          order_status: "Menunggu Konfirmasi",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const createdOrderId = orderResult.id;

      // 2. Insert into order_items
      const orderItemsToInsert = cartItems.map((item) => ({
        order_id: createdOrderId,
        product_id: item.product_id,
        product_name: `${item.name} (${item.variant})`,
        quantity: item.quantity,
        price_per_unit: item.price,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsToInsert);

      if (itemsError) throw itemsError;

      // 3. Clear only checked items from cart
      const itemIdsToDelete = cartItems.map((item) => item.id);
      const { error: clearCartError } = await supabase
        .from("cart_items")
        .delete()
        .in("id", itemIdsToDelete);

      if (clearCartError) throw clearCartError;

      // Redirect to dashboard (order list)
      navigate("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat membuat pesanan.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || (user && loading)) {
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
            Silakan masuk terlebih dahulu untuk menyelesaikan pembayaran.
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-md max-w-md w-full border border-border">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl text-primary mb-4">Keranjang Kosong</h2>
          <p className="text-base text-muted-foreground mb-6">
            Tidak ada produk untuk dibayar. Silakan berbelanja terlebih dahulu.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg transition-colors text-base font-medium"
          >
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-accent py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl text-white mb-4">Pembayaran</h1>
          <p className="text-lg sm:text-xl text-white/90">
            Lengkapi data untuk menyelesaikan pesanan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {errorMsg && (
          <div className="bg-destructive/10 border-l-4 border-destructive text-destructive p-4 rounded-lg mb-6">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-accent" />
                <h2 className="text-2xl text-primary">Alamat Pengiriman</h2>
              </div>
              <div className="space-y-4">
                {courier !== "pickup" && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-base font-semibold text-primary">
                        Pilih Alamat Pengiriman
                      </label>
                      <button
                        type="button"
                        onClick={openAddressModal}
                        className="text-xs bg-accent/10 hover:bg-accent/20 text-accent px-3 py-1.5 rounded-lg font-semibold transition-colors"
                      >
                        + Tambah Alamat Baru
                      </button>
                    </div>
                    {addresses.length === 0 ? (
                      <div className="p-4 border border-dashed border-border rounded-xl text-center text-sm text-muted-foreground bg-secondary/5">
                        Belum ada alamat tersimpan. Silakan tambah alamat baru atau isi form di bawah.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1 mb-6">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => handleSelectAddress(addr)}
                            className={`p-3 rounded-lg border text-xs cursor-pointer transition-all relative flex flex-col justify-between ${
                              selectedAddressId === addr.id
                                ? "border-accent bg-accent/5 ring-1 ring-accent"
                                : "border-border hover:border-accent/40 bg-white"
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="font-bold text-primary">{addr.label}</span>
                                {addr.is_default && (
                                  <span className="bg-accent text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                                    Utama
                                  </span>
                                )}
                              </div>
                              <p className="font-semibold text-primary mb-0.5">{addr.receiver_name} ({addr.receiver_phone})</p>
                              <p className="text-muted-foreground leading-relaxed line-clamp-2">
                                {addr.address}, Kel. {addr.kelurahan}, Kec. {addr.kecamatan}, {addr.kabupaten}, Prov. {addr.provinsi}
                              </p>
                            </div>
                            {selectedAddressId === addr.id && (
                              <div className="absolute top-2 right-2 text-accent font-bold">
                                ✓
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {courier === "pickup" ? (
                  <>
                    <div>
                      <label className="block text-base mb-2 text-foreground">
                        Nama Lengkap Penerima / Pengambil
                      </label>
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-base mb-2 text-foreground">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        required
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="08XX-XXXX-XXXX"
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-start gap-4 mt-4">
                      <span className="text-2xl mt-0.5">📍</span>
                      <div>
                        <h4 className="font-bold text-emerald-950 mb-1">Ambil di Lokasi (Selo Makmur)</h4>
                        <p className="text-sm text-emerald-800 leading-relaxed mb-2">
                          Anda dapat mengambil pesanan secara langsung di Kantor Gapoktan Selo Makmur setelah melakukan pembayaran dan pesanan dikonfirmasi oleh admin.
                        </p>
                        <p className="text-xs text-emerald-600 italic">
                          *Detail pengiriman tidak diperlukan untuk opsi ini.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Summary of Selected Address */}
                    {selectedAddressId ? (
                      <div className="p-4 bg-secondary/15 rounded-xl border border-border">
                        <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-accent" /> Alamat Penerima Terpilih:
                        </h4>
                        <div className="space-y-1.5 text-sm text-foreground">
                          <p className="font-semibold text-primary">{buyerName} <span className="text-muted-foreground font-normal">({buyerPhone})</span></p>
                          <p className="text-muted-foreground leading-relaxed">
                            {address}, Kel. {kelurahan}, Kec. {kecamatan}, {city}, Prov. {provinsi}, {postalCode}
                          </p>
                          {latitude && longitude && (
                            <div className="pt-2 flex items-center justify-between border-t border-border mt-2">
                              <span className="text-xs text-muted-foreground">📍 Koordinat: {latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
                              <a
                                href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-accent hover:underline font-semibold"
                              >
                                Buka di Google Maps ↗
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 border border-dashed border-destructive/30 rounded-xl text-center text-sm text-destructive bg-destructive/5 font-medium">
                        ⚠️ Silakan pilih atau tambahkan alamat pengiriman terlebih dahulu.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-6 h-6 text-accent" />
                <h2 className="text-2xl text-primary">Pilih Kurir</h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-4 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input
                    type="radio"
                    name="courier"
                    value="local"
                    checked={courier === "local"}
                    onChange={(e) => setCourier(e.target.value)}
                    className="w-5 h-5 text-accent"
                  />
                  <div className="flex-1">
                    <p className="text-lg text-primary">Kurir Lokal / Ojek</p>
                    <p className="text-sm text-muted-foreground">
                      Pengiriman khusus area Selomartani (1-2 hari)
                    </p>
                    {courier === "local" && !checkLocalCourierEligibility() && (
                      <div className="mt-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-2 font-medium">
                        ⚠️ Alamat Anda di luar jangkauan kurir lokal (Radius &gt; 5 km). Silakan gunakan opsi "Ambil di Lokasi" atau perbarui titik peta profil Anda.
                      </div>
                    )}
                  </div>
                  <p className="text-lg text-accent">
                    {subtotal > 100000 ? "Gratis" : "Gratis"}
                  </p>
                </label>

                <label className="flex items-center gap-4 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input
                    type="radio"
                    name="courier"
                    value="pickup"
                    checked={courier === "pickup"}
                    onChange={(e) => setCourier(e.target.value)}
                    className="w-5 h-5 text-accent"
                  />
                  <div className="flex-1">
                    <p className="text-lg text-primary">Ambil di Lokasi (Selo Makmur)</p>
                    <p className="text-sm text-muted-foreground">
                      Ambil pesanan Anda langsung di Kantor Gapoktan Selo Makmur
                    </p>
                  </div>
                  <p className="text-lg text-accent font-semibold">Gratis</p>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-accent" />
                <h2 className="text-2xl text-primary">Metode Pembayaran</h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-4 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={paymentMethod === "transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-accent"
                  />
                  <div className="flex-1">
                    <p className="text-lg text-primary">Transfer Bank</p>
                    <p className="text-sm text-muted-foreground">
                      BCA, BNI, Mandiri, BRI
                    </p>
                  </div>
                </label>

              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h2 className="text-2xl text-primary mb-6">Ringkasan Pesanan</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">
                    Subtotal ({totalItems} item)
                  </span>
                  <span className="text-primary font-medium">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Ongkos Kirim</span>
                  <span className="text-accent font-medium">
                    {shippingCost === 0 ? "Gratis" : `Rp ${shippingCost.toLocaleString("id-ID")}`}
                  </span>
                </div>
                {subtotal > 100000 && (
                  <p className="text-xs text-accent">
                    Selamat! Anda mendapatkan promo Gratis Ongkir.
                  </p>
                )}
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-2xl mb-6">
                    <span className="text-primary font-semibold">Total</span>
                    <span className="text-accent font-bold">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent hover:bg-accent/90 disabled:bg-muted disabled:text-muted-foreground text-white py-4 rounded-lg transition-colors text-lg font-medium mb-3 flex items-center justify-center gap-2"
              >
                {submitting ? "Memproses..." : "Buat Pesanan"}
              </button>
              <p className="text-sm text-muted-foreground text-center">
                Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang
                berlaku
              </p>
            </div>
          </div>
        </form>
      </div>

      {showDeliveryWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border border-border shadow-2xl text-center relative">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 text-destructive">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Wilayah di Luar Jangkauan</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Mohon maaf, metode pengiriman Kurir Lokal hanya tersedia untuk wilayah Selomartani atau dalam radius 5 km dari koordinat operasional kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setCourier("pickup");
                  setShowDeliveryWarningModal(false);
                }}
                className="flex-1 bg-accent hover:bg-accent/90 text-white py-3 rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                Ubah ke Ambil di Lokasi
              </button>
              <button
                type="button"
                onClick={() => setShowDeliveryWarningModal(false)}
                className="flex-1 bg-secondary hover:bg-muted text-foreground py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                Batal / Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-border shadow-2xl relative my-8 text-left">
            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-lg font-bold"
              type="button"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-primary mb-4">
              Tambah Alamat Pengiriman Baru
            </h3>
            
            <form onSubmit={handleAddressSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Label Alamat (cth: Rumah, Kantor)</label>
                <input
                  type="text"
                  required
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Rumah / Kantor / Apartemen"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Nama Penerima</label>
                  <input
                    type="text"
                    required
                    value={addressForm.receiver_name}
                    onChange={(e) => setAddressForm({ ...addressForm, receiver_name: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Nama Penerima"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">No. Telepon</label>
                  <input
                    type="tel"
                    required
                    value={addressForm.receiver_phone}
                    onChange={(e) => setAddressForm({ ...addressForm, receiver_phone: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  required
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Nama jalan, RT/RW, nomor rumah"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Kelurahan/Desa</label>
                  <input
                    type="text"
                    required
                    value={addressForm.kelurahan}
                    onChange={(e) => setAddressForm({ ...addressForm, kelurahan: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Kecamatan</label>
                  <input
                    type="text"
                    required
                    value={addressForm.kecamatan}
                    onChange={(e) => setAddressForm({ ...addressForm, kecamatan: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Kota/Kabupaten</label>
                  <input
                    type="text"
                    required
                    value={addressForm.kabupaten}
                    onChange={(e) => setAddressForm({ ...addressForm, kabupaten: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Provinsi</label>
                  <input
                    type="text"
                    required
                    value={addressForm.provinsi}
                    onChange={(e) => setAddressForm({ ...addressForm, provinsi: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Kode Pos</label>
                  <input
                    type="text"
                    required
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Pilih Titik di Peta</label>
                <div id="checkout-address-map" style={{ height: '180px' }} className="rounded-lg border border-border bg-muted mb-1 overflow-hidden"></div>
                <span className="text-[10px] text-muted-foreground">
                  Koordinat: {addressForm.latitude ? Number(addressForm.latitude).toFixed(6) : "-"}, {addressForm.longitude ? Number(addressForm.longitude).toFixed(6) : "-"}
                </span>
              </div>
              <label className="flex items-center gap-2 text-xs text-primary font-medium cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={addressForm.is_default}
                  onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                Atur sebagai alamat utama (default)
              </label>

              <div className="flex gap-2 pt-3 border-t border-border mt-4">
                <button
                  type="submit"
                  disabled={addressSaving}
                  className="flex-1 bg-accent hover:bg-accent/90 disabled:bg-muted disabled:text-muted-foreground text-white py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  {addressSaving ? "Menyimpan..." : "Simpan Alamat"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 bg-secondary hover:bg-muted text-foreground py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
