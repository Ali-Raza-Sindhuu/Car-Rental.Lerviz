import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CarFront, KeyRound, RefreshCw, Wallet, ClipboardCheck, Wrench, ShieldCheck, Truck } from "lucide-react";
import SectionHeading from "@/shared/SectionHeading";
import { focusRing } from "@/shared/styles";

const categories = ["All", "Buying", "Ownership", "Selling"];
const services = [
  { title: "Buy a car", category: "Buying", Icon: CarFront, text: "Find the car that fits your life. Compare your shortlist and arrange time behind the wheel.", enquiry: "buying" },
  { title: "Rent a car", category: "Buying", Icon: KeyRound, text: "A weekend away or a longer stay. Find a rental suited to your plans and the road ahead.", enquiry: "rental" },
  { title: "Sell or trade in", category: "Selling", Icon: RefreshCw, text: "Ready for a change? Discuss your car’s condition, its history and the next step towards a valuation.", enquiry: "selling" },
  { title: "Financing", category: "Buying", Icon: Wallet, text: "Explore payment options with the team. Understand the deposit, term and total cost before deciding.", enquiry: "financing" },
  { title: "Vehicle inspection", category: "Ownership", Icon: ClipboardCheck, text: "Look beyond the finish. Get a clearer picture of condition, documented checks and work to consider.", href: "#inspection" },
  { title: "Maintenance and service", category: "Ownership", Icon: Wrench, text: "Keep the everyday drive feeling right. Discuss routine servicing and the care your car needs next.", enquiry: "maintenance" },
  { title: "Insurance", category: "Ownership", Icon: ShieldCheck, text: "Ask about cover for the way you drive. Compare exclusions, excesses and policy details carefully.", enquiry: "insurance" },
  { title: "Home delivery", category: "Buying", Icon: Truck, text: "Plan a handover around your day. Ask about delivery coverage, timing and preparation for arrival.", enquiry: "delivery" },
];

const ServicesGrid = () => {
  const [category, setCategory] = useState("All");
  const visibleServices = services.filter((service) => category === "All" || service.category === category);

  return (
    <section aria-labelledby="services-title" className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="services-title" eyebrow="Made for your next move" lead={["One destination."]} muted={["Every stage of the drive."]} />
          <p className="max-w-xs text-sm leading-relaxed text-neutral-600">From the first shortlist to your next set of keys, find the support that suits where you are today.</p>
        </div>
        <div role="group" aria-label="Filter services by category" className="mt-10 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button key={item} type="button" aria-pressed={category === item} aria-controls="service-grid" onClick={() => setCategory(item)} className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${focusRing} ${category === item ? "border-[#f05a1a] bg-[#f05a1a] text-white" : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"}`}>{item}</button>
          ))}
        </div>
        <p role="status" className="mt-4 text-[11px] text-neutral-500">{visibleServices.length} services · {category}</p>
        <div id="service-grid" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleServices.map(({ title, category: serviceCategory, Icon, text, enquiry, href }) => (
            <article key={title} className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center justify-between gap-3"><Icon aria-hidden="true" strokeWidth={1.5} className="size-6 text-[#f05a1a]" /><span className="text-[11px] text-neutral-500">{serviceCategory}</span></div>
              <h3 className="mt-8 text-xl font-bold tracking-tight text-neutral-950">{title}</h3>
              <p className="mt-3 mb-6 text-sm leading-relaxed text-neutral-600">{text}</p>
              {href ? (
                <a href={href} className={`mt-auto inline-flex w-fit items-center gap-2 rounded text-xs font-semibold text-neutral-900 hover:text-[#f05a1a] ${focusRing}`}>Learn more<span className="sr-only"> about {title.toLowerCase()}</span><ArrowRight aria-hidden="true" className="size-3.5" /></a>
              ) : (
                <Link to={`/contact?enquiry=${enquiry}`} className={`mt-auto inline-flex w-fit items-center gap-2 rounded text-xs font-semibold text-neutral-900 hover:text-[#f05a1a] ${focusRing}`}>Learn more<span className="sr-only"> about {title.toLowerCase()}</span><ArrowRight aria-hidden="true" className="size-3.5" /></Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ServicesGrid;

