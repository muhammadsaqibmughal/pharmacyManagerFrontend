import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../theme-support/ThemeContext";
import { getPurchaseReturns } from "../api/purchaseAPI";

const ITEM_PER_PAGE = 5;

const PurchaseReturen = () => {
  const { theme } = useTheme();

  const [purchaseReturnData, setPurchaseReturnData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch purchase returns
  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const response = await getPurchaseReturns();
        console.log(response);
        setPurchaseReturnData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching purchase returns:", error.message);
      }
    };
    fetchReturns();
  }, []);

  // Filter by supplier name
  const filteredItems = purchaseReturnData.filter((product) =>
    (product.supplierName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  return (
    <div className={`mt-8 p-10 ${theme === "dark" ? "bg-dark-50" : "bg-light-50"}`}>
      {/* Header */}
      <div className="flex justify-between max-md:flex-col max-md:gap-2 max-md:justify-center items-center mb-4">
        <h2 className={`text-2xl ${theme === "dark" ? "text-white/90" : "text-primary-50"} font-bold`}>
          Purchase Return Data
        </h2>
      </div>

      {/* Search Bar */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search by supplier name..."
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className={`table-Main ${theme === "dark" ? "border-white/10 bg-white/10" : "border-black/10 bg-white/60"}`}>
        <table className={`w-full table-auto ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
          <thead className="text-sm text-left h-14 uppercase bg-bg-50 text-white/80">
            <tr className={`border-b ${theme === "dark" ? "border-white/20" : "border-black/20"}`}>
              <th className="px-4 py-2">Supplier</th>
              <th className="px-4 py-2">Invoice No</th>
              <th className="px-4 py-2">Purchase Date</th>
              <th className="px-4 py-2">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product, idx) => {
                const supplierName = product.supplier.name || "N/A";
                const invoiceNo = product.purchaseInfo.invoiceNo || "N/A";
                const purchaseDate = product.purchaseInfo.purchaseDate
                  ? new Date(product.purchaseInfo.purchaseDate).toLocaleDateString()
                  : "N/A";

                return (
                  <tr
                    key={idx}
                    className={`px-4 py-2 text-xs font-medium border-b ${
                      theme === "dark" ? "border-white/40" : "border-black/50"
                    }`}
                  >
                    <td className="px-4 py-2 text-xs font-medium">
                      <Link
                        to={`/pos/purchase-return/${product.id}`}
                        state={{ items: product.items, purchase: product }}
                        className="text-blue-400 hover:text-blue-600 hover:underline"
                      >
                        {supplierName}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-xs font-medium">{invoiceNo}</td>
                    <td className="px-4 py-2 text-xs font-medium">{purchaseDate}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.totalAmount}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center text-gray-400">
                  No purchase returns found
                </td>
              </tr>
            )}
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

export default PurchaseReturen;
