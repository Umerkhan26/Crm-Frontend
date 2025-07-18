import { API_URL } from "./auth";
import { getAuthToken } from "./orderService";

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

export const fetchCampaigns = async ({ page = 1, limit = 10 }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const response = await fetch(
      `${API_URL}/getAllCampaigns?page=${page}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response:", data);

    const groupedCampaigns = data.groupedCampaigns || {};
    const allCampaigns = Object.values(groupedCampaigns).flat();

    return {
      data: allCampaigns.map((campaign) => ({
        id: campaign.id,
        campaignName: campaign.campaignName,
        parsedFields: campaign.fields ? JSON.parse(campaign.fields) : [],
      })),
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
    };
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
};

export const getCampaignById = async (campaignId) => {
  if (!campaignId) {
    throw new Error("Campaign ID is undefined or invalid.");
  }

  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/getCampaignById/${campaignId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch campaign fields.");
    }

    return result.fields || [];
  } catch (error) {
    throw new Error(`Error fetching campaign fields: ${error.message}`);
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
