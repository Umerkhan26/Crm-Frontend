export const API_URL = "http://localhost:3000/api";

export const registerUser = async (formData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/registerr`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }

  return await response.json();
};

export const updateUserById = async (id, payload, token) => {
  const response = await fetch(`${API_URL}/updateUserById/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update user");
  }

  return result;
};

export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/getAllUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch users");
    }

    return data.users;
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
};

export const getUserById = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token provided");
    }

    const response = await fetch(`${API_URL}/getUserById/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

// In services/auth.js
export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_URL}/updateUserById/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const blockOrUnblockUser = async (userId, action) => {
  try {
    const response = await fetch(`${API_URL}/blockOrUnblockUser/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user status");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in blockOrUnblockUser:", error);
    throw error;
  }
};

export const deleteUserById = async (userId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/deleteUserById/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete user");
    }

    return data.message;
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
};
