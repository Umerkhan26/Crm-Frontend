import { API_URL } from "./auth";

export const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You are not authenticated. Please log in.");
  }
  return token;
};

// Fetch all campaigns
export const fetchCampaigns = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/getAllCampaigns`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch campaigns.");
    }
    const groupedCampaigns = result.groupedCampaigns || {};
    const campaignNames = Object.keys(groupedCampaigns);
    if (campaignNames.length === 0) {
      throw new Error("No campaigns found in the response.");
    }

    const options = campaignNames
      .map((name) => {
        const fields = groupedCampaigns[name];
        if (!fields || fields.length === 0) {
          return null;
        }
        return {
          value: fields[0].id,
          label: name,
        };
      })
      .filter((option) => option !== null);

    if (options.length === 0) {
      throw new Error("No valid campaigns found in the response.");
    }

    return options;
  } catch (error) {
    throw new Error(`Error fetching campaigns: ${error.message}`);
  }
};
// Create a new order
export const createOrder = async (payload) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/createOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create order.");
    }

    return result;
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};

export const fetchAllOrders = async (page = 1, limit = 10, search = "") => {
  try {
    const token = getAuthToken();
    const response = await fetch(
      `${API_URL}/orders?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch orders");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    throw error;
  }
};

export const updateOrder = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update order");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const setOrderBlockStatus = async (orderId, blockStatus) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/orders/${orderId}/block-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ block: blockStatus }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update block status");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "An error occurred");
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Check for MySQL foreign key error
      if (
        errorData.message &&
        errorData.message.includes("foreign key constraint fails")
      ) {
        throw new Error("Cannot delete order — it is linked to a lead.");
      }

      throw new Error(errorData.message || "Failed to delete order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting order:", error.message);
    throw error;
  }
};

export const importClientLeads = async (file, orderId, mappedData) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("order_id", orderId);
  formData.append("mappedData", JSON.stringify(mappedData));

  console.log("Data sent from frontend:");
  console.log("order_id:", orderId);
  console.log("file:", file);
  console.log("mappedData:", mappedData);
  console.log("FormData entries:");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const response = await fetch(`${API_URL}/client-leads/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await response.json();
    console.log("Backend response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to import leads");
    }

    return data;
  } catch (error) {
    console.error("Import client leads error:", error);
    throw new Error(error.message || "Something went wrong during import");
  }
};

export const fetchVendorsAndClients = async (search = "") => {
  try {
    const response = await fetch(
      `${API_URL}/get-vendors-clients?search=${search}&limit=100`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching vendors and clients:", error);
    throw error;
  }
};

export const fetchOrdersByVendorId = async (
  vendorId,
  page = 1,
  limit = 10,
  search = ""
) => {
  try {
    const token = getAuthToken();
    const response = await fetch(
      `${API_URL}/getOrderByVendorId/${vendorId}?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch vendor orders");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching vendor orders:", error.message);
    throw error;
  }
};

export const fetchOrdersByClientId = async (
  clientId,
  page = 1,
  limit = 10,
  search = ""
) => {
  try {
    const token = getAuthToken();
    const response = await fetch(
      `${API_URL}/getOrderByClientId/${clientId}?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch client orders");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching client orders:", error.message);
    throw error;
  }
};
