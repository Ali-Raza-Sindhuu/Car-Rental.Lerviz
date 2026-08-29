import { Reveal, RevealWords } from './Reveal'
import { team } from '../data/dummyData'

export default function Team() {
  return (
    <section id="team" className="py-20 px-5">
      <div className="max-w-[1380px] mx-auto">
        <RevealWords
          as="h2"
          text="People Behind Us"
          className="font-display text-2xl md:text-4xl font-semibold tracking-wide2 text-center mb-12"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.1}>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] card-border">
                <img
                  src={`https://placehold.co/700x900/141414/2a2a2a?text=${encodeURIComponent(
                    member.name
                  )}`}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/50 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <h4 className="font-medium text-lg">{member.name}</h4>
                  <p className="text-mist text-sm">{member.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
