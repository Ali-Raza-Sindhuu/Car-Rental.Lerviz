import SectionHeading from "@/shared/SectionHeading";

const steps = [
  ["Tell us your plans", "A new car, a trade-in or help with ownership. Start with what you need, your timing and your budget."],
  ["Explore the options", "Review the vehicles or services that fit. Ask questions and arrange a closer look where needed."],
  ["Agree the details", "Confirm the scope, price, availability and applicable terms before making a commitment."],
  ["Make your next move", "Arrange your appointment or handover, with a clear point of contact for anything that follows."],
];
const HowItWorksSection = () => (
  <section aria-labelledby="process-title" className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading id="process-title" eyebrow="How it works" lead={["A clear route."]} muted={["From hello to handover."]} />
      <ol className="mt-12 grid md:grid-cols-4">
        {steps.map(([title, text], index) => (
          <li key={title} className="relative border-l border-[#f05a1a] pb-10 pl-6 last:pb-0 md:border-t md:border-l-0 md:pt-8 md:pr-6 md:pb-0 md:pl-0">
            <span aria-hidden="true" className="absolute top-0 -left-1 size-2 rounded-full bg-[#f05a1a] md:-top-1 md:left-0" />
            <p className="text-[11px] font-bold text-[#f05a1a]">0{index + 1}</p>
            <h3 className="mt-3 text-xl font-bold tracking-tight text-neutral-950">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">{text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
export default HowItWorksSection;

