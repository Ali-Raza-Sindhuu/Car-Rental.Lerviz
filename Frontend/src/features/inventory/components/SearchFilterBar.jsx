import { RotateCcw, Search } from "lucide-react";

export const DEFAULT_SEARCH = {
  condition: "", // "" | "new" | "used"
  listingType: "all", // "all" | "buy" | "rent"
  make: "",
  model: "",
  year: "",
  price: "any",
};

export const PRICE_RANGES = [
  { id: "any", label: "Any price", min: 0, max: Infinity },
  { id: "under-30k", label: "Under $30,000", min: 0, max: 30000 },
  { id: "30k-60k", label: "$30,000 – $60,000", min: 30000, max: 60000 },
  { id: "60k-100k", label: "$60,000 – $100,000", min: 60000, max: 100000 },
  { id: "100k-plus", label: "$100,000 +", min: 100000, max: Infinity },
];

const CONDITIONS = [
  { id: "new", label: "New Car" },
  { id: "used", label: "Used Car" },
];

const LISTING_TYPES = [
  { id: "all", label: "All" },
  { id: "buy", label: "Buy Car" },
  { id: "rent", label: "Rent Car" },
];

const SelectField = ({ id, label, value, onChange, placeholder, options, disabled = false }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[11px] font-medium text-white/60">
      {label}
    </label>
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="h-9 w-full cursor-pointer border-b border-white/25 bg-transparent text-xs text-white focus-visible:border-[#f05a1a] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
    >
      <option value="" className="text-neutral-900">
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value} className="text-neutral-900">
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const SearchFilterBar = ({
  values,
  onChange,
  onReset,
  onSearch,
  makes = [],
  models = [],
  years = [],
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.();
  };

  const handleCondition = (id) => {
    // Clicking the active pill clears it, which shows both New and Used.
    onChange({ condition: values.condition === id ? "" : id });
  };

  return (
    <section aria-label="Search vehicles" className="bg-neutral-900 pb-10 md:pb-14">
      <div className="mx-auto max-w-[1400px] px-4 md:px-12">
        <form
          role="search"
          onSubmit={handleSubmit}
          className="rounded-2xl bg-black/50 p-5 backdrop-blur-md md:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {CONDITIONS.map((item) => {
                const isActive = values.condition === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleCondition(item.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      isActive
                        ? "bg-[#f05a1a] text-white"
                        : "border border-white/25 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <fieldset className="flex items-center gap-5">
              <legend className="sr-only">Listing type</legend>
              {LISTING_TYPES.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-center gap-2 text-xs text-white"
                >
                  <input
                    type="radio"
                    name="listingType"
                    value={item.id}
                    checked={values.listingType === item.id}
                    onChange={() => onChange({ listingType: item.id })}
                    className="size-3.5 cursor-pointer accent-[#f05a1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  />
                  {item.label}
                </label>
              ))}
            </fieldset>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto] lg:items-end">
            <SelectField
              id="search-make"
              label="Make"
              value={values.make}
              onChange={(make) => onChange({ make, model: "" })}
              placeholder="Select make"
              options={makes.map((make) => ({ value: make, label: make }))}
            />
            <SelectField
              id="search-model"
              label="Model"
              value={values.model}
              onChange={(model) => onChange({ model })}
              placeholder={values.make ? "Select model" : "Choose make first"}
              options={models.map((model) => ({ value: model, label: model }))}
              disabled={!values.make}
            />
            <SelectField
              id="search-year"
              label="Model year"
              value={values.year}
              onChange={(year) => onChange({ year })}
              placeholder="Any year"
              options={years.map((year) => ({ value: String(year), label: String(year) }))}
            />
            <div className="col-span-2 lg:col-span-2">
              <SelectField
                id="search-price"
                label="Price range"
                value={values.price === "any" ? "" : values.price}
                onChange={(price) => onChange({ price: price || "any" })}
                placeholder="Any price"
                options={PRICE_RANGES.slice(1).map((range) => ({
                  value: range.id,
                  label: range.label,
                }))}
              />
            </div>

            <div className="col-span-2 flex items-center justify-end gap-2 lg:col-span-1">
              <button
                type="button"
                onClick={onReset}
                aria-label="Reset search"
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                type="submit"
                aria-label="Search vehicles"
                className="inline-flex size-10 items-center justify-center rounded-full bg-white text-neutral-900 transition-colors hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a]"
              >
                <Search className="size-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchFilterBar;