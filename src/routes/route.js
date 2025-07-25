// import { Navigate, useLocation } from "react-router-dom";

// const AppRoute = ({ children }) => {
//   const location = useLocation();
//   const isAuthenticated = !!localStorage.getItem("authUser");

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default AppRoute;
// src/routes/route.js
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasPermission } from "../utils/permissions";

const AppRoute = ({ children, requiredPermissions = [] }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("authUser");
  const permissions = useSelector((state) => state.Login.permissions);
  const user = useSelector((state) => state.Login.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required permissions
  if (requiredPermissions.length > 0) {
    const hasAccess = requiredPermissions.some((permission) =>
      hasPermission(permissions, permission)
    );

    if (!hasAccess) {
      return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default AppRoute;
