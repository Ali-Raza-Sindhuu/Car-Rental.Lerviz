import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Inventory from "@/components/home/Inventory";
import Offer from "@/components/home/Offer";
import Testimonials from "@/components/home/Testimonials";
import Brands from "@/components/home/Brands";
import Faq from "@/components/home/Faq";
import Cta from "@/components/home/Cta";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[1360px] space-y-24 px-4 pb-6 md:space-y-32 md:px-8">
      <Hero />
      <About />
      <Inventory />
      <Offer />
      <Testimonials />
      <Brands />
      <Faq />
      <Cta />
      <Footer />
    </main>
  );
}
