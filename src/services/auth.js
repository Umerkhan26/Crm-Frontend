export const API_URL = "http://localhost:3000/api";

export const getAllRoles = async () => {
  const response = await fetch(`${API_URL}/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch roles");
  }

  return response.json();
};

export const registerUser = async (payload) => {
  const response = await fetch(`${API_URL}/registerr`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to register user");
  }

  return result;
};

export const updateUserById = async (id, payload) => {
  const response = await fetch(`${API_URL}/updateUserById/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
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
// export const getUserById = async (id) => {
//   try {
//     const response = await fetch(`${API_URL}/getUserById/${id}`);

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || "Failed to fetch user");
//     }

//     const data = await response.json();
//     return data.user;
//   } catch (error) {
//     throw new Error(error.message || "Network error");
//   }
// };

// export const deleteUserById = async (userId) => {
//   try {
//     const response = await axios.delete(`${API_URL}/deleteUserById/${userId}`);
//     console.log("Deleetinh user", response);
//     return response.data.message;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Failed to delete user.");
//   }
// };

// services/auth.js

export const getUserById = async (userId) => {
  try {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      throw new Error("No token provided"); // Line 66
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
    const response = await fetch(
      `http://localhost:3000/api/updateUserById/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return await response.json();
  } catch (error) {
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
