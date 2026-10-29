import HeroSection from "@/features/home/components/HeroSection";
import AboutSection from "@/features/home/components/AboutSection";
import ServicesSection from "@/features/home/components/ServicesSection";
import CategorySection from "@/features/home/components/CategorySection";
import RentBanner from "@/features/home/components/RentBanner";
import CarListingSection from "@/features/home/components/CarListingSection";
import ShowcaseSection from "@/features/home/components/ShowcaseSection";
import UsedCarsSection from "@/features/home/components/UsedCarsSection";
import NewsletterSection from "@/features/home/components/NewsletterSection";

const HomePage = () => (
  <>
    <HeroSection />
    <AboutSection />
    <ServicesSection />
    <CategorySection />
    <RentBanner />
    <CarListingSection />
    <ShowcaseSection />
    <UsedCarsSection />
    <NewsletterSection />
  </>
);

export default HomePage;
