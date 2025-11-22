import api from "../utils/axiosInstance";

export const managerRegistration = async (data) => {
  return await api.post("/auth/register", data); 
};


export const managerLogin = async (data) => {
  return await api.post("/auth/login", data);
  
};

export const managerForget = async (data) => {
  return await api.post("/auth/reset-password-link", data);
  
};

export const managerResetPassword = (id, token, password) => {
  return api.post(`/auth/reset-password/${id}/${token}`, { password });
};


export const verifyEmail = async (data) => {
  const response = await api.post("/auth/verify-email", data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.post("/auth/change-password", data);
  return response.data;
};

export const pharmacyRegistration = async (data) => {
  return await api.post("/pharmacy/register-pharmacy", data);
  
};
