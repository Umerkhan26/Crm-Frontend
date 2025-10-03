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

export const fetchCampaigns = async ({ page = 1, limit = 10, search = "" }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    }).toString();
    const response = await fetch(`${API_URL}/getAllCampaigns?${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const groupedCampaigns = data.groupedCampaigns || {};
    const allCampaigns = Object.values(groupedCampaigns).flat();

    return {
      data: allCampaigns.map((campaign) => ({
        id: campaign.id,
        campaignName: campaign.campaignName,
        parsedFields: (() => {
          try {
            if (typeof campaign.fields === "string") {
              return JSON.parse(campaign.fields);
            }
            return Array.isArray(campaign.fields) ? campaign.fields : [];
          } catch (e) {
            console.error("Error parsing campaign.fields:", campaign.fields, e);
            return [];
          }
        })(),
      })),
      totalItems: data.totalItems || 0,
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
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
    const response = await fetch(`${API_URL}/getCampaignId/${campaignId}`, {
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
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }

  try {
    const response = await fetch(`${API_URL}/updateCampaignById/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.message || "Failed to update campaign");
    }

    return await response.json();
  } catch (error) {
    console.error("Update campaign error:", error.message);
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
