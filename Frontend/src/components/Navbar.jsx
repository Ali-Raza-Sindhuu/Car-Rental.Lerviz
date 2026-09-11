import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

/**
 * Shared per-character vertical text-swap hover animation.
 * Recreated with perfect timing and easing.
 */
function AnimatedChar({ char, index, duration = 0.4, stagger = 0.02 }) {
  const display = char === " " ? "\u00A0" : char;
  const delay = index * stagger;
  return (
    <span className="relative inline-block overflow-hidden align-bottom leading-none">
      <span
        className="relative inline-block leading-none transition-transform ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[120%]"
        style={{ transitionDuration: `${duration}s`, transitionDelay: `${delay}s` }}
      >
        {display}
      </span>
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 inline-block translate-y-[120%] leading-none text-white/70 transition-transform ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
        style={{ transitionDuration: `${duration}s`, transitionDelay: `${delay}s` }}
      >
        {display}
      </span>
    </span>
  );
}

function SwapLink({ to, text, onClick, className = "", duration = 0.4, stagger = 0.02 }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group inline-flex font-sans tracking-widest text-white ${className}`}
    >
      {text.split("").map((char, i) => (
        <AnimatedChar key={i} char={char} index={i} duration={duration} stagger={stagger} />
      ))}
    </Link>
  );
}

/**
 * 4-dot menu trigger — refined to exactly match premium Framer templates.
 * Animates into a perfectly crisp 'X'.
 */
function DotMenuButton({ isOpen, onClick }) {
  // Translate distances and rotations for the 4 dots to form an X
  const openTransforms = [
    "translate(4px, 4px) rotate(45deg) scaleX(2)",
    "translate(-4px, 4px) rotate(-45deg) scaleX(2)",
    "translate(4px, -4px) rotate(-45deg) scaleX(2)",
    "translate(-4px, -4px) rotate(45deg) scaleX(2)",
  ];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label="Toggle navigation menu"
      className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 transition-colors duration-300 hover:bg-white/10"
    >
      <span
        className="relative h-[18px] w-[18px] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
      >
        {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map(
          (position, i) => (
            <span
              key={i}
              className={`absolute h-[3px] w-[3px] bg-white transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${position}`}
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
  { label: "Inventory", to: "/inventory" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

    // Add backdrop-blur if scrolled past 50px
    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }

    // Hide navbar on scroll down, show on scroll up
    if (latest > 150 && latest > previous && !isMenuOpen) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      className="relative z-[100] w-full bg-black"
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-12">

        {/* LOGO (LEFT) */}
        <div className="flex flex-1 items-center justify-start z-50">
          <Link
            to="/"
            className="group relative text-2xl md:text-3xl font-bold tracking-[0.25em] text-white uppercase overflow-hidden flex items-center h-[1em]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {"LEVRIX".split("").map((char, i) => (
               <span
                 key={i}
                 className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[120%]"
                 style={{ transitionDelay: `${i * 0.03}s` }}
               >
                 {char}
               </span>
            ))}
            <div className="absolute top-0 left-0 flex">
              {"LEVRIX".split("").map((char, i) => (
                 <span
                   key={i}
                   className="inline-block translate-y-[120%] text-white/50 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
                   style={{ transitionDelay: `${i * 0.03}s` }}
                 >
                   {char}
                 </span>
              ))}
            </div>
          </Link>
        </div>

        {/* MENU TRIGGER (CENTER) */}
        <div className="flex flex-1 items-center justify-center z-50">
          <DotMenuButton
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          />
        </div>

        {/* RIGHT ACTION (RIGHT) */}
        <div className="flex flex-1 items-center justify-end z-50 hidden sm:flex">
          <SwapLink
            to="/contact"
            text="LET'S TALK"
            className="text-[11px] md:text-xs font-semibold tracking-[0.3em] uppercase"
            duration={0.5}
            stagger={0.03}
          />
        </div>
      </nav>

      {/* FULLSCREEN DROPDOWN OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 top-0 left-0 h-[100dvh] w-screen bg-[#050505] -z-10 flex flex-col items-center justify-center"
          >
            {/* Animated Background Elements (Optional Luxury Touch) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-[120px] pointer-events-none"
            />

            <ul className="relative z-10 flex flex-col items-center gap-4 md:gap-8 px-6 text-center">
              {NAV_LINKS.map((link, idx) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, y: 50, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: 30, rotateX: 20 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.76, 0, 0.24, 1],
                    delay: idx * 0.08 + 0.2, // Stagger effect
                  }}
                  className="perspective-[1000px] overflow-hidden"
                >
                  <SwapLink
                    to={link.to}
                    text={link.label.toUpperCase()}
                    onClick={() => setIsMenuOpen(false)}
                    duration={0.5}
                    stagger={0.03}
                    className="text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-[0.15em] text-white/90 hover:text-white"
                  />
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-12 text-center text-xs tracking-widest text-white/40 uppercase"
            >
              Levrix Showroom &copy; {new Date().getFullYear()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}