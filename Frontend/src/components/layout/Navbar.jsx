import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowRight, Bookmark, CarFront, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLenis } from "./SmoothScroll";
import { apiRequest } from "@/lib/api";

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
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const guestItems = useSelector((state) => state.garage.guestItems);
  const accountInitial = (user?.name || user?.fullName || user?.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  const [scrolled, setScrolled] = useState(false); // compact mode after scrolling

  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [serverGarageCount, setServerGarageCount] = useState(0);
  const [garageCountError, setGarageCountError] = useState("");
  const garageCount = token ? serverGarageCount : guestItems.length;

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
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!token) {
      setServerGarageCount(0);
      setGarageCountError("");
      return undefined;
    }
    let active = true;
    const refresh = () => {
      apiRequest("/api/cart", { token })
        .then(({ cart }) => {
          if (!active) return;
          setServerGarageCount(cart?.items?.length ?? 0);
          setGarageCountError("");
        })
        .catch((error) => {
          if (active) setGarageCountError(error.message);
        });
    };
    refresh();
    window.addEventListener("revex:garage-changed", refresh);
    return () => {
      active = false;
      window.removeEventListener("revex:garage-changed", refresh);
    };
  }, [token, pathname, guestItems.length]);

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
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
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
            className={`pointer-events-auto relative mx-auto flex items-center justify-between overflow-visible rounded-2xl px-4 ring-1 ring-black/5 backdrop-blur-xl transition-[background-color,box-shadow] duration-500 ${
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
                    className={`relative rounded-lg px-3.5 py-1.5 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a] ${
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
              <Link to="/cart" aria-label={`Garage, ${garageCount} items`} className="hidden h-9 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-700 hover:bg-neutral-100 sm:inline-flex">
                <CarFront aria-hidden="true" className="size-4" />
                Garage <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px]">{garageCount}</span>
              </Link>
              <Link to="/saved" className="hidden rounded-lg px-2 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 sm:inline-flex">Saved cars</Link>
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
              <div className="relative hidden md:block">
                {user ? (
                  <>
                    <Button type="button" size="icon" aria-label="Account menu" aria-expanded={accountOpen} onClick={() => setAccountOpen((open) => !open)} className="size-9 rounded-full bg-[#f05a1a] text-white hover:bg-[#d94e14]">
                      <span className="text-sm font-semibold">{accountInitial}</span>
                    </Button>
                    <AnimatePresence>
                      {accountOpen && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
                        <Link to="/profile" className="block rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Profile</Link>
                        <Link to="/saved" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"><Bookmark className="size-4" />Saved cars</Link>
                        <Link to="/cart" className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"><span className="flex items-center gap-2"><CarFront className="size-4" />Garage</span><span>{garageCount}</span></Link>
                        {garageCountError && <p role="status" className="px-3 py-2 text-[11px] text-red-600">Garage count unavailable: {garageCountError}</p>}
                      </motion.div>}
                    </AnimatePresence>
                  </>
                ) : (
                  <Button asChild size="icon" className="size-9 rounded-lg bg-[#f05a1a] text-white hover:bg-[#d94e14]">
                    <Link to="/login" aria-label="Account"><User className="size-4" /></Link>
                  </Button>
                )}
              </div>

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
                  <motion.li variants={mobileItem} className="px-2 pt-2">
                    <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-neutral-700 hover:bg-neutral-100">
                      Garage <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs">{garageCount}</span>
                    </Link>
                    <Link to="/saved" onClick={() => setMenuOpen(false)} className="mt-1 flex items-center rounded-xl px-4 py-3 text-base font-medium text-neutral-700 hover:bg-neutral-100">Saved cars</Link>
                    <Link to={user ? "/profile" : "/login"} onClick={() => setMenuOpen(false)} className="mt-1 flex items-center rounded-xl px-4 py-3 text-base font-medium text-neutral-700 hover:bg-neutral-100">{user ? "Profile" : "Log in"}</Link>
                  </motion.li>
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
