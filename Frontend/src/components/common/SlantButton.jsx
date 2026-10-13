import { ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Parallelogram "label + arrow" button used across the page.
 * look: "solid"          white label on a dark surface
 *       "outline-dark"   outlined label on a dark surface
 *       "outline-light"  outlined label on a light surface
 * accent: colour of the arrow chip ("red" | "white" | "dark")
 */
const looks = {
  solid: { border: "bg-white", fill: "bg-white", text: "text-ink" },
  "outline-dark": { border: "bg-white/70", fill: "bg-black", text: "text-white" },
  "outline-light": { border: "bg-ink", fill: "bg-white", text: "text-ink" },
};
const accents = {
  red: "bg-brand text-white",
  white: "bg-white text-ink",
  dark: "bg-ink text-white",
};

export default function SlantButton({
  as: Comp = "button",
  look = "solid",
  accent = "red",
  className,
  children,
  ...props
}) {
  const l = looks[look];
  return (
    <Comp
      className={cn(
        "group inline-flex h-9 items-stretch gap-1 text-[0.7rem] font-medium uppercase tracking-wide outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:h-10",
        className,
      )}
      {...props}
    >
      <span className={cn("slant-r relative flex", l.border)}>
        <span className={cn("slant-r m-px flex items-center px-6 pr-8", l.fill, l.text, look === "solid" && "m-0")}>
          {children}
        </span>
      </span>
      <span
        className={cn(
          "slant-both flex w-11 items-center justify-center transition-transform group-hover:translate-x-0.5 sm:w-12",
          accents[accent],
        )}
      >
        <ChevronsRight className="size-4" strokeWidth={1.75} />
      </span>
    </Comp>
  );
}
