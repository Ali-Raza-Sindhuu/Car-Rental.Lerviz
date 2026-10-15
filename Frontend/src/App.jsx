import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import RootLayout from "@/components/layout/RootLayout";
import NotFound from "@/pages/NotFound";
const Home = lazy(() => import("@/pages/Home"));
import PortalLayout from "@/components/app/PortalLayout";
import Protected from "@/components/app/Protected";
const Catalog = lazy(() => import("@/pages/app/Catalog"));
const VehicleDetail = lazy(() => import("@/pages/app/VehicleDetail"));
const Auth = lazy(() => import("@/pages/app/Auth"));
const Profile = lazy(() => import("@/pages/app/Profile"));
const Bookings = lazy(() => import("@/pages/app/Bookings"));
const BookingDetail = lazy(() => import("@/pages/app/BookingDetail"));
const Dashboard = lazy(() => import("@/pages/app/admin/Dashboard"));
const AdminBookings = lazy(() => import("@/pages/app/admin/AdminBookings"));
const AdminCustomers = lazy(() => import("@/pages/app/admin/AdminCustomers"));
const AdminPayments = lazy(() => import("@/pages/app/admin/AdminPayments"));
const AdminReviews = lazy(() => import("@/pages/app/admin/AdminReviews"));
const Reports = lazy(() => import("@/pages/app/admin/Reports"));
const ResourcePage = lazy(() => import("@/pages/app/admin/ResourcePage"));

const customer = (element) => <Protected role="CUSTOMER">{element}</Protected>;
const admin = (element) => <Protected role="ADMIN">{element}</Protected>;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "app", element: <PortalLayout />, children: [
        { index: true, element: <Catalog /> },
        { path: "vehicles/:id", element: <VehicleDetail /> },
        { path: "login", element: <Auth /> },
        { path: "register", element: <Auth register /> },
        { path: "profile", element: customer(<Profile />) },
        { path: "bookings", element: customer(<Bookings />) },
        { path: "bookings/:id", element: customer(<BookingDetail />) },
        { path: "admin", element: admin(<Dashboard />) },
        { path: "admin/bookings", element: admin(<AdminBookings />) },
        { path: "admin/customers", element: admin(<AdminCustomers />) },
        { path: "admin/payments", element: admin(<AdminPayments />) },
        { path: "admin/reviews", element: admin(<AdminReviews />) },
        { path: "admin/reports", element: admin(<Reports />) },
        { path: "admin/:resource", element: admin(<ResourcePage />) },
      ] },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
