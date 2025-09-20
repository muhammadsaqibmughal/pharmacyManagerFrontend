import api from "../utils/axiosInstance";

export const managerRegistration = async (data) => {
  const response = await api.post(
    "http://localhost:5000/api/auth/register",
    data
  );
  return response.data;
};

export const managerLogin = async (data) => {
  const response = await api.post("http://localhost:5000/api/auth/login", data);
  return response.data;
};

export const verifyEmail = async (data) => {
  const response = await api.post("http://localhost:5000/api/auth/verify-email", data);
  return response.data;
};
