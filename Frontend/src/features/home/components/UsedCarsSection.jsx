import { useRef, useState } from "react";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CircleDollarSign,
  Headset,
  Hourglass,
  MapPin,
  Navigation,
  Search,
} from "lucide-react";
import { Reveal } from "@/shared/motion";
import SectionHeading from "@/shared/SectionHeading";
import { btn, focusRing } from "@/shared/styles";

const perks = [
  { icon: Headset, label: "24/7 Emergency Service" },
  { icon: CircleDollarSign, label: "Affordable & Transparent Pricing" },
  { icon: Hourglass, label: "Fast Response Time" },
];

const avatars = [
  { src: "/image/search/avatar-1.jpg", color: "bg-orange-200" },
  { src: "/image/search/avatar-2.jpg", color: "bg-neutral-300" },
  { src: "/image/search/avatar-3.jpg", color: "bg-rose-200" },
];

const recentSearches = ["Sylhet, BD", "Habiganj, Bangladesh", "Khulna"];

const MAP_BLOCKS = [
  [20, 30, 90, 60], [130, 20, 110, 70], [260, 30, 100, 60],
  [30, 110, 80, 70], [130, 110, 100, 80], [250, 120, 110, 60],
  [20, 205, 100, 70], [140, 215, 90, 60], [250, 200, 120, 75],
];

const SearchCard = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const location = query.trim();
    if (!location) {
      inputRef.current?.focus();
      return;
    }
    navigate({
      pathname: "/inventory",
      search: `?${createSearchParams({ condition: "used", location })}`,
    });
  };

  const pickRecent = (place) => {
    setQuery(place);
    inputRef.current?.focus();
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl shadow-black/30 md:p-5">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex items-stretch rounded-lg border border-[#f05a1a]/30 p-0.5 transition-colors focus-within:border-[#f05a1a]"
      >
        <label htmlFor="used-car-search" className="sr-only">
          Search used cars by city or area
        </label>
        <div className="flex min-w-0 flex-1 items-center gap-2 pl-3">
          <Search aria-hidden="true" className="size-4 shrink-0 text-neutral-500" />
          <input
            id="used-car-search"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by city or area"
            autoComplete="off"
            className="h-10 min-w-0 flex-1 bg-transparent text-xs text-neutral-950 outline-none placeholder:text-neutral-400"
          />
        </div>
        <button
          type="submit"
          className={`rounded-md bg-[#f05a1a] px-4 text-xs font-semibold text-white transition-colors duration-300 hover:bg-[#d94e14] ${focusRing}`}
        >
          Search
        </button>
      </form>

      <p className="mt-5 text-center text-xs font-semibold text-neutral-950">
        Recent searches
      </p>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {recentSearches.map((place) => (
          <li key={place}>
            <button
              type="button"
              onClick={() => pickRecent(place)}
              className={`rounded-md bg-neutral-100 px-3 py-1.5 text-[11px] text-neutral-700 transition-colors duration-300 hover:bg-neutral-200 ${focusRing}`}
            >
              {place}
            </button>
          </li>
        ))}
      </ul>

      {/* Decorative map: faded street grid with a pin and a location marker */}
      <div
        aria-hidden="true"
        className="relative mx-auto mt-6 aspect-[4/3] w-full overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_72%)]"
      >
        <svg viewBox="0 0 400 300" className="absolute inset-0 size-full">
          <rect width="400" height="300" fill="#fafafa" />
          {MAP_BLOCKS.map(([x, y, w, h]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="4" fill="#efefef" />
          ))}
          <rect x="300" y="170" width="28" height="48" rx="6" fill="#d7f0dc" />
        </svg>

        <span className="absolute left-[24%] top-[30%] text-[8px] font-semibold text-neutral-800">
          Whittier Street
        </span>
        <span className="absolute left-[24%] top-[58%] origin-left rotate-[14deg] text-[8px] font-semibold text-neutral-800">
          Chesapeake Avenue
        </span>
        <MapPin className="absolute left-[18%] top-[52%] size-5 fill-[#f05a1a] text-white" />

        <span className="absolute left-[68%] top-[34%] grid size-7 place-items-center rounded-full border-2 border-white bg-sky-500 shadow-md">
          <Navigation className="size-3.5 fill-white text-white" />
        </span>
      </div>
    </div>
  );
};

const UsedCarsSection = () => (
  <section
    id="used-cars"
    aria-labelledby="used-cars-title"
    className="bg-white px-4 py-16 md:px-12 md:py-24"
  >
    <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <SectionHeading
          id="used-cars-title"
          eyebrow="Browse by search"
          lead={["Find your next"]}
          muted={["pre-owned drive"]}
          body="Explore a curated selection of inspected, reliable used cars from trusted sellers near you."
        />

        <Reveal delay={0.6}>
          <Link
            to="/inventory?condition=used"
            className={`group mt-7 ${btn.dark}`}
          >
            Browse used cars
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <Reveal
          delay={0.7}
          className="mt-16 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between md:mt-24 lg:pr-16"
        >
          <ul className="flex flex-col gap-3">
            {perks.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-xs text-neutral-700">
                <Icon strokeWidth={1.5} aria-hidden="true" className="size-4 text-[#f05a1a]" />
                {label}
              </li>
            ))}
          </ul>

          <div>
            <p className="text-xs text-neutral-600">Satisfied customers</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex -space-x-2">
                {avatars.map(({ src, color }) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    loading="lazy"
                    className={`size-7 rounded-full border-2 border-white object-cover ${color}`}
                  />
                ))}
              </div>
              <p className="text-3xl font-bold tracking-tight text-neutral-950">
                95K+
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal y={32} delay={0.15}>
        <div
          style={{ backgroundImage: "url(/image/search/search-bg.jpg)" }}
          className="mx-auto w-full max-w-[560px] rounded-2xl bg-neutral-900 bg-cover bg-center p-5 md:p-8 lg:ml-auto lg:mr-0"
        >
          <SearchCard />
        </div>
      </Reveal>
    </div>
  </section>
);

export default UsedCarsSection;
