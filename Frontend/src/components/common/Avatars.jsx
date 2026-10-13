import { cn } from "@/lib/utils";

const tones = ["from-stone-500 to-stone-800", "from-amber-700 to-stone-900", "from-zinc-400 to-zinc-700"];

/** Overlapping initials avatars (swap for real photos when available). */
export default function Avatars({ initials, size = "size-7", ring = "ring-white", className }) {
  return (
    <div className={cn("flex -space-x-2", className)}>
      {initials.map((i, idx) => (
        <span
          key={i}
          className={cn(
            "grid place-items-center rounded-full bg-gradient-to-br text-[0.55rem] font-medium text-white ring-2",
            size,
            ring,
            tones[idx % tones.length],
          )}
        >
          {i}
        </span>
      ))}
    </div>
  );
}
