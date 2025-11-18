import api from "../utils/axiosInstance";

// Add new pharmacy product (inventory)
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

// Add stock for a pharmacy product
export const addPharmacyStock = async (data) => {
  try {
    const response = await api.post("/inventory/addPharmacyStock", data);
    return response.data;
  } catch (error) {
    console.error("Error adding pharmacy stock:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add pharmacy stock"
    );
  }
};

// Get all pharmacy products (for inventory management)
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
export const getInventoryByPharmacy = async () => {
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

// Get near-to-expiry products
export const getExpiry = async () => {
  try {
    const response = await api.get("/inventory/getExpiry");
    return response.data;
  } catch (error) {
    console.error("Error fetching near-to-expiry products:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch near-to-expiry products"
    );
  }
};
