import React from "react";
import PermissionForm from "./PermissionForm";
import { authProtectedRoutes } from "../../routes/index"; // adjust path as needed

// Extract component/module names from routes
const getModuleNames = (routes) => {
  return routes
    .map((route) => route.component?.type?.name)
    .filter((name) => name && name !== "Navigate");
};

const PermissionsPage = () => {
  const moduleNames = getModuleNames(authProtectedRoutes);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Role Permission Management</h1>
      <PermissionForm moduleNames={moduleNames} />
    </div>
  );
};

export default PermissionsPage;
