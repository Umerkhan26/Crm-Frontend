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
    const serializedRoles = Array.isArray(allowedRoles)
      ? JSON.stringify(allowedRoles.map((r) => r.id))
      : null;

    const response = await fetch(
      `${API_URL}/email-permissions/${serviceName}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          canSend,
          allowedRoles: serializedRoles,
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
    throw error;
  }
};

export const sendEmailToLead = async (leadId, templateKey) => {
  try {
    const response = await fetch(`${API_URL}/leads/${leadId}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ templateKey }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Error sending email to lead:", error);
    throw error;
  }
};
