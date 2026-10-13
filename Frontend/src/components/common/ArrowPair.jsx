import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Previous / next chips. `tone="light"` is for white backgrounds, "dark" for black ones. */
export default function ArrowPair({ onPrev, onNext, tone = "dark", className }) {
  return (
    <div className={cn("flex items-stretch gap-0.5", className)}>
      <button
        type="button"
        aria-label="Previous"
        onClick={onPrev}
        className={cn(
          "slant-both grid h-8 w-11 place-items-center outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:h-9 sm:w-14",
          tone === "dark" ? "bg-white text-ink" : "bg-brand/30 text-brand",
        )}
      >
        <ChevronsLeft className="size-4" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={onNext}
        className="slant-both grid h-8 w-11 place-items-center bg-brand text-white outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:h-9 sm:w-14"
      >
        <ChevronsRight className="size-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}
