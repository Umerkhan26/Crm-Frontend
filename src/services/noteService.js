import { API_URL } from "./auth";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

export const addNote = async (noteData) => {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error response:", errorData); // Debug log
      throw new Error(errorData.message || "Something went wrong");
    }
    return handleResponse(response);
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

export const getNotes = async (notebleId, notebleType) => {
  try {
    const response = await fetch(
      `${API_URL}/getNotes/${notebleType}/${notebleId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

export const deleteNote = async (noteId, token) => {
  try {
    const response = await fetch(`${API_URL}/delete/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete note");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error deleting note");
  }
};

export const getReminders = async (notebleId, notebleType) => {
  const response = await fetch(
    `${API_URL}/getReminders/${notebleType}/${notebleId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to fetch reminders");
  return data;
};

export const addReminder = async ({
  content,
  reminderType,
  reminderDate,
  notebleId,
  notebleType,
}) => {
  const response = await fetch(`${API_URL}/addReminder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },

    body: JSON.stringify({
      content,
      reminderType,
      reminderDate,
      notebleId,
      notebleType,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to add reminder");
  return data;
};
export const deleteReminder = async (reminderId, token) => {
  try {
    const response = await fetch(`${API_URL}/deleteReminder/${reminderId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete reminder");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error deleting reminder");
  }
};
