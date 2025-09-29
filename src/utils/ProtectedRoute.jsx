// utils/ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "./getCookie";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectStaff = false,
}) => {
  const location = useLocation();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const is_auth = getCookie("is_auth");
  const role = getCookie("userRole");

  if (!user || !is_auth) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  if (!user.isRegistered) {
    return <Navigate to="/form" replace />;
  }

  if (!user.isApproved) {
    return <Navigate to="/pending-approval" replace />;
  }

  if (redirectStaff && role === "staff") {
    return <Navigate to="/onlyCounter" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/pos/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
