import { useState } from "react";
import { Heart } from "lucide-react";
import { focusRing } from "@/shared/styles";
import { setFavourite, useFavourites } from "../favourites";

const FavouriteButton = ({ carId, className = "" }) => {
  const favourites = useFavourites();
  const [undo, setUndo] = useState(false);
  const saved = favourites.includes(carId);
  const toggle = () => {
    setFavourite(carId, !saved);
    setUndo(saved);
  };
  return (
    <div className="relative z-10 flex flex-col items-center">
      <button
        type="button"
        aria-label={saved ? "Remove favourite" : "Favourite"}
        title={saved ? "Remove favourite" : "Favourite"}
        aria-pressed={saved}
        onClick={toggle}
        className={`grid size-9 place-items-center rounded-full bg-white text-neutral-500 shadow-sm transition-colors hover:text-[#f05a1a] ${focusRing} ${className}`}
      >
        <Heart className={`size-4 ${saved ? "fill-[#f05a1a] text-[#f05a1a]" : ""}`} />
      </button>
      {undo && (
        <p role="status" className="absolute right-0 top-full mt-2 flex items-center gap-1 whitespace-nowrap rounded-lg bg-white px-2 py-1 text-[10px] text-neutral-700 shadow-lg">
          Removed from saved cars.
          <button type="button" onClick={() => { setFavourite(carId, true); setUndo(false); }} className="font-semibold text-[#f05a1a] underline">Undo</button>
        </p>
      )}
    </div>
  );
};

export default FavouriteButton;
