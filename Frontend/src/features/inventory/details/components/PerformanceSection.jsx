import { Gauge } from "lucide-react";
import SectionHeading from "@/shared/SectionHeading";

const PerformanceSection = ({ car, details }) => {
  const stats = [
    { value: car.bhp, unit: "bhp", label: "Power" },
    { value: details.zeroToHundred, unit: "s", label: "0–100 km/h" },
    { value: car.mileage.toLocaleString("en-US"), unit: "km", label: "Recorded mileage" },
  ];
  return (
    <section aria-labelledby="performance-title" className="bg-neutral-900 px-4 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <SectionHeading id="performance-title" tone="dark" eyebrow="Behind the wheel" eyebrowClassName="text-white/60" lead={["More than a silhouette."]} muted={["A character all its own."]} />
          <p className="max-w-md text-sm leading-relaxed text-white/60 lg:ml-auto">The {car.make} {car.model} in three numbers. A starting point for understanding the drive, before you experience it for yourself.</p>
        </div>
        <div className="mt-12 rounded-3xl bg-white p-6 md:p-8">
          <div className="flex items-center gap-3"><Gauge aria-hidden="true" className="size-5 text-[#f05a1a]" /><h3 className="text-sm font-semibold text-neutral-900">The drive, in detail.</h3></div>
          <dl className="mt-6 grid gap-6 border-t border-neutral-200 pt-6 sm:grid-cols-3">
            {stats.map(({ value, unit, label }) => <div key={label} className="flex flex-col-reverse"><dt className="mt-2 text-xs text-neutral-500">{label}</dt><dd className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">{value}<span className="ml-2 text-base text-[#f05a1a]">{unit}</span></dd></div>)}
          </dl>
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-white/60">Figures are taken from this sample listing, not an independently verified vehicle report.</p>
      </div>
    </section>
  );
};
export default PerformanceSection;

