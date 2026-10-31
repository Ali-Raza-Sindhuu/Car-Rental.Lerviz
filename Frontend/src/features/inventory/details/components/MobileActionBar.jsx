import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "./CarSummary";
import { useVehicleEnquiry } from "../useVehicleEnquiry";
import { getCarActions } from "../getCarActions";

const MobileActionBar = ({ car, onReserve, actionStatus = "" }) => {
  const [visible, setVisible] = useState(false);
  const openEnquiry = useVehicleEnquiry();
  const rental = car.listingType === "rent";
  const actions = getCarActions(car, {
    onReserve,
    onTestDrive: (event) => openEnquiry(event, { message: "I'd like to book a test drive." }),
  });

  useEffect(() => {
    // Keep the fixed bar clear of the calculator, form, final CTA and shared footer.
    const targets = ["#calculator", "#vehicle-enquiry", "#vehicle-final-cta", "footer"]
      .map((selector) => document.querySelector(selector)).filter(Boolean);
    const updateVisibility = () => {
      const nearActionArea = targets.some((target) => {
        const bounds = target.getBoundingClientRect();
        return bounds.bottom > 0 && bounds.top < window.innerHeight + 100;
      });
      setVisible(!nearActionArea);
    };
    const observer = new IntersectionObserver(updateVisibility, { rootMargin: "0px 0px 100px 0px", threshold: 0 });
    targets.forEach((target) => observer.observe(target));
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    updateVisibility();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  if (!visible) return null;
  return (
    <aside aria-label="Vehicle quick actions" className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
        <div className="min-w-0"><p className="text-[10px] text-neutral-500">{rental ? "Daily sample rate" : "Sample price"}</p><p className="text-xl font-bold tracking-tight text-[#f05a1a]">{formatPrice(car.price)}{rental && <span className="text-[11px] font-normal text-neutral-500">/day</span>}</p></div>
        <div className="flex shrink-0 flex-col items-center">
          <div className="flex items-center gap-2">
            {actions.secondary && <Button type="button" onClick={actions.secondary.onClick} className="h-10 rounded-lg border border-neutral-200 bg-white px-2 text-[10px] font-semibold text-neutral-900">{actions.secondary.label}</Button>}
            <Button type="button" disabled={actions.primary.disabled} onClick={actions.primary.onClick} className="h-10 rounded-lg bg-[#f05a1a] px-3 text-xs font-semibold text-white hover:bg-[#d94e14] focus-visible:ring-[#f05a1a] disabled:cursor-not-allowed disabled:opacity-50">{actions.primary.label}{!actions.primary.disabled && <ArrowRight aria-hidden="true" className="size-3.5" />}</Button>
          </div>
          {!actions.primary.disabled && <p className="mt-1 text-[9px] text-neutral-500">Held only once payment is complete.</p>}
          {actionStatus && <p role="status" className="mt-1 max-w-[190px] text-right text-[9px] text-neutral-600">{actionStatus}</p>}
        </div>
      </div>
    </aside>
  );
};
export default MobileActionBar;
