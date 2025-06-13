import { API_URL } from "./auth";
import { getAuthToken } from "./orderService";

export const createLead = async (leadData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(leadData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create lead");
    }

    return result;
  } catch (error) {
    throw new Error(`Error creating lead: ${error.message}`);
  }
};

export const fetchAllLeads = async (page = 1, pageSize = 10) => {
  const token = getAuthToken();
  try {
    const response = await fetch(
      `${API_URL}/leads?page=${page}&limit=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch leads: ${response.statusText}`);
    }

    const result = await response.json();

    // Check if result.data exists and is an array
    if (!result.data || !Array.isArray(result.data)) {
      throw new Error("Invalid response format: Expected an array of leads");
    }

    const leads = result.data.map((lead) => {
      const leadDataObj = JSON.parse(lead.leadData);
      return {
        id: lead.id,
        campaignType: lead.campaignName,
        agentName: leadDataObj.agent_name || "Default",
        firstName: leadDataObj.first_name || "Default",
        lastName: leadDataObj.last_name || "Default",
        phoneNumber: leadDataObj.phone_number || "Default",
        state: leadDataObj.state || "Unknown",
        reason: leadDataObj.reason || "",
        status: leadDataObj.status || "Pending",
        fullLeadData: leadDataObj,
      };
    });

    return {
      data: leads,
      totalPages: result.totalPages,
      totalItems: result.totalItems,
      currentPage: result.currentPage,
    };
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }
};

export const updateLead = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedData),
    });

    const responseData = await response.json(); // Parse the response
    console.log("Update lead response:", responseData); // Log the parsed response

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update lead");
    }

    return responseData;
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

export const deleteLead = async (id) => {
  try {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete lead");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
