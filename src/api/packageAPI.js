import api from "../utils/axiosInstance";

// add medicine
export const addPackage = async (data) => {
  const response = await api.post("/package/addPackage", data);
  return response;
};

// get packages
export const getPackage = async ({
  page = 1,
  limit = 50,
  search = "",
} = {}) => {
  const response = await api.get("/package/getPackage", {
    params: { page, limit, search },
  });
  return response.data;
};

export const getMedicinesForDropdown = async () => {
  const response = await api.get("/package/getMedicinesForDropDown");
  return response.data.data;
};
