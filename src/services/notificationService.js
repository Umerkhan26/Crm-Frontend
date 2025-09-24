import { API_URL } from "./auth";

const getNotifications = async (userId, page = 1, limit = 15) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/getNotificationById/${userId}?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return await response.json();
};

const markNotificationAsRead = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Error("User ID not found");
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${userId}/mark-read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return await response.json();
};

const getUnreadCount = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${userId}/unread-count`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch unread count");
  }

  const data = await response.json();
  return data.unreadCount;
};

export { getNotifications, markNotificationAsRead, getUnreadCount };
