import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-9xl sm:text-[12rem] text-accent mb-4">404</h1>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-primary mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman
            telah dipindahkan atau tidak pernah ada.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors text-base sm:text-lg"
          >
            <Home className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-secondary text-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors border border-border text-base sm:text-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Halaman Sebelumnya
          </button>
        </div>
      </div>
    </div>
  );
}
