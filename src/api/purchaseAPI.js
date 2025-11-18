import api from "../utils/axiosInstance";

// Add purchase
export const addPurchase = async (data) => {
  try {
    const response = await api.post("/purchase/add-purchase", data);
    return response;
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
    return response;
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
    return response;
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
    return response;
  } catch (error) {
    console.error("Error fetching purchase items :", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch purchase items"
    );
  }
};

export const getPurchaseById = async (id) => {
  try {
    const response = await api.get(`/purchase/get-purchase-by-id/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching purchase:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch purchase details"
    );
  }
};

// return a purchase item
export const returnPurchaseItem = async (id, payload) => {
  try {
    const response = await api.post(`/purchase/${id}/return`,payload);
    return response;
  } catch (error) {
    console.error("Error adding Purchase Return Item:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to Add Purchase Return Item"
    );
  }
};

// get all purchase returns
export const getPurchaseReturns= async () => {
  try {
    const response = await api.get(`/purchase/get-purchase-return`);
    return response;
  } catch (error) {
    console.error("Error fetching purchase return :", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch purchase returns"
    );
  }
};

// Get inventory for POS
export const getInventoryByPOS = async () => {
  try {
    const response = await api.get("/inventory/getInventoryByPOS");
    return response;
  } catch (error) {
    console.error("Error fetching POS inventory:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch POS inventory"
    );
  }
};

