import { ClipboardCheck, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const items = [
  { Icon: ClipboardCheck, title: "150-point inspection", text: "Ask for the vehicle-specific report and any outstanding findings." },
  { Icon: RotateCcw, title: "7-day return", text: "Confirm eligibility, mileage limits and the full return conditions." },
  { Icon: ShieldCheck, title: "12-month warranty", text: "Review cover, exclusions and the claims process before deciding." },
  { Icon: Truck, title: "Home delivery within 100 km", text: "Arrange a convenient handover at your address." },
];
const TrustSection = ({ car }) => (
  <section aria-labelledby="trust-title" className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <h2 id="trust-title" className="text-2xl font-semibold tracking-tight text-neutral-900">Confidence comes from clear details.</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">{car.listingType === "rent" ? "For rentals, ask the dealer about rental-specific cover, cancellation and delivery arrangements." : "Ask the dealer about the benefits included with this vehicle."}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, title, text }) => <article key={title} className="rounded-2xl border border-neutral-200 bg-white p-5"><Icon aria-hidden="true" className="size-5 text-[#f05a1a]" strokeWidth={1.5} /><h3 className="mt-5 text-sm font-semibold text-neutral-900">{title}</h3><p className="mt-2 text-xs leading-relaxed text-neutral-500">{text}</p></article>)}
      </div>
    </div>
  </section>
);
export default TrustSection;
