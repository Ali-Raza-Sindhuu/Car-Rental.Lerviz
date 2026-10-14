import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
  return <input data-slot="input" className={cn("min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} {...props} />;
}
