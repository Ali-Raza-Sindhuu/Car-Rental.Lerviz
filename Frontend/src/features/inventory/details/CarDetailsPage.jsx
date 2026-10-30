import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import { CARS } from "@/features/inventory/data/cars";
import { CAR_DETAILS } from "@/features/inventory/data/carDetails";
import CarGallery from "./components/CarGallery";
import CarSummary from "./components/CarSummary";
import PriceCalculator from "./components/PriceCalculator";
import VehicleTabs from "./components/VehicleTabs";
import PerformanceSection from "./components/PerformanceSection";
import TrustSection from "./components/TrustSection";
import VehicleEnquiryForm from "./components/VehicleEnquiryForm";
import SimilarVehicles from "./components/SimilarVehicles";
import VehicleFaqSection from "./components/VehicleFaqSection";
import MobileActionBar from "./components/MobileActionBar";
import CtaBanner from "@/components/shared/CtaBanner";

const CarDetailsPage = () => {
  const { id } = useParams();
  const car = CARS.find((item) => item.id === id);
  const details = car ? CAR_DETAILS[car.id] : null;
  const name = car ? `${car.make} ${car.model}` : "Vehicle not found";

  useEffect(() => {
    const previous = document.title;
    document.title = `${name} | REVEX`;
    return () => { document.title = previous; };
  }, [name]);

  if (!car || !details) return (
    <>
      <PageHeader title="Vehicle not found" eyebrow="A different road ahead" description="This vehicle may have moved on, or the link may be incorrect." breadcrumbs={[{ label: "Home", to: "/" }, { label: "Inventory", to: "/inventory" }, { label: "Vehicle not found" }]} />
      <section className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
          <SearchX aria-hidden="true" className="size-8 text-neutral-500" />
          <h2 className="mt-6 text-xl font-semibold tracking-tight text-neutral-900">Your next drive is still out there.</h2>
          <p className="mt-3 text-sm text-neutral-500">Explore the current collection to find another possibility.</p>
          <Button asChild className="mt-8 h-10 rounded-lg bg-[#f05a1a] text-xs font-semibold uppercase text-white hover:bg-[#d94e14] focus-visible:ring-[#f05a1a]"><Link to="/inventory">Back to inventory<ArrowRight className="size-3.5" aria-hidden="true" /></Link></Button>
        </div>
      </section>
    </>
  );

  return (
    <>
      <PageHeader title={`${name} [${car.yearRange}]`} eyebrow="Find your next chapter" description={`${car.bodyType} · ${car.fuel} · ${car.transmission}`} breadcrumbs={[{ label: "Home", to: "/" }, { label: "Inventory", to: "/inventory" }, { label: name }]}>
        <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-900">{car.condition === "new" ? "New Car" : "Used Car"}</span>{car.listingType === "rent" && <span className="rounded-full bg-[#f05a1a] px-3 py-1.5 text-[11px] font-medium text-white">For rent</span>}</div>
      </PageHeader>
      <div key={car.id} className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-6 text-[11px] leading-relaxed text-neutral-500">Sample listing. Specifications, equipment, history, pricing and dealer details are illustrative and require verification.</p>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <CarGallery car={car} gallery={details.gallery} />
            <div className="min-w-0 space-y-4 lg:sticky lg:top-28">
              <CarSummary car={car} details={details} />
              <PriceCalculator car={car} />
            </div>
          </div>
        </div>
      </div>
      <VehicleTabs key={`tabs-${car.id}`} car={car} details={details} />
      <PerformanceSection car={car} details={details} />
      <TrustSection car={car} />
      <VehicleEnquiryForm key={`enquiry-${car.id}`} car={car} details={details} />
      <SimilarVehicles key={`similar-${car.id}`} car={car} />
      <VehicleFaqSection key={`faq-${car.id}`} car={car} />
      <div id="vehicle-final-cta">
        <CtaBanner heading="Your next chapter awaits." text="Keep exploring the collection. The right car is the one that fits your road, your routine and your sense of adventure." buttonLabel="Explore inventory" href="/inventory" />
      </div>
      <MobileActionBar key={`mobile-${car.id}`} car={car} />
    </>
  );
};
export default CarDetailsPage;

