import { Users, MapPin, Sprout } from "lucide-react";

export function ProfileStats() {
  const stats = [
    {
      icon: Users,
      value: "24",
      label: "Kelompok Tani",
      description: "Poktan Aktif",
    },
    {
      icon: MapPin,
      value: "850",
      label: "Hektar",
      description: "Luas Lahan",
    },
    {
      icon: Sprout,
      value: "12+",
      label: "Komoditas",
      description: "Hasil Panen",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl text-primary mb-4">
            Tentang Gapoktan Kami
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Gabungan Kelompok Tani yang berkomitmen menghadirkan produk pertanian berkualitas tinggi langsung dari petani lokal ke meja Anda
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl p-6 sm:p-8 text-center hover:shadow-lg transition-shadow bg-background"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-accent rounded-full mb-4">
                <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-4xl sm:text-5xl text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-lg sm:text-xl text-primary mb-1">
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
