import SectionHeading from "@/shared/SectionHeading";

const milestones = [
  ["2012", "The first keys", "A specialist showroom and a simple idea: make choosing a car more personal."],
  ["2016", "Room to grow", "A second location brings that same considered experience to more drivers."],
  ["2021", "A wider view", "Digital discovery helps drivers build a shortlist before stepping into a showroom."],
  ["2026", "The road ahead", "Buying, renting and ownership support come together around the driver."],
];
const JourneySection = () => (
  <section aria-labelledby="journey-title" className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading id="journey-title" eyebrow="Our journey" lead={["Built one mile"]} muted={["at a time."]} />
      <p className="mt-5 text-[11px] text-neutral-500">Illustrative timeline — dates and milestones await company confirmation.</p>
      <ol className="mt-12 grid md:grid-cols-4">
        {milestones.map(([year, title, text]) => <li key={year} className="relative border-l border-[#f05a1a] pb-10 pl-6 last:pb-0 md:border-t md:border-l-0 md:pt-8 md:pr-6 md:pb-0 md:pl-0"><span aria-hidden="true" className="absolute top-0 -left-1 size-2 rounded-full bg-[#f05a1a] md:-top-1 md:left-0" /><p className="text-[11px] font-bold text-[#f05a1a]">{year}</p><h3 className="mt-3 text-xl font-bold tracking-tight text-neutral-950">{title}</h3><p className="mt-3 text-sm leading-relaxed text-neutral-600">{text}</p></li>)}
      </ol>
    </div>
  </section>
);
export default JourneySection;

