import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTheme } from "../theme-support/ThemeContext";

const ITEM_PER_PAGE = 5;

const SalesReturnDetails = () => {
  const { theme } = useTheme();
  const location = useLocation();

  const { returnData = {} } = location.state || {};
  const { items = [], sale = {}, returnDate } = returnData;
  const [currentPage, setCurrentPage] = useState(1);


  // Pagination
  const totalPages = Math.ceil(items.length / ITEM_PER_PAGE);
  const paginatedItems = items.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  // Calculate total sum of subtotals:
  const totalAmount = items.reduce((acc, item) => {
    const qty = item.saleItem?.quantity || 0;
    const price = item.saleItem?.price || 0;
    return acc + qty * price;
  }, 0);

  return (
    <div
      className={`mt-8 p-10 ${theme === "dark" ? "bg-dark-50" : "bg-light-50"}`}
    >
      {/* Back Button */}
      <div>
        <Link
          to="/pos/sales/salesReturn"
          className="bg-bg-50 hover:bg-selected-50 text-white px-4 py-2 h-10 rounded-full"
        >
          ← Back
        </Link>
      </div>

      {/* Customer Info */}
      <div
        className={`flex flex-col items-center justify-center text-center space-y-2 mt-4 ${
          theme === "dark" ? "text-light-50" : "text-primary-50"
        }`}
      >
        <h1 className="mt-4 border-2 px-6 py-1 text-xl">
          Sales Return Invoice
        </h1>
      </div>

      {/* Contact & Invoice Info */}
      <div className="flex justify-between mt-5 px-5">
        <div
          className={`text-xs space-y-2 ${
            theme === "dark" ? "text-light-50" : "text-primary-50"
          }`}
        >
          <p>
            <b>Invoice No:</b> {sale?.invoiceNo || "N/A"}
          </p>
        </div>
        <div
          className={`text-xs space-y-2 text-right ${
            theme === "dark" ? "text-light-50" : "text-primary-50"
          }`}
        >
          <p>
            <b>Return Date:</b>{" "}
            {returnDate ? new Date(returnDate).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>

      {/* Table */}
      <div
        className={`table-Main mt-5 ${
          theme === "dark"
            ? "border-white/10 bg-white/10"
            : "border-black/10 bg-white/60"
        }`}
      >
        {items.length === 0 ? (
          <p className="text-gray-500 p-4">No return items available.</p>
        ) : (
          <>
            <table
              className={`w-full table-auto ${
                theme === "dark" ? "text-light-50" : "text-primary-50"
              }`}
            >
              <thead className="text-xs text-left h-11 uppercase bg-bg-50 text-white/80">
                <tr
                  className={`border-b ${
                    theme === "dark" ? "border-white/20" : "border-black/20"
                  }`}
                >
                  <th className="px-4 py-2">Product Name</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody className="text-[10px]">
                {paginatedItems.map((item, idx) => {
                  const productName =
                    item.saleItem?.pharmacyProduct?.medicine?.brandName ||
                    "Unknown";
                  const quantity = item.saleItem?.quantity || 0;
                  const price = item.saleItem?.price || 0;
                  const subtotal = quantity * price;

                  return (
                    <tr
                      key={idx}
                      className={`px-4 py-2 text-xs font-medium border-b ${
                        theme === "dark" ? "border-white/40" : "border-black/50"
                      }`}
                    >
                      <td className="px-4 py-2">{productName}</td>
                      <td className="px-4 py-2 font-extrabold">{quantity}</td>
                      <td className="px-4 py-2">{price.toFixed(2)}</td>
                      <td className="px-4 py-2">{subtotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr
                  className={`px-4 py-2 text-xs font-medium border-b ${
                    theme === "dark" ? "border-white/40" : "border-black/50"
                  }`}
                >
                  <td
                    colSpan={3}
                    className="px-4 py-2 text-sm font-medium text-right"
                  >
                    Total
                  </td>
                  <td className="px-4 py-2 text-sm font-medium">
                    {totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Pagination */}
            <div
              className={`flex justify-between items-center px-4 py-3 border-t ${
                theme === "dark"
                  ? "bg-white/20 border-white/20"
                  : "bg-white/10 border-white/20"
              }`}
            >
              <button
                className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-light-50" : "text-primary-50"
                }`}
              >
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
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

export default SalesReturnDetails;
