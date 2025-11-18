import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "./getCookie";

const ProtectedRoute = ({ children, allowedRoles = [], redirectStaff = false }) => {
  const location = useLocation();

  // Get user from LocalStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // Check auth cookie
  const is_auth = getCookie("is_auth") === "true";
  const role = getCookie("userRole") || user?.role;

  // Not authenticated → redirect to signup
  if (!user || !is_auth) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  const isRegistered = Boolean(user?.isRegistered);
  const isApproved = Boolean(user?.isApproved);

  // Redirect unregistered managers → only if not already on form page
  if (!isRegistered && location.pathname !== "/form") {
    return <Navigate to="/form" replace />;
  }

  // Redirect unapproved managers → only if registered AND not on pending page
  if (isRegistered && !isApproved && location.pathname !== "/pending-approval") {
    return <Navigate to="/pending-approval" replace />;
  }

  // Staff-only redirect
  if (redirectStaff && role === "staff") {
    return <Navigate to="/onlyCounter" replace />;
  }

  // Role-based access control
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === "staff") {
      return <Navigate to="/onlyCounter" replace />;
    }
    return <Navigate to="/pos/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
