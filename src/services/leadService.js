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
    if (status) queryParams.append("status", status);

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
      const parsedData =
        typeof lead.leadData === "string"
          ? JSON.parse(lead.leadData)
          : lead.leadData;
      const hasAssignee = lead.assignees && lead.assignees.length > 0;

      return {
        id: lead.id,
        campaignName: lead.campaignName,
        campaignType: lead.campaignName,
        leadData: lead.leadData,
        fullLeadData: parsedData,
        assigneeId: lead.assigneeId,
        assignees: lead.assignees,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        checked: false,
        // Flattened properties
        agentName: parsedData.agent_name || parsedData.agentName,
        firstName: parsedData.first_name || parsedData.firstName,
        lastName: parsedData.last_name || parsedData.lastName,
        phoneNumber: parsedData.phone_number || parsedData.phoneNumber,
        state: parsedData.state,
        date: parsedData.date,
        // Assignment status
        isAssigned: hasAssignee,
        assignedTo: hasAssignee
          ? lead.assignees.map((a) => `${a.firstname} ${a.lastname}`).join(", ")
          : "Unassigned",
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

export const fetchLeadsByCampaign = async (campaignName) => {
  try {
    const response = await fetch(
      `${API_URL}/leads/campaign/${encodeURIComponent(campaignName)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch leads by campaign");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch leads by campaign");
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

    return await response.json();
  } catch (error) {
    console.error(`Error assigning lead ${leadId} to user ${userId}:`, error);
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
      const assigneesArray = (() => {
        try {
          return Array.isArray(lead.assignees)
            ? lead.assignees
            : JSON.parse(lead.assignees || "[]");
        } catch {
          return [];
        }
      })();

      return {
        id: lead.id,
        campaignName: lead.campaignName,
        campaignType: lead.campaignName,
        leadData: lead.leadData,
        fullLeadData: parsedData,
        assigneeId: lead.assignees.userId,
        assignees: lead.assignees,
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
        isAssigned: assigneesArray.length > 0,
        assignedTo: assigneesArray.length
          ? assigneesArray
              .map((a) => `${a.firstname || ""} ${a.lastname || ""}`.trim())
              .join(", ")
          : "Unassigned",
      };
    });

    return {
      data: leads,
      totalPages: 1,
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
        assignees: lead.assignees,
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

export const getAssignmentStats = async (leadId) => {
  try {
    const response = await fetch(`${API_URL}/assignment-stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch assignment stats");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching assignment stats:", error);
    throw error;
  }
};

export const fetchLeadsByAssigneeId = async (
  assigneeId,
  filterType = "daily",
  startDate,
  endDate,
  page = 1,
  limit = 10
) => {
  try {
    const token = localStorage.getItem("token");
    const url = new URL(`${API_URL}/getLeadsByAssigneeId/${assigneeId}`);

    // Add query parameters
    url.searchParams.append("filterType", filterType);
    if (startDate) url.searchParams.append("startDate", startDate);
    if (endDate) url.searchParams.append("endDate", endDate);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch assigned leads");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// services/leadService.js
export const updateLeadStatus = async (leadId, userId, status) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `${API_URL}/getAssignedLeadsByStatus/${leadId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: Number(userId),
          status,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update lead status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating lead status:", error);
    throw error;
  }
};

export const fetchLeadStatusSummary = async (assigneeId = null) => {
  try {
    const baseUrl = `${API_URL}/status-summary`;
    const url = assigneeId ? `${baseUrl}?assigneeId=${assigneeId}` : baseUrl;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch lead status summary");
    }

    const result = await response.json();
    return result.data; // Or return whole result if you need meta
  } catch (error) {
    console.error("Error fetching lead status summary:", error);
    throw error;
  }
};

export const getLeadsByCampaignAndAssignee = async (
  campaignName,
  assigneeId
) => {
  if (!campaignName || !assigneeId) {
    throw new Error("Both campaignName and assigneeId are required");
  }

  try {
    const token = localStorage.getItem("token");
    const url = new URL(
      `${API_URL}/lead-get-by-campaign-and-assignee/${encodeURIComponent(
        campaignName
      )}`
    );
    url.searchParams.append("assigneeId", assigneeId);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getLeadsByCampaignAndAssignee:", {
      campaignName,
      assigneeId,
      error,
    });
    throw error;
  }
};

export const getLeadActivitiesByLeadId = async (leadId) => {
  try {
    const response = await fetch(
      `${API_URL}/getLeadActivityByLeadId/${leadId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch lead activities");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching lead activities:", error);
    throw error;
  }
};

// services/leadService.js
export const deleteLeadActivityById = async (activityId, token) => {
  try {
    const response = await fetch(
      `${API_URL}/deleteLeadActivity/${activityId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete lead activity");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error deleting lead activity");
  }
};
