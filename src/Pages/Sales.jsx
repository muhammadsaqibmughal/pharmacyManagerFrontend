import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../theme-support/ThemeContext";
import { getSales } from "../api/posAPI";

const ITEM_PER_PAGE = 5;

const Sales = () => {
  const { theme } = useTheme();

  const [salesData, setSalesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch sales data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesRes = await getSales();
        if (salesRes?.status === "success" && Array.isArray(salesRes.data)) {
          setSalesData(salesRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch sales data:", err);
      }
    };
    fetchData();
  }, []);

  // Filter sales by date or counter name
  const filteredItems = salesData.filter((sales) => {
    console.log(salesData);
    const term = searchTerm.toLowerCase();
    const date = sales?.date?.toString().toLowerCase() || "";
    const counterName = sales?.counterName?.toLowerCase() || "";
    return date.includes(term) || counterName.includes(term);
  });

  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  return (
    <div
      className={`mt-8 p-10 ${theme === "dark" ? "bg-dark-50" : "bg-light-50"}`}
    >
      {/* Header */}
      <div className="flex justify-between max-md:flex-col max-md:gap-2 max-md:justify-center items-center mb-4">
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white/90" : "text-primary-50"
          }`}
        >
          Sales Data
        </h2>
      </div>

      {/* Search */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="date"
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
          <thead className="text-sm text-left h-11 uppercase bg-bg-50 text-white/80">
            <tr
              className={`border-b ${
                theme === "dark" ? "border-white/20" : "border-black/20"
              }`}
            >
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Counter Name</th>
              <th className="px-4 py-2">Invoice No</th>
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Payment Mode</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((sales, idx) => (
                <tr
                  key={idx}
                  className={`text-xs font-medium border-b ${
                    theme === "dark" ? "border-white/40" : "border-black/50"
                  }`}
                >
                  <td className="px-4 py-2">
                    <Link
                      state={{ sale: sales }}
                      to={`/pos/sale-detail/${sales.id}`}
                      className="text-blue-500 hover:text-blue-700 hover:underline"
                    >
                      {new Date(sales.saleDate).toISOString().split("T")[0]}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{sales.counter.counterName}</td>
                  <td className="px-4 py-2">{sales.invoiceNo}</td>
                  <td className="px-4 py-2">{sales.totalAmount}</td>
                  <td className="px-4 py-2">{sales.paymentMode}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-2 text-center text-gray-400">
                  No purchases found
                </td>
              </tr>
            )}
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
            className={`text-sm text-center ${
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

export default Sales;
