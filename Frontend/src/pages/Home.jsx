import About from "../components/About";
import Blogs from "../components/Blog";
import PartnersLogo from "../components/Carousel";
import WhyChooseUs from "../components/ChoseUs";
import CtaSection from "../components/CtaSection";
import Gallery from "../components/Gallery";
import Hero from "../components/Hero";
import Intro from "../components/Intro";
import Inventory from "../components/Inventory";
import SpecialOffers from "../components/SpecialOffers";
import Team from "../components/Team";
import Testimonials from "../components/Testemonial";
import VideoHero from "../components/VideoHero";

export default function Home() {
  return (
    <>
    <Hero/>
    <PartnersLogo/>
    <Intro/>
    <About/>
    <Inventory/>
    <WhyChooseUs/>
    <Testimonials/>
    <SpecialOffers/>
    <VideoHero/>
    <Team/>
    <Gallery/>
    <Blogs/>
    <CtaSection/>
    </>
  );
}
