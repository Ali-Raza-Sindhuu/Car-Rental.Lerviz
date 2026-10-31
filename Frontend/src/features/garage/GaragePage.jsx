import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, CarFront, RotateCcw, Trash2 } from "lucide-react";
import VehicleImage from "@/components/shared/VehicleImage";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { mapCar } from "@/features/inventory/data/apiCars";
import { clearGarageMessage, setGuestItems } from "./garageSlice";
import { readGuestGarage, writeGuestGarage } from "./garageStorage";
import { formatPrice } from "@/features/inventory/details/components/CarSummary";

const rentalDays = (startDate, endDate) =>
  Math.floor((Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 86400000) + 1;

const GaragePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const guestItems = useSelector((state) => state.garage.guestItems);
  const mergeMessage = useSelector((state) => state.garage.message);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [undoItem, setUndoItem] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const load = token
      ? apiRequest("/api/cart", { token }).then(({ cart }) => cart.items.map((item) => ({
          itemId: item.id,
          carId: item.car.id,
          listingType: item.listing_type,
          startDate: item.start_date,
          endDate: item.end_date,
          car: mapCar({
            ...item.car,
            year_range: item.car.year_range,
            body_type: item.car.body_type,
            listing_type: item.car.listing_type,
            image_url: item.car.image_url,
            condition: item.car.condition,
            fuel: item.car.fuel,
            transmission: item.car.transmission,
            cc: item.car.cc,
            bhp: item.car.bhp,
            mileage: item.car.mileage,
            colour: item.car.colour,
          }),
        })))
      : Promise.all(guestItems.map(async (item) => {
          const car = await apiRequest(`/api/cars/${encodeURIComponent(item.carId)}`);
          return {
            ...item,
            itemId: item.carId,
            carId: item.carId,
            car: mapCar(car),
          };
        }));
    load.then((loaded) => {
      if (active) setItems(loaded);
    }).catch((loadError) => {
      if (active) setError(loadError.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [token, guestItems]);

  const purchaseTotal = useMemo(() => items.reduce(
    (total, item) => total + (item.listingType === "buy" ? item.car.price : 0), 0,
  ), [items]);
  const rentalTotal = useMemo(() => items.reduce(
    (total, item) => total + (item.listingType === "rent" ? rentalDays(item.startDate, item.endDate) * item.car.price : 0), 0,
  ), [items]);

  const removeItem = async (item) => {
    setBusy(true);
    setStatus("");
    try {
      if (token) {
        await apiRequest(`/api/cart/items/${encodeURIComponent(item.itemId)}`, { method: "DELETE", token });
        window.dispatchEvent(new Event("revex:garage-changed"));
      } else {
        const next = readGuestGarage().filter((candidate) => candidate.carId !== item.carId);
        writeGuestGarage(next);
        dispatch(setGuestItems(next));
      }
      setItems((current) => current.filter((entry) => entry.itemId !== item.itemId));
      setUndoItem(item);
      setStatus("Removed from your garage.");
    } catch (removeError) {
      setStatus(removeError.message);
    } finally {
      setBusy(false);
    }
  };

  const undoRemoval = async () => {
    if (!undoItem || busy) return;
    setBusy(true);
    setStatus("");
    try {
      if (token) {
        const body = {
          carId: undoItem.carId,
          listingType: undoItem.listingType,
          ...(undoItem.startDate ? { startDate: undoItem.startDate } : {}),
          ...(undoItem.endDate ? { endDate: undoItem.endDate } : {}),
        };
        const { item } = await apiRequest("/api/cart/items", { method: "POST", token, body });
        setItems((current) => [...current, {
          ...undoItem,
          itemId: item.id,
          car: mapCar({ ...item.car, year_range: item.car.year_range, listing_type: item.car.listing_type, image_url: item.car.image_url }),
        }]);
        window.dispatchEvent(new Event("revex:garage-changed"));
      } else {
        const next = [...readGuestGarage(), {
          carId: undoItem.carId,
          listingType: undoItem.listingType,
          ...(undoItem.startDate ? { startDate: undoItem.startDate } : {}),
          ...(undoItem.endDate ? { endDate: undoItem.endDate } : {}),
        }];
        writeGuestGarage(next);
        dispatch(setGuestItems(next));
        setItems((current) => [...current, undoItem]);
      }
      setUndoItem(null);
      setStatus("Item restored to your garage.");
    } catch (undoError) {
      setStatus(`Unable to restore this item: ${undoError.message}`);
    } finally {
      setBusy(false);
    }
  };

  const continueToPayment = () => {
    if (token) navigate("/checkout");
    else navigate("/login", { state: { from: { pathname: "/checkout" } } });
  };

  return (
    <section className="min-h-[65vh] bg-neutral-50 px-4 pb-20 pt-32 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[1100px]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">Your collection</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-5xl">Garage</h1>
        {mergeMessage && <div role="status" className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700"><p>{mergeMessage}</p><button type="button" aria-label="Dismiss garage message" onClick={() => dispatch(clearGarageMessage())} className="font-semibold text-[#f05a1a]">Dismiss</button></div>}
        {loading && <p role="status" className="mt-8 text-sm text-neutral-500">Loading your garage…</p>}
        {error && <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load your garage: {error}</p>}
        {!loading && !error && !items.length && (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center">
            <CarFront aria-hidden="true" className="mx-auto size-9 text-neutral-400" />
            <h2 className="mt-5 text-xl font-semibold text-neutral-900">Your garage is empty.</h2>
            <p className="mt-2 text-sm text-neutral-500">Explore the collection and reserve a car to see it here.</p>
            <Link to="/inventory" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-xs font-semibold uppercase text-white">Browse inventory <ArrowRight className="size-4" /></Link>
          </div>
        )}
        {!loading && !error && items.length > 0 && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              {items.map((item) => (
                <article key={item.itemId} className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:flex-row">
                  <Link to={`/inventory/${item.carId}`} className="block aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100 sm:w-48 sm:shrink-0">
                    <VehicleImage src={item.car.image} alt={`${item.car.make} ${item.car.model}`} className="size-full object-contain p-3" />
                  </Link>
                  <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-500">{item.listingType === "rent" ? "Rental" : "Purchase"}</p>
                      <h2 className="mt-1 text-base font-semibold text-neutral-900"><Link to={`/inventory/${item.carId}`} className="hover:text-[#f05a1a]">{item.car.make} {item.car.model} [{item.car.yearRange}]</Link></h2>
                      <p className="mt-2 text-sm font-semibold text-[#f05a1a]">{formatPrice(item.car.price)}{item.listingType === "rent" && <span className="ml-1 text-xs font-normal text-neutral-500">/day</span>}</p>
                      {item.listingType === "rent" && <p className="mt-1 text-xs text-neutral-500">{item.startDate} – {item.endDate} · {rentalDays(item.startDate, item.endDate)} day{rentalDays(item.startDate, item.endDate) === 1 ? "" : "s"} · {formatPrice(rentalDays(item.startDate, item.endDate) * item.car.price)}</p>}
                    </div>
                    <button type="button" disabled={busy || Boolean(undoItem)} onClick={() => removeItem(item)} aria-label={`Remove ${item.car.make} ${item.car.model} from garage`} className="grid size-9 shrink-0 place-items-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"><Trash2 className="size-4" /></button>
                  </div>
                </article>
              ))}
              {status && <div role="status" className="rounded-xl bg-white p-3 text-sm text-neutral-600">{status}{undoItem && <button type="button" disabled={busy} onClick={undoRemoval} className="ml-3 inline-flex items-center gap-1 font-semibold text-[#f05a1a]"><RotateCcw className="size-3.5" />Undo</button>}</div>}
            </div>
            <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-neutral-900">Garage summary</h2>
              <dl className="mt-5 space-y-3 border-t border-neutral-200 pt-4 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-neutral-500">Purchase subtotal</dt><dd className="font-medium text-neutral-900">{formatPrice(purchaseTotal)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-neutral-500">Rental estimate</dt><dd className="font-medium text-neutral-900">{formatPrice(rentalTotal)}</dd></div>
              </dl>
              <Button onClick={continueToPayment} className="mt-6 h-11 w-full rounded-lg bg-[#f05a1a] text-xs font-semibold text-white hover:bg-[#d94e14]">Continue to payment <ArrowRight className="size-4" /></Button>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-neutral-500">Checkout is not available yet</p>
              <p className="mt-4 text-[10px] leading-relaxed text-neutral-500">Adding a vehicle does not reserve it. Availability is checked again when checkout is introduced.</p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
};

export default GaragePage;
