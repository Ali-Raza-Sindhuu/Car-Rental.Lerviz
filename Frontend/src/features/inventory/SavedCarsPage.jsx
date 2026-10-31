import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Bookmark, RotateCcw, Trash2 } from "lucide-react";
import VehicleImage from "@/components/shared/VehicleImage";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { addToGarage } from "@/features/garage/garageApi";
import { mapCar } from "./data/apiCars";
import { setFavourite, useFavourites, WISHLIST_ENABLED } from "./favourites";
import { formatPrice } from "./details/components/CarSummary";

const SavedCarsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const savedIds = useFavourites();
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [undoId, setUndoId] = useState("");
  const [reserveStatus, setReserveStatus] = useState("");
  const [isReserving, setIsReserving] = useState(false);

  useEffect(() => {
    let active = true;
    setError("");
    Promise.all(savedIds.map((id) => apiRequest(`/api/cars/${encodeURIComponent(id)}`).then(mapCar)))
      .then((result) => { if (active) setCars(result); })
      .catch((loadError) => { if (active) setError(loadError.message); });
    return () => { active = false; };
  }, [savedIds]);

  const remove = (id) => {
    setFavourite(id, false);
    setUndoId(id);
  };
  const undo = () => {
    if (undoId) {
      setFavourite(undoId, true);
      setUndoId("");
    }
  };
  const reserve = async (car) => {
    if (car.listingType === "rent") {
      navigate(`/inventory/${car.id}`);
      return;
    }
    setIsReserving(true);
    setReserveStatus("");
    try {
      await addToGarage({ car, token, dispatch });
      setReserveStatus("Added to your garage");
    } catch (reserveError) {
      setReserveStatus(reserveError.message);
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <section className="min-h-[65vh] bg-neutral-50 px-4 pb-20 pt-32 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[1100px]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">Keep what catches your eye</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-5xl">Saved cars</h1>
        {!WISHLIST_ENABLED && <p className="mt-4 rounded-xl border border-neutral-200 bg-white p-3 text-xs leading-relaxed text-neutral-600">Saved cars are stored on this device. Account wishlist sync is not available yet.</p>}
        {error && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load saved cars: {error}</p>}
        {reserveStatus && <p role="status" className="mt-5 text-sm text-neutral-600">{reserveStatus}</p>}
        {!error && savedIds.length === 0 && (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center">
            <Bookmark aria-hidden="true" className="mx-auto size-9 text-neutral-400" />
            <h2 className="mt-5 text-xl font-semibold text-neutral-900">No saved cars yet.</h2>
            <p className="mt-2 text-sm text-neutral-500">Use the heart on a car to keep it here.</p>
            <Link to="/inventory" className="mt-6 inline-flex rounded-lg bg-neutral-900 px-5 py-3 text-xs font-semibold uppercase text-white">Explore inventory</Link>
          </div>
        )}
        {undoId && <p role="status" className="mt-5 flex items-center gap-3 text-sm text-neutral-600">Car removed from saved cars.<button type="button" onClick={undo} className="inline-flex items-center gap-1 font-semibold text-[#f05a1a]"><RotateCcw className="size-3.5" />Undo</button></p>}
        {cars.length > 0 && (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <li key={car.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <Link to={`/inventory/${car.id}`} className="block aspect-[4/3] bg-neutral-100">
                  <VehicleImage src={car.image} alt={`${car.make} ${car.model}`} className="size-full object-contain p-4" />
                </Link>
                <div className="p-4">
                  <p className="text-[10px] font-medium uppercase text-neutral-500">{car.listingType === "rent" ? "Rental" : "For sale"}{car.status === "sold" ? " · Sold" : ""}</p>
                  <h2 className="mt-1 font-semibold text-neutral-900">{car.make} {car.model} [{car.yearRange}]</h2>
                  <p className="mt-2 font-semibold text-[#f05a1a]">{formatPrice(car.price)}{car.listingType === "rent" && <span className="ml-1 text-xs font-normal text-neutral-500">/day</span>}</p>
                  <div className="mt-4 flex gap-2">
                    {car.status === "sold" ? (
                      <Link to={`/inventory/${car.id}`} className="flex-1 rounded-lg bg-neutral-900 px-3 py-2.5 text-center text-xs font-semibold text-white">View car</Link>
                    ) : car.listingType === "rent" ? (
                      <Link to={`/inventory/${car.id}`} className="flex-1 rounded-lg bg-[#f05a1a] px-3 py-2.5 text-center text-xs font-semibold text-white">Reserve</Link>
                    ) : (
                      <Button type="button" disabled={isReserving} onClick={() => reserve(car)} className="h-10 flex-1 rounded-lg bg-[#f05a1a] text-xs font-semibold uppercase text-white">Reserve</Button>
                    )}
                    <button type="button" disabled={Boolean(undoId)} onClick={() => remove(car.id)} aria-label={`Remove ${car.make} ${car.model} from saved cars`} className="grid size-10 place-items-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default SavedCarsPage;
