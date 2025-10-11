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
  { filterType = "all", startDate = "", endDate = "" } = {}
) => {
  const token = getAuthToken();

  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString(),
    });

    if (search) queryParams.append("search", search);

    // ✅ Add backend date filtering parameters
    if (filterType && filterType !== "all")
      queryParams.append("filterType", filterType);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

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
        agentName: parsedData.agent_name || parsedData.agentName,
        firstName: parsedData.first_name || parsedData.firstName,
        lastName: parsedData.last_name || parsedData.lastName,
        phoneNumber: parsedData.phone_number || parsedData.phoneNumber,
        state: parsedData.state,
        date: parsedData.date,
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

export const fetchLeadsByCampaign = async (
  campaignName,
  page = 1,
  limit = 10
) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    }).toString();

    const response = await fetch(
      `${API_URL}/leads/campaign/${encodeURIComponent(
        campaignName
      )}?${queryParams}`,
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

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch leads by campaign");
    }

    const processedLeads = (result.data || []).map((lead) => {
      const parsedData = normalizeLeadData(lead.leadData);
      const assigneesArray = normalizeAssignees(lead.assignees);

      return {
        id: lead.id,
        campaignName: lead.campaignName,
        campaignType: lead.campaignName,
        leadData: lead.leadData,
        fullLeadData: parsedData,
        assignees: assigneesArray,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        checked: false,
        agentName: parsedData.agent_name || parsedData.agentName || "",
        firstName: parsedData.first_name || parsedData.firstName || "",
        lastName: parsedData.last_name || parsedData.lastName || "",
        phoneNumber: parsedData.phone_number || parsedData.phoneNumber || "",
        state: parsedData.state || "",
        date: parsedData.date || "",
        isAssigned: assigneesArray.length > 0,
        assignedTo: assigneesArray.length
          ? assigneesArray
              .map((a) => `${a.firstname || ""} ${a.lastname || ""}`.trim())
              .join(", ")
          : "Unassigned",
      };
    });

    return {
      data: processedLeads,
      totalPages: result.totalPages || 1,
      totalItems: result.totalItems || processedLeads.length,
      currentPage: result.currentPage || page,
    };
  } catch (error) {
    throw new Error(error.message || "Failed to fetch leads by campaign");
  }
};

// Helper functions
const normalizeLeadData = (leadData) => {
  try {
    if (!leadData) return {};

    if (typeof leadData === "object" && leadData !== null) {
      return leadData;
    }

    if (typeof leadData === "string") {
      const trimmed = leadData.trim();
      if (trimmed === "[object Object]") {
        return {};
      }
      return JSON.parse(trimmed);
    }

    return {};
  } catch (err) {
    console.error("Error normalizing leadData:", leadData, err);
    return {};
  }
};

const normalizeAssignees = (assignees) => {
  try {
    if (Array.isArray(assignees)) {
      return assignees;
    }

    if (typeof assignees === "string") {
      const trimmed = assignees.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        return JSON.parse(trimmed);
      }
      if (trimmed === "[object Object]") {
        return [];
      }
    }

    if (typeof assignees === "object" && assignees !== null) {
      return [assignees];
    }

    return [];
  } catch (error) {
    console.warn("Failed to parse assignees:", assignees, error);
    return [];
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
export const fetchAllLeadsWithAssignee = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  const token = getAuthToken();
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    }).toString();

    const response = await fetch(
      `${API_URL}/getLeadsWithAssignee?${queryParams}`,
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
        `Failed to fetch leads with assignees: ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch leads with assignees");
    }

    const processedLeads = (result.data || []).map((lead) => {
      const parsedData = normalizeLeadData(lead.leadData);
      const assigneesArray = normalizeAssignees(lead.assignees);

      return {
        id: lead.id,
        campaignName: lead.campaignName,
        campaignType: lead.campaignName,
        leadData: lead.leadData,
        fullLeadData: parsedData,
        assignees: assigneesArray,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        checked: false,
        agentName: parsedData.agent_name || parsedData.agentName || "",
        firstName: parsedData.first_name || parsedData.firstName || "",
        lastName: parsedData.last_name || parsedData.lastName || "",
        phoneNumber: parsedData.phone_number || parsedData.phoneNumber || "",
        state: parsedData.state || "",
        date: parsedData.date || "",
        isAssigned: assigneesArray.length > 0,
        assignedTo: assigneesArray.length
          ? assigneesArray
              .map((a) => `${a.firstname || ""} ${a.lastname || ""}`.trim())
              .join(", ")
          : "Unassigned",
      };
    });

    return {
      data: processedLeads,
      totalPages: result.totalPages || 1,
      totalItems: result.totalItems || processedLeads.length,
      currentPage: result.currentPage || page,
    };
  } catch (error) {
    console.error("Error fetching leads with assignees:", error);
    throw error;
  }
};

export const fetchUnassignedLeads = async (
  page = 1,
  limit = 10,
  searchTerm = ""
) => {
  const token = getAuthToken();
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(searchTerm && { search: searchTerm }),
    }).toString();

    const response = await fetch(
      `${API_URL}/getLeadsWithUnassigned?${queryParams}`,
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
        `Failed to fetch unassigned leads: ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch unassigned leads");
    }

    const processedLeads = (result.data || []).map((lead) => {
      const parsedData = normalizeLeadData(lead.leadData);
      const assigneesArray = normalizeAssignees(lead.assignees);

      return {
        id: lead.id,
        campaignName: lead.campaignName,
        campaignType: lead.campaignName,
        leadData: lead.leadData,
        fullLeadData: parsedData,
        assignees: assigneesArray,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        checked: false,
        agentName: parsedData.agent_name || parsedData.agentName || "",
        firstName: parsedData.first_name || parsedData.firstName || "",
        lastName: parsedData.last_name || parsedData.lastName || "",
        phoneNumber: parsedData.phone_number || parsedData.phoneNumber || "",
        state: parsedData.state || "",
        date: parsedData.date || "",
        isAssigned: assigneesArray.length > 0,
        assignedTo: "Unassigned",
      };
    });

    return {
      data: processedLeads,
      totalPages: result.totalPages || 1,
      totalItems: result.totalItems || processedLeads.length,
      currentPage: result.currentPage || page,
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

export const importLeads = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type for FormData - let browser set it with boundary
      },
      body: formData,
    };

    const response = await fetch(`${API_URL}/import-leads`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to import leads");
    }

    return await response.json();
  } catch (error) {
    console.error("Error importing leads:", error);
    throw error;
  }
};
