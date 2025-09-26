import api from "../utils/axiosInstance";

//create counter
export const createCounter = async (data) => {
  try {
    const response = await api.post("/counter/create-counter", data);
    return response.data;
  } catch (error) {
    console.error("Error adding counter:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add counter"
    );
  }
};
export const getCounterList = async () => {
  try {
    const response = await api.get("/counter/get-counter");
    return response.data;
  } catch (error) {
    console.error("Error getting counter list:", error);
    throw new Error(
      error.response?.data?.message || "Failed to get counter list"
    );
  }
};