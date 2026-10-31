import { useLenis } from "@/components/layout/SmoothScroll";

export const useVehicleEnquiry = () => {
  const lenis = useLenis();
  return (event, { message } = {}) => {
    const target = document.getElementById("vehicle-enquiry");
    if (!target) return;
    event.preventDefault();
    if (message) {
      window.dispatchEvent(new CustomEvent("revex:vehicle-enquiry", { detail: { message } }));
    }
    document.getElementById("enquiry-title")?.focus({ preventScroll: true });
    if (lenis) lenis.scrollTo(target, { offset: -112, immediate: true });
    else target.scrollIntoView({ behavior: "instant", block: "start" });
  };
};
