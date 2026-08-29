import { Link } from 'react-router-dom'
import { Reveal, RevealWords } from './Reveal'

export default function CTA() {
  return (
    <section className="relative py-28 px-5 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://placehold.co/1600x900/0a0a0a/1a1a1a?text=%20"
          alt=""
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
      </div>

      <div className="relative max-w-2xl mx-auto text-center flex flex-col items-center">
        <RevealWords
          as="h2"
          text="Ready to Find Your Perfect Car?"
          className="font-display text-2xl md:text-4xl font-semibold tracking-wide2 mb-5"
        />
        <Reveal delay={0.1}>
          <p className="text-mist text-base md:text-lg mb-8">
            Premium vehicles, exceptional service, unbeatable deals.
            Experience automotive excellence crafted for the discerning
            driver.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <Link to="/inventory" className="btn-primary">
            Browse Cars
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
