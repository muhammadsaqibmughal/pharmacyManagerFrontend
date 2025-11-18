import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../theme-support/ThemeContext";

const ITEM_PER_PAGE = 10;

const SalesDetail = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const sale = location.state?.sale;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  if (!sale) {
    return (
      <div className="flex items-center w-full min-h-screen justify-center py-4">
        <p className="text-red-500">Sale data not found. Please go back to the Sales page.</p>
      </div>
    );
  }

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toISOString().split("T")[0] : "N/A";

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 2,
    }).format(value || 0);

  const getLineTotal = (item) => {
    const quantity = item.quantity || 0;
    const price = item.unitPrice || 0;
    const discount = item.discount || 0;

    const total = quantity * price;
    const discountAmount = total * (discount / 100);

    return total - discountAmount;
  };

  const filteredItems = (sale.items || []).filter((item) => {
    const name =
      item.pharmacyProduct?.medicine?.brandName ||
      item.pharmacyProduct?.medicine?.genericName ||
      "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  const totalLineSum = filteredItems.reduce(
    (acc, item) => acc + getLineTotal(item),
    0
  );

  return (
    <div
      className={`mt-8 p-10 ${
        theme === "dark" ? "bg-dark-50" : "bg-light-50"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Link
          to="/pos/sales/sales"
          className="bg-bg-50 text-white px-4 py-2 rounded-full hover:bg-selected-50"
        >
          ← Back
        </Link>
      </div>

      {/* Title */}
      <div className="w-full flex justify-center items-center">
        <h1
          className={`text-2xl font-bold w-50 border-2 text-center ${
            theme === "dark"
              ? "border-white/90 text-light-50"
              : "border-primary-50 text-primary-50"
          }`}
        >
          Sale Details
        </h1>
      </div>

      {/* Invoice Info */}
      <div
        className={`flex justify-between items-center mt-8 text-sm mb-6 ${
          theme === "dark" ? "text-light-50" : "text-primary-50"
        }`}
      >
        <div className="space-y-2">
          <p>
            <strong>Invoice No:</strong> {sale.invoiceNo}
          </p>
          <p>
            <strong>Counter Name:</strong>{" "}
            {sale.posCounter?.name || "N/A"}
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <strong>Payment Mode:</strong> {sale.paymentMode}
          </p>
          <p>
            <strong>Date:</strong> {formatDate(sale.createdAt)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search product..."
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div
        className={`table-Main ${
          theme === "dark"
            ? "border-white/10 bg-white/10"
            : "border-black/10 bg-white/60"
        }`}
      >
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
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Discount</th>
              <th className="px-4 py-2">Line Total</th>
            </tr>
          </thead>

          <tbody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item, idx) => {
                const name =
                  item.pharmacyProduct?.medicine?.brandName ||
                  item.pharmacyProduct?.medicine?.genericName ||
                  "Unnamed Product";

                return (
                  <tr
                    key={idx}
                    className={`px-4 py-2 text-xs font-medium border-b ${
                      theme === "dark"
                        ? "border-white/40"
                        : "border-black/50"
                    }`}
                  >
                    <td className="px-4 py-2">{name}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">{item.discount ?? 0}%</td>
                    <td className="px-4 py-2">
                      {formatCurrency(getLineTotal(item))}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-4 text-center text-gray-400"
                >
                  No products found
                </td>
              </tr>
            )}

            {/* Total */}
            <tr className="font-bold">
              <td colSpan={3} className="px-4 py-3 text-right">
                Net Total:
              </td>
              <td className="px-4 py-3">
                {formatCurrency(totalLineSum)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Pagination */}
        <div
          className={`flex justify-between items-center px-4 py-3 border-t ${
            theme === "dark"
              ? "bg-white/20 border-white/20"
              : "bg-white/20 border-black/40"
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
      </div>
    </div>
  );
};

export default SalesDetail;
