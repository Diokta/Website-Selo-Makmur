import { useState, useEffect } from "react";
import { Users, MapPin, Sprout, Building2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export function ProfileStats() {
  const [totalPoktan, setTotalPoktan] = useState<number>(0);
  const [totalFarmers, setTotalFarmers] = useState<number>(0);
  const [totalCommodities, setTotalCommodities] = useState<number>(0);
  const [totalLuasLahan, setTotalLuasLahan] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveStats() {
      try {
        setLoading(true);

        // 1. Fetch Kelompok Tani data
        const { data: poktanData } = await supabase
          .from("kelompok_tani")
          .select("jumlah_anggota, luas_lahan_ha, komoditas_utama");

        if (poktanData) {
          const poktanCount = poktanData.length;
          const farmersCount = poktanData.reduce((acc, p) => acc + (Number(p.jumlah_anggota) || 0), 0);
          const luasSum = poktanData.reduce((acc, p) => acc + (Number(p.luas_lahan_ha) || 0), 0);

          setTotalPoktan(poktanCount);
          setTotalFarmers(farmersCount);
          setTotalLuasLahan(Math.round(luasSum * 10) / 10);

          // Extract unique commodities
          const komoditasSet = new Set<string>();
          poktanData.forEach((p) => {
            if (p.komoditas_utama) {
              p.komoditas_utama.split(/[,;\n]/).forEach((k: string) => {
                const trimmed = k.trim();
                if (trimmed) komoditasSet.add(trimmed.toLowerCase());
              });
            }
          });

          // Fetch active products categories
          const { data: productsData } = await supabase
            .from("products")
            .select("category")
            .eq("status", "Aktif");

          if (productsData) {
            productsData.forEach((prod) => {
              if (prod.category) komoditasSet.add(prod.category.trim().toLowerCase());
            });
          }

          setTotalCommodities(komoditasSet.size > 0 ? komoditasSet.size : (productsData?.length || 0));
        }
      } catch (err) {
        console.error("Error fetching live stats from poktan data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLiveStats();
  }, []);

  const stats = [
    {
      icon: Building2,
      value: loading ? "..." : String(totalPoktan),
      label: "Kelompok Tani",
      description: "Poktan Terdaftar",
    },
    {
      icon: Users,
      value: loading ? "..." : String(totalFarmers),
      label: "Petani Mitra",
      description: "Total Anggota Poktan",
    },
    {
      icon: Sprout,
      value: loading ? "..." : String(totalCommodities),
      label: "Komoditas",
      description: "Hasil Panen & Produk",
    },
    {
      icon: MapPin,
      value: loading ? "..." : `${totalLuasLahan} Ha`,
      label: "Luas Lahan",
      description: "Total Area Pertanian",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl text-primary mb-4 font-semibold">
            Tentang Gapoktan Kami
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Gabungan Kelompok Tani yang berkomitmen menghadirkan produk pertanian berkualitas tinggi langsung dari petani lokal ke meja Anda
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl p-6 sm:p-8 text-center hover:shadow-lg transition-shadow bg-background border border-border"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-accent rounded-full mb-4 shadow-sm">
                <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-4xl sm:text-5xl text-primary mb-2 font-bold">
                {stat.value}
              </div>
              <div className="text-lg sm:text-xl text-primary mb-1 font-semibold">
                {stat.label}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
