import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { hasAnyPermission, isAdmin } from "../utils/permissions";

const AppRoute = ({
  children,
  requiredPermissions = [],
  isAuthProtected = true,
}) => {
  const user =
    useSelector((state) => state.Login?.user) ||
    JSON.parse(localStorage.getItem("authUser") || "null");

  const isUserAdmin = isAdmin(user);

  // If route doesn't xrequire authentication
  if (isAuthProtected && !user) {
    return <Navigate to="/login" replace />;
  }
  if (!isAuthProtected) {
    return children;
  }

  // If user is admin, bypass all permission checks
  if (isUserAdmin) {
    return children;
  }

  // If no permissions are required, allow access
  if (requiredPermissions.length === 0) {
    return children;
  }

  // If user data isn't loaded yet, show loading or block render
  if (!user || !user.role || !user.role.permissions) {
    return <div>Loading...</div>; // Replace with spinner if needed
  }

  const hasAccess = hasAnyPermission(user, requiredPermissions);

  if (!hasAccess) {
    console.warn("Access denied. Missing permissions:", requiredPermissions);
    console.log("User permissions:", user.role.permissions);
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AppRoute;
