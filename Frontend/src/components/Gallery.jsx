import { Reveal, RevealWords } from './Reveal'
import { gallery } from '../data/dummyData'

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 px-5 overflow-hidden">
      <div className="max-w-[1380px] mx-auto">
        <div className="max-w-2xl mb-12">
          <RevealWords
            as="h2"
            text="Future on Display"
            className="font-display text-2xl md:text-4xl font-semibold tracking-wide2 mb-4"
          />
          <Reveal delay={0.1}>
            <p className="text-mist text-base md:text-lg">
              A curated glimpse into the next generation of automotive
              performance.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {gallery.map((_, i) => (
            <Reveal
              key={i}
              delay={i * 0.06}
              y={i % 2 === 0 ? -20 : 20}
              className={i % 2 === 0 ? 'lg:mt-0' : 'lg:mt-8'}
            >
              <div className="rounded-xl overflow-hidden aspect-[3/4] card-border">
                <img
                  src={`https://placehold.co/400x520/141414/2a2a2a?text=${i + 1}`}
                  alt={`Gallery image ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
