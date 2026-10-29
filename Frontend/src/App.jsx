import { Outlet } from "react-router-dom";
import SmoothScroll from "./components/layout/SmoothScroll";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

const App = () => (
  <SmoothScroll>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </SmoothScroll>
);

export default App;