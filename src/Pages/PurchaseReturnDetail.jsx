import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTheme } from "../theme-support/ThemeContext";

const ITEM_PER_PAGE = 5;

const PurchaseReturnDetail = () => {
  const { theme } = useTheme();
  const location = useLocation();

  const { items = [], purchase = {} } = location.state || {};

  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(items.length / ITEM_PER_PAGE);
  const paginatedProducts = items.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  const totalLineSum = items.reduce(
    (acc, item) => acc + (parseFloat(item.totalPrice) || 0),
    0
  );

  return (
    <div className={`mt-8 p-10 ${theme === "dark" ? "bg-dark-50" : "bg-light-50"}`}>
      {/* Back Button */}
      <div>
        <Link
          to="/pos/purchase/purchaseReturn"
          className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-2 h-10 rounded-full hover:bg-hf-100"
        >
          ← Back
        </Link>
      </div>

      {/* Supplier Info */}
      <div
        className={`flex flex-col w-full items-center justify-center text-center space-y-2 ${
          theme === "dark" ? "text-light-50" : "text-primary-50"
        }`}
      >
        <h2 className="text-2xl font-bold">{purchase?.supplierName || "Unknown Supplier"}</h2>
        <h1 className="mt-5 border-2 w-50 text-2xl">Return Invoice</h1>
      </div>

      {/* Contact & Invoice Info */}
      <div className="flex justify-between mt-5 px-5 text-xs space-y-2">
        <div className={`${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
          <p><b>Email:</b> {purchase?.supplierEmail || "N/A"}</p>
          <p><b>Phone:</b> {purchase?.supplierPhone || "N/A"}</p>
        </div>
        <div className={`${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
          <p><b>Invoice No:</b> {purchase?.invoiceNo || "N/A"}</p>
          <p><b>Date:</b> {purchase?.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString() : "N/A"}</p>
        </div>
      </div>

      {/* Table */}
      <div className={`table-Main ${theme === "dark" ? "border-white/10 bg-white/10" : "border-black/10 bg-white/60"} mt-5`}>
        {items.length === 0 ? (
          <p className="text-gray-500 p-4">No return records found.</p>
        ) : (
          <>
            <table className={`w-full table-auto ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
              <thead className="text-xs text-left h-11 uppercase bg-bg-50 text-white/80">
                <tr className={`border-b ${theme === "dark" ? "border-white/20" : "border-black/20"}`}>
                  <th className="px-4 py-2">Product Name</th>
                  <th className="px-4 py-2">Generic Name</th>
                  <th className="px-4 py-2">Product Type</th>
                  <th className="px-4 py-2">Returned Qty</th>
                  <th className="px-4 py-2">Cost Price</th>
                  <th className="px-4 py-2">Batch No</th>
                  <th className="px-4 py-2">Expiry</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody className="text-[10px]">
                {paginatedProducts.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`px-4 py-2 text-xs font-medium border-b ${
                      theme === "dark" ? "border-white/40" : "border-black/50"
                    }`}
                  >
                    <td className="px-4 py-2">{item.medicineName || "N/A"}</td>
                    <td className="px-4 py-2">{item.genericName || "N/A"}</td>
                    <td className="px-4 py-2">{item.packagingType || "N/A"}</td>
                    <td className="px-4 py-2 text-warning-50 font-extrabold">{item.quantity}</td>
                    <td className="px-4 py-2">{item.unitPrice}</td>
                    <td className="px-4 py-2">{item.batchNumber || "N/A"}</td>
                    <td className="px-4 py-2">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "N/A"}</td>
                    <td className="px-4 py-2">{item.totalPrice}</td>
                  </tr>
                ))}
                <tr className={`px-4 py-2 text-xs font-medium border-b ${theme === "dark" ? "border-white/40" : "border-black/50"}`}>
                  <td colSpan={7} className="px-4 py-2 text-sm font-medium text-right">Total</td>
                  <td className="px-4 py-2 text-sm font-medium">{totalLineSum.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            {/* Pagination */}
            <div className={`flex justify-between items-center px-4 py-3 border-t ${theme === "dark" ? "bg-white/20 border-white/20" : "bg-white/10 border-white/20"}`}>
              <button
                className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className={`text-sm text-center ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PurchaseReturnDetail;
