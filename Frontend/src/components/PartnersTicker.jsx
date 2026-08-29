import { useMarquee } from '../hooks/useMarquee'
import { partners } from '../data/dummyData'

export default function PartnersTicker() {
  const trackRef = useMarquee(50)
  const items = [...partners, ...partners]

  return (
    <section className="py-10 border-y border-line overflow-hidden bg-ink">
      <div ref={trackRef} className="flex items-center gap-16 w-max">
        {items.map((p, i) => (
          <div
            key={i}
            className="h-8 w-[160px] flex items-center justify-center opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
          >
            <img
              src={`https://placehold.co/160x40/141414/666666?text=${encodeURIComponent(
                p.name
              )}`}
              alt={p.name}
              className="h-full w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
