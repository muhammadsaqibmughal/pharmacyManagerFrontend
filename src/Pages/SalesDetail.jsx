import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../theme-support/ThemeContext";
import { invoices, products } from "../constants"; // adjust path
import { FaSpinner } from "react-icons/fa";

const ITEM_PER_PAGE = 10;

const SalesDetail = () => {
  const { theme } = useTheme();
  const { id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [salesDetail, setSalesDetail] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const matchedInvoice = invoices.find((inv) => inv.id === id);
    setInvoice(matchedInvoice);
  }, [id]);

  const filteredItems = salesDetail.filter((product) =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  const totalLineSum = filteredItems.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0),
    0
  );

  if (!invoice) {
    return (
      <div className="flex items-center w-full min-h-screen justify-center py-4">
        <FaSpinner className="animate-spin text-blue-500 text-5xl" />
      </div>
    );
  }

  return (
    <div
      className={`mt-8 p-10 ${theme === "dark" ? "bg-dark-50" : "bg-light-50"}`}
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

      {/* Invoice Info */}
      <div className="w-full flex justify-center items-center">
        <h1
          className={`text-2xl font-bold w-50 border-2 border-primary-50 text-center  ${
            theme === "dark"
              ? "border-white/90 text-light-50"
              : " border-primary-50  text-primary-50"
          }`}
        >
          Sale Details
        </h1>
      </div>
      <div
        className={`flex justify-between items-center  mt-8 text-sm  mb-6 ${
          theme === "dark" ? "text-light-50" : " text-primary-50"
        }`}
      >
        <div className="space-y-2">
          <p>
            <strong>Invoice No:</strong> {invoice.invoiceNo}
          </p>

          <p>
            <strong>Counter Name:</strong> {invoice.counterName}
          </p>
        </div>
        <div className="space-y-2">
          <p>
            <strong>Payment Mode:</strong> {invoice.paymentMode}
          </p>
          <p>
            <strong>Date:</strong> {invoice.date}
          </p>
        </div>
      </div>

      {/* Search Bar */}
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
        className={`table-Main  ${
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
          <thead className="text-xs text-left h-11 uppercase bg-bg-50 text-white/80">
            <tr
              className={`border-b ${
                theme === "dark" ? " border-white/20" : " border-black/20"
              }`}
            >
              {" "}
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Discount</th>
              <th className="px-4 py-2">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product, idx) => (
              <tr
                key={idx}
                className={` px-4 py-2 text-xs font-medium border-b ${
                  theme === "dark" ? " border-white/40" : " border-black/50"
                }`}
              >
                <td className="px-4 py-2 text-xs font-medium">
                  {product.name}
                </td>
                <td className="px-4 py-2 text-xs font-medium">
                  {product.quantity}
                </td>
                <td className="px-4 py-2 text-xs font-medium">
                  {product.discount || "0%"}
                </td>
                <td className="px-4 py-2 text-xs font-medium">
                  Rs. {product.price}
                </td>
              </tr>
            ))}
            <tr className="font-bold">
              <td colSpan={3} className="px-4 py-3 text-right">
                Net Total:
              </td>
              <td className="px-4 py-3">Rs. {totalLineSum.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Pagination */}
        <div
          className={`flex justify-between items-center px-4 py-3  border-t ${
            theme === "dark"
              ? "bg-white/20 border-white/20"
              : "bg-white/20 border-black/40"
          }`}
        >
          {" "}
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
