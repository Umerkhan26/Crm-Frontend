import store from "../..";
import { updatePermissions } from "./actions";

export const syncPermissions = () => {
  const handleStorageChange = (e) => {
    if (e.key === "permissionsUpdated") {
      const permissions = JSON.parse(
        localStorage.getItem("rolePermissions") || []
      );
      store.dispatch(updatePermissions(permissions));
    }
  };

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
};

export const triggerPermissionUpdate = () => {
  localStorage.setItem("permissionsUpdated", Date.now().toString());
};
