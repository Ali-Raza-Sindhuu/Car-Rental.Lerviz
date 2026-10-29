import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "year", label: "Year" },
];

const VIEW_OPTIONS = [
  { value: "grid", label: "Grid view", Icon: LayoutGrid },
  { value: "list", label: "List view", Icon: List },
];

const ResultsToolbar = ({
  shownCount = 0,
  totalCount = 0,
  sort,
  onSortChange,
  view,
  onViewChange,
  activeFilterCount = 0,
  onOpenFilters,
}) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <p role="status" aria-live="polite" className="text-sm text-neutral-500">
      Showing <span className="font-semibold text-neutral-900">{shownCount}</span> of{" "}
      <span className="font-semibold text-neutral-900">{totalCount}</span>{" "}
      {totalCount === 1 ? "vehicle" : "vehicles"}
    </p>

    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={onOpenFilters}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-xs font-medium text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a] lg:hidden"
      >
        <SlidersHorizontal className="size-3.5" aria-hidden="true" />
        Filters
        {activeFilterCount > 0 && (
          <span className="rounded-full bg-[#f05a1a] px-1.5 py-0.5 text-[11px] font-medium leading-none text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      <div className="flex items-center gap-2">
        <label htmlFor="inventory-sort" className="text-[11px] font-medium text-neutral-500">
          Sort by
        </label>
        <select
          id="inventory-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-10 cursor-pointer rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-900 focus-visible:border-[#f05a1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a]"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div role="group" aria-label="Change layout" className="flex items-center gap-2">
        {VIEW_OPTIONS.map(({ value, label, Icon }) => {
          const isActive = view === value;
          return (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={isActive}
              onClick={() => onViewChange(value)}
              className={`inline-flex size-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a] ${
                isActive
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              <Icon className="size-4" />
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

export default ResultsToolbar;