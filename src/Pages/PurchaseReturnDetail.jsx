import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { users, purchaseDataa } from "../constants";
import { useTheme } from "../theme-support/ThemeContext";

const ITEM_PER_PAGE = 5;

const PurchaseReturnDetail = () => {
  const { theme } = useTheme();

  const { supplierName } = useParams();
  const decodedSupplier = decodeURIComponent(supplierName);

  const supplierInfo = users.find((user) => user.supplier === decodedSupplier);
  const supplierPurchases = purchaseDataa.filter(
    (item) => item.supplier === decodedSupplier
  );

  const [allReturnedProducts, setAllReturnedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const returnData = JSON.parse(
      localStorage.getItem("purchaseReturns") || "[]"
    );
    const filteredReturns = returnData.filter(
      (item) => item.supplier === decodedSupplier
    );
    setAllReturnedProducts(filteredReturns);
  }, [decodedSupplier]);

  // Filter and paginate
  const filteredItems = allReturnedProducts.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  const totalLineSum = filteredItems.reduce(
    (acc, item) => acc + (parseFloat(item.lineTotal) || 0),
    0
  );

  return (
    <div
      className={`mt-8 p-10 ${
        theme === "dark" ? "bg-dark-50" : " bg-light-50"
      }`}
    >
      {" "}
      {/* Back Button */}
      <div>
        <Link
          to="/pos/purchase/purchaseReturn"
          className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-2 h-10 rounded-full hover:bg-hf-100"
        >
          ← Back
        </Link>
      </div>
      {/* Supplier Info */}
      <div
        className={`flex flex-col w-full items-center justify-center text-center space-y-2 ${
          theme === "dark" ? "text-light-50" : " text-primary-50"
        }`}
      >
        <h2 className="text-2xl font-bold">{decodedSupplier}</h2>
        <p className="text-sm">{supplierInfo?.address}</p>
        <h1 className="mt-5 border-2 w-50  text-2xl">Return Invoice</h1>
      </div>
      {/* Contact Info */}
      <div className="flex justify-between mt-5 px-5">
        <div
          className={`text-xs space-y-2 ${
            theme === "dark" ? "text-light-50" : " text-primary-50"
          }`}
        >
          <p>
            <b>Email:</b> {supplierInfo?.email}
          </p>
          <p>
            <b>Phone:</b> {supplierInfo?.phone}
          </p>
          <p>
            <b>Address:</b> {supplierInfo?.address}
          </p>
          <p>
            <b>Drug Lic #:</b> {supplierInfo?.drug || "N/A"}
          </p>
        </div>

        {supplierPurchases.length > 0 && (
          <div
            className={`text-xs space-y-2 ${
              theme === "dark" ? "text-light-50" : " text-primary-50"
            }`}
          >
            <p>
              <b>Invoice No:</b> {supplierPurchases[0].invoiceNo}
            </p>
            <p>
              <b>Date:</b>{" "}
              {new Date(supplierPurchases[0].purchaseDate).toLocaleDateString()}
            </p>
            <p>
              <b>SalesMan:</b> {supplierInfo?.name}
            </p>
          </div>
        )}
      </div>
      {/* Search Bar */}
      <div className="mt-4 mb-4  bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 w-full outline-none font-semibold text-primary-50  text-sm"
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
        {" "}
        {filteredItems.length === 0 ? (
          <p className="text-gray-500">
            No return records found for this supplier.
          </p>
        ) : (
          <>
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
                  <th className="px-4 py-2 ">Product Name</th>
                  <th className="px-4 py-2 ">Product Type</th>
                  <th className="px-4 py-2 ">returned Qty</th>
                  <th className="px-4 py-2 ">Cost Price</th>
                  <th className="px-4 py-2 ">Batch No</th>
                  <th className="px-4 py-2 ">Expiry</th>
                  <th className="px-4 py-2 ">Discount</th>
                  <th className="px-4 py-2 ">Total</th>
                </tr>
              </thead>
              <tbody className="text-[10px] ">
                {paginatedProducts.map((item, idx) => (
                  <tr
                    key={idx}
                    className={` px-4 py-2 text-xs font-medium border-b ${
                      theme === "dark" ? " border-white/40" : " border-black/50"
                    }`}
                  >
                    <td className="px-4 py-2 text-xs font-medium">
                      {item.productName}
                    </td>
                    <td className="px-4 py-2 text-xs font-medium">
                      {item.productType}
                    </td>
                    <td className="px-4 py-2 text-xs text-warning-50 font-extrabold">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-2 text-xs font-medium">
                      {item.costPrice}
                    </td>
                    <td className="px-4 py-2 text-xs font-medium">
                      {item.batchNo}
                    </td>
                    <td className="px-4 py-2 text-xs font-medium">
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-xs font-medium">
                      {item.discount}
                    </td>
                    <td className="px-4 py-2 text-xs font-medium">
                      {item.lineTotal}
                    </td>
                  </tr>
                ))}
                <tr
                  className={` px-4 py-2 text-xs font-medium border-b ${
                    theme === "dark" ? " border-white/40" : " border-black/50"
                  }`}
                >
                  <td colSpan={7} className="px-4 py-2 text-sm font-medium">
                    Total
                  </td>
                  <td className="px-4 py-2 text-sm font-medium">
                    {totalLineSum.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div
              className={`flex justify-between items-center px-4 py-3  border-t ${
                theme === "dark"
                  ? "bg-white/20 border-white/20"
                  : "bg-white/10 border-white/20"
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
          </>
        )}
      </div>
    </div>
  );
};

export default PurchaseReturnDetail;
