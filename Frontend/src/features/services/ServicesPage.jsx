import SectionHeading from '@/shared/SectionHeading'

const ServicesPage = () => (
  <section className="min-h-svh bg-neutral-50 px-4 pb-20 pt-36 md:px-12 md:pt-44">
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading
        eyebrow="Our services"
        lead={["Everything for your next drive."]}
        body="Explore our cars, arrange a test drive, and get help finding the right vehicle."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          ['Find a car', 'Browse our available vehicles and compare your options.'],
          ['Book a test drive', 'Get behind the wheel before you decide.'],
          ['Talk to our team', 'Ask us about vehicles, availability, and your next steps.'],
        ].map(([title, description]) => (
          <article key={title} className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">{description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
)

export default ServicesPage
