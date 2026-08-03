import { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Target, History, Users, Award, Wrench } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useWebsiteContent } from "../../hooks/useWebsiteContent";

export function About() {
  const { getContent } = useWebsiteContent();
  const name = getContent("identity.name", "Gapoktan Selo Makmur");
  const visi = getContent("visi", "Menjadi organisasi kelompok tani yang mandiri, profesional, dan berkelanjutan dalam menghasilkan produk pertanian berkualitas tinggi untuk meningkatkan kesejahteraan petani dan masyarakat.");
  const misiText = getContent("misi", "Meningkatkan kualitas produksi pertanian melalui teknologi modern\nMembangun kemitraan strategis dengan berbagai pihak\nMemberdayakan petani melalui pelatihan dan pendampingan\nMenjaga kelestarian lingkungan dan pertanian berkelanjutan");
  const misiList = misiText.split("\n").map(item => item.replace(/^[•\-\*\s]+/, "").trim()).filter(line => line !== "");

  const rawOrg = getContent("structure.organization");
  let leadership = [
    {
      name: "Bapak Sutrisno",
      position: "Ketua Gapoktan",
      image: "https://images.unsplash.com/photo-1602511706963-02ecf61637b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Ibu Sumiati",
      position: "Wakil Ketua",
      image: "https://images.unsplash.com/photo-1676281945404-4e1cb6eaf25e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Bapak Darmawan",
      position: "Sekretaris",
      image: "https://images.unsplash.com/photo-1673746759526-375ad76cb399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Ibu Widya Sari",
      position: "Bendahara",
      image: "https://images.unsplash.com/photo-1673746759528-e48f0dce5896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Bapak Hendra",
      position: "Kepala Seksi Usaha",
      image: "https://images.unsplash.com/photo-1676281945191-4c0ed1a1784d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Ibu Ratna",
      position: "Kepala Seksi Produksi",
      image: "https://images.unsplash.com/photo-1676281945404-4e1cb6eaf25e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxJbmRvbmVzaWFuJTIwZmFybWVycyUyMHdvcmtpbmclMjBpbiUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3ODA0NjExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  if (rawOrg) {
    try {
      const parsed = JSON.parse(rawOrg);
      if (Array.isArray(parsed) && parsed.length > 0) {
        leadership = parsed;
      }
    } catch (e) {
      console.warn("Failed to parse structure.organization JSON:", e);
    }
  }

  const [poktan, setPoktan] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch kelompok tani
      const { data: poktanData } = await supabase
        .from("kelompok_tani")
        .select("*")
        .order("nama", { ascending: true });
      if (poktanData) {
        setPoktan(
          poktanData.map((item) => ({
            name: item.nama,
            ketua: item.ketua ?? "-",
            lokasi: item.dusun ?? "-",
            komoditas: item.komoditas_utama ?? "-",
          }))
        );
      }

      // Fetch assets
      const { data: assetsData } = await supabase
        .from("gapoktan_assets")
        .select("*")
        .order("nama", { ascending: true });
      if (assetsData) {
        setAssets(
          assetsData.map((item) => ({
            nama: item.nama,
            deskripsi: item.deskripsi ?? "",
            kondisi: item.kondisi ?? "Baik",
            tahun: item.tahun_perolehan ? String(item.tahun_perolehan) : "-",
            image: item.image_url ?? "https://images.unsplash.com/photo-1605146959272-0e97a1159b0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
          }))
        );
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary to-accent py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
            Tentang Kami
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            Mengenal lebih dekat {name}
          </p>
        </div>
      </div>

      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-accent" />
                <h2 className="text-3xl sm:text-4xl text-primary">Visi</h2>
              </div>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {visi}
              </p>
            </div>
            <div className="bg-secondary p-6 sm:p-8 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-accent" />
                <h2 className="text-3xl sm:text-4xl text-primary">Misi</h2>
              </div>
              <ul className="space-y-3 text-base sm:text-lg text-muted-foreground">
                {misiList.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-accent flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <History className="w-8 h-8 text-accent" />
              <h2 className="text-3xl sm:text-4xl text-primary">Sejarah Singkat</h2>
            </div>
            <div className="max-w-4xl mx-auto space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              <p>
                Gabungan Kelompok Tani (Gapoktan) Selo Makmur didirikan pada tahun 2015 atas inisiatif para petani di wilayah Desa Selomartani, Kecamatan Kalasan, Kabupaten Sleman, D.I. Yogyakarta. Berawal dari 8 kelompok tani kecil, kami berkembang menjadi wadah bagi kelompok-kelompok tani yang tersebar di berbagai dusun.
              </p>
              <p>
                Sejak awal berdiri, Gapoktan Selo Makmur berkomitmen untuk meningkatkan kesejahteraan petani melalui peningkatan kualitas produksi, akses pasar yang lebih luas, dan penerapan teknologi pertanian modern. Kami juga aktif dalam berbagai program pemerintah seperti distribusi pupuk bersubsidi, bantuan alat pertanian, dan pelatihan budidaya organik.
              </p>
              <p>
                Pada tahun 2020, Gapoktan Selo Makmur meraih penghargaan sebagai Gapoktan Terbaik tingkat Kabupaten Sleman atas prestasi dalam peningkatan produksi padi dan diversifikasi komoditas pertanian. Hingga kini, kami terus berinovasi untuk memberikan yang terbaik bagi anggota dan masyarakat.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8 sm:mb-12 justify-center">
            <Users className="w-8 h-8 text-accent" />
            <h2 className="text-3xl sm:text-4xl text-primary">Struktur Organisasi</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {leadership.map((person, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <ImageWithFallback
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 sm:p-6 text-center">
                  <h3 className="text-lg sm:text-xl text-primary mb-2">
                    {person.name}
                  </h3>
                  <p className="text-sm sm:text-base text-accent">
                    {person.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aset Gapoktan */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8 sm:mb-12 justify-center">
            <Wrench className="w-8 h-8 text-accent" />
            <h2 className="text-3xl sm:text-4xl text-primary">Aset & Peralatan</h2>
          </div>
          <p className="text-center text-base sm:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Gapoktan Selo Makmur dilengkapi dengan berbagai peralatan modern untuk mendukung proses produksi dan pasca panen anggota.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((aset, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-border">
                <div className="h-48 overflow-hidden">
                  <ImageWithFallback
                    src={aset.image}
                    alt={aset.nama}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg text-primary mb-2">{aset.nama}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{aset.deskripsi}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                      Tahun {aset.tahun}
                    </span>
                    <span className="flex items-center gap-1 text-accent">
                      <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
                      Kondisi {aset.kondisi}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl text-primary mb-8 sm:mb-12 text-center">
            Daftar Kelompok Tani (Poktan)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-3 sm:p-4 text-left text-sm sm:text-base">No</th>
                  <th className="p-3 sm:p-4 text-left text-sm sm:text-base">Nama Poktan</th>
                  <th className="p-3 sm:p-4 text-left text-sm sm:text-base">Ketua</th>
                  <th className="p-3 sm:p-4 text-left text-sm sm:text-base">Lokasi</th>
                  <th className="p-3 sm:p-4 text-left text-sm sm:text-base">Komoditas</th>
                </tr>
              </thead>
              <tbody>
                {poktan.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-secondary"}
                  >
                    <td className="p-3 sm:p-4 text-sm sm:text-base">{index + 1}</td>
                    <td className="p-3 sm:p-4 text-sm sm:text-base text-primary">{item.name}</td>
                    <td className="p-3 sm:p-4 text-sm sm:text-base">{item.ketua}</td>
                    <td className="p-3 sm:p-4 text-sm sm:text-base">{item.lokasi}</td>
                    <td className="p-3 sm:p-4 text-sm sm:text-base text-accent">{item.komoditas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
