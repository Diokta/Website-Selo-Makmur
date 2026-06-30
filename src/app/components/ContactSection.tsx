import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useWebsiteContent } from "../../hooks/useWebsiteContent";

export function ContactSection() {
  const { getContent } = useWebsiteContent();

  const name = getContent("identity.name", "Gabungan Kelompok Tani Selo Makmur");
  const address = getContent("identity.address", "Jl. Letda Abdul Jalil, Salakan, Selomartani, Kalasan, Sleman, Daerah Istimewa Yogyakarta 55571");
  const phone = getContent("identity.phone", "+62 251 8123456");
  const email = getContent("identity.email", "info@gapoktansukamaju.id");

  const contactInfo = [
    {
      icon: MapPin,
      title: "Alamat Sekretariat",
      content: address,
    },
    {
      icon: Phone,
      title: "Telepon",
      content: phone,
    },
    {
      icon: Mail,
      title: "Email",
      content: email,
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      content: "Senin - Jumat: 08.00 - 16.00 WIB",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 text-white" style={{ backgroundColor: "var(--footer-background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4">
            Hubungi Kami
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto px-4">
            Kami siap membantu kebutuhan produk pertanian Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 sm:p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/15 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent rounded-lg flex items-center justify-center">
                    <info.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg mb-1 sm:mb-2">
                    {info.title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/80">
                    {info.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 h-64 sm:h-80 lg:h-full min-h-[300px]">
            <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center">
              <div className="text-center px-4">
                <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-white/60 mx-auto mb-3 sm:mb-4" />
                <p className="text-base sm:text-lg text-white/80">
                  Peta Lokasi
                </p>
                <p className="text-xs sm:text-sm text-white/60 mt-2">
                  Selomartani, Kalasan, Sleman, DIY
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-white/20 text-center">
          <p className="text-sm sm:text-base text-white/80">
            © 2026 {name}. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </section>
  );
}
