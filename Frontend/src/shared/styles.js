const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

export const focusRing = `${ring} focus-visible:ring-[#f05a1a]`;

// One button shape for the whole page: pill, 44px tall, sentence case.
const base = `inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors duration-300 ${ring}`;

export const btn = {
  primary: `${base} bg-[#f05a1a] text-white hover:bg-[#d94e14] focus-visible:ring-[#f05a1a]`,
  dark: `${base} bg-neutral-950 text-white hover:bg-neutral-800 focus-visible:ring-neutral-950`,
  light: `${base} bg-white text-neutral-950 hover:bg-neutral-100 focus-visible:ring-white focus-visible:ring-offset-[#f05a1a]`,
  outline: `${base} text-white ring-1 ring-white/35 hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-neutral-900`,
};
