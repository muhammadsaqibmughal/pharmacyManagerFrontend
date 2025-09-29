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

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    return {
      status: "success",
      type: "pdf",
      data: fileURL, 
    };
  } catch (error) {
    console.log(error.message);
    return { status: "error", message: error.message };
  }
};


export const addManagerSale = async (data) => {
  try {
    const response = await api.post("/sales/add-manager-sale", data, {
      responseType: "arraybuffer",
    });

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    return {
      status: "success",
      type: "pdf",
      data: fileURL, 
    };
  } catch (error) {
    console.log(error.message);
    return { status: "error", message: error.message };
  }
};

export const returnSale = async (data) => {
  try {
    const response = await api.post("/sales/return-sale", data);

    return response.data;
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

export const getReturns = async () => {
  try {
    const response = await api.get("/sales/get-returns");
    return response.data;
  } catch (error) {
    console.error("Error fetching pharmacy return sales:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch pharmacy return sales"
    );
  }
};