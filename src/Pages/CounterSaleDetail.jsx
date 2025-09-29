import { useLocation, Link,useNavigate } from "react-router-dom";
import { useTheme } from "../theme-support/ThemeContext";
import { useState } from "react";

const ITEM_PER_PAGE = 10;

const CounterSaleDetail = () => {
  const { theme } = useTheme();
  const location = useLocation();

  // Sale data passed via state from previous page
  const { sales = [], counterName, date } = location.state || {};

  const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
  

  if (!sales || sales.length === 0) {
    return (
      <div className="p-6 text-white">
        No sale items found!{" "}
        <Link onClick={() => navigate(-1)}  className="underline text-blue-400">
          Go Back
        </Link>
      </div>
    );
  }

  const sale = sales; 
  const totalPages = Math.ceil(sale.length / ITEM_PER_PAGE);
  const paginatedItems = sale.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  const totalPrice = sale.reduce((sum, item) => sum + (item.price || 0), 0);
  const staffUser = sale[0]?.createdBy || {};

  return (
    <div className={`mt-8 p-10 ${theme === "dark" ? "bg-dark-50" : "bg-light-50"}`}>
      {/* Back Button */}
      <div className="flex justify-between gap-2 items-center mb-4">
        <div className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-2 h-10 rounded-full hover:bg-hf-100">
          <Link onClick={() => navigate(-1)}  className="text-sm text-primary-50">
            ← Back
          </Link>
        </div>
      </div>

      {/* Sale Info */}
      <div className={`mb-6 ${theme === "dark" ? "text-white/90" : "text-primary-50"}`}>
        <h2 className="text-2xl font-bold">{counterName}</h2>
        <p>Date: {new Date(date).toISOString().slice(0, 10)}</p>
      </div>

      {/* Items Table */}
      <div className={`table-Main ${theme === "dark" ? "border-white/10 bg-white/10" : "border-black/10 bg-white/60"}`}>
        <table className={`w-full table-auto ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
          <thead className="text-sm text-left uppercase bg-bg-50 text-white/80">
            <tr className={`border-b ${theme === "dark" ? "border-white/20" : "border-black/20"}`}>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {paginatedItems.map((item, idx) => (
              <tr key={idx} className={`px-4 py-2 text-xs font-medium border-b ${theme === "dark" ? "border-white/40" : "border-black/50"}`}>
                <td className="px-4 py-2">{item?.pharmacyProduct?.medicine?.brandName || "Unknown"}</td>
                <td className="px-4 py-2">{item.quantity || 0}</td>
                <td className="px-4 py-2">{item.price || 0}</td>
              </tr>
            ))}
            <tr className="text-[11px] font-bold">
              <td className="px-4 py-2">Total</td>
              <td></td>
              <td className="px-4 py-2">{totalPrice}</td>
            </tr>
          </tbody>
        </table>

        {/* Pagination Controls */}
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

export default CounterSaleDetail;
