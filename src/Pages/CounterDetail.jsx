import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../theme-support/ThemeContext";

const ITEM_PER_PAGE = 10;

const CounterDetail = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Counter from previous page
  const counter = location.state?.counter;

  if (!counter) {
    return (
      <div className="p-6 text-white">
        Counter data not found!{" "}
        <button onClick={() => navigate(-1)} className="underline text-blue-400">
          Go Back
        </button>
      </div>
    );
  }

  // FIXED: correct field name
  const counterName = counter.name || "Unnamed Counter";

  const sales = counter.sales || [];

  // Filter by invoice or date
  const filteredSales = sales.filter((sale) => {
    const date = sale.createdAt?.slice(0, 10) || "";
    return (
      sale.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      date.includes(searchTerm)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredSales.length / ITEM_PER_PAGE);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  return (
    <div className={`mt-8 p-10 ${theme === "dark" ? "bg-dark-50" : "bg-light-50"}`}>
      
      {/* Back Button */}
      <div className="flex justify-between gap-2 items-center mb-2">
        <div className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-2 h-10 rounded-full hover:bg-hf-100">
          <button onClick={() => navigate(-1)} className="text-sm text-primary-50">
            ← Back
          </button>
        </div>
      </div>

      {/* Title */}
      <h2
        className={`text-2xl font-bold mb-4 ${
          theme === "dark" ? "text-white/90" : "text-primary-50"
        }`}
      >
        All Sales for {counterName}
      </h2>

      {/* Search */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search by Invoice No or Date..."
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm rounded-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sales Table */}
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
          <thead className="text-sm text-left uppercase bg-bg-50 text-white/80">
            <tr
              className={`border-b ${
                theme === "dark" ? "border-white/20" : "border-black/20"
              }`}
            >
              <th className="px-4 py-2">Invoice No</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Total Items</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSales.map((sale, idx) => {
              const saleDate = sale.createdAt
                ? sale.createdAt.slice(0, 10)
                : "N/A";

              return (
                <tr
                  key={idx}
                  className={`px-4 py-2 text-xs font-medium border-b ${
                    theme === "dark" ? "border-white/40" : "border-black/50"
                  }`}
                >
                  <td className="px-4 py-2">
                    <Link
                      to={`/pos/counter-sale-detail/`}
                      state={{
                        sales: sale.items,
                        counterName: counterName,
                        date: saleDate,
                      }}
                      className="text-blue-300 hover:text-blue-500 hover:underline"
                    >
                      {sale.invoiceNo || "N/A"}
                    </Link>
                  </td>

                  <td className="px-4 py-2">{saleDate}</td>
                  <td className="px-4 py-2">{sale.items?.length || 0}</td>
                </tr>
              );
            })}
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

          <span className="text-sm text-gray-300">
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

export default CounterDetail;
