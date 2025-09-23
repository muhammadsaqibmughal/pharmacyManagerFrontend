import api from "../utils/axiosInstance";

// add medicine
export const addPackage = async (data) => {
  const response = await api.post("/package/addPackage", data);
  return response.data;
};

// get medicines
export const getPackage = async () => {
  const response = await api.get("/package/getPackage");
  return response.data;
};
