import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import heroImage from "@/assets/inventory_hero.png";

const InventoryHeader = ({ resultCount = 0 }) => {
  const countLabel = `${resultCount} ${resultCount === 1 ? "vehicle" : "vehicles"} available`;

  return (
    <header className="relative isolate overflow-hidden bg-neutral-900 pt-32 pb-8 md:pt-36 md:pb-10">
      <img src={heroImage} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover object-[70%_center]" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-900/75 to-neutral-900/45" />
      <div className="relative mx-auto max-w-[1400px] px-4 md:px-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-[11px] text-white/60">
            <li>
              <Link
                to="/"
                className="rounded transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a]"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li aria-current="page" className="font-medium text-white">
              Inventory
            </li>
          </ol>
        </nav>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
              <span className="size-1.5 rounded-full bg-[#f05a1a]" aria-hidden="true" />
              Browse latest car
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
              Our inventory
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              New and pre-owned cars from verified dealers, available to buy or rent.
              Filter by make, price, body type and more to find the right one.
            </p>
          </div>

          <p
            role="status"
            aria-live="polite"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white"
          >
            <span className="size-1.5 rounded-full bg-[#f05a1a]" aria-hidden="true" />
            {countLabel}
          </p>
        </div>
      </div>
    </header>
  );
};

export default InventoryHeader;