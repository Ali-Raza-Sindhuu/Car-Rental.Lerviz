import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import NotFoundPage from "./NotFoundPage";

const RouteErrorPage = () => {
  useEffect(() => { document.title = "Page unavailable | REVEX"; }, []);
  return <SmoothScroll><Navbar /><main><NotFoundPage error /></main><Footer /></SmoothScroll>;
};
export default RouteErrorPage;
