import { API_URL } from "./auth";

export const createCampaign = async (campaignData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token provided");
    }

    const response = await fetch(`${API_URL}/createCampaign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(campaignData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create campaign");
    }

    return data;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
};

export const getCampaignById = async (id) => {
  try {
    // Validate ID
    if (!id || isNaN(id)) {
      throw new Error("Invalid campaign ID");
    }

    const API_URL =
      process.env.REACT_APP_API_URL || "http://localhost:3001/api";
    const response = await fetch(`${API_URL}/getCampaignById/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch campaign fields");
    }

    const data = await response.json();

    // Ensure the response has the expected structure
    if (!data.fields && !data.campaignName) {
      throw new Error("Invalid campaign data structure");
    }

    return data;
  } catch (error) {
    console.error("Error fetching campaign fields:", error);
    throw new Error(error.message || "Failed to fetch campaign data");
  }
};

export const fetchCampaigns = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/getAllCampaigns`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (typeof data !== "object" || Array.isArray(data) || data === null) {
      throw new Error("Unexpected API response format");
    }

    return Object.entries(data).map(([campaignName, fields]) => {
      const id =
        Array.isArray(fields) && fields[0]?.id ? fields[0].id : campaignName;

      return {
        id,
        campaignName,
        parsedFields: fields,
      };
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error.message);
    throw error;
  }
};

export const updateCampaign = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/updateCampaignById/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update campaign");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteCampaign = async (campaignId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/deleteCampaign/${campaignId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete campaign");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw error;
  }
};
