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
      responseType: "blob", // Expect PDF response
    });

    // Check if the response is a PDF
    const contentType = response.headers["content-type"];
    if (contentType === "application/pdf") {
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${Date.now()}.pdf`; // you can dynamically set name
      a.click();

      window.URL.revokeObjectURL(url); // Clean up
    } else {
      throw new Error("Unexpected response type.");
    }

    return { status: "success" }; // you can return more if needed
  } catch (error) {
    console.error("❌ Error creating sale:", error);

    // Try to extract backend error message
    if (error.response?.data instanceof Blob) {
      const errorText = await error.response.data.text();
      try {
        const parsed = JSON.parse(errorText);
        throw new Error(parsed.message || "Sale failed.");
      } catch {
        throw new Error(errorText || "Sale failed.");
      }
    }

    throw new Error(error.response?.data?.message || "Failed to create sale.");
  }
};
