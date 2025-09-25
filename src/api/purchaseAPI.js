import api from "../utils/axiosInstance";

// Add purchase
export const addPurchase = async (data) => {
  try {
    const response = await api.post("/purchase/add-purchase", data);
    return response.data;
  } catch (error) {
    console.error("Error adding purchase:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add purchase"
    );
  }
};

// Add item
export const addPurchaseItem = async (data,id) => {
  try {
    const response = await api.post(`/purchase/add-purchase-item/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding purchase item:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add purchase item"
    );
  }
};

// Get purchase
export const getPurchase = async () => {
  try {
    const response = await api.get("/purchase/get-purchase");
    return response.data;
  } catch (error) {
    console.error("Error fetching purchase:", error);
    throw new Error(
      error.response?.data?.message || "Failed to purchase"
    );
  }
};

// Get purchaseItem
export const getPurchaseItems = async (id) => {
  try {
    const response = await api.get(`/purchase/get-purchase-items/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching purchase items :", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch purchase items"
    );
  }
};

// Get inventory for POS
export const getInventoryByPOS = async () => {
  try {
    const response = await api.get("/inventory/getInventoryByPOS");
    return response.data;
  } catch (error) {
    console.error("Error fetching POS inventory:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch POS inventory"
    );
  }
};

// purchase return
export const addReturnPurchaseItem = async () => {
  try {
    const response = await api.get("/inventory/getInventoryByPOS");
    return response.data;
  } catch (error) {
    console.error("Error fetching POS inventory:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch POS inventory"
    );
  }
};
