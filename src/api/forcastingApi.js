import api from "../utils/axiosInstance";


export const getForecast = async (payload) => {
  try {
    const response = await api.post("/forecast/predict", payload);
    return response.data;
  } catch (error) {
    console.error("Forecast API error:", error.response?.data || error.message);
    throw error; 
  }
};
