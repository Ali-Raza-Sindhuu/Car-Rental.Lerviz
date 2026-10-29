import { ArrowLeft, ArrowRight } from "lucide-react";
import { focusRing } from "./styles";

const Arrow = ({ direction, label, disabled, onClick }) => {
  const Icon = direction < 0 ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`group grid size-11 place-items-center rounded-full text-neutral-900 transition-colors duration-300 hover:bg-neutral-200/70 active:bg-neutral-300/70 disabled:pointer-events-none disabled:text-neutral-400 ${focusRing}`}
    >
      <Icon
        strokeWidth={1.5}
        className={`size-6 transition-transform duration-300 ease-out ${
          direction < 0 ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
        }`}
      />
    </button>
  );
};

const CarouselArrows = ({ carousel, label }) => (
  <div className="flex gap-1">
    <Arrow
      direction={-1}
      label={`Previous ${label}`}
      disabled={!carousel.canPrev}
      onClick={() => carousel.scrollBy(-1)}
    />
    <Arrow
      direction={1}
      label={`Next ${label}`}
      disabled={!carousel.canNext}
      onClick={() => carousel.scrollBy(1)}
    />
  </div>
);

export default CarouselArrows;
