import api from "../utils/axiosInstance";

/**
 * payload example:
 * {
 *   medicine: ["Panadol", "Brufen"],
 *   days_ahead: 7,
 *   prediction_date: "2025-01-01",
 *   pharmacy_name: "My Pharmacy"
 * }
 */
export const getForecast = async (payload) => {
  try {
    const response = await api.post("/forecast/predict", payload);
    return response.data;
  } catch (error) {
    console.error("Forecast API error:", error.response?.data || error.message);
    throw error; // let the component handle the error
  }
};
