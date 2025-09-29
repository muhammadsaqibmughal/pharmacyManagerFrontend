import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../theme-support/ThemeContext";
import { getReturns } from "../api/posAPI";

const ITEMS_PER_PAGE = 5;

const SalesReturn = () => {
  const { theme } = useTheme();
  const [salesReturnData, setSalesReturnData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch sales returns
  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const response = await getReturns();
        console.log("Fetched Sales Returns:", response.data);
        setSalesReturnData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching sales returns:", error.message);
      }
    };
    fetchReturns();
  }, []);

  // Filter by invoice number
  const filteredReturns = salesReturnData.filter((entry) => {
    const term = searchTerm.toLowerCase();
    const invoice = entry.sale?.invoiceNo?.toLowerCase() || "";
    return invoice.includes(term);
  });

  const totalPages = Math.ceil(filteredReturns.length / ITEMS_PER_PAGE);
  const paginatedReturns = filteredReturns.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className={`mt-8 p-10 ${theme === "dark" ? "bg-dark-50" : "bg-light-50"}`}>
      {/* Header */}
      <div className="flex justify-between max-md:flex-col max-md:gap-2 max-md:justify-center items-center mb-4">
        <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white/90" : "text-primary-50"}`}>
          Sales Return Records
        </h2>
      </div>

      {/* Search */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search by Invoice No..."
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div
        className={`table-Main ${
          theme === "dark" ? "border-white/10 bg-white/10" : "border-black/10 bg-white/60"
        }`}
      >
        <table className={`w-full table-auto ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
          <thead className="text-sm text-left h-14 uppercase bg-bg-50 text-white/80">
            <tr className={`border-b ${theme === "dark" ? "border-white/20" : "border-black/20"}`}>
              <th className="px-4 py-2">Invoice No</th>
              <th className="px-4 py-2">Return Date</th>
              <th className="px-4 py-2">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReturns.map((returnItem, idx) => {
              const returnId = returnItem.id;
              const invoiceNo = returnItem.sale?.invoiceNo || "N/A";
              const returnDate = returnItem.returnDate
                ? new Date(returnItem.returnDate).toLocaleDateString()
                : "N/A";
              const totalAmount = returnItem.totalAmount;

              return (
                <tr
                  key={idx}
                  className={`text-xs font-medium border-b ${
                    theme === "dark" ? "border-white/40" : "border-black/50"
                  }`}
                >
                  <td className="px-4 py-2">
                    <Link
                      to={`/pos/sales/salesReturn/${returnId}`}
                      state={{ returnData: returnItem }}
                      className="text-blue-400 hover:text-blue-600 hover:underline"
                    >
                      {invoiceNo}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{returnDate}</td>
                  <td className="px-4 py-2">{totalAmount}</td>
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
          <span className="text-sm text-gray-400">
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
      </div>
    </div>
  );
};

export default SalesReturn;
