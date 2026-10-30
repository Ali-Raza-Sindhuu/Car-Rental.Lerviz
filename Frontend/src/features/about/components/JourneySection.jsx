import SectionHeading from "@/shared/SectionHeading";

const milestones = [
  ["2012", "REVEX opens", "A single showroom with a simple promise: honest cars, clear prices."],
  ["2015", "Certified pre-owned", "Every used car gets a documented multi-point inspection."],
  ["2018", "Second dealership", "Online listings go live alongside the new showroom."],
  ["2021", "Rentals and Click & Drive", "Rent or buy online and collect when it suits you."],
  ["2024", "48K vehicles delivered", "A milestone built on repeat customers and referrals."],
  ["2026", "Third dealership", "A dedicated airport branch and an expanded electric range."],
];
const JourneySection = () => (
  <section aria-labelledby="journey-title" className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading id="journey-title" eyebrow="Our journey" lead={["Built one mile"]} muted={["at a time."]} />
      <ol className="mt-12 grid md:grid-cols-4">
        {milestones.map(([year, title, text]) => <li key={year} className="relative border-l border-[#f05a1a] pb-10 pl-6 last:pb-0 md:border-t md:border-l-0 md:pt-8 md:pr-6 md:pb-0 md:pl-0"><span aria-hidden="true" className="absolute top-0 -left-1 size-2 rounded-full bg-[#f05a1a] md:-top-1 md:left-0" /><p className="text-[11px] font-bold text-[#f05a1a]">{year}</p><h3 className="mt-3 text-xl font-bold tracking-tight text-neutral-950">{title}</h3><p className="mt-3 text-sm leading-relaxed text-neutral-600">{text}</p></li>)}
      </ol>
    </div>
  </section>
);
export default JourneySection;
