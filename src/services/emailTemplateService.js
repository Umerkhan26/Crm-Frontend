import { API_URL } from "./auth";

export const getEmailTemplates = async () => {
  try {
    const response = await fetch(`${API_URL}/email-templates`);
    if (!response.ok) throw new Error("Failed to fetch email templates");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching email templates:", error);
    throw error;
  }
};

export const getEmailTemplatesById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/email-templates/${id}`);
    if (!response.ok) throw new Error("Failed to fetch email templates");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching email templates:", error);
    throw error;
  }
};

export const updateEmailTemplate = async (id, data) => {
  const response = await fetch(`${API_URL}/email-templates/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update template");
  }

  return await response.json();
};
