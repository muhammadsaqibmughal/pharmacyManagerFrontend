import api from "../utils/axiosInstance";

// ==================== GET POS INVENTORY ====================
export const getPOSItems = async () => {
  try {
    console.log("Fetching POS items...");
    const response = await api.get("/inventory/getInventoryByPOS");
    console.log("POS items fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching POS items:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch POS inventory");
  }
};

// ==================== GET ALL SALES ====================
export const getSales = async () => {
  try {
    console.log("Fetching sales...");
    const response = await api.get("/sales/get-sales");
    console.log("Sales fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch sales");
  }
};

// ==================== CREATE NEW SALE ====================
export const addSale = async (data) => {
  try {
    console.log("=== CREATING NEW SALE ===");
    console.log("Payload being sent:", JSON.stringify(data, null, 2));

    // Validate payload
    if (!data.counterId) {
      throw new Error("Counter ID is required");
    }
    if (!data.paymentMode) {
      throw new Error("Payment mode is required");
    }
    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new Error("At least one item is required");
    }

    // Validate each item
    for (const item of data.items) {
      if (!item.pharmacyProductId) {
        throw new Error("Product ID is missing in item");
      }
      if (!item.quantity || item.quantity < 1) {
        throw new Error("Valid quantity is required for each item");
      }
      if (item.price === undefined || item.price < 0) {
        throw new Error("Valid price is required for each item");
      }
    }

    // Send POST request
    const response = await api.post("/sales/add-sale", data, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Sale created successfully, status:", response.status);

    // Convert arraybuffer to blob and create PDF
    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    // Open PDF in new window
    const win = window.open(fileURL, "_blank");
    if (win) {
      win.focus();
      setTimeout(() => {
        try {
          win.print();
        } catch (e) {
          console.warn("Print dialog error:", e);
        }
      }, 500);
    } else {
      console.warn("Popup blocked - PDF not opened");
    }

    return {
      status: "success",
      type: "pdf",
      data: fileURL,
      statusCode: response.status,
      message: "Sale created successfully",
    };
  } catch (error) {
    console.error("=== SALE CREATION ERROR ===");
    console.error("Error object:", error);
    console.error("Error message:", error.message);

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);

      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Server error occurred";

      return {
        status: "error",
        message: errorMessage,
        statusCode: error.response.status,
        type: "server",
      };
    } else if (error.request) {
      // Request made but no response
      console.error("No response received:", error.request);
      return {
        status: "error",
        message:
          "No response from server. Ensure backend is running on http://localhost:5002",
        statusCode: 0,
        type: "network",
      };
    } else if (error.message) {
      // Validation error
      console.error("Validation/Setup error:", error.message);
      return {
        status: "error",
        message: error.message,
        statusCode: null,
        type: "validation",
      };
    } else {
      // Unknown error
      return {
        status: "error",
        message: "An unknown error occurred",
        statusCode: null,
        type: "unknown",
      };
    }
  }
};

// ==================== RETURN SALE ====================
export const returnSale = async (data) => {
  try {
    console.log("=== PROCESSING RETURN ===");
    console.log("Payload being sent:", JSON.stringify(data, null, 2));

    // Validate payload
    if (!data.saleId) {
      throw new Error("Sale ID is required");
    }
    if (data.totalAmount === undefined || data.totalAmount < 0) {
      throw new Error("Valid total amount is required");
    }
    if (!Array.isArray(data.returnItems) || data.returnItems.length === 0) {
      throw new Error("At least one item to return is required");
    }

    // Validate each return item
    for (const item of data.returnItems) {
      if (!item.saleItemId) {
        throw new Error("Sale Item ID is missing in return item");
      }
      if (!item.quantity || item.quantity < 1) {
        throw new Error("Valid quantity is required for each return item");
      }
    }

    // Send POST request
    const response = await api.post("/sales/return-sale", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Return processed successfully, status:", response.status);
    console.log("Response data:", response.data);

    return {
      status: "success",
      message: "Return processed successfully",
      data: response.data,
      statusCode: response.status,
    };
  } catch (error) {
    console.error("=== RETURN PROCESSING ERROR ===");
    console.error("Error object:", error);
    console.error("Error message:", error.message);

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);

      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Server error occurred";

      return {
        status: "error",
        message: errorMessage,
        statusCode: error.response.status,
        type: "server",
      };
    } else if (error.request) {
      // Request made but no response
      console.error("No response received:", error.request);
      return {
        status: "error",
        message:
          "No response from server. Ensure backend is running on http://localhost:5002",
        statusCode: 0,
        type: "network",
      };
    } else if (error.message) {
      // Validation error
      console.error("Validation/Setup error:", error.message);
      return {
        status: "error",
        message: error.message,
        statusCode: null,
        type: "validation",
      };
    } else {
      // Unknown error
      return {
        status: "error",
        message: "An unknown error occurred",
        statusCode: null,
        type: "unknown",
      };
    }
  }
};

// ==================== GET RETURN SALES ====================
export const getReturnSales = async () => {
  try {
    console.log("Fetching return sales...");
    const response = await api.get("/sales/get-returns");
    console.log("Return sales fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching return sales:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch return sales");
  }
};

// ==================== CREATE MANAGER SALE ====================
export const addManagerSale = async (data) => {
  try {
    console.log("Creating manager sale with payload:", JSON.stringify(data, null, 2));

    const response = await api.post("/sales/add-manager-sale", data, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    const win = window.open(fileURL, "_blank");
    if (win) {
      win.focus();
      setTimeout(() => {
        try {
          win.print();
        } catch (e) {
          console.warn("Print dialog error:", e);
        }
      }, 500);
    }

    return {
      status: "success",
      type: "pdf",
      data: fileURL,
      statusCode: response.status,
      message: "Manager sale created successfully",
    };
  } catch (error) {
    console.error("Manager sale creation error:", error);

    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Server error occurred";
      return {
        status: "error",
        message: errorMessage,
        statusCode: error.response.status,
        type: "server",
      };
    } else if (error.request) {
      return {
        status: "error",
        message:
          "No response from server. Ensure backend is running on http://localhost:5002",
        statusCode: 0,
        type: "network",
      };
    } else {
      return {
        status: "error",
        message: error.message,
        statusCode: null,
        type: "validation",
      };
    }
  }
};