import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Shared per-character vertical text-swap hover animation.
 */
function AnimatedChar({ char, index, duration = 280, stagger = 18 }) {
  const display = char === " " ? "\u00A0" : char;
  const delay = `${index * stagger}ms`;
  return (
    <span
      className="relative inline-block h-[1em] overflow-hidden align-bottom leading-none"
      style={{ transitionDelay: delay }}
    >
      <span
        className="relative inline-block leading-none transition-transform ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-full"
        style={{ transitionDuration: `${duration}ms`, transitionDelay: delay }}
      >
        {display}
      </span>
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 inline-block -translate-y-full text-brand-red-bright leading-none transition-transform ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0"
        style={{ transitionDuration: `${duration}ms`, transitionDelay: delay }}
      >
        {display}
      </span>
    </span>
  );
}

/** A word rendered as independently-animated, per-character swap text. */
function SwapLink({ to, text, onClick, className = "", duration, stagger }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group inline-flex font-sans font-medium tracking-wide text-brand-white ${className}`}
    >
      {text.split("").map((char, i) => (
        <AnimatedChar key={i} char={char} index={i} duration={duration} stagger={stagger} />
      ))}
    </Link>
  );
}

/**
 * 4-dot menu trigger — smaller, sharper dots; tighter/crisper cross on open.
 */
function DotMenuButton({ isOpen, onClick }) {
  const openTransforms = [
    "translate(4px, 4px) rotate(45deg) scaleX(2.2)",
    "translate(-4px, 4px) rotate(-45deg) scaleX(2.2)",
    "translate(4px, -4px) rotate(-45deg) scaleX(2.2)",
    "translate(-4px, -4px) rotate(45deg) scaleX(2.2)",
  ];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label="Toggle navigation menu"
      className="group flex h-9 w-9 items-center justify-center"
    >
      <span
        className={`relative h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isOpen ? "rotate-180" : "rotate-0 group-hover:rotate-45"
        }`}
      >
        {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map(
          (position, i) => (
            <span
              key={i}
              className={`absolute h-1 w-1 bg-brand-white transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${position} ${
                isOpen ? "rounded-none" : "rounded-[1px]"
              }`}
              style={{ transform: isOpen ? openTransforms[i] : "none" }}
            />
          )
        )}
      </span>
    </button>
  );
}

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-20 w-full border-b border-border-subtle/0">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div id="nav-section-1" className="flex items-center" />

        <div id="nav-section-2" className="relative flex items-center justify-center">
          <DotMenuButton
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          />

          <div
            className={`absolute left-1/2 top-[calc(100%+12px)] z-40 w-max -translate-x-1/2 transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              isMenuOpen
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-2 scale-95 opacity-0"
            }`}
          >
            <ul className="relative z-10 flex flex-col items-center gap-0.5 px-10 py-6 text-center">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <SwapLink
                    to={link.to}
                    text={link.label.toUpperCase()}
                    onClick={() => setIsMenuOpen(false)}
                    duration={220}
                    stagger={14}
                    className="text-[32px] font-bold uppercase tracking-tight"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div id="nav-section-3" className="flex items-center">
          <SwapLink to="/contact" text="Contact" duration={220} stagger={14} className="text-base" />
        </div>
      </nav>

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-[81px] z-30 h-[220px] w-screen bg-card/50 backdrop-blur-md transition-opacity duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isMenuOpen ? "opacity-100" : "opacity-0"
        }`}
      />
    </header>
  );
}