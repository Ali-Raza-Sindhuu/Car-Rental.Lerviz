import { Reveal, RevealWords } from './Reveal'
import { whyChooseUs } from '../data/dummyData'

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-5">
      <div className="max-w-[1380px] mx-auto">
        <div className="max-w-2xl mb-12">
          <RevealWords
            as="h2"
            text="What Sets Us Apart"
            className="font-display text-2xl md:text-4xl font-semibold tracking-wide2 mb-4"
          />
          <Reveal delay={0.1}>
            <p className="text-white/90 text-base md:text-lg">
              We believe a car isn't just transportation. It's a statement of
              identity, ambition, and lifestyle.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] card-border">
                <img
                  src={`https://placehold.co/500x650/141414/2a2a2a?text=${encodeURIComponent(
                    item.title
                  )}`}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/40 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col gap-2">
                  <span className="w-8 h-8 rounded bg-accent-soft" />
                  <h4 className="font-medium text-lg">{item.title}</h4>
                  <p className="text-mist text-sm">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
