import {
  getEffectivePermissions,
  hasAnyPermission,
  isAdmin,
} from "./permissions";

export const getMenuItems = (user) => {
  const isAdminUser = isAdmin(user);
  const permissions = getEffectivePermissions(user);
  // In your getMenuItems function, before filtering
  console.log("User permissions:", permissions);

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
