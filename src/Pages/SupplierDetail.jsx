import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  addPurchaseItem,
  getPurchaseItems,
  getPurchase,
} from "../api/purchaseAPI";

import { getPackage } from "../api/packageAPI";
import { getProduct } from "../api/productsApi";
import { getPharmacyProduct } from "../api/inventoryAPI";
import { getSupplier } from "../api/supplierAPI";
import Select from "react-select";

const ITEM_PER_PAGE = 10;

const SupplierDetail = () => {
  const { id } = useParams();

  const [purchaseData, setPurchaseData] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [returnQuantities, setReturnQuantities] = useState({});
  const [medicines, setMedicines] = useState([]);
  const [allPackage, setAllPackage] = useState([]);
  const [pharmacyMedicine, setPharmacyMedicine] = useState([]);
  const [supplierInfo, setSupplierInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [medRes, pkgRes, pharmMedRes, itemRes, suplierRes, purchaseRes] =
          await Promise.all([
            getProduct(),
            getPackage(),
            getPharmacyProduct(),
            getPurchaseItems(id),
            getSupplier(),
            getPurchase(),
          ]);

        setAllPackage(Array.isArray(pkgRes.data) ? pkgRes.data : []);
        setMedicines(Array.isArray(medRes.data) ? medRes.data : []);
        setPurchaseData(Array.isArray(itemRes.data) ? itemRes.data : []);
        setPharmacyMedicine(
          Array.isArray(pharmMedRes.data) ? pharmMedRes.data : []
        );
        setSupplierInfo(Array.isArray(suplierRes.data) ? suplierRes.data : []);
        setPurchaseDetails(
          Array.isArray(purchaseRes.data) ? purchaseRes.data : []
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, [id]);

  const [newPurchase, setNewPurchase] = useState({
    pharmacyProductId: "",
    quantity: "",
    costPrice: "",
    sellingPrice: "",
    batchNumber: "",
    expiryDate: "",
    medicineId: "",
    packagingId: "",
    reorderLevel: "",
    shelf: "",
    packsPerBox: "",
    packsBarcode: "",
  });

  // Filtered, Paginated Products
  const filteredItems = (purchaseData || []).filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product?.medicineName?.toLowerCase().includes(term) ||
      product?.packagingType?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  const totalLineSum = filteredItems.reduce(
    (acc, item) => acc + (parseFloat(item.lineTotal) || 0),
    0
  );

  // Add Purchase
  const handleAddPurchase = async () => {
    const payload = {
      ...newPurchase,
      pharmacyProductId: newPurchase.pharmacyProductId || null,
      quantity: newPurchase.quantity ? Number(newPurchase.quantity) : 0,
      costPrice: newPurchase.costPrice ? Number(newPurchase.costPrice) : 0,
      sellingPrice: newPurchase.sellingPrice
        ? Number(newPurchase.sellingPrice)
        : 0,
      reorderLevel: newPurchase.reorderLevel
        ? Number(newPurchase.reorderLevel)
        : 0,
      packsPerBox: newPurchase.packsPerBox
        ? Number(newPurchase.packsPerBox)
        : 0,
      expiryDate: newPurchase.expiryDate
        ? new Date(newPurchase.expiryDate).toISOString()
        : null,
    };

    try {
      const response = await addPurchaseItem(payload, id);
      console.log("Purchase Added, Status:", response.status);
      const itemRes = await getPurchaseItems(id);
      if (itemRes.status == "success") {
        setPurchaseData(Array.isArray(itemRes.data) ? itemRes.data : []);
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error adding purchase:", error);
    }
  };

  // Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase({ ...newPurchase, [name]: value });
  };

  const resetForm = () => {
    setNewPurchase({
      pharmacyProductId: "",
      quantity: "",
      costPrice: "",
      sellingPrice: "",
      batchNumber: "",
      expiryDate: "",
      medicineId: "",
      packagingId: "",
      reorderLevel: "",
      shelf: "",
      packsPerBox: "",
      packsBarcode: "",
    });
    setIsLoading(false);
    setIsNewProduct(false);
  };

  const handleReturnQuantityChange = (id, value) => {
    setReturnQuantities({ ...returnQuantities, [id]: value });
  };

  const handleReturn = (product) => {
    const quantityToReturn = returnQuantities[product.id];
    if (!quantityToReturn || isNaN(quantityToReturn)) {
      alert("Enter a valid return quantity.");
      return;
    }

    const returnData = JSON.parse(
      localStorage.getItem("purchaseReturns") || "[]"
    );

    const returnedItem = {
      ...product,
      quantity: quantityToReturn,
      originalQuantity: product.quantity,
    };

    localStorage.setItem(
      "purchaseReturns",
      JSON.stringify([returnedItem, ...returnData])
    );
    alert("Product return recorded.");
  };

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex justify-between gap-2 items-center mb-2">
        <div className="rounded-full px-4 py-2 bg-[#4F7942]">
          <Link to="/pos/purchase/purchase" className="text-sm text-primary-50">
            ← Back
          </Link>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#4F7942] text-white px-4 py-1 rounded-full"
        >
          Add New Purchase Item
        </button>
      </div>

      {/* Supplier Info */}
      <div className="flex flex-col w-full items-center justify-center text-center space-y-2 text-white/90">
        <h2 className="text-2xl font-bold">
          {supplierInfo[0]?.name || "Supplier"}
        </h2>
        <p className="text-sm">
          {supplierInfo[0]?.address || "No Address Provided"}
        </p>
        <h1 className="mt-5 border-2 w-50 font-bold text-2xl">Invoice</h1>
      </div>

      {/* Contact Info */}
      <div className="flex justify-between mt-5 px-5">
        {/* Left - Supplier Contact */}
        <div className="text-xs space-y-2 text-white/90">
          <p>
            <b>Contact:</b> {supplierInfo[0]?.contact || "N/A"}
          </p>
          <p>
            <b>Email:</b> {supplierInfo[0]?.email || "N/A"}
          </p>
          <p>
            <b>Address:</b> {supplierInfo[0]?.address || "N/A"}
          </p>
          <p>
            <b>Supplier:</b> {supplierInfo[0]?.supplier || "N/A"}
          </p>
        </div>

        {/* Right - Invoice Info */}

        <div className="text-xs space-y-2 text-white/90">
          <p>
            <b>Invoice No:</b> {purchaseDetails[0]?.invoiceNo || "N/A"}
          </p>
          <p>
            <b>Date:</b>{" "}
            {purchaseDetails[0]?.purchaseDate
              ? new Date(purchaseDetails[0].purchaseDate).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <b>Total Amount:</b> {purchaseDetails[0]?.totalAmount || 0}
          </p>
          <p>
            <b>Discount:</b> {purchaseDetails[0]?.discount || 0}
          </p>
          <p>
            <b>Tax:</b> {purchaseDetails[0]?.tax || 0}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name..."
        className="my-4 px-4 py-2 w-full rounded-full outline-none bg-[#acc5b0ff] text-primary-50 text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-y-auto mt-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg shadow">
        <table className="w-full table-auto text-primary-50">
          <thead className="text-[10px] uppercase bg-bg-50 text-white/80">
            <tr>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-2 py-1">Package</th>
              <th className="px-2 py-1">Quantity</th>
              <th className="px-2 py-1">Cost Price</th>
              <th className="px-2 py-1">Batch No</th>
              <th className="px-2 py-1">Expiry</th>
              <th className="px-2 py-1">Total</th>
              <th className="px-2 py-1">Return Qty</th>
              <th className="px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {paginatedProducts.map((product, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-2">{product.medicineName}</td>
                <td className="px-4 py-2">{product.packagingType}</td>
                <td className="px-4 py-2">{product.quantity}</td>
                <td className="px-4 py-2">{product.costPrice}</td>
                <td className="px-4 py-2">{product.batchNumber}</td>
                <td className="px-4 py-2">
                  {product.expiryDate
                    ? new Date(product.expiryDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-2">{product.lineTotal}</td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    className="px-2 py-1 w-16 font-semibold rounded-full bg-[#acc5b0ff] text-primary-50 outline-none text-[10px]"
                    placeholder="Qty"
                    value={returnQuantities[product.id] || ""}
                    onChange={(e) =>
                      handleReturnQuantityChange(product.id, e.target.value)
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleReturn(product)}
                    className="text-xs px-2 py-1 bg-hf-50 text-white rounded-full"
                  >
                    Return
                  </button>
                </td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td colSpan={8} className="px-4 py-2">
                Total
              </td>
              <td className="px-4 py-2">{totalLineSum.toFixed(2)}</td>
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </table>

        {/* Pagination */}
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-10">
          <div className="bg-db-50 p-6 rounded-md w-full max-w-lg">
            <h2 className="text-xl text-primary-50 font-semibold mb-4">
              Add New Purchase
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {(isNewProduct
                ? [
                    "medicineId",
                    "packagingId",
                    "reorderLevel",
                    "shelf",
                    "packsPerBox",
                    "packsBarcode",
                    "quantity",
                    "costPrice",
                    "sellingPrice",
                    "batchNumber",
                    "expiryDate",
                  ]
                : [
                    "pharmacyProductId",
                    "quantity",
                    "costPrice",
                    "sellingPrice",
                    "batchNumber",
                    "expiryDate",
                  ]
              ).map((field) => (
                <div className="relative" key={field}>
                  {field === "pharmacyProductId" ? (
                    <Select
                      name="pharmacyProductId"
                      value={
                        pharmacyMedicine.find(
                          (p) => p.id === newPurchase.pharmacyProductId
                        )
                          ? {
                              value: newPurchase.pharmacyProductId,
                              label: `${
                                pharmacyMedicine.find(
                                  (p) => p.id === newPurchase.pharmacyProductId
                                )?.medicine.brandName
                              } - ${
                                pharmacyMedicine.find(
                                  (p) => p.id === newPurchase.pharmacyProductId
                                )?.packaging.packageType
                              }`,
                            }
                          : null
                      }
                      options={pharmacyMedicine.map((product) => ({
                        value: product.id,
                        label: `${product.medicine.brandName} - ${product.packaging.packageType}`,
                      }))}
                      onChange={(selectedOption) => {
                        setNewPurchase({
                          ...newPurchase,
                          pharmacyProductId: selectedOption
                            ? selectedOption.value
                            : "",
                        });
                        setIsNewProduct(false);
                      }}
                      onInputChange={(inputValue) => {
                        if (inputValue.trim() !== "") {
                          const exists = pharmacyMedicine.some((p) =>
                            `${p.medicine.brandName} - ${p.packaging.packageType}`
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                          );
                          setIsNewProduct(!exists);
                        } else {
                          setIsNewProduct(false);
                        }
                      }}
                      isClearable
                      isSearchable
                      placeholder="Search.."
                      classNamePrefix="react-select"
                    />
                  ) : field === "medicineId" ? (
                    <>
                      <label className="block text-xs font-semibold text-primary-50 mb-1">
                        Select Medicine
                      </label>
                      {medicines.length > 0 ? (
                        <Select
                          name="medicineId"
                          value={
                            medicines.find(
                              (m) => m.id === newPurchase.medicineId
                            )
                              ? {
                                  value: newPurchase.medicineId,
                                  label: medicines.find(
                                    (m) => m.id === newPurchase.medicineId
                                  )?.brandName,
                                }
                              : null
                          }
                          options={medicines.map((m) => ({
                            value: m.id,
                            label: m.brandName,
                          }))}
                          onChange={(selectedOption) =>
                            setNewPurchase({
                              ...newPurchase,
                              medicineId: selectedOption
                                ? selectedOption.value
                                : "",
                              packagingId: "",
                            })
                          }
                          isClearable
                          isSearchable
                          placeholder="Search.."
                          classNamePrefix="react-select"
                        />
                      ) : (
                        <p className="text-red-500 text-xs">
                          ⚠ Please add medicine first before adding purchase.
                        </p>
                      )}
                    </>
                  ) : field === "packagingId" ? (
                    <>
                      <label className="block text-xs font-semibold text-primary-50 mb-1">
                        Select Package
                      </label>
                      <Select
                        name="packagingId"
                        value={
                          allPackage.find(
                            (p) => p.id === newPurchase.packagingId
                          )
                            ? {
                                value: newPurchase.packagingId,
                                label: allPackage.find(
                                  (p) => p.id === newPurchase.packagingId
                                )?.packageType,
                              }
                            : null
                        }
                        options={allPackage
                          .filter(
                            (pkg) => pkg.medicineId === newPurchase.medicineId
                          )
                          .map((pkg) => ({
                            value: pkg.id,
                            label: pkg.packageType,
                          }))}
                        onChange={(selectedOption) =>
                          setNewPurchase({
                            ...newPurchase,
                            packagingId: selectedOption
                              ? selectedOption.value
                              : "",
                          })
                        }
                        isClearable
                        isSearchable
                        placeholder={
                          newPurchase.medicineId ? "Search.." : "Select.."
                        }
                        isDisabled={!newPurchase.medicineId}
                        classNamePrefix="react-select"
                      />
                    </>
                  ) : (
                    <input
                      type={field === "expiryDate" ? "date" : "text"}
                      name={field}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      value={newPurchase[field] || ""}
                      onChange={handleChange}
                      disabled={isLoading && field !== "pharmacyProductId"}
                      className={`border text-xs border-gray-300 font-semibold text-primary-50 px-3 py-2 rounded w-full ${
                        isLoading && field !== "pharmacyProductId"
                          ? "bg-gray-200 cursor-not-allowed"
                          : ""
                      }`}
                    />
                  )}
                </div>
              ))}
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
