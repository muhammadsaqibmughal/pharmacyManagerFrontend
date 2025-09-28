import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "./getCookie";

const RequireLogin = ({ children }) => {
  const location = useLocation();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const is_auth  = getCookie("is_auth ");

  if (!user || !is_auth ) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireLogin;
