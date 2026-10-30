import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { focusRing } from "@/shared/styles";

const tabs = ["Overview", "Specifications", "Features"];
const VehicleTabs = ({ car, details }) => {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const specs = [
    ["Engine", car.cc ? `${car.cc.toLocaleString("en-US")} cc` : "Electric motor"],
    ["Power", `${car.bhp} bhp`], ["Torque", `${details.torque} Nm`],
    ["0–100 km/h", `${details.zeroToHundred} seconds`], ["Top speed", `${details.topSpeed} km/h`],
    ["Drivetrain", details.drivetrain], ["Transmission", car.transmission], ["Fuel", car.fuel],
    ["Mileage", `${car.mileage.toLocaleString("en-US")} km`], ["Exterior colour", car.colour],
    ["Interior colour", details.interiorColour], ["Doors", details.doors], ["Seats", details.seats],
    ["Model year", car.year], ["Ownership", details.ownershipHistory], ["Warranty", details.warranty],
    ["VIN (placeholder)", details.vin],
  ];
  const handleKeyDown = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  };
  return (
    <section aria-labelledby="vehicle-details-title" className="bg-white px-4 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500"><span aria-hidden="true" className="size-1.5 rounded-full bg-[#f05a1a]" />A closer look</p>
            <h2 id="vehicle-details-title" className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-5xl">Get to know your next drive.</h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-neutral-500">The character, the numbers and the details that make a car feel like yours.</p>
        </div>
        <div role="tablist" aria-label="Vehicle information" className="mt-10 flex flex-wrap gap-2">
          {tabs.map((tab, index) => (
            <button ref={(element) => { tabRefs.current[index] = element; }} key={tab} id={`vehicle-tab-${index}`} role="tab" type="button" aria-selected={active === index} aria-controls={`vehicle-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => handleKeyDown(event, index)} className={`rounded-full border px-4 py-2 text-xs font-medium ${focusRing} ${active === index ? "border-[#f05a1a] bg-[#f05a1a] text-white" : "border-neutral-200 text-neutral-600 hover:bg-neutral-100"}`}>{tab}</button>
          ))}
        </div>
        <div id="vehicle-panel-0" role="tabpanel" aria-labelledby="vehicle-tab-0" hidden={active !== 0} tabIndex={0} className={`mt-8 rounded-2xl border border-neutral-200 p-6 md:p-8 ${focusRing}`}>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div><h3 className="text-xl font-semibold tracking-tight text-neutral-900">Made for the way you move.</h3><p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500">{details.description}</p><p className="mt-5 text-[11px] text-neutral-500">Sample description and specifications. Confirm the exact vehicle and equipment with the dealer.</p></div>
            <div className="rounded-xl bg-neutral-50 p-5"><h3 className="text-sm font-semibold text-neutral-900">Worth a closer look</h3><ul className="mt-4 space-y-3">{[`${details.drivetrain} confidence`, `${details.seats} seats for your plans`, ...details.features.slice(-2)].map((feature) => <li key={feature} className="flex items-start gap-3 text-sm text-neutral-600"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#f05a1a]" />{feature}</li>)}</ul></div>
          </div>
        </div>
        <div id="vehicle-panel-1" role="tabpanel" aria-labelledby="vehicle-tab-1" hidden={active !== 1} tabIndex={0} className={`mt-8 rounded-2xl border border-neutral-200 p-6 md:p-8 ${focusRing}`}>
          <h3 className="text-xl font-semibold tracking-tight text-neutral-900">The specification, at a glance.</h3>
          <dl className="mt-6 grid gap-x-10 md:grid-cols-2">{specs.map(([label, value]) => <div key={label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 border-t border-neutral-200 py-4 text-sm"><dt className="text-neutral-500">{label}</dt><dd className="break-words font-medium text-neutral-900">{value}</dd></div>)}</dl>
          <p className="mt-5 text-[11px] text-neutral-500">All values are sample listing data; the VIN is deliberately a placeholder.</p>
        </div>
        <div id="vehicle-panel-2" role="tabpanel" aria-labelledby="vehicle-tab-2" hidden={active !== 2} tabIndex={0} className={`mt-8 rounded-2xl border border-neutral-200 p-6 md:p-8 ${focusRing}`}>
          <h3 className="text-xl font-semibold tracking-tight text-neutral-900">Small details. Everyday difference.</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{details.features.map((feature) => <li key={feature} className="flex items-start gap-3 text-sm text-neutral-600"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#f05a1a]" />{feature}</li>)}</ul>
          <p className="mt-6 text-[11px] text-neutral-500">Illustrative equipment list. Availability varies by vehicle and specification.</p>
        </div>
      </div>
    </section>
  );
};
export default VehicleTabs;

