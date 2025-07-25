// Helper function to check if user has a specific permission
export const hasPermission = (
  permissions,
  permissionName,
  resourceType = null,
  resourceId = null,
  isAdminUser = false
) => {
  // Admin users automatically have all permissions
  if (isAdminUser) return true;

  // Handle case where permissions might be null or undefined
  if (!permissions || !Array.isArray(permissions)) return false;

  return permissions.some((perm) => {
    const nameMatch = perm.name === permissionName;
    const typeMatch = resourceType ? perm.resourceType === resourceType : true;
    const idMatch = resourceId ? perm.resourceId === resourceId : true;
    return nameMatch && typeMatch && idMatch;
  });
};

// Check if user has any of the required permissions
export const hasAnyPermission = (
  permissions,
  permissionNames,
  isAdminUser = false
) => {
  if (isAdminUser) return true;
  if (!permissions || !Array.isArray(permissions)) return false;
  return permissionNames.some((name) => hasPermission(permissions, name));
};

// Check if user has all required permissions
export const hasAllPermissions = (
  permissions,
  permissionNames,
  isAdminUser = false
) => {
  if (isAdminUser) return true;
  if (!permissions || !Array.isArray(permissions)) return false;
  return permissionNames.every((name) => hasPermission(permissions, name));
};

// Check if user is admin
export const isAdmin = (user) => {
  return (
    user?.userrole === "admin" || user?.role?.name?.toLowerCase() === "admin"
  );
};

// Get menu items based on permissions
export const getMenuItems = (user) => {
  const permissions = user?.role?.Permissions || [];
  const isAdminUser = isAdmin(user);

  const menuItems = [
    {
      title: "Dashboard",
      icon: "ri-dashboard-line",
      path: "/dashboard",
      requiredPermissions: [],
    },
    {
      title: "Chat",
      icon: "ri-chat-1-line",
      path: "/chat",
      requiredPermissions: [],
    },
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
    // Users section
    {
      title: "Users",
      icon: "ri-user-line",
      subItems: [
        {
          title: "All Users",
          path: "/allUsers",
          requiredPermissions: ["user:get"],
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
      requiredPermissions: ["user:get", "user:create"],
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
          requiredPermissions: ["lead:getAll"],
        },
        {
          title: "Add Leads",
          path: "/add-lead",
          requiredPermissions: ["lead:create"],
        },
      ],
      requiredPermissions: ["lead:getAll", "lead:create"],
    },
    // Referrals section
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
    // Settings section
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
        },
        {
          title: "System Settings",
          path: "/settings",
          requiredPermissions: [],
        },
      ],
      requiredPermissions: [],
    },
  ];

  // Filter menu items based on permissions
  return menuItems
    .filter((item) => {
      if (item.requiredPermissions.length === 0) return true;
      return hasAnyPermission(
        permissions,
        item.requiredPermissions,
        isAdminUser
      );
    })
    .map((item) => {
      // Filter sub-items if they exist
      if (item.subItems) {
        return {
          ...item,
          subItems: item.subItems.filter((subItem) => {
            if (subItem.requiredPermissions.length === 0) return true;
            return hasAnyPermission(
              permissions,
              subItem.requiredPermissions,
              isAdminUser
            );
          }),
        };
      }
      return item;
    })
    .filter((item) => {
      // Remove parent items with no visible sub-items
      if (item.subItems && item.subItems.length === 0) return false;
      return true;
    });
};
