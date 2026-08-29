import { Reveal, RevealWords } from './Reveal'
import Counter from './Counter'
import { stats } from '../data/dummyData'

export default function Intro() {
  return (
    <section className="py-24 px-5">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        <img
          src="https://placehold.co/64x64/141414/db0404?text=L"
          alt="Levrix mark"
          className="w-16 h-16 rounded-full mb-8"
        />

        <RevealWords
          as="h2"
          text="we don't just sell cars we craft experiences"
          className="font-display text-2xl md:text-4xl font-semibold tracking-wide2 mb-6"
        />

        <Reveal delay={0.1}>
          <p className="text-mist text-base md:text-lg max-w-xl">
            At Levrix, we believe a car is more than just a way to get from
            one place to another — it's a reflection of who you are.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="w-full mt-14">
          <div className="grid grid-cols-3 gap-6 divide-x divide-line">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2 px-2">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                <p className="text-mist text-sm md:text-base text-center">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
