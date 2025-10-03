// const getEffectivePermissions = (user) => {
//   // Always prioritize fresh permissions from user.role.Permissions
//   if (user?.role?.Permissions && Array.isArray(user.role.Permissions)) {
//     localStorage.setItem(
//       "rolePermissions",
//       JSON.stringify(user.role.Permissions)
//     );
//     return user.role.Permissions;
//   }

//   // Fall back to localStorage if no fresh permissions available
//   const storedPermissions = localStorage.getItem("rolePermissions");
//   if (storedPermissions) {
//     try {
//       return JSON.parse(storedPermissions);
//     } catch (e) {
//       console.error("Failed to parse stored permissions", e);
//     }
//   }

//   return [];
// };

// In your permission utility functions
// Updated getEffectivePermissions in permissions utilities
export const getEffectivePermissions = (user, reduxPermissions = null) => {
  if (reduxPermissions && Array.isArray(reduxPermissions)) {
    return reduxPermissions;
  }

  if (user?.role?.Permissions && Array.isArray(user.role.Permissions)) {
    const roleId = user.role.id;
    localStorage.setItem(
      `rolePermissions_${roleId}`,
      JSON.stringify(user.role.Permissions)
    );
    return user.role.Permissions;
  }

  const roleId = user?.role?.id;
  if (roleId) {
    const storedPermissions = localStorage.getItem(`rolePermissions_${roleId}`);
    if (storedPermissions) {
      try {
        return JSON.parse(storedPermissions);
      } catch (e) {
        console.error("Failed to parse stored permissions", e);
      }
    }
  }

  return [];
};

export const hasPermission = (
  permissions,
  permissionName,
  resourceType = null,
  resourceId = null,
  isAdminUser = false
) => {
  if (isAdminUser) return true;
  if (!permissions || !Array.isArray(permissions)) {
    console.error("Invalid permissions array");
    return false;
  }

  const found = permissions.some((perm) => {
    const nameMatch = perm.name === permissionName;
    const typeMatch = resourceType ? perm.resourceType === resourceType : true;
    const idMatch = resourceId ? perm.resourceId === resourceId : true;

    if (nameMatch) {
      console.log(`Permission match found:`, perm); // Debug log
    }

    return nameMatch && typeMatch && idMatch;
  });
  return found;
};

export const hasAnyPermission = (
  user,
  permissionNames,
  permissions = null,
  isAdminUser = isAdmin(user)
) => {
  if (isAdminUser) return true;

  const effectivePermissions = permissions || getEffectivePermissions(user);
  if (!effectivePermissions || !Array.isArray(effectivePermissions))
    return false;

  return permissionNames.some((name) =>
    effectivePermissions.some((p) => p.name === name)
  );
};

export const hasExclusivePermission = (user, permissionName) => {
  const permissions = getEffectivePermissions(user);
  if (!permissions || !Array.isArray(permissions)) return false;

  return (
    permissions.some((p) => p.name === permissionName) &&
    !permissions.some(
      (p) =>
        p.name !== permissionName &&
        p.name.startsWith(permissionName.split(":")[0])
    )
  );
};

// Check if user has all required permissions
export const hasAllPermissions = (
  user,
  permissionNames,
  isAdminUser = false
) => {
  if (isAdminUser || isAdmin(user)) return true;

  const permissions = getEffectivePermissions(user);
  if (!permissions || !Array.isArray(permissions)) return false;

  if (
    permissionNames.includes("user:getById") &&
    !permissionNames.includes("user:get")
  ) {
    return hasExclusivePermission(user, "user:getById");
  }

  return permissionNames.every((name) =>
    hasPermission(permissions, name, null, null, isAdminUser)
  );
};

// Check if user is admin
export const isAdmin = (user) => {
  return (
    user?.userrole === "admin" ||
    user?.role?.name?.toLowerCase() === "admin" ||
    // Fallback check for stored user data
    JSON.parse(localStorage.getItem("authUser") || "{}")?.userrole === "admin"
  );
};

export const getMenuItems = (user) => {
  const isAdminUser = isAdmin(user);
  const permissions = getEffectivePermissions(user);
  console.log("User permissions:", permissions);
  console.log(
    "Checking for assigngetByAssigneeedLead::",
    hasAnyPermission(user, ["assignedLead:getByAssignee"], isAdminUser)
  );

  const menuItems = [
    {
      title: "Dashboard",
      icon: "ri-dashboard-line",
      path: "/dashboard",
      requiredPermissions: [],
    },
    // {
    //   title: "Chat",
    //   icon: "ri-chat-1-line",
    //   path: "/chat",
    //   requiredPermissions: [],
    // },
    // Role section - only for admin
    ...(isAdminUser
      ? [
          {
            title: "Role",
            icon: "ri-shield-user-line",
            subItems: [
              {
                title: "Create Role",
                path: "/create-role",
                requiredPermissions: [],
              },
              {
                title: "All Role",
                path: "/role-index",
                requiredPermissions: [],
              },
            ],
            requiredPermissions: [],
          },
        ]
      : []),

    {
      title: "Users",
      icon: "ri-user-line",
      subItems: [
        {
          title: hasAnyPermission(user, ["user:get"])
            ? "All Users"
            : "My Profile",
          path: "/allUsers",
          requiredPermissions: ["user:get", "user:getById"],
        },
        {
          title: "User Registration",
          path: "/user-register",
          requiredPermissions: ["user:create"],
        },
        {
          title: "Clientele",
          path: "/all-client",
          requiredPermissions: ["user:get"],
        },
      ],
      requiredPermissions: ["user:get", "user:create", "user:getById"],
      showIfAnySubItem: true,
    },
    // Campaigns section
    {
      title: "Campaigns",
      icon: "ri-broadcast-line",
      subItems: [
        {
          title: "All Campaigns",
          path: "/campaign-index",
          requiredPermissions: ["campaign:get"],
        },
        {
          title: "Create Campaigns",
          path: "/create-campaign",
          requiredPermissions: ["campaign:create"],
        },
      ],
      requiredPermissions: ["campaign:get", "campaign:create"],
    },
    // Orders section
    {
      title: "Orders",
      icon: "ri-shopping-cart-line",
      subItems: [
        {
          title: "All Orders",
          path: "/order-index",
          requiredPermissions: ["order:get"],
        },
        {
          title: "Create New Order",
          path: "/create-order",
          requiredPermissions: ["order:create"],
        },
      ],
      requiredPermissions: ["order:get", "order:create"],
    },
    // Leads section
    {
      title: "Leads",
      icon: "ri-user-search-line",
      subItems: [
        {
          title: "Master Leads (Leads Center)",
          path: "/master-lead-index",
          requiredPermissions: ["lead:getAll"],
        },
        {
          title: "Client Leads",
          path: "/lead-index",
          requiredPermissions: ["clientLead:getAll"],
        },
        {
          title: "Assigned Leads",
          path: "/assigned-leads",
          requiredPermissions: ["assignedLead:getByAssignee"],
        },
        {
          title: "Add Leads",
          path: "/add-lead",
          requiredPermissions: ["lead:create"],
        },
      ],
      requiredPermissions: [], // Parent always visible
    },

    {
      title: "Product",
      icon: "ri-shopping-bag-3-line", // Valid Remix icon
      subItems: [
        {
          title: "Create Product",
          path: "/create-product",
          requiredPermissions: ["PRODUCT_CREATE"],
        },

        {
          title: "All Product",
          path: "/all-products",
          requiredPermissions: ["PRODUCT_GET_ALL"],
        },
        {
          title: "All Sales",
          path: "/all-sales",
          requiredPermissions: [
            "SALE_GET_ALL",
            "SALE_GET_BY_ID",
            "SALE_GET_BY_ASSIGNEE",
          ],
        },
      ],
      requiredPermissions: [],
    },
    // Referrals section
    ...(isAdminUser
      ? [
          {
            title: "Referrals",
            icon: "ri-group-line",
            subItems: [
              {
                title: "Send Referral",
                path: "#",
                modal: true,
                requiredPermissions: [],
              },
              {
                title: "My Referrals",
                path: "/all-referral",
                requiredPermissions: [],
              },
            ],
            requiredPermissions: [],
          },
        ]
      : []),

    ...(isAdminUser
      ? [
          {
            title: "Settings",
            icon: "ri-settings-3-line",
            subItems: [
              {
                title: "Email Template",
                path: "/allEmail",
                requiredPermissions: [],
              },
              {
                title: "Email Action",
                path: "/email-action",
                requiredPermissions: [],
              },
              {
                title: "Notification",
                path: "/all-notifications",
                requiredPermissions: [],
              },
              {
                title: "Activity Logs",
                path: "/all-activities",
                requiredPermissions: [],
              }, // admin also sees
              // {
              //   title: "System Settings",
              //   path: "/settings",
              //   requiredPermissions: [],
              // },
            ],
            requiredPermissions: [],
          },
        ]
      : [
          {
            title: "Settings",
            icon: "ri-settings-3-line",
            subItems: [
              {
                title: "Notification",
                path: "/all-notifications",
                requiredPermissions: [],
              },
              {
                title: "Activity Logs",
                path: "/all-activities",
                requiredPermissions: [],
              }, // non-admins see only this
            ],
            requiredPermissions: [],
          },
        ]),
  ];

  // Filter menu items based on permissions

  // Enhanced filtering with better permission handling
  // return menuItems
  //   .filter((item) => {
  //     if (item.requiredPermissions.length === 0) return true;
  //     return hasAnyPermission(user, item.requiredPermissions, isAdminUser);
  //   })
  //   .map((item) => {
  //     if (item.subItems) {
  //       const filteredSubItems = item.subItems.filter((subItem) => {
  //         if (subItem.requiredPermissions.length === 0) return true;
  //         return hasAnyPermission(
  //           user,
  //           subItem.requiredPermissions,
  //           isAdminUser
  //         );
  //       });

  //       // Only include the item if it has visible sub-items or is a direct link
  //       return filteredSubItems.length > 0 || item.path
  //         ? { ...item, subItems: filteredSubItems }
  //         : null;
  //     }
  //     return item;
  //   })
  //   .filter(Boolean); // Remove any null items

  return menuItems
    .filter((item) => {
      if (item.subItems) return true;
      if (item.requiredPermissions.length === 0) return true;
      return hasAnyPermission(user, item.requiredPermissions, isAdminUser);
    })
    .map((item) => {
      if (item.subItems) {
        const filteredSubItems = item.subItems.filter((subItem) => {
          if (subItem.requiredPermissions.length === 0) return true;
          return hasAnyPermission(
            user,
            subItem.requiredPermissions,
            isAdminUser
          );
        });

        return filteredSubItems.length > 0 || item.path
          ? { ...item, subItems: filteredSubItems }
          : null;
      }
      return item;
    })
    .filter(Boolean);
};

export const initializePermissions = () => {
  try {
    const authUser = localStorage.getItem("authUser");
    if (!authUser) return [];

    const user = JSON.parse(authUser);
    return getEffectivePermissions(user);
  } catch (e) {
    console.error("Failed to initialize permissions", e);
    return [];
  }
};
