import AboutPreview from "@/components/home/AboutPreview";
import FeatureStrip from "@/components/home/FeatureStrip";
import Footer from "@/components/home/Footer";
import GalleryPreview from "@/components/home/GalleryPreview";
import HeroSection from "@/components/home/HeroSection";
import MenuPreview from "@/components/home/MenuPreview";
import ReservationCTA from "@/components/home/ReservationCTA";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeatureStrip />
      <AboutPreview />
      <MenuPreview />
      <GalleryPreview />
      <ReservationCTA />
      <Footer />
    </main>
  );
}
