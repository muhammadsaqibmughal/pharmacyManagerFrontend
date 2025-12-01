import api from "./api"; 

// Get all pharmacies
export const getAllPharmacies = async () => {
  try {
    const response = await api.get("/pharmacyApp/get-all-pharmacies");
    return response.data;
  } catch (error) {
    console.error("Error getting pharmacy list:", error);
    throw new Error(error.response?.data?.message);
  }
};

//Get medicines by user location (lat, long → params)
export const getMedicinesByLocation = async (lat, long) => {
  try {
    const response = await api.get(
      `/pharmacyApp/get-medicines-by-location/${lat}/${long}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting medicines:", error);
    throw new Error(error.response?.data?.message);
  }
};

// Get specific pharmacy by ID
export const getSpecificPharmacy = async (pharmacyId) => {
  try {
    const response = await api.get(
      `/pharmacyApp/get-specific-pharmacy/${pharmacyId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting specific pharmacy:", error);
    throw new Error(error.response?.data?.message);
  }
};

// Get top products
export const getTopProducts = async () => {
  try {
    const response = await api.get("/pharmacyApp/get-top-products");
    return response.data;
  } catch (error) {
    console.error("Error getting top products:", error);
    throw new Error(error.response?.data?.message);
  }
};
