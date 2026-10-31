import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import { apiRequest } from "@/lib/api";
import { mapCar, mapCarDetails } from "@/features/inventory/data/apiCars";
import { addToGarage } from "@/features/garage/garageApi";
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
import heroImage from "@/assets/inventory_hero.png";

const CarDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [car, setCar] = useState(null);
  const [details, setDetails] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [actionStatus, setActionStatus] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [rentalDates, setRentalDates] = useState({ startDate: "", endDate: "" });
  const name = car ? `${car.make} ${car.model}` : "Vehicle not found";

  useEffect(() => {
    const controller = new AbortController();
    setCar(null);
    setDetails(null);
    setLoadError("");
    setRentalDates({ startDate: "", endDate: "" });
    setActionStatus("");
    apiRequest(`/api/cars/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then((response) => {
        setCar(mapCar(response));
        setDetails(mapCarDetails(response));
      })
      .catch((error) => {
        if (error.name !== "AbortError") setLoadError(error.message);
      });
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const previous = document.title;
    document.title = `${name} | REVEX`;
    return () => { document.title = previous; };
  }, [name]);

  const updateRentalDates = useCallback((dates) => setRentalDates(dates), []);
  const handleReserve = async () => {
    if (!car || isAdding) return;
    setActionStatus("");
    if (car.status === "sold") {
      setActionStatus("This car has already been sold.");
      return;
    }
    if (car.listingType === "rent") {
      const { startDate, endDate } = rentalDates;
      if (!startDate || !endDate) {
        setActionStatus("Choose rental dates in the estimate section first.");
        return;
      }
      const days = Math.floor((Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 86400000) + 1;
      const today = new Date();
      const todayText = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      if (endDate < startDate || startDate < todayText || days < 1 || days > 30) {
        setActionStatus("Choose a valid rental range of 1–30 days starting today or later.");
        return;
      }
      setIsAdding(true);
      try {
        const availability = await apiRequest(`/api/cars/${encodeURIComponent(car.id)}/availability?from=${startDate}&to=${endDate}`);
        const conflict = availability.bookedRanges?.some((range) => range.startDate <= endDate && range.endDate >= startDate);
        if (conflict) {
          setActionStatus("Those dates are unavailable. Choose another range.");
          return;
        }
        await addToGarage({ car, token, dispatch, startDate, endDate });
        setActionStatus("Added to your garage");
      } catch (error) {
        setActionStatus(error.message);
      } finally {
        setIsAdding(false);
      }
      return;
    }
    setIsAdding(true);
    try {
      await addToGarage({ car, token, dispatch });
      setActionStatus("Added to your garage");
    } catch (error) {
      setActionStatus(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  if (!car || !details) return (
    loadError ? (
      <>
        <PageHeader title="Vehicle unavailable" eyebrow="A different road ahead" description={loadError} breadcrumbs={[{ label: "Home", to: "/" }, { label: "Inventory", to: "/inventory" }]} heroImage={heroImage} />
        <section className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24"><div role="alert" className="mx-auto max-w-[1400px] rounded-2xl border border-red-200 bg-white p-8 text-sm text-red-700">{loadError}</div></section>
      </>
    ) : (
    <>
      <PageHeader title="Loading vehicle" eyebrow="A different road ahead" description="Loading vehicle details." breadcrumbs={[{ label: "Home", to: "/" }, { label: "Inventory", to: "/inventory" }]} heroImage={heroImage} />
      <section className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
          <SearchX aria-hidden="true" className="size-8 text-neutral-500" />
          <h2 className="mt-6 text-xl font-semibold tracking-tight text-neutral-900">Loading the vehicle.</h2>
          <p className="mt-3 text-sm text-neutral-500">Please wait while we fetch its listing details.</p>
          <Button asChild className="mt-8 h-10 rounded-lg bg-[#f05a1a] text-xs font-semibold uppercase text-white hover:bg-[#d94e14] focus-visible:ring-[#f05a1a]"><Link to="/inventory">Back to inventory<ArrowRight className="size-3.5" aria-hidden="true" /></Link></Button>
        </div>
      </section>
    </>
    )
  );

  return (
    <>
      <PageHeader title={`${name} [${car.yearRange}]`} eyebrow="Find your next chapter" description={`${car.bodyType} · ${car.fuel} · ${car.transmission}`} breadcrumbs={[{ label: "Home", to: "/" }, { label: "Inventory", to: "/inventory" }, { label: name }]} heroImage={heroImage}>
        <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-900">{car.condition === "new" ? "New Car" : "Used Car"}</span>{car.listingType === "rent" && <span className="rounded-full bg-[#f05a1a] px-3 py-1.5 text-[11px] font-medium text-white">For rent</span>}</div>
      </PageHeader>
      <div key={car.id} className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-6 text-[11px] leading-relaxed text-neutral-500">Sample listing. Specifications, equipment, history, pricing and dealer details are illustrative and require verification.</p>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <CarGallery car={car} gallery={details.gallery} />
            <div className="min-w-0 space-y-4 lg:sticky lg:top-28">
              {car.listingType === "rent" && <PriceCalculator car={car} onRentalDatesChange={updateRentalDates} />}
              <CarSummary car={car} details={details} onReserve={handleReserve} actionStatus={isAdding ? "Adding to your garage…" : actionStatus} />
              {car.listingType !== "rent" && <PriceCalculator car={car} onRentalDatesChange={updateRentalDates} />}
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
      <MobileActionBar key={`mobile-${car.id}`} car={car} onReserve={handleReserve} actionStatus={isAdding ? "Adding…" : actionStatus} />
    </>
  );
};
export default CarDetailsPage;
