import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { users, purchaseDataa, purchases } from "../constants";
import Card, { CardContent } from "../components/Card";

const ITEM_PER_PAGE = 10;

const SupplierDetail = () => {
  const { supplierName } = useParams();
  const decodedSupplier = decodeURIComponent(supplierName);

  const supplierInfo = users.find((user) => user.supplier === decodedSupplier);
  const supplierPurchases = purchaseDataa.filter(
    (item) => item.supplier === decodedSupplier
  );

  const [purchaseData, setPurchaseData] = useState(purchases);
  const [returnQuantities, setReturnQuantities] = useState({});
  const [newPurchase, setNewPurchase] = useState({
    productName: "",
    productType: "",
    quantity: "",
    costPrice: "",
    batchNo: "",
    expiryDate: "",
    discount: "",
    discountPayment: "",
    lineTotal: "",
    packageType: "",
    shelf: "",
    reorderLevel: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [disabledFields, setDisabledFields] = useState(true);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Filtered, Paginated Products
  const filteredItems = purchaseData.filter((product) => {
    const term = searchTerm.toLowerCase();
    return product.productName.toLowerCase().includes(term);
  });

  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  const totalLineSum = filteredItems.reduce((acc, item) => acc + (parseFloat(item.lineTotal) || 0), 0);

  const handleAddPurchase = () => {
    setPurchaseData([newPurchase, ...purchaseData]);
    setShowModal(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase({ ...newPurchase, [name]: value });
  };

  const handleProductNameBlur = () => {
    setIsLoading(true);
    setDisabledFields(true);
    setTimeout(() => {
      const exists = purchaseData.some(
        (item) =>
          item.productName.toLowerCase() === newPurchase.productName.toLowerCase()
      );
      setIsNewProduct(!exists);
      setDisabledFields(false);
      setIsLoading(false);
    }, 1000);
  };

  const resetForm = () => {
    setNewPurchase({
      productName: "",
      productType: "",
      quantity: "",
      costPrice: "",
      batchNo: "",
      expiryDate: "",
      discount: "",
      discountPayment: "",
      lineTotal: "",
      packageType: "",
      shelf: "",
      reorderLevel: "",
    });
    setIsLoading(false);
    setIsNewProduct(false);
    setDisabledFields(true);
  };

  const handleReturnQuantityChange = (index, value) => {
    setReturnQuantities({ ...returnQuantities, [index]: value });
  };

  const handleReturn = (product) => {
    const quantityToReturn = returnQuantities[product.productName];
    if (!quantityToReturn || isNaN(quantityToReturn)) {
      alert("Enter a valid return quantity.");
      return;
    }

    const returnData = JSON.parse(localStorage.getItem("purchaseReturns") || "[]");

    const returnedItem = {
      ...product,
      quantity: quantityToReturn,
      originalQuantity: product.quantity,
      supplier: decodedSupplier,
    };

    localStorage.setItem("purchaseReturns", JSON.stringify([returnedItem, ...returnData]));
    alert("Product return recorded.");
  };

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex justify-between gap-2 items-center mb-2">
        <div className="rounded-full px-4 py-2 bg-[#4F7942]">
          <Link to="/pos/purchase/purchase" className="text-sm text-white">← Back</Link>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#4F7942] text-white px-4 py-1 rounded-full">Add New Purchase</button>
      </div>

      {/* Supplier Info */}
      <div className="flex flex-col w-full items-center justify-center text-center space-y-2 text-primary-50">
        <h2 className="text-2xl font-bold">{decodedSupplier}</h2>
        <p className="text-sm">{supplierInfo?.address}</p>
        <h1 className="mt-5 border-2 w-50 font-bold text-primary-50 text-2xl">Invoice</h1>
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
        className="my-4 px-4 py-2 w-full rounded-full bg-[#acc5b0ff] text-primary-50 text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table */}
      <Card>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead className="text-white text-[11px] text-left bg-[#4F7942]">
                <tr>
                  <th className="px-2 py-1">Product Name</th>
                  <th className="px-2 py-1">Product Type</th>
                  <th className="px-2 py-1">Quantity</th>
                  <th className="px-2 py-1">Cost Price</th>
                  <th className="px-2 py-1">Batch No</th>
                  <th className="px-2 py-1">Expiry</th>
                  <th className="px-2 py-1">Discount</th>
                  <th className="px-2 py-1">Disc. Payment</th>
                  <th className="px-2 py-1">Total</th>
                  <th className="px-2 py-1">Return Qty</th>
                  <th className="px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody className="text-[10px]">
                {paginatedProducts.map((product, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-2 py-1">{product.productName}</td>
                    <td className="px-2 py-1">{product.productType}</td>
                    <td className="px-2 py-1">{product.quantity}</td>
                    <td className="px-2 py-1">{product.costPrice}</td>
                    <td className="px-2 py-1">{product.batchNo}</td>
                    <td className="px-2 py-1">{new Date(product.expiryDate).toLocaleDateString()}</td>
                    <td className="px-2 py-1">{product.discount}</td>
                    <td className="px-2 py-1">{product.discountPayment}</td>
                    <td className="px-2 py-1">{product.lineTotal}</td>
                    <td className="px-2 py-1">
                      <input
                        type="text"
                        className="px-4 py-2 w-20 font-semibold bg-[#acc5b0ff] text-primary-50 outline-none text-[10px]"
                        placeholder="quantity.."
                        value={returnQuantities[product.productName] || ""}
                        onChange={(e) =>
                          handleReturnQuantityChange(product.productName, e.target.value)
                        }
                      />
                    </td>
                    <td className="px-2 py-1">
                      <button
                        onClick={() => handleReturn(product)}
                        className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                      >
                        Return
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#e5f0e3] font-semibold">
                  <td colSpan={8} className="px-2 py-2">Total</td>
                  <td className="px-2 py-2">{totalLineSum.toFixed(2)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
        </CardContent>
      </Card>

            {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-10">
          <div className="bg-db-50 p-6 rounded-md w-full max-w-lg">
            <h2 className="text-xl text-primary-50 font-semibold mb-4">
              Add New Purchase
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(newPurchase).map(([field, value]) => {
                const extraFields = ["packageType", "shelf", "reorderLevel"];
                const shouldShow =
                  !extraFields.includes(field) || isNewProduct;

                if (!shouldShow) return null;

                return (
                  <div className="relative" key={field}>
                    <input
                      type="text"
                      name={field}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      value={value}
                      onChange={handleChange}
                      onBlur={field === "productName" ? handleProductNameBlur : undefined}
                      disabled={field !== "productName" && disabledFields}
                      className={`border text-xs border-gray-300 font-semibold text-primary-50 px-3 py-2 rounded w-full ${
                        disabledFields && field !== "productName"
                          ? "bg-gray-200 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    {field === "productName" && isLoading && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <svg
                          className="animate-spin h-4 w-4 text-[#4F7942]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l5-5-5-5v4a8 8 0 00-8 8z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPurchase}
                className="px-4 py-2 bg-[#4F7942] text-white rounded hover:bg-hf-100"
              >
                Add Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    
    </div>
  );
};

export default SupplierDetail;
