import { Link } from 'react-router-dom'
import { Gauge, Cog, Calendar } from 'lucide-react'
import { Reveal } from './Reveal'
import { inventory } from '../data/dummyData'

export default function InventoryPreview() {
  return (
    <section className="py-20 px-5">
      <div className="max-w-[1380px] mx-auto grid md:grid-cols-3 gap-6">
        {inventory.map((car, i) => (
          <Reveal key={car.slug} delay={i * 0.1}>
            <Link
              to={`/inventory/${car.slug}`}
              className="group relative block rounded-2xl overflow-hidden aspect-[3/4] card-border"
            >
              <img
                src={`https://placehold.co/700x900/141414/2a2a2a?text=${encodeURIComponent(
                  car.name
                )}`}
                alt={car.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col items-center text-center gap-3">
                <h3 className="font-display text-xl font-semibold">
                  {car.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-mist flex-wrap justify-center">
                  <span className="flex items-center gap-1.5">
                    <Gauge size={16} /> {car.topSpeed}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Cog size={16} /> {car.transmission}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={16} /> {car.year}
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
