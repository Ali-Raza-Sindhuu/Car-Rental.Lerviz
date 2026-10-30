import { useState } from "react";
import { useVehicleEnquiry } from "../useVehicleEnquiry";
import { ArrowRight, Heart, Share2, Gauge, Zap, Fuel, Settings2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { focusRing } from "@/shared/styles";

export const formatPrice = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: Number.isInteger(value) ? 0 : 2 }).format(value);

const CarSummary = ({ car, details }) => {
  const openEnquiry = useVehicleEnquiry();
  const [saved, setSaved] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [copyFailed, setCopyFailed] = useState(false);
  const rent = car.listingType === "rent";
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("Link copied. Ready to share.");
      setCopyFailed(false);
    } catch {
      setShareStatus("Copy is unavailable. Select and copy the link below.");
      setCopyFailed(true);
    }
  };
  const specs = [[Gauge, car.cc ? `${car.cc} cc` : "Electric"], [Zap, `${car.bhp} bhp`], [Fuel, car.fuel], [Settings2, car.transmission]];
  return (
    <section aria-labelledby="summary-title" className="rounded-2xl border border-neutral-200 bg-white p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="summary-title" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">Your next drive</h2>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] text-neutral-600">{car.condition === "new" ? "New Car" : "Used Car"}</span>
      </div>
      <p className="mt-5 text-4xl font-bold tracking-tight text-[#f05a1a]">{formatPrice(car.price)}{rent && <span className="ml-1 text-sm font-normal text-neutral-500">/day</span>}</p>
      <p className="mt-2 text-[11px] text-neutral-500">{rent ? "Daily sample rate · availability to be confirmed" : "Sample asking price · USD"}</p>
      <ul className="my-6 grid grid-cols-4 gap-1 border-y border-neutral-200 py-4">
        {specs.map(([Icon, label]) => <li key={label} className="flex min-w-0 flex-col items-center gap-2 text-center text-[11px] text-neutral-500"><Icon aria-hidden="true" className="size-4 text-neutral-400" /><span className="break-words">{label}</span></li>)}
      </ul>
      <Button asChild className="h-10 w-full rounded-lg bg-[#f05a1a] text-xs font-semibold uppercase text-white hover:bg-[#d94e14] focus-visible:ring-[#f05a1a]"><a href="#vehicle-enquiry" onClick={openEnquiry}>{rent ? "Rent now" : "Book a test drive"}<ArrowRight aria-hidden="true" className="size-3.5" /></a></Button>
      <div className="mt-3 flex gap-2">
        <Button asChild className="h-10 flex-1 rounded-lg border border-neutral-200 bg-white text-xs font-semibold uppercase text-neutral-900 hover:bg-neutral-100 focus-visible:ring-[#f05a1a]"><a href="#vehicle-enquiry" onClick={openEnquiry}>Enquire</a></Button>
        <button type="button" aria-label={saved ? "Remove vehicle from saved" : "Save vehicle"} aria-pressed={saved} onClick={() => setSaved(!saved)} className={`grid size-10 shrink-0 place-items-center rounded-full border border-neutral-200 ${focusRing}`}><Heart className={`size-4 ${saved ? "fill-[#f05a1a] text-[#f05a1a]" : "text-neutral-600"}`} /></button>
        <button type="button" aria-label="Copy vehicle page link" onClick={share} className={`grid size-10 shrink-0 place-items-center rounded-full border border-neutral-200 text-neutral-600 ${focusRing}`}><Share2 className="size-4" /></button>
      </div>
      <p role="status" className="mt-3 text-xs text-neutral-500">{shareStatus || (saved ? "Saved for this visit." : "")}</p>
      {copyFailed && <input aria-label="Vehicle page link" readOnly value={window.location.href} onFocus={(event) => event.target.select()} className={`mt-2 w-full min-w-0 rounded-lg border border-neutral-200 p-2 text-xs ${focusRing}`} />}
      <div className="mt-5 rounded-xl bg-neutral-50 p-4">
        <h3 className="text-sm font-semibold text-neutral-900">{details.dealer.name}</h3>
        <p className="mt-2 flex items-center gap-2 text-xs text-neutral-500"><MapPin aria-hidden="true" className="size-3.5" />{details.dealer.city}</p>
        <p className="mt-2 text-[11px] text-neutral-500">{details.dealer.hours}</p>
        <a href={`tel:${details.dealer.phone.replace(/[^+\d]/g, "")}`} className={`mt-3 inline-block rounded text-xs font-semibold text-neutral-900 ${focusRing}`}>{details.dealer.phone}</a>
        <p className="mt-2 text-[11px] text-neutral-500">Placeholder dealership and phone.</p>
      </div>
    </section>
  );
};
export default CarSummary;

