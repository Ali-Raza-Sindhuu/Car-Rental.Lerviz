import { Target, Sparkles, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal, RevealWords } from './Reveal'
import { aboutFeatures } from '../data/dummyData'

const icons = {
  target: Target,
  sparkles: Sparkles,
  'shield-check': ShieldCheck,
}

export default function About() {
  return (
    <section className="py-20 px-5">
      <div className="max-w-[1380px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <Reveal>
          <div className="flex flex-col gap-6">
            <RevealWords
              as="h3"
              text="More Than a Showroom— A Destination for True Driving Enthusiasts"
              className="font-display text-2xl md:text-4xl font-semibold tracking-wide2"
            />
            <p className="text-mist text-base md:text-lg max-w-lg">
              Levrix redefines the car buying experience through curated
              vehicles, refined presentation, and a commitment to excellence.
            </p>
            <Link to="/inventory" className="btn-outline self-start">
              Browse Inventory
            </Link>

            <div className="mt-6 rounded-2xl overflow-hidden aspect-[16/10] border-line card-border">
              <img
                src="https://placehold.co/900x560/141414/333333?text=Showroom"
                alt="Levrix showroom"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-4">
          {aboutFeatures.map((f, i) => {
            const Icon = icons[f.icon]
            return (
              <Reveal key={f.title} delay={i * 0.1}>
                <div className="flex gap-4 items-start p-6 rounded-lg border card-border">
                  <div className="w-10 h-10 rounded-md bg-accent-soft flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-base font-medium mb-1">{f.title}</h4>
                    <p className="text-mist text-sm">{f.text}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
