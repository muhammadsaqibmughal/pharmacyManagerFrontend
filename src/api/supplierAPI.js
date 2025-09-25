import api from "../utils/axiosInstance";

// add supplier
export const addSupplier = async (data) => {
  try {
    const response = await api.post("/supplier/add-supplier",data);
    return response.data;
  } catch (error) {
    console.error("Error Adding Supplier:", error);
    throw new Error(
      error.response?.data?.message || "Failed to Add supplier"
    );
  }
};

export const getSupplier = async () => {
  try {
    const response = await api.get("/supplier/get-suppliers");
    return response.data;
  } catch (error) {
    console.error("Error in fetch pharmacy Supplier:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch pharmacy Supplier"
    );
  }
};