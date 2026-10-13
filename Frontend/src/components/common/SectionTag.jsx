import { cn } from "@/lib/utils";

export default function SectionTag({ children, className }) {
  return <p className={cn("text-[0.65rem] tracking-wide", className)}>[ {children} ]</p>;
}
