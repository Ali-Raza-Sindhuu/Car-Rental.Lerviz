import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/shared/SectionHeading";
import ContactMap from "./ContactMap";

const branches = [
  { name: "REVEX Downtown", address: "100 Example Avenue, Example City, EX 10001", hours: "Mon–Sat 9:00–19:00, Sun 10:00–16:00" },
  { name: "REVEX Riverside", address: "24 Harbour Road, Example City, EX 10024", hours: "Mon–Fri 8:30–18:00, Sat 10:00–16:00" },
  { name: "REVEX Airport Park", address: "8 Terminal Way, Example City, EX 10088", hours: "Daily 7:00–22:00 (rentals)" },
];
const DealershipsSection = () => (
  <section aria-labelledby="dealerships-title" className="bg-white px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading id="dealerships-title" eyebrow="Come say hello" lead={["Find your car."]} muted={["Meet your people."]} body="Take a closer look, ask the extra question and make time for a proper conversation." />
      <p className="mt-5 text-[11px] text-neutral-500">All branches, addresses and opening hours below are placeholders. Directions open a map search for the example address.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {branches.map(({ name, address, hours }, index) => (
          <article key={name} className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6">
            <p className="text-[11px] font-bold text-[#f05a1a]">0{index + 1} / SHOWROOM NETWORK</p>
            <h3 className="mt-5 text-xl font-bold tracking-tight text-neutral-950">{name}</h3>
            <address className="mt-3 text-sm leading-relaxed text-neutral-600 not-italic">{address}</address>
            <p className="mt-4 mb-6 text-xs leading-relaxed text-neutral-500">{hours}</p>
            <Button asChild className="mt-auto h-10 w-fit rounded-lg bg-neutral-900 text-xs font-semibold text-white hover:bg-neutral-800 focus-visible:ring-[#f05a1a]"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" aria-label={`Get directions to ${name} (placeholder address, opens new tab)`}>Get directions<ArrowUpRight aria-hidden="true" className="size-3.5" /></a></Button>
          </article>
        ))}
      </div>
      <ContactMap />
    </div>
  </section>
);
export default DealershipsSection;
