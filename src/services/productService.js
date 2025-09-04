import { API_URL } from "./auth";
import { updateLeadStatus } from "./leadService";

// const handleResponse = async (response) => {
//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || "Request failed");
//   }
//   return response.json();
// };
export const createProduct = async (payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/createProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Fix this line
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create product");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Create Product Error:", error);
    throw error;
  }
};

export const fetchAllProducts = async ({ page = 1, limit = 10 }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/getAll?page=${page}&limit=${limit}&status=pending`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch products");
    }

    const result = await response.json();
    return result; // return full object (data, totalItems, totalPages, currentPage)
  } catch (error) {
    throw error.message || "Network error while fetching products";
  }
};

export const convertLeadToSale = async (data) => {
  const token = localStorage.getItem("token");
  try {
    // 1. First convert the lead to sale
    const response = await fetch(`${API_URL}/convertLeadToSale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.message || "Failed to convert lead to sale";

      if (errorMessage.includes("already converted")) {
        throw new Error(
          "This lead has already been converted to a sale. Please refresh the page."
        );
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();

    // 2. Then update the original lead status to 'sold'
    if (result.success) {
      await updateLeadStatus(data.leadId, data.assigneeId, "sold", true);
    }

    return result;
  } catch (error) {
    console.error("API Error in convertLeadToSale:", error);
    throw error;
  }
};
export const fetchSales = async ({
  page = 1,
  limit = 10,
  search = "",
  productType = "",
  status = "",
}) => {
  try {
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams({
      page,
      limit,
      search,
      productType,
      status,
    });

    const response = await fetch(
      `${API_URL}/getAllSales?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch sales");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    throw new Error(error.message || "Network error while fetching sales");
  }
};
export const fetchSaleById = async (id) => {
  try {
    // Validate ID
    if (!id || isNaN(Number(id))) {
      throw new Error("Invalid sale ID");
    }

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/getSalesById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Handle "not found" specifically
      if (response.status === 404) {
        return null; // Return null instead of throwing for "not found"
      }
      throw new Error(errorData.message || "Failed to fetch sale details");
    }

    const data = await response.json();
    return data.data || data; // Handle both {data: ...} and direct responses
  } catch (error) {
    console.error("Error in fetchSaleById:", error);
    throw new Error(`Failed to fetch sale details: ${error.message}`);
  }
};
export const deleteSaleById = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/deleteSalesById/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to delete sale");
  }

  return res.json();
};

export const updateProduct = async (id, payload) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/updateProduct/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update product");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/deleteProduct/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete product");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const getAllSales = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("authUser"));
    const isAdminUser =
      user?.userrole === "admin" || user?.role?.name?.toLowerCase() === "admin";

    let url;
    if (isAdminUser) {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || "",
        productType: params.productType || "",
        status: "converted", // Filter converted on backend
      }).toString();
      url = `${API_URL}/getAllSales?${queryParams}`;
    } else {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        status: "converted", // Filter converted on backend
      }).toString();
      url = `${API_URL}/getSalesByAssigneeId/${user.id}?${queryParams}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sales");
    }

    const data = await response.json();

    // Normalize response format
    return {
      data: data.data || data,
      totalItems: data.totalItems || (Array.isArray(data) ? data.length : 0),
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
    };
  } catch (error) {
    console.error("Error in fetchSales:", error);
    throw error;
  }
};

export const fetchInvoiceByLeadId = async (leadId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/invoice/${leadId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
};
