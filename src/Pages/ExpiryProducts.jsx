import { useState, useEffect } from "react";
import { useTheme } from "../theme-support/ThemeContext";
import dayjs from "dayjs";
import { getExpiry } from "../api/inventoryAPI";

const ITEM_PER_PAGE = 8;

const ExpiryProducts = () => {
  const { theme } = useTheme();

  const [expiryData, setExpiryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getExp = async () => {
      try {
        setLoading(true);
        const data = await getExpiry(); 
        console.log(data.data);
        setExpiryData(Array.isArray(data.data) ? data.data : []);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch expiry data.");
      } finally {
        setLoading(false);
      }
    };
    getExp();
  }, []);

  // Search filter
  const filteredItems = expiryData.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.brandName.toLowerCase().includes(term) ||
      product.genericName.toLowerCase().includes(term)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Format date
  const formatDate = (date) => dayjs(date).format("DD MMM YYYY");

  // Calculate days left
  const getDaysLeft = (expiryDate) => {
    const days = dayjs(expiryDate).diff(dayjs(), "day");
    return days < 0 ? "Expired" : days;
  };

  return (
    <div
      className={`mt-8 p-10 ${
        theme === "dark" ? "bg-dark-50" : "bg-light-50"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between max-md:flex-col max-md:gap-2 max-md:justify-center items-center mb-4">
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white/90" : "text-primary-50"
          }`}
        >
          Near Expiry Products
        </h2>
      </div>

      {/* Search */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search by brand or generic name..."
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
        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-6">{error}</p>
        ) : (
          <table
            className={`w-full table-auto ${
              theme === "dark" ? "text-light-50" : "text-primary-50"
            }`}
          >
            <thead className="text-sm text-left uppercase h-11 bg-bg-50 text-white/80">
              <tr
                className={`border-b ${
                  theme === "dark" ? "border-white/20" : "border-black/20"
                }`}
              >
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Expiry Date</th>
                <th className="px-4 py-2">Days Left</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-sm py-6 text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product, idx) => (
                  <tr
                    key={idx}
                    className={`px-4 py-2 text-xs font-medium border-b ${
                      theme === "dark" ? "border-white/40" : "border-black/50"
                    }`}
                  >
                    <td className="px-4 py-2">
                      <div className="font-semibold">{product.brandName}</div>
                      <div className="text-xs text-gray-400">{product.genericName}</div>
                    </td>
                    <td className="px-4 py-2">{product.totalQuantity}</td>
                    <td className="px-4 py-2">{formatDate(product.earliestExpiry)}</td>
                    <td
                      className={`px-4 py-2 ${
                        getDaysLeft(product.earliestExpiry) === "Expired"
                          ? "text-red-500 font-bold"
                          : ""
                      }`}
                    >
                      {getDaysLeft(product.earliestExpiry)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && !error && filteredItems.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default ExpiryProducts;
