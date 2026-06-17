import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Target, History, Users, Award, Wrench } from "lucide-react";

export function About() {
  const leadership = [
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

  const poktan = [
    { name: "Poktan Harapan Jaya", ketua: "Bapak Suparman", lokasi: "Dusun Cipanas", komoditas: "Padi, Jagung" },
    { name: "Poktan Maju Bersama", ketua: "Ibu Siti Aminah", lokasi: "Dusun Cibeureum", komoditas: "Sayuran Organik" },
    { name: "Poktan Berkah Tani", ketua: "Bapak Ahmad Yani", lokasi: "Dusun Cijeruk", komoditas: "Padi, Cabai" },
    { name: "Poktan Sumber Rezeki", ketua: "Bapak Bambang", lokasi: "Dusun Pasir Angin", komoditas: "Hortikultura" },
    { name: "Poktan Tani Makmur", ketua: "Ibu Eka Wati", lokasi: "Dusun Cisarua", komoditas: "Padi, Sayuran" },
    { name: "Poktan Subur Jaya", ketua: "Bapak Wahyudi", lokasi: "Dusun Bojong", komoditas: "Buah-buahan" },
    { name: "Poktan Mandiri", ketua: "Bapak Solihin", lokasi: "Dusun Cimande", komoditas: "Padi, Palawija" },
    { name: "Poktan Sejahtera", ketua: "Ibu Nurhasanah", lokasi: "Dusun Sukajaya", komoditas: "Sayuran, Bumbu" },
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary to-accent py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
            Tentang Kami
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            Mengenal lebih dekat Gabungan Kelompok Tani Selo Makmur
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
                Menjadi organisasi kelompok tani yang mandiri, profesional, dan berkelanjutan dalam menghasilkan produk pertanian berkualitas tinggi untuk meningkatkan kesejahteraan petani dan masyarakat.
              </p>
            </div>
            <div className="bg-secondary p-6 sm:p-8 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-accent" />
                <h2 className="text-3xl sm:text-4xl text-primary">Misi</h2>
              </div>
              <ul className="space-y-3 text-base sm:text-lg text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-accent flex-shrink-0">•</span>
                  <span>Meningkatkan kualitas produksi pertanian melalui teknologi modern</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent flex-shrink-0">•</span>
                  <span>Membangun kemitraan strategis dengan berbagai pihak</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent flex-shrink-0">•</span>
                  <span>Memberdayakan petani melalui pelatihan dan pendampingan</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent flex-shrink-0">•</span>
                  <span>Menjaga kelestarian lingkungan dan pertanian berkelanjutan</span>
                </li>
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
                Gabungan Kelompok Tani (Gapoktan) Selo Makmur didirikan pada tahun 2015 atas inisiatif para petani di wilayah Kecamatan Cisarua, Kabupaten Bogor. Berawal dari 8 kelompok tani kecil, kami berkembang menjadi wadah bagi 24 kelompok tani yang tersebar di berbagai dusun.
              </p>
              <p>
                Sejak awal berdiri, Gapoktan Selo Makmur berkomitmen untuk meningkatkan kesejahteraan petani melalui peningkatan kualitas produksi, akses pasar yang lebih luas, dan penerapan teknologi pertanian modern. Kami juga aktif dalam berbagai program pemerintah seperti distribusi pupuk bersubsidi, bantuan alat pertanian, dan pelatihan budidaya organik.
              </p>
              <p>
                Pada tahun 2020, Gapoktan Selo Makmur meraih penghargaan sebagai Gapoktan Terbaik tingkat Kabupaten Bogor atas prestasi dalam peningkatan produksi padi dan diversifikasi komoditas pertanian. Hingga kini, kami terus berinovasi untuk memberikan yang terbaik bagi anggota dan masyarakat.
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
            {[
              {
                nama: "Mesin Penggiling Padi",
                deskripsi: "Kapasitas 2 ton/jam. Digunakan untuk menggiling gabah menjadi beras siap konsumsi.",
                kondisi: "Baik",
                tahun: "2021",
                image: "https://images.unsplash.com/photo-1605146959272-0e97a1159b0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
              },
              {
                nama: "Blower Pengering Gabah",
                deskripsi: "Pengering mekanis berkapasitas 5 ton/siklus untuk menjaga kualitas gabah di musim hujan.",
                kondisi: "Baik",
                tahun: "2022",
                image: "https://images.unsplash.com/photo-1669822818164-cf66cd0dac4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
              },
              {
                nama: "Traktor Tangan",
                deskripsi: "Traktor tangan untuk pengolahan lahan sawah. Tersedia 3 unit yang dapat dipinjam anggota.",
                kondisi: "Baik",
                tahun: "2020",
                image: "https://images.unsplash.com/photo-1668415762833-e0607ffae375?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
              },
              {
                nama: "Pompa Irigasi",
                deskripsi: "Pompa air untuk sistem irigasi sawah anggota. Debit 50 liter/detik.",
                kondisi: "Baik",
                tahun: "2021",
                image: "https://images.unsplash.com/photo-1645727527942-f12e14a0c841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
              },
              {
                nama: "Gudang Penyimpanan",
                deskripsi: "Gudang berkapasitas 50 ton untuk penyimpanan gabah dan sarana produksi pertanian.",
                kondisi: "Baik",
                tahun: "2019",
                image: "https://images.unsplash.com/photo-1556114846-f753bec8a9f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
              },
              {
                nama: "Mesin Combine Harvester",
                deskripsi: "Mesin panen padi modern yang dapat memanen sekaligus merontokkan gabah di lahan.",
                kondisi: "Baik",
                tahun: "2023",
                image: "https://images.unsplash.com/photo-1635223735346-8442e3601b58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
              },
            ].map((aset, index) => (
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
