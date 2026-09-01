import About from "../components/About";
import PartnersLogo from "../components/Carousel";
import WhyChooseUs from "../components/ChoseUs";
import Hero from "../components/Hero";
import Intro from "../components/Intro";
import Inventory from "../components/Inventory";
import Testimonials from "../components/Testemonial";

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
    </>
  );
}
