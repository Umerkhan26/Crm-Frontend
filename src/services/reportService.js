import { API_URL } from "./auth";
export const getLeadReportByUser = async (userId, period) => {
  try {
    const response = await fetch(
      `${API_URL}/LeadreportByUser?userId=${userId}&period=${period}`
    );
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error("Error fetching lead report by user:", err);
    throw err;
  }
};
