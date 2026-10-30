import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/shared/SectionHeading";
import { btn } from "@/shared/styles";
import carImage from "@/assets/sample_001.png";

const checks = ["Mechanical condition", "Safety systems", "Interior and exterior", "Available service history"];
const stats = [
  { value: "150", unit: "points", label: "Proposed inspection checklist" },
  { value: "7", unit: "days", label: "Proposed return period" },
  { value: "12", unit: "months", label: "Proposed warranty term" },
];

const InspectionSection = () => (
  <section id="inspection" aria-labelledby="inspection-title" className="scroll-mt-28 bg-neutral-900 px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <div className="grid items-end gap-8 lg:grid-cols-2">
        <SectionHeading id="inspection-title" tone="dark" eyebrow="The certified programme" eyebrowClassName="text-white/60" lead={["Confidence starts"]} muted={["with the details."]} />
        <p className="max-w-md text-sm leading-relaxed text-white/60 lg:ml-auto">A polished finish tells only part of the story. Our proposed certified programme puts condition, documentation and a clear handover at the centre of your decision.</p>
      </div>
      <div className="mt-12 overflow-hidden rounded-3xl bg-white p-4 md:p-6">
        <dl className="grid gap-6 border-b border-neutral-200 pb-6 sm:grid-cols-3">
          {stats.map(({ value, unit, label }) => (
            <div key={label} className="flex flex-col-reverse">
              <dt className="mt-2 text-xs text-neutral-600">{label}</dt>
              <dd className="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">{value}<span className="ml-2 text-sm text-[#f05a1a]">{unit}</span></dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
          <img src={carImage} alt="Close-up of a sports car headlight and bonnet" loading="lazy" className="aspect-[16/9] w-full rounded-xl bg-neutral-100 object-cover" />
          <div className="px-2 py-2 md:px-4">
            <h3 className="text-xl font-bold tracking-tight text-neutral-950">Know what you’re getting into.</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">Ask for a vehicle-specific report, review the findings and discuss any outstanding work before you commit.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {checks.map((check) => <li key={check} className="flex items-center gap-2 text-xs text-neutral-600"><Check aria-hidden="true" className="size-4 shrink-0 text-[#f05a1a]" />{check}</li>)}
            </ul>
            <Button asChild className={`mt-7 ${btn.dark}`}><Link to="/contact?enquiry=inspection">Ask about certification<ArrowRight aria-hidden="true" className="size-4" /></Link></Button>
          </div>
        </div>
      </div>
      <p className="mt-5 max-w-3xl text-[11px] leading-relaxed text-white/60">Programme preview: the 150-point check, 7-day return and 12-month warranty are placeholder terms, not confirmed offers. Availability, eligibility and full terms must be confirmed before publication.</p>
    </div>
  </section>
);
export default InspectionSection;

