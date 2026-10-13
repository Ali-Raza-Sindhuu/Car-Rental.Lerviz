import { cn } from "@/lib/utils";

/** Display heading. Use "\n" in `children` to force a line break. */
export default function Heading({ as: Comp = "h2", className, children }) {
  return (
    <Comp className={cn("font-display uppercase leading-[1.18] tracking-tight whitespace-pre-line", className)}>
      {children}
    </Comp>
  );
}
