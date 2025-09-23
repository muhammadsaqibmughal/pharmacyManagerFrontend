import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { users, purchaseDataa } from "../constants";
import Card, { CardContent } from "../components/Card";

const ITEM_PER_PAGE = 5;

const PurchaseReturnDetail = () => {
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
    const returnData = JSON.parse(localStorage.getItem("purchaseReturns") || "[]");
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
    <div className="p-10">
      {/* Back Button */}
      <div className="rounded-full inline px-4 py-2 bg-[#4F7942]">
        <Link to="/pos/purchase/purchaseReturn" className="text-sm text-white">
          ← Back
        </Link>
      </div>

      {/* Supplier Info */}
      <div className="flex flex-col w-full items-center justify-center text-center space-y-2 text-white/90">
        <h2 className="text-2xl font-bold">{decodedSupplier}</h2>
        <p className="text-sm">{supplierInfo?.address}</p>
        <h1 className="mt-5 border-2 w-50  text-2xl">Return Invoice</h1>
      </div>

      {/* Contact Info */}
      <div className="flex justify-between mt-5 px-5">
        <div className="text-xs space-y-2 text-white/90">
          <p><b>Email:</b> {supplierInfo?.email}</p>
          <p><b>Phone:</b> {supplierInfo?.phone}</p>
          <p><b>Address:</b> {supplierInfo?.address}</p>
          <p><b>Drug Lic #:</b> {supplierInfo?.drug || "N/A"}</p>
        </div>

        {supplierPurchases.length > 0 && (
          <div className="text-xs space-y-2 text-white/90">
            <p><b>Invoice No:</b> {supplierPurchases[0].invoiceNo}</p>
            <p><b>Date:</b> {new Date(supplierPurchases[0].purchaseDate).toLocaleDateString()}</p>
            <p><b>SalesMan:</b> {supplierInfo?.name}</p>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name..."
        className="my-4 px-4 py-2 w-full rounded-full bg-[#acc5b0ff] outline-none text-primary-50 text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-y-auto mt-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        {/* <Card> */}
          {/* <CardContent> */}
            {filteredItems.length === 0 ? (
              <p className="text-gray-500">No return records found for this supplier.</p>
            ) : (
              <>
                <table className="w-full table-auto text-white">
                 <thead className="text-[10px] text-left uppercase bg-bg-50 text-white/80">
                    <tr>
                      <th className="px-4 py-3  border-b border-white/10">Product Name</th>
                      <th className="px-2 py-1 border-b border-white/10">Product Type</th>
                      <th className="px-2 py-1 border-b border-white/10">returned Qty</th>
                      <th className="px-2 py-1 border-b border-white/10">Cost Price</th>
                      <th className="px-2 py-1 border-b border-white/10">Batch No</th>
                      <th className="px-2 py-1 border-b border-white/10">Expiry</th>
                      <th className="px-2 py-1 border-b border-white/10">Discount</th>
                      <th className="px-2 py-1 border-b border-white/10">Total</th>
                    </tr>
                  </thead>
                   <tbody className="text-[10px] ">
                    {paginatedProducts.map((item, idx) => (
                      <tr key={idx} className="border-b">
                    <td className="px-4 py-2   border-b border-white/10">{item.productName}</td>
                        <td className="px-4 py-2   border-b border-white/10">{item.productType}</td>
                        <td className="px-4 py-2 text-warning-50 font-extrabold  border-b border-white/10">{item.quantity}</td>
                        <td className="px-4 py-2   border-b border-white/10">{item.costPrice}</td>
                        <td className="px-4 py-2   border-b border-white/10">{item.batchNo}</td>
                        <td className="px-4 py-2   border-b border-white/10">
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2   border-b border-white/10">{item.discount}</td>
                        <td className="px-4 py-2   border-b border-white/10">{item.lineTotal}</td>
                      </tr>
                    ))}
                    <tr className="font-semibold">
                      <td colSpan={7} className="px-4 py-2   border-b border-white/10">Total</td>
                      <td className="px-4 py-2   border-b border-white/10">{totalLineSum.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Pagination Controls */}
             <div className="flex justify-between items-center px-4 py-3 bg-white/10 border-t border-white/10">
                  <button
            className="px-4 py-1 bg-[#4F7942] text-white rounded-full disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
            className="px-4 py-1 bg-[#4F7942] text-white rounded-full disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          {/* </CardContent> */}
        {/* </Card> */}
      </div>
    </div>
  );
};

export default PurchaseReturnDetail;
