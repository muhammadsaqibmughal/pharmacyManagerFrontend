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

    const contentType = response.headers["content-type"] || "";

    if (contentType.includes("application/pdf")) {
      return {
        status: "success",
        type: "pdf",
        data: response.data,
      };
    }

    if (contentType.includes("application/json")) {
      const decoder = new TextDecoder("utf-8");
      const jsonString = decoder.decode(new Uint8Array(response.data));
      return JSON.parse(jsonString);
    }

    throw new Error("Unsupported response type");
  } catch (error) {
    console.log(error.message);
  }
};
