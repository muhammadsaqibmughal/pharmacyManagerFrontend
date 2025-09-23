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
      <div className="flex flex-col w-full items-center justify-center text-center space-y-2 text-primary-50">
        <h2 className="text-2xl font-bold">{decodedSupplier}</h2>
        <p className="text-sm">{supplierInfo?.address}</p>
        <h1 className="mt-5 border-2 w-50 text-primary-50 text-2xl">Return Invoice</h1>
      </div>

      {/* Contact Info */}
      <div className="flex justify-between mt-5 px-5">
        <div className="text-xs space-y-2 text-primary-50">
          <p><b>Email:</b> {supplierInfo?.email}</p>
          <p><b>Phone:</b> {supplierInfo?.phone}</p>
          <p><b>Address:</b> {supplierInfo?.address}</p>
          <p><b>Drug Lic #:</b> {supplierInfo?.drug || "N/A"}</p>
        </div>

        {supplierPurchases.length > 0 && (
          <div className="text-xs space-y-2 text-primary-50">
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
      <div className="mt-2">
        <Card>
          <CardContent>
            {filteredItems.length === 0 ? (
              <p className="text-gray-500">No return records found for this supplier.</p>
            ) : (
              <>
                <table className="w-full mt-4 text-xs">
                  <thead className="bg-[#4F7942] text-white text-xs text-left uppercase">
                    <tr>
                      <th className="px-2 py-2">Product Name</th>
                      <th className="px-2 py-2">Product Type</th>
                      <th className="px-2 py-2">Returned Qty</th>
                      <th className="px-2 py-2">Cost Price</th>
                      <th className="px-2 py-2">Batch No</th>
                      <th className="px-2 py-2">Expiry</th>
                      <th className="px-2 py-2">Discount</th>
                      <th className="px-2 py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="px-2 py-1 text-[11px]">{item.productName}</td>
                        <td className="px-2 py-1 text-xs">{item.productType}</td>
                        <td className="px-2 py-1 text-[11px] text-red-600 font-bold">{item.quantity}</td>
                        <td className="px-2 py-1">{item.costPrice}</td>
                        <td className="px-2 py-1 text-[11px]">{item.batchNo}</td>
                        <td className="px-2 py-1 text-[11px]">
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="px-2 py-1 text-[11px]">{item.discount}</td>
                        <td className="px-2 py-1 text-[11px]">{item.lineTotal}</td>
                      </tr>
                    ))}
                    <tr className="bg-[#e5f0e3] font-semibold">
                      <td colSpan={7} className="px-2 py-2 text-right">Total</td>
                      <td className="px-2 py-2">{totalLineSum.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-between mt-4">
                  <button
                    className="px-4 py-1 bg-[#4F7942] text-white rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="px-4 py-1 bg-[#4F7942] text-white rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseReturnDetail;
