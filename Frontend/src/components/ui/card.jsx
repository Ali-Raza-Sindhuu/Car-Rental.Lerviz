import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return <div data-slot="card" className={cn("rounded-xl bg-card text-card-foreground", className)} {...props} />;
}
