import { MapPin, Phone, Mail, Send, MessageSquare } from "lucide-react";
import { useWebsiteContent } from "../../hooks/useWebsiteContent";

const getMapSrc = (input: string) => {
  if (!input) return "";
  if (input.includes("<iframe")) {
    const match = input.match(/src=["']([^"']+)["']/);
    return match ? match[1] : "";
  }
  return input;
};

const getWaLink = (input: string) => {
  if (!input) return "";
  const firstPart = input.split("|")[0];
  const cleanNumber = firstPart.replace(/[^\d+]/g, "");
  const finalNumber = cleanNumber.startsWith("0") ? "62" + cleanNumber.substring(1) : cleanNumber.replace("+", "");
  return `https://wa.me/${finalNumber}`;
};

export function Contact() {
  const { getContent } = useWebsiteContent();

  const address = getContent("identity.address", "Jl. Letda Abdul Jalil, Salakan, Selomartani, Kalasan, Sleman, Daerah Istimewa Yogyakarta 55571");
  const phone = getContent("identity.phone", "+62 251 8123456");
  const email = getContent("identity.email", "info@gapoktansukamaju.id");
  const whatsapp = getContent("identity.whatsapp", "+62 812 3456 7890 (Penjualan) | +62 813 4567 8901 (Organisasi)");
  const mapInput = getContent("identity.map", "");
  const mapUrl = getMapSrc(mapInput);

  const contactInfo = [
    {
      icon: MapPin,
      title: "Alamat Sekretariat",
      content: address,
      link: null,
    },
    {
      icon: Phone,
      title: "Telepon",
      content: phone,
      link: `tel:${phone.replace(/\s+/g, "")}`,
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Admin",
      content: whatsapp,
      link: getWaLink(whatsapp),
    },
    {
      icon: Mail,
      title: "Email",
      content: email,
      link: `mailto:${email}`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-accent py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl text-white mb-4">
            Hubungi Kami
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            Kami siap membantu kebutuhan produk pertanian Anda
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl text-primary mb-6">
              Informasi Kontak
            </h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                const content = info.link ? (
                  <a
                    href={info.link}
                    className="text-accent hover:text-accent/80 transition-colors"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-base sm:text-lg text-muted-foreground">
                    {info.content}
                  </p>
                );

                return (
                  <div
                    key={index}
                    className="flex gap-4 p-4 sm:p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg text-primary mb-2">
                        {info.title}
                      </h3>
                      {content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl text-primary mb-6">
              Kirim Pesan
            </h2>
            <form className="bg-white rounded-xl p-6 sm:p-8 shadow-md space-y-5">
              <div>
                <label className="block text-base mb-2 text-foreground">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-base mb-2 text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-base mb-2 text-foreground">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  placeholder="08XX-XXXX-XXXX"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-base mb-2 text-foreground">
                  Subjek
                </label>
                <input
                  type="text"
                  placeholder="Perihal pesan Anda"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-base mb-2 text-foreground">
                  Pesan
                </label>
                <textarea
                  rows={5}
                  placeholder="Tulis pesan Anda di sini..."
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-white py-3 sm:py-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-base sm:text-lg"
              >
                <Send className="w-5 h-5" />
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-md">
          <div className="h-96 sm:h-[500px] bg-secondary flex items-center justify-center relative">
            {mapUrl ? (
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi Sekretariat"
                className="w-full h-full absolute inset-0"
              ></iframe>
            ) : (
              <div className="text-center px-4">
                <MapPin className="w-16 h-16 sm:w-20 sm:h-20 text-accent mx-auto mb-4" />
                <h3 className="text-2xl sm:text-3xl text-primary mb-3">
                  Peta Lokasi
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground mb-2">
                  Sekretariat Gapoktan Selo Makmur
                </p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {address}
                </p>
                <p className="text-sm text-muted-foreground mt-4 italic">
                  (Peta lokasi belum dikonfigurasi)
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-accent/10 rounded-xl p-6 sm:p-8 border-l-4 border-accent">
          <h3 className="text-xl text-primary mb-3">Layanan Pelanggan</h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            Tim kami siap melayani pertanyaan Anda seputar produk, pemesanan, atau
            kerjasama. Untuk respon lebih cepat, hubungi kami melalui WhatsApp
            Admin Penjualan. Kami akan membalas pesan Anda dalam 1x24 jam pada
            hari kerja.
          </p>
        </div>
      </div>
    </div>
  );
}
