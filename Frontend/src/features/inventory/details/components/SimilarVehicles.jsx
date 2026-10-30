import { useMemo, useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Car } from "lucide-react";
import InventoryCarCard from "@/features/inventory/components/InventoryCarCard";
import { getSimilarCars } from "@/features/inventory/data/carDetails";
import SectionHeading from "@/shared/SectionHeading";
import { focusRing } from "@/shared/styles";

const SimilarCard = ({ car }) => {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <div className="relative flex h-full" onErrorCapture={(event) => {
      if (event.target.tagName === "IMG") {
        event.target.style.visibility = "hidden";
        setImageFailed(true);
      }
    }}>
      <InventoryCarCard car={car} />
      {imageFailed && <div aria-hidden="true" className="pointer-events-none absolute top-3 right-3 left-3 flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-xl bg-neutral-100 text-neutral-400"><Car className="size-10" strokeWidth={1.5} /><span className="text-[11px]">Image coming soon</span></div>}
    </div>
  );
};

const SimilarVehicles = ({ car }) => {
  const cars = useMemo(() => getSimilarCars(car, 4), [car]);
  const trackRef = useRef(null);
  const [position, setPosition] = useState({ previous: false, next: false });
  const update = () => {
    const track = trackRef.current;
    if (track) setPosition({ previous: track.scrollLeft > 4, next: track.scrollLeft + track.clientWidth < track.scrollWidth - 4 });
  };
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);
  const move = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const distance = (track.firstElementChild?.getBoundingClientRect().width ?? track.clientWidth) + 16;
    track.scrollBy({ left: direction * distance, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return (
    <section aria-labelledby="similar-title" className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          <SectionHeading id="similar-title" eyebrow="Keep exploring" lead={["Another possibility."]} muted={["The same sense of adventure."]} />
          <p className="max-w-xs text-sm leading-relaxed text-neutral-600 md:ml-8 md:pb-1">A few more cars to consider, starting with the same body style, then the same make.</p>
          <div className="flex shrink-0 gap-2 md:ml-auto">
            <button type="button" aria-label="Previous similar vehicles" disabled={!position.previous} onClick={() => move(-1)} className={`grid size-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100 disabled:opacity-40 ${focusRing}`}><ArrowLeft className="size-4" /></button>
            <button type="button" aria-label="Next similar vehicles" disabled={!position.next} onClick={() => move(1)} className={`grid size-10 place-items-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40 ${focusRing}`}><ArrowRight className="size-4" /></button>
          </div>
        </div>
        <ul ref={trackRef} tabIndex={0} aria-label="Similar vehicles. Use left and right arrow keys to browse." onScroll={update} onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }} className={`mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-2xl pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${focusRing}`}>
          {cars.map((item) => <li key={item.id} className="w-[88%] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.667px)]"><SimilarCard car={item} /></li>)}
        </ul>
      </div>
    </section>
  );
};
export default SimilarVehicles;

