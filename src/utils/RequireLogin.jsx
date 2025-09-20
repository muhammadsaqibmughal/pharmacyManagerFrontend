import { Navigate, useLocation } from "react-router-dom";

const RequireLogin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireLogin;
