import api from "../utils/axiosInstance";



// get month wise sales
export const getMonthlySales = async () => {
  try {
    const response = await api.get("/dashboard/get-monthly-sales");
    return response.data;
  } catch (error) {
    console.error("Error getting monthly sales:", error);
    throw new Error(
      error.response?.data?.message
    );
  }
};

export const getMostSaleProducts = async () => {
  try {
    const response = await api.get("/dashboard/get-most-sale-products");
    return response.data;
  } catch (error) {
    console.error("Error getting in most sales products:", error);
    throw new Error(
      error.response?.data?.message
    );
  }
};

export const getWeeklySales = async () => {
  try {
    const response = await api.get("/dashboard/get-weekly-sales");
    return response.data;
  } catch (error) {
    console.error("Error getting in weekly sales:", error);
    throw new Error(
      error.response?.data?.message
    );
  }
};

export const getTotalProduct = async () => {
  try {
    const response = await api.get("/dashboard/get-total-products");
    return response;
  } catch (error) {
    console.error("Error getting in total products:", error);
    throw new Error(
      error.response?.data?.message
    );
  }
};

export const getTotalReturn = async () => {
  try {
    const response = await api.get("/dashboard/get-total-returns");
    return response.data;
  } catch (error) {
    console.error("Error getting in total Returns:", error);
    throw new Error(
      error.response?.data?.message
    );
  }
};

export const getTotalSales = async () => {
  try {
    const response = await api.get("/dashboard/get-total-sales");
    return response;
  } catch (error) {
    console.error("Error getting in total Sales:", error);
    throw new Error(
      error.response?.data?.message
    );
  }
};
