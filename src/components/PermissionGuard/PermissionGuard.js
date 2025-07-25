// // components/PermissionGuard.js
// import React from "react";
// import { useSelector } from "react-redux";
// import { hasPermission } from "../../utils/permissions";

// const PermissionGuard = ({ children, requiredPermission }) => {
//   const { permissions } = useSelector((state) => state.permissions);

//   if (hasPermission(permissions, requiredPermission)) {
//     return <>{children}</>;
//   }
//   return null;
// };

// export default PermissionGuard;

import React from "react";
import { useSelector } from "react-redux";
import { hasPermission } from "../../utils/permissions";

const PermissionGuard = ({ children, requiredPermission, anyOf }) => {
  const { permissions } = useSelector((state) => state.permissions);

  // Check for single permission
  if (requiredPermission && hasPermission(permissions, requiredPermission)) {
    return <>{children}</>;
  }

  // Check for any of multiple permissions
  if (anyOf && anyOf.some((perm) => hasPermission(permissions, perm))) {
    return <>{children}</>;
  }

  return null;
};

export default PermissionGuard;
