// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);

  useEffect(() => {
    const loadUser = () => {
      const authUser = localStorage.getItem("authUser");
      const rolePerms = localStorage.getItem("rolePermissions");

      if (authUser) {
        setUser(JSON.parse(authUser));
      }
      if (rolePerms) {
        setRolePermissions(JSON.parse(rolePerms));
      }
    };

    loadUser();
  }, []);

  const hasPermission = (permissionName) => {
    return rolePermissions.some((perm) => perm.name === permissionName);
  };

  const hasCampaignPermission = (campaignId) => {
    return rolePermissions?.some(
      (perm) =>
        perm.resourceId == campaignId || // loose equality to handle string/number
        perm.resourceType?.includes(`campaign-${campaignId}`)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        rolePermissions,
        hasPermission,
        hasCampaignPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
