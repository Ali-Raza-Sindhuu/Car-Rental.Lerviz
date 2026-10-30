import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowRight, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLenis } from "./SmoothScroll";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { key: "home", label: "Home", to: "/" },
  { key: "inventory", label: "Inventory", to: "/inventory" },
  { key: "services", label: "Services", to: "/services" },
  { key: "about", label: "About", to: "/about" },
  { key: "contact", label: "Contact", to: "/contact" },
];

const EASE = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/* Scroll spy: which home-page section is in view                      */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

const LogoMark = ({ className = "" }) => (
  <span
    className={`grid place-items-center rounded-xl bg-[#f05a1a] font-extrabold text-white ${className}`}
  >
    R
  </span>
);

const mobileList = {
  open: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const mobileItem = {
  open: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
  closed: { opacity: 0, x: -16, transition: { duration: 0.2 } },
};

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

const Navbar = () => {
  const lenis = useLenis();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();

  const [scrolled, setScrolled] = useState(false); // compact mode after scrolling

  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  /* ---------- active item ---------- */
  let activeKey = null;
  if (pathname.startsWith("/inventory")) activeKey = "inventory";
  else if (pathname.startsWith("/contact")) activeKey = "contact";
  else if (pathname === "/services") activeKey = "services";
  else if (pathname === "/about") activeKey = "about";
  else if (pathname === "/") activeKey = "home";
  const lit = hovered ?? activeKey;

  /* ---------- scroll direction ---------- */
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  useEffect(() => {
    setScrolled(window.scrollY > 40); // correct on reload mid-page
  }, []);

  /* ---------- reset on route change ---------- */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* ---------- escape closes things ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- freeze page scroll while mobile menu is open ---------- */
  useEffect(() => {
    if (!menuOpen) return;
    if (lenis) {
      lenis.stop();
      return () => lenis.start();
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, lenis]);

  /* ---------- click handling ---------- */
  const handleNavClick = (e, item) => {
    e.preventDefault();
    setMenuOpen(false);

    if (item.to === pathname) {
      lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate(item.to);
  };

  return (
    <>
      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-neutral-950/30 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* The navbar */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-12 md:pt-6">
        <div className="w-full" style={{ maxWidth: 1240 }}>
          <motion.div
            animate={{
              maxWidth: scrolled ? 980 : 1240,
              height: scrolled ? 52 : 60,
            }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: EASE }}
            className={`pointer-events-auto relative mx-auto flex items-center justify-between overflow-hidden rounded-2xl px-4 ring-1 ring-black/5 backdrop-blur-xl transition-[background-color,box-shadow] duration-500 ${
              scrolled
                ? "bg-white/85 shadow-xl shadow-black/15"
                : "bg-white shadow-lg shadow-black/10"
            }`}
          >
            {/* Brand */}
            <Link
              to="/"
              onClick={(e) => handleNavClick(e, NAV_ITEMS[0])}
              className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-neutral-900"
            >
              <LogoMark className="size-8 text-base" />
              <span className="hidden sm:inline">REVEX</span>
            </Link>

            {/* Desktop links */}
            <nav
              className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex"
              onMouseLeave={() => setHovered(null)}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeKey === item.key;
                return (
                  <Link
                    key={item.key}
                    to={item.to}
                    onClick={(e) => handleNavClick(e, item)}
                    onMouseEnter={() => setHovered(item.key)}
                    onFocus={() => setHovered(item.key)}
                    onBlur={() => setHovered(null)}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative rounded-lg px-3.5 py-1.5 text-sm transition-colors duration-300 focus-visible:outline-none ${
                      isActive
                        ? "font-semibold text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {lit === item.key && (
                      <motion.span
                        layoutId="nav-highlight"
                        className="absolute inset-0 rounded-lg bg-neutral-100"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#f05a1a]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                asChild
                className="group hidden h-9 rounded-lg bg-neutral-900 px-4 text-xs font-semibold text-white hover:bg-neutral-800 sm:inline-flex"
              >
                <Link to="/inventory" onClick={(e) => handleNavClick(e, NAV_ITEMS[1])}>
                  Shop now
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </Button>

              {/* Desktop: account */}
              <Button
                asChild
                size="icon"
                className="hidden size-9 rounded-lg bg-[#f05a1a] text-white hover:bg-[#d94e14] md:inline-flex"
              >
                <Link to="/account" aria-label="Account">
                  <User className="size-4" />
                </Link>
              </Button>

              {/* Mobile: menu toggle */}
              <Button
                size="icon"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((p) => !p)}
                className="size-9 overflow-hidden rounded-lg bg-[#f05a1a] text-white hover:bg-[#d94e14] md:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={menuOpen ? "x" : "menu"}
                    initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.18 }}
                    className="grid place-items-center"
                  >
                    {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                  </motion.span>
                </AnimatePresence>
              </Button>
            </div>

            {/* Scroll progress */}
            <motion.span
              aria-hidden
              style={{ scaleX: progress }}
              className={`absolute inset-x-4 bottom-0 h-[2px] origin-left rounded-full bg-[#f05a1a] transition-opacity duration-300 ${
                scrolled ? "opacity-100" : "opacity-0"
              }`}
            />
          </motion.div>

          {/* Mobile panel */}
          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                key="mobile-panel"
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="pointer-events-auto mt-2 origin-top overflow-hidden rounded-2xl bg-white p-2 shadow-xl shadow-black/15 ring-1 ring-black/5 md:hidden"
              >
                <motion.ul
                  variants={mobileList}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="flex flex-col"
                >
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeKey === item.key;
                    return (
                      <motion.li key={item.key} variants={mobileItem}>
                        <Link
                          to={item.to}
                          onClick={(e) => handleNavClick(e, item)}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-xl tracking-tight transition-colors active:bg-neutral-100 ${
                            isActive
                              ? "bg-neutral-100 font-semibold text-neutral-900"
                              : "text-neutral-600"
                          }`}
                        >
                          {item.label}
                          {isActive && <span className="size-1.5 rounded-full bg-[#f05a1a]" />}
                        </Link>
                      </motion.li>
                    );
                  })}
                  <motion.li variants={mobileItem} className="p-2 pt-3">
                    <Button
                      asChild
                      className="h-11 w-full rounded-xl bg-neutral-900 text-sm font-semibold text-white hover:bg-neutral-800"
                    >
                      <Link to="/inventory" onClick={(e) => handleNavClick(e, NAV_ITEMS[1])}>
                        Shop now
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </motion.li>
                </motion.ul>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
};

export default Navbar;
