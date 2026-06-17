import { HeroSection } from "../components/HeroSection";
import { ProfileStats } from "../components/ProfileStats";
import { ProductCarousel } from "../components/ProductCarousel";
import { NewsSection } from "../components/NewsSection";
import { ContactSection } from "../components/ContactSection";

export function Home() {
  return (
    <div>
      <HeroSection />
      <ProfileStats />
      <ProductCarousel />
      <NewsSection />
      <ContactSection />
    </div>
  );
}
