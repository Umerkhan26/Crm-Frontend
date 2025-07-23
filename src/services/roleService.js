import { API_URL } from "./auth";

export const getAllPermissions = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/getAllPermissions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch permissions");
  }

  const result = await response.json();

  // Return the actual permissions array from the response
  return result.data || [];
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

export const getAllRoles = async ({ page = 1, limit = 10, search = "" }) => {
  const token = localStorage.getItem("token");
  const query = new URLSearchParams({ page, limit, search }).toString();

  try {
    const response = await fetch(`${API_URL}/all?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch roles");
    }

    return response.json();
  } catch (error) {
    console.error("getAllRoles error:", error);
    throw error;
  }
};

export const deleteRole = async (roleId) => {
  try {
    const response = await fetch(`${API_URL}/delete/${roleId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete role");
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
