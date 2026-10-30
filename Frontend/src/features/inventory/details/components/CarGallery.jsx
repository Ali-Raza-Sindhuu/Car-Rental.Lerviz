import { useState } from "react";
import { ArrowLeft, ArrowRight, Car } from "lucide-react";
import { focusRing } from "@/shared/styles";

const GalleryImage = ({ src, fallback, alt }) => {
  const [failed, setFailed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const image = failed ? fallback : src;
  return image && !fallbackFailed ? (
    <img src={image} alt={alt} className="size-full object-contain p-4 md:p-8" onError={() => failed ? setFallbackFailed(true) : setFailed(true)} />
  ) : (
    <div className="flex size-full flex-col items-center justify-center gap-3 p-3 text-neutral-400" role="img" aria-label={alt + " — image unavailable"}>
      <Car aria-hidden="true" className="size-8 md:size-12" strokeWidth={1.5} />
      <span className="text-center text-[11px]">Image coming soon</span>
    </div>
  );
};

const CarGallery = ({ car, gallery }) => {
  const [active, setActive] = useState(0);
  const change = (direction) => setActive((index) => (index + direction + gallery.length) % gallery.length);
  const label = `${car.make} ${car.model}`;
  return (
    <section aria-label={label + " photo gallery"} className="min-w-0" onKeyDown={(event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        change(event.key === "ArrowLeft" ? -1 : 1);
      }
    }}>
      <div tabIndex={0} aria-label="Vehicle image. Use left and right arrows to browse." className={`aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 ${focusRing}`}>
        <GalleryImage key={gallery[active]} src={gallery[active]} fallback={active === 0 ? car.image : undefined} alt={`${label}, image ${active + 1}`} />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 md:gap-3">
        {gallery.map((src, index) => (
          <button key={src} type="button" onClick={() => setActive(index)} aria-label={`View image ${index + 1} of ${label}`} aria-current={active === index ? "true" : undefined} className={`aspect-[4/3] min-w-0 overflow-hidden rounded-xl border bg-neutral-100 ${focusRing} ${active === index ? "border-[#f05a1a]" : "border-neutral-200"}`}>
            <GalleryImage src={src} fallback={index === 0 ? car.image : undefined} alt="" />
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p aria-live="polite" aria-atomic="true" className="text-xs text-neutral-500">{active + 1} / {gallery.length}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => change(-1)} aria-label="Previous vehicle image" className={`grid size-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100 ${focusRing}`}><ArrowLeft className="size-4" /></button>
          <button type="button" onClick={() => change(1)} aria-label="Next vehicle image" className={`grid size-10 place-items-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800 ${focusRing}`}><ArrowRight className="size-4" /></button>
        </div>
      </div>
    </section>
  );
};
export default CarGallery;

