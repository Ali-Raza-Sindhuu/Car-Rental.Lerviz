import { useMemo, useRef, useState } from "react";
import InventoryHeader from "./components/InventoryHeader";
import SearchFilterBar, { DEFAULT_SEARCH, PRICE_RANGES } from "./components/SearchFilterBar";
import FilterSidebar, { DEFAULT_FILTERS, countActiveFilters } from "./components/FilterSidebar";
import ResultsToolbar from "./components/ResultsToolbar";
import CarListing from "./components/CarListing";
import Pagination from "./components/Pagination";
import EmptyState from "./components/EmptyState";
import { CARS, MAKES, MODELS_BY_MAKE, YEARS } from "./data/cars";
import RentCtaBanner from "../home/components/RentBanner";

const PAGE_SIZE = 9;

// Price filters apply to cars for sale only. Rental prices are per day, so rentals always pass.
const matchesPrice = (car, min, max) =>
  car.listingType === "rent" || (car.price >= min && car.price <= max);

const SORTERS = {
  newest: (a, b) => b.year - a.year,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  year: (a, b) => a.year - b.year,
};

const filterCars = (cars, search, filters) => {
  const range = PRICE_RANGES.find((item) => item.id === search.price) ?? PRICE_RANGES[0];
  const priceMin = Math.max(range.min, Number(filters.priceMin) || 0);
  const priceMax = Math.min(range.max, filters.priceMax === "" ? Infinity : Number(filters.priceMax));

  return cars.filter((car) => {
    // Search bar
    if (search.condition && car.condition !== search.condition) return false;
    if (search.listingType !== "all" && car.listingType !== search.listingType) return false;
    if (search.make && car.make !== search.make) return false;
    if (search.model && car.model !== search.model) return false;
    if (search.year && String(car.year) !== search.year) return false;

    // Price from both the search bar and the sidebar
    if (!matchesPrice(car, priceMin, priceMax)) return false;

    // Sidebar
    if (filters.bodyTypes.length && !filters.bodyTypes.includes(car.bodyType)) return false;
    if (filters.fuels.length && !filters.fuels.includes(car.fuel)) return false;
    if (filters.transmissions.length && !filters.transmissions.includes(car.transmission)) return false;
    if (filters.colours.length && !filters.colours.includes(car.colour)) return false;
    if (filters.yearMin && car.year < Number(filters.yearMin)) return false;
    if (filters.yearMax && car.year > Number(filters.yearMax)) return false;
    if (filters.mileageMax && car.mileage > Number(filters.mileageMax)) return false;

    return true;
  });
};

const InventoryPage = () => {
  const [search, setSearch] = useState(DEFAULT_SEARCH);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const resultsRef = useRef(null);

  const filteredCars = useMemo(() => {
    const matches = filterCars(CARS, search, filters);
    return [...matches].sort(SORTERS[sort]);
  }, [search, filters, sort]);

  const totalCount = filteredCars.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageCars = filteredCars.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const models = MODELS_BY_MAKE[search.make] ?? [];

  const scrollToResults = () => resultsRef.current?.scrollIntoView();

  const handleSearchChange = (patch) => {
    setSearch((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  const handleFiltersChange = (patch) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    scrollToResults();
  };

  const resetSearch = () => {
    setSearch(DEFAULT_SEARCH);
    setPage(1);
  };

  const clearSidebarFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const clearEverything = () => {
    setSearch(DEFAULT_SEARCH);
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  return (
    <>
      <InventoryHeader resultCount={totalCount} />

      <SearchFilterBar
        values={search}
        onChange={handleSearchChange}
        onReset={resetSearch}
        onSearch={scrollToResults}
        makes={MAKES}
        models={models}
        years={YEARS}
      />

      <section
        ref={resultsRef}
        aria-label="Inventory results"
        className="scroll-mt-24 bg-white py-16 md:py-24"
      >
        <div className="mx-auto flex max-w-[1400px] gap-8 px-4 md:px-12">
          <FilterSidebar
            filters={filters}
            onChange={handleFiltersChange}
            onClearAll={clearSidebarFilters}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
            resultCount={totalCount}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-6">
              <ResultsToolbar
                shownCount={pageCars.length}
                totalCount={totalCount}
                sort={sort}
                onSortChange={handleSortChange}
                view={view}
                onViewChange={setView}
                activeFilterCount={countActiveFilters(filters)}
                onOpenFilters={() => setIsDrawerOpen(true)}
              />
            </div>

            {totalCount === 0 ? (
              <EmptyState onClearFilters={clearEverything} />
            ) : (
              <>
                <CarListing cars={pageCars} view={view} />
                <Pagination
                  page={currentPage}
                  pageCount={pageCount}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </section>

      <RentCtaBanner />
    </>
  );
};

export default InventoryPage;