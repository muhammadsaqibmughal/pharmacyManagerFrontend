import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user?.isRegistered) {
    return <Navigate to="/form" />;
  }

  if (!user?.isApproved) {
    return <Navigate to="/pending-approval" />;
  }

  return children;
};

export default ProtectedRoute;
