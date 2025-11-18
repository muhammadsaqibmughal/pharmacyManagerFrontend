import api from "../utils/axiosInstance";

// add medicine
export const addProduct = async (data) => {
  const response = await api.post("/medicine/addMedicine", data);
  return response.data;
};

// get medicines
export const getProduct = async ({ page = 1, limit = 50, search = "" }) => {
  const response = await api.get("/medicine/getMedicine", {
    params: { page, limit, search },
  });
  return response.data; 
};

