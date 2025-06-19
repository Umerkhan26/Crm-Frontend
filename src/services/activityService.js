import { API_URL } from "./auth";

export const getActivityLogs = async () => {
  try {
    const response = await fetch(`${API_URL}/getAllActivities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch activity logs");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    throw error;
  }
};

export const getActivitiesByUserId = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/getActivitybyId/${userId}`);
    const data = await response.json();
    if (response.status === 200) {
      return data;
    } else {
      throw new Error(data.message || "Failed to fetch activity logs");
    }
  } catch (error) {
    throw new Error("Failed to fetch activity logs");
  }
};

export const deleteActivityById = async (id) => {
  const response = await fetch(`${API_URL}/activity/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete activity log");
  }

  return response.json();
};
