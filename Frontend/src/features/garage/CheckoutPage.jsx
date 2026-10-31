import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { formatPrice } from "@/features/inventory/details/components/CarSummary";

export const CHECKOUT_ENABLED = false;

const CheckoutPage = () => {
  const token = useSelector((state) => state.auth.token);
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    apiRequest("/api/cart", {
      token,
      signal: controller.signal,
    }).then(({ cart: serverCart }) => {
      setCart(serverCart);
    }).catch((requestError) => {
      if (requestError.name !== "AbortError") setError(requestError.message);
    });
    return () => controller.abort();
  }, [token]);

  const total = cart?.items?.reduce((sum, item) => {
    const price = Number(item.car.price);
    if (item.listing_type === "buy") return sum + price;
    const days = Math.floor((Date.parse(`${item.end_date}T00:00:00Z`) - Date.parse(`${item.start_date}T00:00:00Z`)) / 86400000) + 1;
    return sum + price * days;
  }, 0) ?? 0;

  return (
    <section className="min-h-[65vh] bg-neutral-50 px-4 pb-20 pt-32 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[850px]">
        <Link to="/cart" className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-[#f05a1a]"><ArrowLeft className="size-4" />Back to Garage</Link>
        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">Review your selections</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-5xl">Checkout</h1>
        {error && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load the server garage summary: {error}</p>}
        {!cart && !error && <p role="status" className="mt-6 text-sm text-neutral-500">Loading server summary…</p>}
        {cart && (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 md:p-7">
            <h2 className="text-lg font-semibold text-neutral-900">Garage summary</h2>
            {!cart.items.length ? (
              <p className="mt-4 text-sm text-neutral-500">Your garage is empty. <Link to="/inventory" className="font-semibold text-[#f05a1a]">Browse inventory</Link></p>
            ) : (
              <ul className="mt-5 divide-y divide-neutral-200">
                {cart.items.map((item) => {
                  const days = item.listing_type === "rent" ? Math.floor((Date.parse(`${item.end_date}T00:00:00Z`) - Date.parse(`${item.start_date}T00:00:00Z`)) / 86400000) + 1 : 1;
                  return <li key={item.id} className="flex items-start justify-between gap-4 py-4 text-sm"><div><p className="font-medium text-neutral-900">{item.car.make} {item.car.model}</p><p className="mt-1 text-xs text-neutral-500">{item.listing_type === "rent" ? `${item.start_date} – ${item.end_date} · ${days} day${days === 1 ? "" : "s"}` : "Purchase"}</p></div><p className="font-medium text-neutral-900">{formatPrice(Number(item.car.price) * days)}</p></li>;
                })}
              </ul>
            )}
            <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-sm font-semibold text-neutral-900"><span>Estimated total</span><span>{formatPrice(total)}</span></div>
            <p className="mt-3 text-xs leading-relaxed text-neutral-500">This is the current server garage summary. Removed items are not included in the available server response.</p>
            <button type="button" disabled={!CHECKOUT_ENABLED || !cart.items.length} className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#f05a1a] px-5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Continue to payment <ArrowRight className="size-4" /></button>
            {!CHECKOUT_ENABLED && <p role="status" className="mt-3 text-center text-xs text-neutral-500">Checkout is not available yet</p>}
          </div>
        )}
      </div>
    </section>
  );
};

export default CheckoutPage;
