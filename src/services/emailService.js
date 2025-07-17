// src/services/emailService.js

import { API_URL } from "./auth";

export const fetchEmailPermissions = async () => {
  try {
    const response = await fetch(`${API_URL}/email-permissions`);
    if (!response.ok) {
      throw new Error("Failed to fetch email permissions");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching email permissions:", error);
    return [];
  }
};

export const updateEmailPermission = async (
  serviceName,
  { canSend, allowedRoles }
) => {
  try {
    const response = await fetch(
      `${API_URL}/email-permissions/${serviceName}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          canSend,
          allowedRoles: allowedRoles || null,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update permission");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating email permission:", error);
    throw error; // Re-throw to handle in the component
  }
};
