// services/authService.js
import store from "../store";
import { setPermissions } from "../store/permissionsSlice";

export const initializePermissions = (user) => {
  const isAdminUser =
    user?.userrole === "admin" || user?.role?.name?.toLowerCase() === "admin";

  const permissions = user?.role?.Permissions || [];

  store.dispatch(
    setPermissions({
      permissions,
      isAdmin: isAdminUser,
    })
  );
};
