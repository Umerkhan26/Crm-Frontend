import { Navigate, useLocation } from "react-router-dom";

const AppRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("authUser");

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AppRoute;
