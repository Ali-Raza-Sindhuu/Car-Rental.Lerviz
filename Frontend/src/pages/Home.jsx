import Hero from '../components/Hero'
import PartnersTicker from '../components/PartnersTicker'
import Intro from '../components/Intro'
import About from '../components/About'
import InventoryPreview from '../components/InventoryPreview'
import WhyChooseUs from '../components/WhyChooseUs'
import Testimonials from '../components/Testimonials'
import SpecialOffers from '../components/SpecialOffers'
import VideoShowcase from '../components/VideoShowcase'
import Team from '../components/Team'
import Gallery from '../components/Gallery'
import BlogsPreview from '../components/BlogsPreview'
import CTA from '../components/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <PartnersTicker />
      <Intro />
      <About />
      <InventoryPreview />
      <WhyChooseUs />
      <Testimonials />
      <SpecialOffers />
      <VideoShowcase />
      <Team />
      <Gallery />
      <BlogsPreview />
      <CTA />
    </>
  )
}
