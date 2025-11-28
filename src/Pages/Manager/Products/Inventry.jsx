import { useState, useEffect } from "react";
import { useTheme } from "../../../theme-support/ThemeContext";

import {
  addPharmacyProduct,
  addPharmacyStock,
  getInventoryByPharmacy,
  getPharmacyProduct,
} from "../../../api/inventoryAPI";
import { getPackage, getMedicinesForDropdown } from "../../../api/packageAPI";

import MainHeader from "../../../components/common/MainHeader";
import Search from "../../../components/common/Search";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import Modal from "../../../components/common/Modal";
import ModalButtons from "../../../components/common/ModalButtons";
import ModalInput from "../../../components/common/ModalInput";
import ModalDropdown from "../../../components/common/ModalDropdown";
import Loader from "../../../components/common/Loader";

const ITEM_PER_PAGE = 5;

const Inventry = () => {
  const { theme } = useTheme();

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "inventory" | "stock"
  const [searchTerm, setSearchTerm] = useState("");
  const [allMedicines, setAllMedicines] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const [allPharmacyMedicines, setAllPharmacyMedicines] = useState([]);
  const [newEntry, setNewEntry] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fieldsByType = {
    inventory: ["medicineId", "packagingId", "shelf", "reorderLevel"],
    stock: [
      "pharmacyProductId",
      "batchNumber",
      "expiryDate",
      "quantity",
      "costPrice",
      "sellingPrice",
      "packsPerBox",
      "packsBarcode",
    ],
  };

  // ---------------- Handlers ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownSelect = (field, value) => {
    setNewEntry((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setNewEntry({});
    setErrorMsg("");
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    resetForm();
  };

  // ---------------- Fetch Data ----------------
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [medsRes, packRes, inventoryRes, pharmacyRes] = await Promise.all([
        getMedicinesForDropdown(),
        getPackage(),
        getInventoryByPharmacy(),
        getPharmacyProduct(),
      ]);

      setAllMedicines(Array.isArray(medsRes) ? medsRes : []);
      setAllPackages(Array.isArray(packRes.data) ? packRes.data : []);
      setProducts(Array.isArray(inventoryRes.data) ? inventoryRes.data : []);
      setAllPharmacyMedicines(
        Array.isArray(pharmacyRes.data) ? pharmacyRes.data : []
      );
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to fetch inventory data.");
    } finally {
      setIsLoading(false);
    }
  };

  console.log("All Medicine" , allMedicines)
  console.log("All Packages" , allPackages)
  console.log("All Products" , products)
  console.log("All PharmacyMedicines" , allPharmacyMedicines)

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- Add Entry ----------------
  const handleAddProduct = async () => {
    try {
      setIsSubmitting(true);

      let payload;
      if (modalType === "inventory") {
        payload = {
          ...newEntry,
          reorderLevel: newEntry.reorderLevel
            ? parseInt(newEntry.reorderLevel, 10)
            : 0,
        };
        await addPharmacyProduct(payload);
      } else if (modalType === "stock") {
        payload = {
          ...newEntry,
          expiryDate: newEntry.expiryDate
            ? new Date(newEntry.expiryDate).toISOString()
            : null,
          quantity: newEntry.quantity ? parseInt(newEntry.quantity, 10) : 0,
          costPrice: newEntry.costPrice ? parseFloat(newEntry.costPrice) : 0,
          sellingPrice: newEntry.sellingPrice
            ? parseFloat(newEntry.sellingPrice)
            : 0,
          packsPerBox: newEntry.packsPerBox
            ? parseInt(newEntry.packsPerBox, 10)
            : null,
        };
        await addPharmacyStock(payload);
      }

      fetchData();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to add entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- Filter & Pagination ----------------
  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.brandName?.toLowerCase().includes(term) ||
      product.genericName?.toLowerCase().includes(term) ||
      product.packageType?.toLowerCase().includes(term) ||
      product.stockEntries?.some((s) =>
        s.batchNumber?.toLowerCase().includes(term)
      )
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEM_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  // ---------------- Table Data ----------------
  const tableData = paginatedProducts.flatMap((product) =>
    product.stockEntries && product.stockEntries.length > 0
      ? product.stockEntries.map((stock) => ({
          brandName: product.brandName || "-",
          genericName: product.genericName || "-",
          packageType: product.packaging || "-",
          unitsPerPack: product.unitsPerPack
            ? `${product.unitsPerPack} ${product.unitType}`
            : "-",
          shelf: product.shelf || "-",
          reorderLevel: product.reorderLevel || "-",
          batchNumber: stock.batchNumber || "-",
          quantity: stock.quantity || 0,
          expiryDate: stock.expiryDate
            ? new Date(stock.expiryDate).toLocaleDateString()
            : "-",
          costPrice: stock.costPrice || 0,
          sellingPrice: stock.sellingPrice || 0,
          createdAt: stock.createdAt
            ? new Date(stock.createdAt).toLocaleString()
            : "-",
        }))
      : [
          {
            brandName: product.brandName || "-",
            genericName: product.genericName || "-",
            packageType: product.packaging || "-",
            unitsPerPack: product.unitsPerPack
              ? `${product.unitsPerPack} ${product.unitType}`
              : "-",
            shelf: product.shelf || "-",
            reorderLevel: product.reorderLevel || "-",
            batchNumber: "No Stock",
            quantity: "-",
            expiryDate: "-",
            costPrice: "-",
            sellingPrice: "-",
            createdAt: "-",
          },
        ]
  );

  const columns = [
    { key: "brandName", label: "Brand" },
    { key: "genericName", label: "Generic" },
    { key: "packageType", label: "Package" },
    { key: "unitsPerPack", label: "Units/Pack" },
    { key: "shelf", label: "Shelf" },
    { key: "reorderLevel", label: "Reorder Level" },
    { key: "batchNumber", label: "Batch" },
    { key: "quantity", label: "Quantity" },
    { key: "expiryDate", label: "Expiry" },
    { key: "costPrice", label: "Cost Price" },
    { key: "sellingPrice", label: "Selling Price" },
    { key: "createdAt", label: "Added On" },
  ];
  console.log("new Entry" , newEntry)

  // ---------------- Modal Dropdown Options ----------------
  const medicineOptions = allMedicines?.map((m) => ({ value: m.id, label: m.brandName })) || [];
  console.log("medicine option" ,medicineOptions)

  const packagingOptions = allPackages?.filter((p) => p.medicineId === newEntry.medicineId).map((p) => ({
        value: p.id,
        label: `${p.packageType} - ${p.unitsPerPack} ${p.unitType}`,
      })) || [];

  console.log("Packaging option" ,packagingOptions)

  const pharmacyProductOptions = allPharmacyMedicines?.map((p) => ({
      value: p.id,
      label: `${p.medicine?.brandName} (${p.medicine?.genericName}) - ${p.packaging?.packageType} (${p.packaging?.unitsPerPack} ${p.packaging?.unitType})`,
    })) || [];
      console.log("Pharmacy Product option" ,pharmacyProductOptions)



  const renderModalField = (field) => {
    if (field === "medicineId") {
      return (
        <ModalDropdown
          key={field}
          options={medicineOptions.map((o) => o.label)}
          value={
            medicineOptions.find((o) => o.value === newEntry[field])?.label ||
            ""
          }
          placeholder="Select Medicine"
          onSelect={(val) =>
            handleDropdownSelect(
              "medicineId",
              medicineOptions.find((o) => o.label === val)?.value
            )
          }
          theme={theme}
        />
      );
    }

    if (field === "packagingId") {
      return (
        <ModalDropdown
          key={field}
          options={packagingOptions.map((o) => o.label)}
          value={
            packagingOptions.find((o) => o.value === newEntry[field])?.label ||
            ""
          }
          placeholder="Select Packaging"
          onSelect={(val) =>
            handleDropdownSelect(
              "packagingId",
              packagingOptions.find((o) => o.label === val)?.value
            )
          }
          theme={theme}
          disabled={!newEntry.medicineId}
        />
      );
    }

    if (field === "pharmacyProductId") {
      return (
        <ModalDropdown
          key={field}
          options={pharmacyProductOptions.map((o) => o.label)}
          value={
            pharmacyProductOptions.find((o) => o.value === newEntry[field])
              ?.label || ""
          }
          placeholder="Select Pharmacy Product"
          onSelect={(val) =>
            handleDropdownSelect(
              "pharmacyProductId",
              pharmacyProductOptions.find((o) => o.label === val)?.value
            )
          }
          theme={theme}
          className={"mt-3"}
        />
      );
    }

    return (
      <ModalInput
        key={field}
        fields={[
          {
            name: field,
            placeholder: field.charAt(0).toUpperCase() + field.slice(1),
            type: field === "expiryDate" ? "date" : "text",
          },
        ]}
        values={newEntry}
        onChange={handleChange}
        theme={theme}
      />
    );
  };

  const buttons = [
    { name: "Add Inventory", onClick: () => openModal("inventory") },
    { name: "Add Stock", onClick: () => openModal("stock") },
  ];

  return (
    <div
      className={`mt-8 p-10`}
    >
      <MainHeader
        title="Inventry Management"
        buttons={buttons}
        // buttonText="Add Stock"
        onButtonClick={() => setShowModal(true)}
        theme={theme}
      />

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {isLoading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={tableData}
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

      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={
          modalType === "inventory" ? "Add New Inventory" : "Add New Stock"
        }
        theme={theme}
      >
        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

        <div className="grid grid-cols-2 gap-4">
          {(fieldsByType[modalType] || []).map((field) =>
            renderModalField(field)
          )}
        </div>

        <ModalButtons
          onCancel={() => {
            setShowModal(false);
            resetForm();
          }}
          onSubmit={handleAddProduct}
          isSubmitting={isSubmitting}
          submitText="Add"
        />
      </Modal>
    </div>
  );
};

export default Inventry;
