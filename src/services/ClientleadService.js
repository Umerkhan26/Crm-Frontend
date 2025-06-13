import { API_URL } from "./auth";

export const createClientLead = async (leadData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/createClientLead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create lead");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// export const getAllClientLeads = async (
//   page = 1,
//   limit = 10,
//   orderId = null
// ) => {
//   try {
//     let url = `${API_URL}/getAllClientLeads?page=${page}&limit=${limit}`;
//     if (orderId) {
//       url += `&orderId=${orderId}`;
//     }

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const result = await response.json();
//     if (!result.success) {
//       throw new Error(result.message || "Failed to fetch leads");
//     }

//     return {
//       data: result.data.map((lead) => ({
//         id: lead.id,
//         orderId: lead.order_id,
//         campaignName: lead.campaign?.campaignName || "",
//         leadData: JSON.parse(lead.leadData || "{}"),
//       })),
//       totalItems: result.totalItems,
//       totalPages: result.totalPages,
//       currentPage: result.currentPage,
//     };
//   } catch (error) {
//     console.error("Error in getAllClientLeads:", error);
//     throw new Error(`Error fetching leads: ${error.message}`);
//   }
// };

export const getAllClientLeads = async (
  page = 1,
  limit = 10,
  orderId = null
) => {
  try {
    let url = `${API_URL}/getAllClientLeads?page=${page}&limit=${limit}`;
    if (orderId) {
      url += `&orderId=${orderId}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch leads");
    }

    return {
      data: result.data.map((lead) => ({
        id: lead.id,
        orderId: lead.order_id,
        campaignName: lead.campaign?.campaignName || "",
        leadData: JSON.parse(lead.leadData || "{}"),
        status: lead.status, // Add status field here
      })),
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    };
  } catch (error) {
    console.error("Error in getAllClientLeads:", error);
    throw new Error(`Error fetching leads: ${error.message}`);
  }
};
export const updateClientLead = async (id, updateData) => {
  try {
    const response = await fetch(`${API_URL}/updateClientLead/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on your auth setup
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update client lead");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Error updating client lead");
  }
};

export const getClientLeadById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/getClientLeadById/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const deleteLead = async (id) => {
  try {
    const response = await fetch(`${API_URL}/deleteClientLead/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // if using auth
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete lead");
    }

    return data;
  } catch (error) {
    console.error("Delete lead error:", error);
    throw error;
  }
};

export const updateLeadStatus = async (id, status) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token provided");
    }

    const response = await fetch(`${API_URL}/updateLeadStatus/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // <-- Include the token
      },
      body: JSON.stringify({ status }),
    });

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
