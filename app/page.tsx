import HeroSection from "@/components/sections/HeroSection";
import FeaturesStrip from "@/components/sections/FeaturesStrip";
import FeaturedDishes from "@/components/sections/FeaturedDishes";
import Testimonials from "@/components/sections/Testimonials";
import ReservationCTA from "@/components/sections/ReservationCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesStrip />
      <FeaturedDishes />
      <Testimonials />
      <ReservationCTA />
    </>
  );
}
