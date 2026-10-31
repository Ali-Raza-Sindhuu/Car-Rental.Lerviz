import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Cog, Cylinder, Fuel, Gauge } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { mapCar } from "@/features/inventory/data/apiCars";
import VehicleImage from "@/components/shared/VehicleImage";
import { Reveal } from "@/shared/motion";
import SectionHeading from "@/shared/SectionHeading";
import { focusRing } from "@/shared/styles";
import FavouriteButton from "@/features/inventory/components/FavouriteButton";

const filterTabs = ["All", "New", "Used"];
// Spec order: [engine, power, fuel, transmission]
const SPEC_META = [
  { label: "Engine", icon: Cylinder },
  { label: "Power", icon: Gauge },
  { label: "Fuel", icon: Fuel },
  { label: "Transmission", icon: Cog },
];

const CarCard = ({ car, index }) => {
  const name = `${car.make} ${car.model} [${car.yearRange}]`;
  const rent = car.listingType === "rent";
  const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: rent ? 2 : 0 }).format(car.price);
  const specs = [car.cc ? `${car.cc} cc` : "Electric", `${car.bhp} bhp`, car.fuel.toLowerCase(), car.transmission.toLowerCase()];

  return (
    <Reveal
      as="article"
      y={32}
      delay={(index % 3) * 0.08}
      className="group rounded-2xl border border-neutral-200 bg-white p-3 transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/5"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
        <VehicleImage
          src={car.image}
          alt={name}
          loading="lazy"
          className="size-full object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-700">
          {car.condition === "new" ? "New Car" : "Used Car"}
        </span>

        {rent && (
          <span className="absolute right-3 top-3 rounded-full bg-[#f05a1a]/10 px-3 py-1.5 text-[11px] font-medium text-[#f05a1a]">
            For rent
          </span>
        )}

        <div className="absolute bottom-3 right-3"><FavouriteButton carId={car.id} /></div>
      </div>

      <div className="flex items-start justify-between gap-3 px-1 pt-5">
        <div className="min-w-0">
          <p className="text-2xl font-bold leading-none tracking-tight text-[#f05a1a]">
            {price}
            {rent && (
              <span className="ml-1 text-[11px] font-medium tracking-normal text-neutral-400">
                /day
              </span>
            )}
          </p>
          <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-neutral-950">
            {name}
          </h3>
        </div>

        <Link
          to={`/inventory/${car.id}`}
          aria-label={`View details for ${name}`}
          className={`grid size-10 shrink-0 place-items-center rounded-full border border-neutral-200 text-neutral-950 transition-colors duration-300 group-hover:border-[#f05a1a] group-hover:bg-[#f05a1a] group-hover:text-white ${focusRing}`}
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <ul className="mt-5 grid grid-cols-4 gap-1 border-t border-neutral-200 px-1 pt-4">
        {specs.map((spec, specIndex) => {
          const { label, icon: Icon } = SPEC_META[specIndex];
          return (
            <li
              key={label}
              title={label}
              className="flex flex-col items-center gap-2 text-center"
            >
              <Icon
                strokeWidth={1.5}
                aria-hidden="true"
                className="size-5 text-neutral-400 transition-colors duration-300 group-hover:text-[#f05a1a]"
              />
              <span className="sr-only">{label}:</span>
              <span className="text-xs text-neutral-950">{spec}</span>
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
};

const CarListingSection = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    apiRequest("/api/cars?page=1&pageSize=6&sort=newest", { signal: controller.signal })
      .then(({ items }) => setCars(items.map(mapCar)))
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      });
    return () => controller.abort();
  }, []);

  const visibleCars =
    activeTab === "All" ? cars : cars.filter((car) => car.condition === activeTab.toLowerCase());

  return (
    <section
      id="features"
      aria-labelledby="listing-title"
      className="bg-white px-4 pb-16 md:px-12 md:pb-24"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="listing-title"
            eyebrow="Browse latest car"
            lead={["Made for every"]}
            muted={["kind of journey"]}
          />

          <Reveal
            delay={0.3}
            role="group"
            aria-label="Filter cars by condition"
            className="flex gap-2"
          >
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                aria-pressed={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2 text-xs font-medium transition-colors duration-300 ${focusRing} ${
                  activeTab === tab
                    ? "bg-[#f05a1a] text-white"
                    : "border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </Reveal>
        </div>

        {/* Keyed by tab so the cards animate in again when the filter changes */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {error && <p role="alert" className="sm:col-span-2 lg:col-span-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load cars: {error}</p>}
          {visibleCars.map((car, index) => (
            <CarCard key={`${activeTab}-${car.id}`} car={car} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarListingSection;
