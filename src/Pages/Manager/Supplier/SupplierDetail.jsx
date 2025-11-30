import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../../../theme-support/ThemeContext";

import {
  addPurchaseItem,
  getPurchaseItems,
  getPurchaseById,
  returnPurchaseItem,
} from "../../../api/purchaseAPI";

import { getPackage, getMedicinesForDropdown } from "../../../api/packageAPI";
import { getPharmacyProduct } from "../../../api/inventoryAPI";
import { getSupplier } from "../../../api/supplierAPI";

import InvoiceHeader from "../../../components/common/InvoiceHeader";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import Modal from "../../../components/common/Modal";
import ModalButtons from "../../../components/common/ModalButtons";
import ModalInput from "../../../components/common/ModalInput";
import ModalDropdown from "../../../components/common/ModalDropdown";
import Loader from "../../../components/common/Loader";

const ITEMS_PER_PAGE = 10;

const SupplierDetail = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate()

  const [purchaseDetails, setPurchaseDetails] = useState({});
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [pharmacyProducts, setPharmacyProducts] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);
  const [newPurchase, setNewPurchase] = useState({});
  const [returnEntry, setReturnEntry] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);


  console.log("New purchase " , newPurchase)
  // ---------------- Fetch Data ----------------
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [pharmRes, itemsRes, supplierRes, purchaseRes] = await Promise.all([
        getPharmacyProduct(),
        getPurchaseItems(id),
        getSupplier(),
        getPurchaseById(id),
      ]);

      setPharmacyProducts(pharmRes.data || []);
      setPurchaseItems(itemsRes.data.items || []);
      setSuppliers(supplierRes.data || []);
      setPurchaseDetails(purchaseRes.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  console.log("pharmacy_product" , pharmacyProducts)
  console.log("purchase_items" , purchaseItems)
  console.log("suppliers" , suppliers)
  console.log("purchase_detail" , purchaseDetails)

  useEffect(() => {
    fetchData();
  }, [id]);

  // ---------------- Add Purchase ----------------
  const handleAddPurchase = async () => {
    try {
      const payload = {
        ...newPurchase,
        quantity: Number(newPurchase.quantity),
        unitPrice: Number(newPurchase.unitPrice),
        sellingPrice: Number(newPurchase.sellingPrice),
        expiryDate: newPurchase.expiryDate
          ? new Date(newPurchase.expiryDate).toISOString()
          : null,
      };

      await addPurchaseItem(payload, id);
      fetchData();
      setShowAddModal(false);
      setNewPurchase({});
    } catch (err) {
      console.error(err);
      alert("Failed to add purchase.");
    }
  };

  // ---------------- Return Purchase ----------------
  const handleReturnConfirm = async () => {
    try {
      const payload = {
        purchaseItemId: selectedRow.id,
        pharmacyProductId: selectedRow.pharmacyProductId,
        quantity: Number(returnEntry.quantity),
        reason: returnEntry.reason,
        batchNumber: selectedRow.batchNumber,
        expiryDate: selectedRow.expiryDate,
        unitPrice: selectedRow.unitPrice,
      };

      await returnPurchaseItem(id, payload);
      fetchData();
      setShowReturnModal(false);
      setReturnEntry({});
    } catch (err) {
      console.error(err);
      alert("Failed to return item.");
    }
  };

  // ---------------- Filter & Pagination ----------------
  const filteredItems = purchaseItems.filter(
    (item) =>
      item.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.packagingType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ---------------- Table ----------------
  const columns = [
    { key: "medicineName", label: "Product Name" },
    { key: "packagingType", label: "Package" },
    { key: "quantity", label: "Quantity" },
    { key: "unitPrice", label: "Cost Price" },
    { key: "batchNumber", label: "Batch" },
    { key: "expiryDate", label: "Expiry" },
    { key: "lineTotal", label: "Total" },
    { key: "action", label: "Action" },
  ];

  const tableData = paginatedItems.map((item) => ({
    medicineName: item.medicineName || "-",
    packagingType: item.packagingType || "-",
    quantity: item.quantity || 0,
    unitPrice: item.unitPrice || 0,
    batchNumber: item.batchNumber || "-",
    expiryDate: item.expiryDate
      ? new Date(item.expiryDate).toLocaleDateString()
      : "-",
    lineTotal: item.lineTotal || 0,
    action: (
      <button
        className="bg-red-500 text-white px-2 rounded"
        onClick={() => {
          setSelectedRow(item);
          setShowReturnModal(true);
        }}
      >
        Return
      </button>
    ),
  }));

  
  const totalLineSum = filteredItems.reduce(
    (acc, item) => acc + (parseFloat(item.lineTotal) || 0),
    0
  );

  const newRow = {
      medicineName: "Net Total",
      packageType: "",
      quantity: "",
      unitPrice: "",
      batchNumber: "",
      expiryDate: "",
      lineTotal: totalLineSum
  }

  const handleDropdownSelect = (value) => {
    const selected = pharmacyProducts.find((p) => `${p.medicine.brandName} - ${p.packaging.packageType}` ===value)
    setNewPurchase((prev) => ({
      ...prev,
      pharmacyProductId : selected.id,
    }));
  };
  
 

  const pharmacyProductOptions = pharmacyProducts.map(
    (p) => `${p.medicine.brandName} - ${p.packaging.packageType}`
  );

  const selectedPharmacyLabel = newPurchase.pharmacyProductId ? pharmacyProducts.find((p) => p.id === newPurchase.pharmacyProductId)
      ? `${pharmacyProducts.find((p) => p.id === newPurchase.pharmacyProductId).medicine.brandName} - ${pharmacyProducts.find((p) => p.id === newPurchase.pharmacyProductId).packaging.packageType}`: ""
    : "";

  // ---------------- Helper for formatting date ----------------
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "N/A";

  return (
    <div className="p-10 mt-8">
      {/* Invoice Header */}
      <InvoiceHeader
        link={() => navigate(-1)}
        data={purchaseDetails}
        title="Purchase Invoice"
        theme={theme}
        formatDate={formatDate}
        className={"w-70"}
      />

      {/* Add Purchase Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-2 rounded-full"
        >
          Add New Purchase Item
        </button>
      </div>

      {/* Search Bar */}
      <div className="mt-4 mb-4 bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 w-full outline-none font-semibold text-primary-50 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={[...tableData ,newRow ]}
          theme={theme}
          pagination={
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              theme={theme}
            />
          }
        />
      )}

      {/* Add Purchase Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title="Add Purchase Item" theme={theme}>
        <div className="grid grid-cols-2 gap-4">
          <ModalDropdown
            options={pharmacyProductOptions}
            value={selectedPharmacyLabel}
            placeholder="Select Product"
            onSelect={handleDropdownSelect}
            theme={theme}
            className={"mt-3"}
          />

          {["quantity", "unitPrice", "sellingPrice", "batchNumber", "expiryDate"].map((field) => (
            <ModalInput
              key={field}
              fields={[{ name: field, placeholder: field.toUpperCase(), type: field === "expiryDate" ? "date" : "text" }]}
              values={newPurchase}
              onChange={(e) => setNewPurchase({ ...newPurchase, [e.target.name]: e.target.value })}
              theme={theme}
            />
          ))}
        </div>

        <ModalButtons
          onSubmit={handleAddPurchase}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Return Item Modal */}
      <Modal show={showReturnModal} onClose={() => setShowReturnModal(false)} title="Return Item" theme={theme}>
        <ModalInput
          fields={[{ name: "quantity", placeholder: "Return Quantity", type: "number" }]}
          values={returnEntry}
          onChange={(e) => setReturnEntry({ ...returnEntry, quantity: e.target.value })}
          theme={theme}
        />
        <ModalInput
          fields={[{ name: "reason", placeholder: "Reason", type: "text" }]}
          values={returnEntry}
          onChange={(e) => setReturnEntry({ ...returnEntry, reason: e.target.value })}
          theme={theme}
        />

        <ModalButtons
          onSubmit={handleReturnConfirm}
          onCancel={() => setShowReturnModal(false)}
        />
      </Modal>
    </div>
  );
};

export default SupplierDetail;
