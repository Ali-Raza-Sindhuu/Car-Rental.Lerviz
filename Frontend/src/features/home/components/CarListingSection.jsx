import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Cog, Cylinder, Fuel, Gauge, Heart } from "lucide-react";
import img1 from "@/assets/product_01.png";
import img2 from "@/assets/product_02.png";
import img3 from "@/assets/product_03.png";
import img4 from "@/assets/product_04.png";
import img5 from "@/assets/product_05.png";
import img6 from "@/assets/product_06.png";
import { Reveal } from "@/shared/motion";
import SectionHeading from "@/shared/SectionHeading";
import { focusRing } from "@/shared/styles";

const filterTabs = ["All", "New", "Used"];

// Spec order: [engine, power, fuel, transmission]
const SPEC_META = [
  { label: "Engine", icon: Cylinder },
  { label: "Power", icon: Gauge },
  { label: "Fuel", icon: Fuel },
  { label: "Transmission", icon: Cog },
];

const cars = [
  { id: 1, name: "BMW i8 [2022-2023]", condition: "New", price: "$146,000", image: img1, specs: ["1498 cc", "122 bhp", "petrol", "manual"] },
  { id: 2, name: "Chevrolet Camaro SS [2019-2020]", condition: "Used", listingType: "For rent", price: "$89,900", priceUnit: "/day", image: img2, specs: ["6162 cc", "455 bhp", "petrol", "manual"] },
  { id: 3, name: "Chevrolet Camaro RS [2022-2024]", condition: "New", price: "$42,500", image: img3, specs: ["3600 cc", "335 bhp", "petrol", "manual"] },
  { id: 4, name: "BMW M2 Competition [2022-2023]", condition: "New", price: "$58,900", image: img4, specs: ["2993 cc", "122 bhp", "petrol", "manual"] },
  { id: 5, name: "Toyota Hilux [2023-2024]", condition: "New", price: "$34,200", image: img5, specs: ["1499 cc", "122 bhp", "petrol", "manual"] },
  { id: 6, name: "Mercedes-Benz E-Class [2019-2020]", condition: "Used", listingType: "For rent", price: "$75,900", priceUnit: "/day", image: img6, specs: ["1498 cc", "122 bhp", "petrol", "manual"] },
];

const CarCard = ({ car, index }) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Reveal
      as="article"
      y={32}
      delay={(index % 3) * 0.08}
      className="group rounded-2xl border border-neutral-200 bg-white p-3 transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/5"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          className="size-full object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-700">
          {car.condition} Car
        </span>

        {car.listingType && (
          <span className="absolute right-3 top-3 rounded-full bg-[#f05a1a]/10 px-3 py-1.5 text-[11px] font-medium text-[#f05a1a]">
            {car.listingType}
          </span>
        )}

        <button
          type="button"
          aria-label={isSaved ? `Remove ${car.name} from saved` : `Save ${car.name}`}
          aria-pressed={isSaved}
          onClick={() => setIsSaved((prev) => !prev)}
          className={`absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-white text-neutral-500 shadow-sm transition-colors duration-300 hover:text-[#f05a1a] ${focusRing}`}
        >
          <Heart
            className={`size-4 transition-colors ${
              isSaved ? "fill-[#f05a1a] text-[#f05a1a]" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex items-start justify-between gap-3 px-1 pt-5">
        <div className="min-w-0">
          <p className="text-2xl font-bold leading-none tracking-tight text-[#f05a1a]">
            {car.price}
            {car.priceUnit && (
              <span className="ml-1 text-[11px] font-medium tracking-normal text-neutral-400">
                {car.priceUnit}
              </span>
            )}
          </p>
          <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-neutral-950">
            {car.name}
          </h3>
        </div>

        <Link
          to={`/inventory/${car.id}`}
          aria-label={`View details for ${car.name}`}
          className={`grid size-10 shrink-0 place-items-center rounded-full border border-neutral-200 text-neutral-950 transition-colors duration-300 group-hover:border-[#f05a1a] group-hover:bg-[#f05a1a] group-hover:text-white ${focusRing}`}
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <ul className="mt-5 grid grid-cols-4 gap-1 border-t border-neutral-200 px-1 pt-4">
        {car.specs.map((spec, specIndex) => {
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

  const visibleCars =
    activeTab === "All" ? cars : cars.filter((car) => car.condition === activeTab);

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
          {visibleCars.map((car, index) => (
            <CarCard key={`${activeTab}-${car.id}`} car={car} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarListingSection;
