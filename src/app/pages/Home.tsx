import { HeroSection } from "../components/HeroSection";
import { CsrAamaiSection } from "../components/CsrAamaiSection";
import { ProfileStats } from "../components/ProfileStats";
import { ProductCarousel } from "../components/ProductCarousel";
import { GapoktanAssetsSection } from "../components/GapoktanAssetsSection";
import { NewsSection } from "../components/NewsSection";
import { ContactSection } from "../components/ContactSection";

export function Home() {
  return (
    <div>
      <HeroSection />
      <CsrAamaiSection />
      <ProfileStats />
      <ProductCarousel />
      <GapoktanAssetsSection />
      <NewsSection />
      <ContactSection />
    </div>
  );
}
