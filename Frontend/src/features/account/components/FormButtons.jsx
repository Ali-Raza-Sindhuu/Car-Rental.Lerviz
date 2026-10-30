import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const primaryClass =
  "group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f05a1a] text-xs font-semibold tracking-wide text-white shadow-lg shadow-[#f05a1a]/25 transition hover:bg-[#d94e14] focus-visible:ring-4 focus-visible:ring-[#f05a1a]/30 focus-visible:outline-none";

const PrimaryButton = ({ children, icon: Icon = ArrowRight, ...props }) => (
  <button className={primaryClass} {...props}>
    <span>{children}</span>
    <Icon className="size-4 transition-transform group-hover:translate-x-0.5" />
  </button>
);

const PrimaryLink = ({ children, to }) => (
  <Link to={to} className={primaryClass}>
    <span>{children}</span>
    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
  </Link>
);

const SecondaryButton = ({ children, ...props }) => (
  <button
    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold tracking-wide text-neutral-900 transition hover:bg-neutral-50 focus-visible:ring-4 focus-visible:ring-neutral-900/10 focus-visible:outline-none"
    {...props}
  >
    {children}
  </button>
);

const IconBadge = ({ icon: Icon }) => (
  <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#f05a1a]/10 text-[#f05a1a]">
    <Icon className="size-6" />
  </span>
);

export { PrimaryButton, PrimaryLink, SecondaryButton, IconBadge };
