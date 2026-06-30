import { useState, useEffect } from "react";
import { Link } from "react-router";
import { MapPin, ShoppingBag, Plus, Trash2, Edit } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export function Addresses() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Saved addresses states
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressForm, setAddressForm] = useState<any>({
    label: "",
    receiver_name: "",
    receiver_phone: "",
    address: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    postal_code: "",
    latitude: -6.5971,
    longitude: 106.8060,
    is_default: false
  });
  const [addressSaving, setAddressSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const loadAddressesData = async () => {
      setLoading(true);
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        if (profileData) {
          setProfile(profileData);
        }

        // Fetch user addresses
        const { data: addressesData } = await supabase
          .from("user_addresses")
          .select("*")
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false });

        if (addressesData) {
          setAddresses(addressesData);
        }
      } catch (err) {
        console.error("Error loading addresses data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAddressesData();
  }, [user, authLoading]);

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
      const existingAddressMap = (window as any).addressMapInstance;
      if (existingAddressMap) {
        existingAddressMap.remove();
        (window as any).addressMapInstance = null;
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

    const initialLat = addressForm.latitude || -6.5971;
    const initialLng = addressForm.longitude || 106.8060;

    const mapContainer = document.getElementById("address-map");
    if (!mapContainer) return;

    const existingMap = (window as any).addressMapInstance;
    if (existingMap) {
      existingMap.remove();
    }

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const map = L.map("address-map").setView([initialLat, initialLng], 13);
    (window as any).addressMapInstance = map;

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

  const handleSetDefaultAddress = async (id: string) => {
    if (!user) return;
    try {
      await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
      
      const { error } = await supabase
        .from("user_addresses")
        .update({ is_default: true })
        .eq("id", id);
      
      if (error) throw error;
      
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === id 
            ? { ...addr, is_default: true } 
            : { ...addr, is_default: false }
        ).sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))
      );
      setSuccessMsg("Alamat utama berhasil diubah.");
    } catch (err) {
      console.error("Gagal mengubah alamat utama:", err);
      setErrorMsg("Gagal mengubah alamat utama.");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus alamat ini?");
    if (!confirmDelete) return;
    try {
      const { error } = await supabase
        .from("user_addresses")
        .delete()
        .eq("id", id);
      if (error) throw error;
      
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      setSuccessMsg("Alamat berhasil dihapus.");
    } catch (err) {
      console.error("Gagal menghapus alamat:", err);
      setErrorMsg("Gagal menghapus alamat.");
    }
  };

  const openAddressModal = (addr: any) => {
    if (addr) {
      setEditingAddress(addr);
      setAddressForm({
        label: addr.label,
        receiver_name: addr.receiver_name,
        receiver_phone: addr.receiver_phone,
        address: addr.address,
        kelurahan: addr.kelurahan,
        kecamatan: addr.kecamatan,
        kabupaten: addr.kabupaten,
        provinsi: addr.provinsi,
        postal_code: addr.postal_code,
        latitude: addr.latitude || -6.5971,
        longitude: addr.longitude || 106.8060,
        is_default: addr.is_default
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        label: "Rumah",
        receiver_name: profile?.name || "",
        receiver_phone: profile?.phone || "",
        address: "",
        kelurahan: "",
        kecamatan: "",
        kabupaten: "",
        provinsi: "",
        postal_code: "",
        latitude: -6.5971,
        longitude: 106.8060,
        is_default: addresses.length === 0
      });
    }
    setShowAddressModal(true);
  };

  const handleAddressSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAddressSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      if (addressForm.is_default) {
        await supabase
          .from("user_addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      if (editingAddress) {
        const { data, error } = await supabase
          .from("user_addresses")
          .update({
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
          .eq("id", editingAddress.id)
          .select()
          .single();

        if (error) throw error;
        setAddresses((prev) =>
          prev.map((addr) => (addr.id === editingAddress.id ? data : addr))
              .sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))
        );
        setSuccessMsg("Alamat berhasil diperbarui.");
      } else {
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
        setAddresses((prev) => [data, ...prev]
          .sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))
        );
        setSuccessMsg("Alamat baru berhasil ditambahkan.");
      }
      setShowAddressModal(false);
    } catch (err: any) {
      console.error("Gagal menyimpan alamat:", err);
      setErrorMsg(err.message || "Gagal menyimpan alamat.");
    } finally {
      setAddressSaving(false);
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
            Silakan masuk terlebih dahulu untuk melihat alamat Anda.
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

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-accent py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl text-white mb-4">Alamat Saya</h1>
          <p className="text-lg sm:text-xl text-white/90">
            Kelola daftar alamat pengiriman belanja Anda
          </p>
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

        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md border border-border text-left">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center animate-pulse">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">Daftar Alamat</h3>
                <p className="text-xs text-muted-foreground">Kelola alamat pengiriman utama dan cadangan Anda</p>
              </div>
            </div>
            <button
              onClick={() => openAddressModal(null)}
              className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Tambah Alamat
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-base text-muted-foreground">Belum ada alamat pengiriman yang disimpan.</p>
              <button
                onClick={() => openAddressModal(null)}
                className="text-accent hover:underline font-medium mt-2 inline-block text-sm"
              >
                Tambah Alamat Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-4 rounded-xl border text-xs relative flex flex-col justify-between ${
                    addr.is_default 
                      ? "border-accent bg-accent/5" 
                      : "border-border hover:border-accent/40 bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="font-bold text-sm text-primary">{addr.label}</span>
                      {addr.is_default && (
                        <span className="bg-accent text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                          Utama
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-primary mb-1 text-xs">{addr.receiver_name} ({addr.receiver_phone})</p>
                    <p className="text-muted-foreground leading-relaxed text-xs">
                      {addr.address}, Kel. {addr.kelurahan}, Kec. {addr.kecamatan}, {addr.kabupaten}, Prov. {addr.provinsi}, {addr.postal_code}
                    </p>
                    {addr.latitude && addr.longitude && (
                      <a
                        href={`https://www.google.com/maps?q=${addr.latitude},${addr.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-accent font-semibold hover:underline inline-flex items-center gap-1 mt-2"
                      >
                        📍 Buka di Google Maps ↗
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-secondary/20">
                    {!addr.is_default && (
                      <button
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        Set Utama
                      </button>
                    )}
                    <button
                      onClick={() => openAddressModal(addr)}
                      className="text-xs text-accent hover:text-accent/80 transition-colors font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-xs text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-border shadow-2xl relative my-8">
            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-lg font-bold"
              type="button"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-primary mb-4">
              {editingAddress ? "Edit Alamat Pengiriman" : "Tambah Alamat Pengiriman"}
            </h3>
            
            <form onSubmit={handleAddressSave} className="space-y-4 text-left max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Label Alamat (cth: Rumah, Kantor)</label>
                <input
                  type="text"
                  required
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs"
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
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs"
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
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs"
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
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs"
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
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Kecamatan</label>
                  <input
                    type="text"
                    required
                    value={addressForm.kecamatan}
                    onChange={(e) => setAddressForm({ ...addressForm, kecamatan: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs"
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
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Provinsi</label>
                  <input
                    type="text"
                    required
                    value={addressForm.provinsi}
                    onChange={(e) => setAddressForm({ ...addressForm, provinsi: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Kode Pos</label>
                  <input
                    type="text"
                    required
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Pilih Titik di Peta</label>
                <div id="address-map" style={{ height: '180px' }} className="rounded-lg border border-border bg-muted mb-1 overflow-hidden"></div>
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
