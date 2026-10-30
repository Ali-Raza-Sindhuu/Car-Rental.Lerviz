import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SmoothScroll from "./components/layout/SmoothScroll";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

const pageTitles = {
  "/": "Home",
  "/inventory": "Inventory",
  "/about": "About",
  "/services": "Services",
  "/contact": "Contact",
};

const App = () => {
  const { pathname } = useLocation();
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
      <Footer />
    </SmoothScroll>
  );
};

export default App;
