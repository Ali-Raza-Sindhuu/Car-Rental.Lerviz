import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SmoothScroll from "./components/layout/SmoothScroll";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { clearGarageMessage } from "@/features/garage/garageSlice";

const pageTitles = {
  "/": "Home",
  "/inventory": "Inventory",
  "/about": "About",
  "/services": "Services",
  "/contact": "Contact",
  "/profile": "Profile",
  "/saved": "Saved cars",
  "/cart": "Garage",
  "/checkout": "Checkout",
  "/checkout/success": "Order confirmation",
};

const App = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const garageMessage = useSelector((state) => state.garage.message);
  useEffect(() => {
    if (!pathname.startsWith("/inventory/")) {
      document.title = `${pageTitles[pathname] ?? "Page not found"} | REVEX`;
    }
  }, [pathname]);
  return (
    <SmoothScroll>
      <ScrollRestoration />
      <Navbar />
      <main>
        <Outlet />
      </main>
      {garageMessage && <div role="status" className="fixed bottom-5 left-4 right-4 z-[60] mx-auto flex max-w-2xl items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700 shadow-xl">
        <p>{garageMessage}</p>
        <button type="button" aria-label="Dismiss garage message" onClick={() => dispatch(clearGarageMessage())} className="shrink-0 font-semibold text-[#f05a1a]">Dismiss</button>
      </div>}
      <Footer />
    </SmoothScroll>
  );
};

export default App;
