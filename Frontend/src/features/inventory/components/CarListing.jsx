import InventoryCarCard from "./InventoryCarCard";

const CarListing = ({ cars, view = "grid" }) => (
  <ul
    className={
      view === "list"
        ? "flex flex-col gap-4"
        : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    }
  >
    {cars.map((car) => (
      <li key={car.id} className="flex">
        <InventoryCarCard car={car} layout={view} />
      </li>
    ))}
  </ul>
);

export default CarListing;