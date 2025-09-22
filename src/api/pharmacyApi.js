import api from "../utils/axiosInstance";

export const managerRegistration = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const managerLogin = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const verifyEmail = async (data) => {
  const response = await api.post("/auth/verify-email", data);
  return response.data;
};

export const pharmacyRegistration = async (data) => {
  const response = await api.post("/pharmacy/register-pharmacy", data);
  console.log(response.status);
  return response.data;
};
