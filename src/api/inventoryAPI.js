import api from "../utils/axiosInstance";

// Add inventory
export const addPharmacyProduct = async (data) => {
  try {
    const response = await api.post("/inventory/addPharmacyProduct", data);
    return response.data;
  } catch (error) {
    console.error("Error adding pharmacy product:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add pharmacy product"
    );
  }
};

// Add stock
export const addStock = async (data) => {
  try {
    const response = await api.post("/inventory/addPharmacyStock", data);
    return response.data;
  } catch (error) {
    console.error("Error adding stock:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add pharmacy stock"
    );
  }
};

// Get inventory (all products in pharmacy)
export const getPharmacyProduct = async () => {
  try {
    const response = await api.get("/inventory/getPharmacyProduct");
    return response.data;
  } catch (error) {
    console.error("Error fetching pharmacy products:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch pharmacy products"
    );
  }
};

// Get inventory by pharmacy
export const getAllPharmacyProduct = async () => {
  try {
    const response = await api.get("/inventory/getInventoryByPharmacy");
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory by pharmacy:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch inventory by pharmacy"
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
