import api from "../utils/axiosInstance";

export const getPOSItems = async () => {
  try {
    const response = await api.get("/inventory/getInventoryByPOS");
    return response.data;
  } catch (error) {
    console.error("Error fetching pharmacy products:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch pharmacy products"
    );
  }
};

export const addSale = async (data) => {
  try {
    const response = await api.post("/sales/add-sale", data, {
      responseType: "arraybuffer",
    });

    return {
      status: "success",
      type: "pdf",
      data: response.data,
    };
  } catch (error) {
    console.log(error.message);
  }
};
export const returnSale = async (data) => {
  try {
    const response = await api.post("/sales/return-sale", data, {
      responseType: "arraybuffer",
    });

    return response.status
  } catch (error) {
    console.log(error.message);
  }
};

export const getSales = async () => {
  try {
    const response = await api.get("/sales/get-sales");
    return response.data;
  } catch (error) {
    console.error("Error fetching pharmacy sales:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch pharmacy sales"
    );
  }
};
