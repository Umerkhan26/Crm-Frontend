import { API_URL } from "./auth";

export const getAllPermissions = async () => {
  const response = await fetch(`${API_URL}/getAllPermissions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch permissions");
  return await response.json();
};

export const createRole = async (payload) => {
  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create role");
  }

  return await response.json();
};

// Update role permissions
export const updateRolePermissions = async (roleId, permissions) => {
  const response = await fetch(`${API_URL}/update/${roleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ permissions }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update role permissions: ${response.statusText}`
    );
  }

  return response.json();
};

// Fetch all roles with permissions
export const getAllRoles = async () => {
  const response = await fetch(`${API_URL}/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch roles: ${response.statusText}`);
  }

  return response.json();
};
