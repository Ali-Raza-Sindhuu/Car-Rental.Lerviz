import { Suspense } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loading } from "./Ui";
import "@/portal.css";

const customerLinks = [{ to: "/app/profile", label: "Profile" }, { to: "/app/bookings", label: "My bookings" }];
const adminLinks = [
  ["/app/admin", "Dashboard"], ["/app/admin/bookings", "Bookings"], ["/app/admin/vehicles", "Vehicles"],
  ["/app/admin/categories", "Categories"], ["/app/admin/locations", "Locations"], ["/app/admin/customers", "Customers"],
  ["/app/admin/payments", "Payments"], ["/app/admin/maintenance", "Maintenance"], ["/app/admin/coupons", "Coupons"],
  ["/app/admin/reviews", "Reviews"], ["/app/admin/reports", "Reports"],
];

export default function PortalLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  async function logout() { await signOut(); navigate("/app"); }
  return <div className="portal">
    <header className="portal-header"><div className="portal-header-inner"><Link className="portal-logo" to="/">elcarro<span>.</span></Link><nav aria-label="Main navigation"><NavLink end to="/app">Browse cars</NavLink>{user?.role === "CUSTOMER" && customerLinks.map(({ to, label }) => <NavLink key={to} to={to}>{label}</NavLink>)}{user?.role === "ADMIN" && <NavLink to="/app/admin">Admin</NavLink>}</nav><div className="portal-account">{user ? <><span>{user.fullName}</span><button onClick={logout}>Sign out</button></> : <><Link to="/app/login">Sign in</Link><Link className="portal-button small" to="/app/register">Create account</Link></>}</div></div></header>
    {user?.role === "ADMIN" && <nav className="portal-admin-nav" aria-label="Administration">{adminLinks.map(([to, label]) => <NavLink end key={to} to={to}>{label}</NavLink>)}</nav>}
    <main className="portal-main"><Suspense fallback={<Loading />}><Outlet /></Suspense></main>
    <footer className="portal-footer"><span>elcarro. rental operations</span><Link to="/">Back to home</Link></footer>
  </div>;
}
