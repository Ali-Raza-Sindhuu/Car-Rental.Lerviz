import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Lenis from "lenis";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function RootLayout() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1 });
    let frame;
    const tick = (time) => { lenis.raf(time); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); };
  }, []);
  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <ScrollToTop />
      <Suspense fallback={null}><Outlet /></Suspense>
    </div>
  );
}
