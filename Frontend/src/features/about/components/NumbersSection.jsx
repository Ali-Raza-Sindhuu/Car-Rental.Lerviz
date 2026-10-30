import SectionHeading from "@/shared/SectionHeading";

const stats = [["14", "Years in business"], ["12K+", "Vehicles delivered"], ["3", "Dealerships"], ["98%", "Customer satisfaction"]];
const NumbersSection = () => (
  <section aria-labelledby="numbers-title" className="bg-neutral-900 px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading id="numbers-title" eyebrow="The journey in numbers" eyebrowClassName="text-white/60" tone="dark" lead={["Every handover."]} muted={["Another beginning."]} />
      <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-white/15 pt-8 lg:grid-cols-4">
        {stats.map(([value, label]) => <div key={label} className="flex flex-col-reverse"><dt className="mt-3 text-xs text-white/60">{label}</dt><dd className="text-4xl font-bold tracking-tight text-white md:text-5xl">{value}<span className="text-[#f05a1a]">*</span></dd></div>)}
      </dl>
      <p className="mt-8 text-[11px] text-white/60">*All figures are illustrative placeholders. Replace with verified company data before publication.</p>
    </div>
  </section>
);
export default NumbersSection;

