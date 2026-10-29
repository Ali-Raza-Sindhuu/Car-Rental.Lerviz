import { ArrowRight, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyState = ({ onClearFilters }) => (
  <div
    role="status"
    className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center md:py-20"
  >
    <span className="flex size-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
      <SearchX className="size-6" aria-hidden="true" />
    </span>
    <h3 className="mt-6 text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl">
      No vehicles match your filters
    </h3>
    <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">
      Try widening the price or year range, or removing a body type or colour to see more cars.
    </p>
    <Button
      type="button"
      onClick={onClearFilters}
      className="mt-8 h-10 rounded-lg bg-[#f05a1a] px-5 text-xs font-semibold uppercase text-white hover:bg-[#d94e14]"
    >
      Clear filters
      <ArrowRight className="size-3.5" />
    </Button>
  </div>
);

export default EmptyState;