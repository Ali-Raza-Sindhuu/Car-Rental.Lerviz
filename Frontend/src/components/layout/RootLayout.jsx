import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

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
  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <ScrollToTop />
      <Outlet />
    </div>
  );
}
