import { Link } from "react-router-dom";
import { ArrowRight, Fuel, Gauge, Settings2, Zap } from "lucide-react";

// Change this once the car details route exists.
const getCarHref = (car) => `/inventory/${car.id}`;

const formatPrice = (car) => {
  const isRent = car.listingType === "rent";
  return `$${car.price.toLocaleString("en-US", {
    minimumFractionDigits: isRent ? 2 : 0,
    maximumFractionDigits: isRent ? 2 : 0,
  })}`;
};

const SpecRow = ({ car }) => {
  const specs = [
    { Icon: Gauge, label: car.cc ? `${car.cc} cc` : "Electric" },
    { Icon: Zap, label: `${car.bhp} bhp` },
    { Icon: Fuel, label: car.fuel.toLowerCase() },
    { Icon: Settings2, label: car.transmission.toLowerCase() },
  ];

  return (
    <ul className="mt-4 grid grid-cols-4 gap-2 border-t border-neutral-200 pt-3">
      {specs.map(({ Icon, label }) => (
        <li
          key={label}
          className="flex flex-col items-center gap-1 text-center text-[11px] text-neutral-500"
        >
          <Icon className="size-4 text-neutral-400" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
};

const InventoryCarCard = ({ car, layout = "grid" }) => {
  const isList = layout === "list";
  const isRent = car.listingType === "rent";
  const name = `${car.make} ${car.model}`;

  return (
    <article
      className={`relative flex w-full rounded-2xl border border-neutral-200 bg-white p-3 transition-shadow focus-within:shadow-lg hover:shadow-lg ${
        isList ? "flex-col sm:flex-row sm:gap-4" : "flex-col"
      }`}
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100 ${
          isList ? "sm:w-[38%] sm:shrink-0" : ""
        }`}
      >
        <img
          src={car.image}
          alt={`${name} ${car.yearRange}`}
          loading="lazy"
          className="size-full object-contain p-4"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-900">
          {car.condition === "new" ? "New Car" : "Used Car"}
        </span>
        {isRent && (
          <span className="absolute right-3 top-3 rounded-full bg-[#f05a1a]/10 px-2.5 py-1 text-[11px] font-medium text-[#f05a1a]">
            For rent
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col justify-between ${isList ? "px-1 pt-4 sm:py-2" : "px-1 pt-4"}`}>
        <div>
          <p className="text-lg font-bold text-[#f05a1a]">
            {formatPrice(car)}
            {isRent && <span className="ml-1 text-[11px] font-normal text-neutral-500">/day</span>}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-neutral-900">
            <Link
              to={getCarHref(car)}
              className="rounded after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a]"
            >
              {name} [{car.yearRange}]
            </Link>
          </h3>
          {isList && (
            <p className="mt-2 text-[11px] leading-relaxed text-neutral-500">
              {car.bodyType} in {car.colour.toLowerCase()}
              {car.condition === "used" ? `, ${car.mileage.toLocaleString("en-US")} km driven` : ", brand new"}.
            </p>
          )}
        </div>

        <div>
          <SpecRow car={car} />
          {isList && (
            <span className="mt-4 hidden h-9 w-fit items-center gap-1.5 rounded-lg bg-neutral-900 px-4 text-xs font-semibold uppercase text-white sm:inline-flex">
              View details
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default InventoryCarCard;