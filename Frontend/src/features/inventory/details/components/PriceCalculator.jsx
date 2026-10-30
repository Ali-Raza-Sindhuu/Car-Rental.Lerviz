import { useState } from "react";
import { formatPrice } from "./CarSummary";

const inputClass = "mt-2 h-10 w-full min-w-0 rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a]";
const localDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const PriceCalculator = ({ car }) => {
  const [deposit, setDeposit] = useState(String(Math.round(car.price * 0.2)));
  const [term, setTerm] = useState(48);
  const [pickup, setPickup] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const rent = car.listingType === "rent";
  const depositValid = deposit !== "" && Number.isFinite(Number(deposit)) && Number(deposit) >= 0 && Number(deposit) <= car.price;
  const monthly = depositValid ? (car.price - Number(deposit)) / term : null;
  const days = pickup && returnDate ? Math.max(1, (Date.parse(returnDate) - Date.parse(pickup)) / 86400000) : null;
  const datesValid = days !== null && Number.isFinite(days) && pickup >= localDate() && returnDate >= pickup;
  return (
    <section id="calculator" aria-labelledby="calculator-title" className="scroll-mt-28 rounded-2xl border border-neutral-200 bg-white p-5 md:p-6">
      <h2 id="calculator-title" className="text-lg font-semibold tracking-tight text-neutral-900">{rent ? "Plan your time away." : "Make room for your next car."}</h2>
      <p className="mt-2 text-xs text-neutral-500">{rent ? "Choose your dates for a rental estimate." : "A simple monthly budget estimate."}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {rent ? <>
          <label className="min-w-0 text-xs text-neutral-600">Pickup date<input type="date" min={localDate()} value={pickup} onChange={(event) => setPickup(event.target.value)} className={inputClass} aria-describedby="calculator-note" /></label>
          <label className="min-w-0 text-xs text-neutral-600">Return date<input type="date" min={pickup || localDate()} value={returnDate} onChange={(event) => setReturnDate(event.target.value)} className={inputClass} aria-invalid={Boolean(pickup && returnDate && !datesValid)} aria-describedby="calculator-note" /></label>
        </> : <>
          <label className="text-xs text-neutral-600">Deposit (USD)<input type="number" min="0" max={car.price} step="1" value={deposit} onChange={(event) => setDeposit(event.target.value)} aria-invalid={!depositValid} aria-describedby="calculator-note" className={inputClass} /></label>
          <label className="text-xs text-neutral-600">Term<select value={term} onChange={(event) => setTerm(Number(event.target.value))} className={inputClass}>{[12,24,36,48,60].map((months) => <option key={months} value={months}>{months} months</option>)}</select></label>
        </>}
      </div>
      <div className="mt-5 border-t border-neutral-200 pt-5" aria-live="polite">
        <p className="text-2xl font-bold tracking-tight text-neutral-900">{rent ? datesValid ? formatPrice(days * car.price) : "Select valid dates" : monthly !== null ? formatPrice(monthly) : "Check deposit"}{!rent && monthly !== null && <span className="ml-1 text-xs font-normal text-neutral-500">/month</span>}</p>
        <p id="calculator-note" className="mt-3 text-[11px] leading-relaxed text-neutral-500">{rent ? datesValid ? `${days} day${days === 1 ? "" : "s"} × ${formatPrice(car.price)}. Estimate only; minimum one day. Fees, cover and availability are not included.` : "Return must be on or after pickup, and pickup cannot be in the past. Minimum one day; same-day rentals count as one day." : depositValid ? "Estimate only: (price − deposit) ÷ months. Interest, taxes and fees are excluded. This is not a finance quote." : `Enter a deposit between $0 and ${formatPrice(car.price)}.`}</p>
      </div>
    </section>
  );
};
export default PriceCalculator;

