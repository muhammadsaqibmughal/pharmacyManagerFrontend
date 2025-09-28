import { Navigate } from "react-router-dom";
import { getCookie } from "./getCookie";

const RoleRedirect = () => {
  const is_auth = getCookie("is_auth");
  const role = getCookie("userRole");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }


  if (!is_auth || !user) return <Navigate to="/signup" replace />;


  if (!user.isRegistered) return <Navigate to="/form" replace />;


  if (!user.isApproved) return <Navigate to="/pending-approval" replace />;

  return role === "staff" 
    ? <Navigate to="/onlyCounter" replace /> 
    : <Navigate to="/pos/dashboard" replace />;
};

export default RoleRedirect;
