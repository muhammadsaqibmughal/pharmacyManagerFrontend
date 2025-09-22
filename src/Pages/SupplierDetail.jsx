import { useParams, Link } from "react-router-dom";
import { useState } from "react";
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

  const filteredItems = purchaseData.filter((product) => {
    const term = searchTerm.toLowerCase();
    return product.productName.toLowerCase().includes(term);
  });

  const totalLineSum = filteredItems.reduce((acc, item) => {
    const total = parseFloat(item.lineTotal) || 0;
    return acc + total;
  }, 0);

  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

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
          item.productName.toLowerCase() ===
          newPurchase.productName.toLowerCase()
      );
      setIsNewProduct(!exists);
      setDisabledFields(false);
      setIsLoading(false);
    }, 1000); // Simulated loading
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

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex justify-between gap-2 items-center mb-2">
        <div className="rounded-full px-4 py-2 bg-[#4F7942]">
          <Link
            to="/pos/purchase/purchase"
            className="text-sm text-white hover:bg-hf-100"
          >
            ← Back
          </Link>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#4F7942] text-white max-md:text-sm px-4 py-1 h-10 rounded-full hover:bg-hf-100"
        >
          Add New Purchase
        </button>
      </div>

      {/* Supplier Info */}
      <div className="flex justify-center items-center w-full text-primary-50 font-semibold">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{decodedSupplier}</h2>
          <p className="text-sm">{supplierInfo?.address}</p>
          <h1 className="mt-5 border-2 text-2xl">Invoice</h1>
        </div>
      </div>

      {/* Supplier Contact Info & Purchase Meta */}
      <div className="flex items-start justify-between mt-5 px-5 py-2">
        <div className="gap-2 space-y-2">
          <p className="text-primary-50 text-xs font-medium">
            <span className="font-semibold">Email:</span> {supplierInfo?.email}
          </p>
          <p className="text-primary-50 text-xs font-medium">
            <span className="font-semibold">Phone:</span> {supplierInfo?.phone}
          </p>
          <p className="text-primary-50 text-xs font-medium">
            <span className="font-semibold">Address:</span> {supplierInfo?.address}
          </p>
          <p className="text-primary-50 text-xs font-medium">
            <span className="font-semibold">Drug Lic #:</span>{" "}
            {supplierInfo?.drug || "N/A"}
          </p>
        </div>

        {supplierPurchases.length > 0 && (
          <div className="gap-2 space-y-2">
            <p className="text-primary-50 text-xs font-medium">
              <span className="font-semibold">Invoice No:</span>{" "}
              {supplierPurchases[0].invoiceNo}
            </p>
            <p className="text-primary-50 text-xs font-medium">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(supplierPurchases[0].purchaseDate).toLocaleDateString()}
            </p>
            <p className="text-primary-50 text-xs font-medium">
              <span className="font-semibold">SalesMan:</span>  {supplierInfo.name} 
            </p>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-4 mt-2 bg-[#acc5b0ff] rounded-full">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent>
          <div className="overflow-y-auto overflow-x-auto mt-2">
            <table className="w-full">
              <thead className="text-[9px] text-left uppercase text-white bg-[#4F7942]">
                <tr>
                  <th className="px-4 py-2">Product Name</th>
                  <th className="px-4 py-2">Product Type</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Cost Price</th>
                  <th className="px-4 py-2">Batch No</th>
                  <th className="px-4 py-2">Expiry Date</th>
                  <th className="px-4 py-2">Discount </th>
                  <th className="px-4 py-2">Discount Payment</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2 text-xs">{product.productName}</td>
                    <td className="px-4 py-2 text-xs">{product.productType}</td>
                    <td className="px-4 py-2 text-xs">{product.quantity}</td>
                    <td className="px-4 py-2 text-xs">{product.costPrice}</td>
                    <td className="px-4 py-2 text-xs">{product.batchNo}</td>
                    <td className="px-4 py-2 text-xs">
                      {new Date(product.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-xs">{product.discount}</td>
                    <td className="px-4 py-2 text-xs">
                      {product.discountPayment}
                    </td>
                    <td className="px-4 py-2 text-xs">{product.lineTotal}</td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="bg-[#e5f0e3] font-semibold">
                  <td colSpan={8} className="px-4 py-2 text-xs">
                    Total
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {totalLineSum.toFixed(2)}
                  </td>
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
