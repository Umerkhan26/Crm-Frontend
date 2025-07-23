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

export const fetchAllLeads = async (
  page = 1,
  pageSize = 10,
  search = "",
  status = ""
) => {
  const token = getAuthToken();
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString(),
    });

    if (search) queryParams.append("search", search);
    if (status) queryParams.append("status", status); // Add status filter

    const response = await fetch(
      `${API_URL}/getleads?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch leads: ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();

    if (!Array.isArray(result.data)) {
      throw new Error("Invalid response format");
    }

    const leads = result.data.map((lead) => {
      const parsedData = JSON.parse(lead.leadData);
      return {
        id: lead.id,
        campaignName: lead.campaignName,
        campaignType: lead.campaignName,
        leadData: lead.leadData,
        fullLeadData: parsedData,
        assigneeId: lead.assigneeId,
        assignee: lead.assignee, // Include the full assignee object
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        checked: false,
        // Flattened properties
        agentName: parsedData.agent_name,
        firstName: parsedData.first_name,
        lastName: parsedData.last_name,
        phoneNumber: parsedData.phone_number,
        state: parsedData.state,
        date: parsedData.date,
        // Assignment status
        isAssigned: !!lead.assigneeId,
        assignedTo: lead.assignee ? lead.assignee.firstname : "Unassigned",
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

    const responseData = await response.json();
    console.log("Update lead response:", responseData);

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

export const assignLeadToUser = async (leadId, userId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/assign/${leadId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to assign lead");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

export const fetchAllLeadsWithAssignee = async () => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_URL}/getLeadsWithAssignee`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch leads with assignees: ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();

    if (!Array.isArray(result.data)) {
      throw new Error("Invalid response format");
    }

    const leads = result.data.map((lead) => {
      const parsedData = JSON.parse(lead.leadData);
      return {
        id: lead.id,
        campaignName: lead.campaignName,
        campaignType: lead.campaignName,
        leadData: lead.leadData,
        fullLeadData: parsedData,
        assigneeId: lead.assigneeId,
        assignee: lead.assignee,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        checked: false,
        // Flattened properties
        agentName: parsedData.agent_name,
        firstName: parsedData.first_name,
        lastName: parsedData.last_name,
        phoneNumber: parsedData.phone_number,
        state: parsedData.state,
        date: parsedData.date,
        // Assignment status
        isAssigned: !!lead.assigneeId,
        assignedTo: lead.assignee ? lead.assignee.firstname : "Unassigned",
      };
    });

    return {
      data: leads,
      totalPages: 1, // Note: getAllLeadsWithAssignee doesn't support pagination
      totalItems: leads.length,
      currentPage: 1,
    };
  } catch (error) {
    console.error("Error fetching leads with assignees:", error);
    throw error;
  }
};

export const fetchUnassignedLeads = async () => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_URL}/getLeadsWithUnassigned`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch unassigned leads: ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();

    if (!Array.isArray(result.data)) {
      throw new Error("Invalid response format");
    }

    const leads = result.data.map((lead) => {
      const parsedData = JSON.parse(lead.leadData);
      return {
        id: lead.id,
        campaignName: lead.campaignName,
        campaignType: lead.campaignName,
        leadData: lead.leadData,
        fullLeadData: parsedData,
        assigneeId: lead.assigneeId,
        assignee: lead.assignee,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        checked: false,
        agentName: parsedData.agent_name,
        firstName: parsedData.first_name,
        lastName: parsedData.last_name,
        phoneNumber: parsedData.phone_number,
        state: parsedData.state,
        date: parsedData.date,
        isAssigned: !!lead.assigneeId,
        assignedTo: lead.assignee ? lead.assignee.firstname : "Unassigned",
      };
    });

    return {
      data: leads,
      totalPages: 1,
      totalItems: leads.length,
      currentPage: 1,
    };
  } catch (error) {
    console.error("Error fetching unassigned leads:", error);
    throw error;
  }
};
