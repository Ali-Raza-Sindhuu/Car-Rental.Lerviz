import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const LenisContext = createContext(null);

/** Returns the Lenis instance (or null before mount / with reduced motion). */
export const useLenis = () => useContext(LenisContext);

/**
 * Wrap your routes with this INSIDE <BrowserRouter>:
 *
 *   <BrowserRouter>
 *     <SmoothScroll>
 *       <Navbar />
 *       <Routes>...</Routes>
 *     </SmoothScroll>
 *   </BrowserRouter>
 */
const SmoothScroll = ({ children }) => {
  const [lenis, setLenis] = useState(null);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
    });

    let frame;
    const loop = (time) => {
      instance.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    setLenis(instance);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // New page (without a #hash) always starts at the top.
  useEffect(() => {
    if (hash) return;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname, hash, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
};

export default SmoothScroll;