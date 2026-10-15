import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loading } from "./Ui";

export default function Protected({ role, children }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <Loading />;
  if (!user) return <Navigate to="/app/login" state={{ from: location.pathname }} replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "ADMIN" ? "/app/admin" : "/app"} replace />;
  return children;
}
