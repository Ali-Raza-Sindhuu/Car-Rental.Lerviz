import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DEFAULT_FILTERS = {
  bodyTypes: [],
  priceMin: "",
  priceMax: "",
  yearMin: "",
  yearMax: "",
  fuels: [],
  transmissions: [],
  mileageMax: "",
  colours: [],
};

export const BODY_TYPES = ["SUV", "Sedan", "Wagon", "Coupe", "Convertible", "Hatchback", "Pickup"];
export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
export const TRANSMISSIONS = ["Automatic", "Manual"];
export const MILEAGE_LIMITS = [10000, 30000, 60000, 100000];
export const COLOURS = [
  { name: "Black", hex: "#171717" },
  { name: "White", hex: "#ffffff" },
  { name: "Grey", hex: "#737373" },
  { name: "Silver", hex: "#d4d4d4" },
  { name: "Blue", hex: "#1d4ed8" },
  { name: "Red", hex: "#dc2626" },
  { name: "Yellow", hex: "#facc15" },
  { name: "Orange", hex: "#f05a1a" },
];

export const countActiveFilters = (filters) =>
  filters.bodyTypes.length +
  filters.fuels.length +
  filters.transmissions.length +
  filters.colours.length +
  [filters.priceMin, filters.priceMax, filters.yearMin, filters.yearMax, filters.mileageMax].filter(
    Boolean,
  ).length;

const inputClass =
  "h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus-visible:border-[#f05a1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a]";

const FilterGroup = ({ id, title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-t border-neutral-200 py-4">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between rounded text-left text-sm font-semibold text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a]"
      >
        {title}
        <ChevronDown
          className={`size-4 text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div id={`${id}-panel`} className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

const CheckboxList = ({ idPrefix, options, selected, onToggle }) => (
  <ul className="space-y-2.5">
    {options.map((option) => (
      <li key={option}>
        <label className="flex cursor-pointer items-center gap-2.5 text-xs text-neutral-600">
          <input
            type="checkbox"
            id={`${idPrefix}-${option}`}
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
            className="size-3.5 cursor-pointer rounded accent-[#f05a1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a]"
          />
          {option}
        </label>
      </li>
    ))}
  </ul>
);

const FilterGroups = ({ idPrefix, filters, onChange }) => {
  const toggleIn = (key, value) => {
    const current = filters[key];
    onChange({
      [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    });
  };

  return (
    <div>
      <FilterGroup id={`${idPrefix}-body`} title="Body type">
        <div className="flex flex-wrap gap-2">
          {BODY_TYPES.map((type) => {
            const isActive = filters.bodyTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                aria-pressed={isActive}
                onClick={() => toggleIn("bodyTypes", type)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a] ${
                  isActive
                    ? "bg-[#f05a1a] text-white"
                    : "border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-price`} title="Price range">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor={`${idPrefix}-price-min`} className="sr-only">
              Minimum price
            </label>
            <input
              id={`${idPrefix}-price-min`}
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="Min $"
              value={filters.priceMin}
              onChange={(event) => onChange({ priceMin: event.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-price-max`} className="sr-only">
              Maximum price
            </label>
            <input
              id={`${idPrefix}-price-max`}
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="Max $"
              value={filters.priceMax}
              onChange={(event) => onChange({ priceMax: event.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-year`} title="Year">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor={`${idPrefix}-year-min`} className="sr-only">
              From year
            </label>
            <input
              id={`${idPrefix}-year-min`}
              type="number"
              inputMode="numeric"
              placeholder="From"
              value={filters.yearMin}
              onChange={(event) => onChange({ yearMin: event.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-year-max`} className="sr-only">
              To year
            </label>
            <input
              id={`${idPrefix}-year-max`}
              type="number"
              inputMode="numeric"
              placeholder="To"
              value={filters.yearMax}
              onChange={(event) => onChange({ yearMax: event.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-fuel`} title="Fuel type">
        <CheckboxList
          idPrefix={`${idPrefix}-fuel-option`}
          options={FUEL_TYPES}
          selected={filters.fuels}
          onToggle={(value) => toggleIn("fuels", value)}
        />
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-transmission`} title="Transmission">
        <CheckboxList
          idPrefix={`${idPrefix}-transmission-option`}
          options={TRANSMISSIONS}
          selected={filters.transmissions}
          onToggle={(value) => toggleIn("transmissions", value)}
        />
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-mileage`} title="Mileage">
        <label htmlFor={`${idPrefix}-mileage-max`} className="sr-only">
          Maximum mileage
        </label>
        <select
          id={`${idPrefix}-mileage-max`}
          value={filters.mileageMax}
          onChange={(event) => onChange({ mileageMax: event.target.value })}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="">Any mileage</option>
          {MILEAGE_LIMITS.map((limit) => (
            <option key={limit} value={limit}>
              Up to {limit.toLocaleString()} km
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-colour`} title="Colour">
        <div className="flex flex-wrap gap-2.5">
          {COLOURS.map((colour) => {
            const isActive = filters.colours.includes(colour.name);
            return (
              <button
                key={colour.name}
                type="button"
                aria-pressed={isActive}
                aria-label={colour.name}
                title={colour.name}
                onClick={() => toggleIn("colours", colour.name)}
                style={{ backgroundColor: colour.hex }}
                className={`size-7 rounded-full border border-neutral-200 transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a] ${
                  isActive ? "ring-2 ring-[#f05a1a] ring-offset-2" : ""
                }`}
              />
            );
          })}
        </div>
      </FilterGroup>
    </div>
  );
};

const SidebarHeader = ({ activeCount, onClearAll }) => (
  <div className="flex items-center justify-between pb-4">
    <h2 className="text-base font-semibold tracking-tight text-neutral-900">
      Filters
      {activeCount > 0 && (
        <span className="ml-2 rounded-full bg-[#f05a1a]/10 px-2 py-0.5 text-[11px] font-medium text-[#f05a1a]">
          {activeCount}
        </span>
      )}
    </h2>
    <button
      type="button"
      onClick={onClearAll}
      disabled={activeCount === 0}
      className="rounded text-xs font-medium text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:no-underline"
    >
      Clear all
    </button>
  </div>
);

const FilterDrawer = ({ filters, onChange, onClearAll, onClose, activeCount, resultCount }) => {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = panelRef.current?.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href]',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden" onKeyDown={handleKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filter vehicles"
        className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white"
      >
        <div className="flex items-start justify-between gap-3 border-b border-neutral-200 px-5 pt-5">
          <div className="flex-1">
            <SidebarHeader activeCount={activeCount} onClearAll={onClearAll} />
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a]"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          <FilterGroups idPrefix="drawer" filters={filters} onChange={onChange} />
        </div>

        <div className="border-t border-neutral-200 p-5">
          <Button
            type="button"
            onClick={onClose}
            className="h-10 w-full rounded-lg bg-[#f05a1a] text-xs font-semibold uppercase text-white hover:bg-[#d94e14]"
          >
            Show {resultCount} {resultCount === 1 ? "vehicle" : "vehicles"}
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const FilterSidebar = ({
  filters,
  onChange,
  onClearAll,
  isDrawerOpen = false,
  onCloseDrawer,
  resultCount = 0,
}) => {
  const activeCount = countActiveFilters(filters);

  return (
    <>
      <aside
        aria-label="Filter vehicles"
        className="hidden w-[280px] shrink-0 self-start rounded-2xl border border-neutral-200 bg-white p-5 lg:sticky lg:top-28 lg:block"
      >
        <SidebarHeader activeCount={activeCount} onClearAll={onClearAll} />
        <FilterGroups idPrefix="sidebar" filters={filters} onChange={onChange} />
      </aside>

      {isDrawerOpen && (
        <FilterDrawer
          filters={filters}
          onChange={onChange}
          onClearAll={onClearAll}
          onClose={onCloseDrawer}
          activeCount={activeCount}
          resultCount={resultCount}
        />
      )}
    </>
  );
};

export default FilterSidebar;