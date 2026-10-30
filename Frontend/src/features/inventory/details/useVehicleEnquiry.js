import { useLenis } from "@/components/layout/SmoothScroll";

export const useVehicleEnquiry = () => {
  const lenis = useLenis();
  return (event) => {
    const target = document.getElementById("vehicle-enquiry");
    if (!target) return;
    event.preventDefault();
    document.getElementById("enquiry-title")?.focus({ preventScroll: true });
    if (lenis) lenis.scrollTo(target, { offset: -112, immediate: true });
    else target.scrollIntoView({ behavior: "instant", block: "start" });
  };
};

