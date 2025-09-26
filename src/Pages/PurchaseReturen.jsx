import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../theme-support/ThemeContext";
import { getPurchaseReturns } from "../api/purchaseAPI";

const ITEM_PER_PAGE = 5;

const PurchaseReturn = () => {
  const { theme } = useTheme();

  const [purchaseReturnData, setPurchaseReturnData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Get purchase returns
  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const response = await getPurchaseReturns();
        console.log("Raw response: ", response.data);
        setPurchaseReturnData(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (error) {
        console.log("Error fetching purchase returns:", error.message);
      }
    };
    fetchReturns();
  }, []);

  // Filter by supplier name
  const filteredItems = purchaseReturnData.filter((product) => {
    const term = searchTerm.toLowerCase();
    const supplierName = product.purchase?.supplier?.name?.toLowerCase() || "";
    return supplierName.includes(term);
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );


  return (
    <div
      className={`mt-8 p-10 ${
        theme === "dark" ? "bg-dark-50" : " bg-light-50"
      }`}
    >
      {/* TOP */}
      <div className="flex justify-between max-md:flex-col max-md:gap-2 max-md:justify-center items-center mb-4">
        <h2
          className={`text-2xl ${
            theme === "dark" ? "text-white/90" : " text-primary-50"
          } font-bold`}
        >
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
      <div
        className={`table-Main ${
          theme === "dark"
            ? " border-white/10 bg-white/10"
            : " border-black/10 bg-white/60"
        }`}
      >
        <table
          className={`w-full table-auto ${
            theme === "dark" ? "text-light-50" : " text-primary-50"
          }`}
        >
          <thead className="text-sm text-left h-14 uppercase bg-bg-50 text-white/80">
            <tr
              className={`border-b ${
                theme === "dark" ? " border-white/20" : " border-black/20"
              }`}
            >
              <th className="px-4 py-2">Supplier</th>
              <th className="px-4 py-2">Invoice No</th>
              <th className="px-4 py-2">Purchase Date</th>
              <th className="px-4 py-2">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product, idx) => {
              const supplierName = product.purchase?.supplier?.name || "N/A";
              const invoiceNo = product.purchase?.invoiceNo || "N/A";
              const purchaseDate = product.purchase?.purchaseDate
                ? new Date(product.purchase.purchaseDate).toLocaleDateString()
                : "N/A";

              return (
                <tr
                  key={idx}
                  className={`px-4 py-2 text-xs font-medium border-b ${
                    theme === "dark" ? " border-white/40" : " border-black/50"
                  }`}
                >
                  <td className="px-4 py-2 text-xs font-medium">
                    {console.log("data showing here",JSON.stringify(product.items, null, 2))}
                    <Link
                       to={`/pos/purchase-return/${product.id}`}
                       state={{ items: product.items, purchase: product.purchase }}
                      className="text-blue-400 hover:text-blue-600 hover:underline"
                    >
                      {supplierName}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-xs font-medium">{invoiceNo}</td>
                  <td className="px-4 py-2 text-xs font-medium">
                    {purchaseDate}
                  </td>
                  <td className="px-4 py-2 text-xs font-medium">
                    {product.totalAmount}
                  </td>
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

export default PurchaseReturn;
