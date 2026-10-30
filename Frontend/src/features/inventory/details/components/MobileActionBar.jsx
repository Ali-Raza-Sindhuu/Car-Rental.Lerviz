import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "./CarSummary";
import { useVehicleEnquiry } from "../useVehicleEnquiry";

const MobileActionBar = ({ car }) => {
  const [visible, setVisible] = useState(false);
  const openEnquiry = useVehicleEnquiry();
  const rental = car.listingType === "rent";

  useEffect(() => {
    // Keep the fixed bar clear of the calculator, form, final CTA and shared footer.
    const targets = ["#calculator", "#vehicle-enquiry", "#vehicle-final-cta", "footer"]
      .map((selector) => document.querySelector(selector)).filter(Boolean);
    const intersections = new Map(targets.map((target) => [target, false]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => intersections.set(entry.target, entry.isIntersecting));
      setVisible(![...intersections.values()].some(Boolean));
    }, { rootMargin: "0px 0px 100px 0px", threshold: 0 });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;
  return (
    <aside aria-label="Vehicle quick actions" className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
        <div className="min-w-0"><p className="text-[10px] text-neutral-500">{rental ? "Daily sample rate" : "Sample price"}</p><p className="text-xl font-bold tracking-tight text-[#f05a1a]">{formatPrice(car.price)}{rental && <span className="text-[11px] font-normal text-neutral-500">/day</span>}</p></div>
        <Button asChild className="h-10 shrink-0 rounded-lg bg-[#f05a1a] px-3 text-xs font-semibold uppercase text-white hover:bg-[#d94e14] focus-visible:ring-[#f05a1a]"><a href="#vehicle-enquiry" onClick={openEnquiry}>{rental ? "Rent now" : "Book a test drive"}<ArrowRight aria-hidden="true" className="size-3.5" /></a></Button>
      </div>
    </aside>
  );
};
export default MobileActionBar;

