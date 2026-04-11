import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HotelSection from "@/components/HotelSection";
import VehicleSection from "@/components/VehicleSection";
import ExperienceSection from "@/components/ExperienceSection";
import PlacesSection from "@/components/PlacesSection";
import MoodSection from "@/components/MoodSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HotelSection />
      <VehicleSection />
      <ExperienceSection />
      <PlacesSection />
      <MoodSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
