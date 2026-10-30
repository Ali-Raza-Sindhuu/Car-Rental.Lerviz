import { ScanEye, Wrench, Gauge, HeartHandshake } from "lucide-react";
import SectionHeading from "@/shared/SectionHeading";

const values = [
  { title: "Transparency", Icon: ScanEye, text: "Clear information before a commitment. We want you to understand the car, its history and the cost of your next step." },
  { title: "Craftsmanship", Icon: Wrench, text: "Details deserve attention. From a well-kept cabin to a thoughtful handover, quality is something you can feel." },
  { title: "Performance", Icon: Gauge, text: "The right performance is personal. Find a car that fits your everyday roads as well as your favourite detours." },
  { title: "Care", Icon: HeartHandshake, text: "Good advice starts with listening. Take your time, ask the extra question and choose with confidence." },
];
const ValuesSection = () => (
  <section aria-labelledby="values-title" className="bg-white px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading id="values-title" eyebrow="What drives us" lead={["Good cars."]} muted={["Even better standards."]} />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {values.map(({ title, Icon, text }) => <article key={title} className="rounded-2xl border border-neutral-200 bg-white p-6"><Icon aria-hidden="true" strokeWidth={1.5} className="size-6 text-[#f05a1a]" /><h3 className="mt-8 text-xl font-bold tracking-tight text-neutral-950">{title}</h3><p className="mt-3 text-sm leading-relaxed text-neutral-600">{text}</p></article>)}
      </div>
    </div>
  </section>
);
export default ValuesSection;

