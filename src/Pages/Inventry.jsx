import { useState, useEffect } from "react";
import Select from "react-select";
import { useTheme } from "../theme-support/ThemeContext";

import {
  addPharmacyProduct,
  addPharmacyStock,
  getInventoryByPharmacy,
  getPharmacyProduct,
} from "../api/inventoryAPI";

import { getPackage, getMedicinesForDropdown } from "../api/packageAPI";

const ITEM_PER_PAGE = 5;

const Inventry = () => {
  const { theme } = useTheme();

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allMedicines, setAllMedicines] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const [allPharmacyMedicines, setAllPharmacyMedicines] = useState([]);
  const [newEntry, setNewEntry] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
    try {
      const [medsRes, packRes, inventoryRes, pharmacyRes] = await Promise.all([
        getMedicinesForDropdown(),
        getPackage(),
        getInventoryByPharmacy(),
        getPharmacyProduct(),
      ]);

      console.log("md", medsRes);
      console.log("pkg", packRes.data);
      console.log("inv", inventoryRes.data);
      console.log("pharm", pharmacyRes.data);

      // Ensure all state arrays are properly initialized
      setAllMedicines(Array.isArray(medsRes) ? medsRes : []);
      setAllPackages(Array.isArray(packRes.data) ? packRes.data : []);
      setProducts(Array.isArray(inventoryRes.data) ? inventoryRes.data : []);
      setAllPharmacyMedicines(
        Array.isArray(pharmacyRes.data) ? pharmacyRes.data : []
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async () => {
    try {
      let response;

      if (modalType === "inventory") {
        const payload = {
          ...newEntry,
          reorderLevel: newEntry.reorderLevel
            ? parseInt(newEntry.reorderLevel, 10)
            : 0,
        };
        response = await addPharmacyProduct(payload);
      } else if (modalType === "stock") {
        const payload = {
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

        response = await addPharmacyStock(payload);
      }

      console.log("Added:", response);
      setShowModal(false);
      setNewEntry({});
      fetchData();
    } catch (error) {
      console.error("Failed to add:", error);
      alert("Failed to add. Please try again.");
    }
  };

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

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setNewEntry({});
  };

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

  return (
    <div className={`mt-8 p-10 ${theme === "dark" ? "bg-dark-50" : "bg-light-50"}`}>
      {/* Top Bar */}
      <div className="flex justify-between max-md:flex-col max-md:gap-2 max-md:justify-center items-center mb-4">
        <h2 className={`text-2xl ${theme === "dark" ? "text-white/90" : "text-primary-50"} font-bold`}>
          Inventory Management
        </h2>
        <div className="space-x-2 max-md:flex">
          <button
            onClick={() => openModal("inventory")}
            className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-1 h-10 rounded-full hover:bg-hf-100"
          >
            Add Inventory
          </button>
          <button
            onClick={() => openModal("stock")}
            className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-1 h-10 rounded-full hover:bg-hf-100"
          >
            Add Stock
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search medicine, package, batch..."
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Table */}
      <div className={`table-Main ${theme === "dark" ? "border-white/10 bg-white/10" : "border-black/10 bg-white/60"}`}>
        <table className={`w-full table-auto ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
          <thead className="text-sm text-left uppercase bg-bg-50 text-white/80">
            <tr className={`border-b ${theme === "dark" ? "border-white/20" : "border-black/20"}`}>
              <th className="px-4 py-2">Brand</th>
              <th className="px-4 py-2">Generic</th>
              <th className="px-4 py-2">Package</th>
              <th className="px-4 py-2">Units/Pack</th>
              <th className="px-4 py-2">Shelf</th>
              <th className="px-4 py-2">Reorder Level</th>
              <th className="px-4 py-2">Batch</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Expiry</th>
              <th className="px-4 py-2">Cost Price</th>
              <th className="px-4 py-2">Selling Price</th>
              <th className="px-4 py-2">Added On</th>
            </tr>
          </thead>
          <tbody className="text-left">
            {paginatedProducts.map((product) =>
              product.stockEntries && product.stockEntries.length > 0 ? (
                product.stockEntries.map((stock) => (
                  <tr key={`${product.id}-${stock.id}`} className={`px-4 py-2 text-xs font-medium border-b ${theme === "dark" ? "border-white/40" : "border-black/50"}`}>
                    <td>{product.brandName || "-"}</td>
                    <td>{product.genericName || "-"}</td>
                    <td>{product.packaging || "-"}</td>
                    <td>{product.unitsPerPack} {product.unitType}</td>
                    <td>{product.shelf || "-"}</td>
                    <td>{product.reorderLevel || "-"}</td>
                    <td>{stock.batchNumber || "-"}</td>
                    <td>{stock.quantity}</td>
                    <td>{stock.expiryDate ? new Date(stock.expiryDate).toLocaleDateString() : "-"}</td>
                    <td>{stock.costPrice}</td>
                    <td>{stock.sellingPrice}</td>
                    <td>{new Date(stock.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr key={`${product.id}-no-stock`} className={`px-4 py-2 text-xs font-medium border-b ${theme === "dark" ? "border-white/40" : "border-black/50"}`}>
                  <td>{product.brandName || "-"}</td>
                  <td>{product.genericName || "-"}</td>
                  <td>{product.packaging || "-"}</td>
                  <td>{product.unitsPerPack} {product.unitType}</td>
                  <td>{product.shelf || "-"}</td>
                  <td>{product.reorderLevel || "-"}</td>
                  <td colSpan="6" className="text-center">No Stock</td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={`flex justify-between items-center px-4 py-3 border-t ${theme === "dark" ? "bg-white/20 border-white/20" : "bg-white/10 border-white/20"}`}>
          <button
            className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className={`text-sm text-center ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>Page {currentPage} of {totalPages}</span>
          <button
            className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-10">
          <div className={`rounded-xl p-5 border ${theme === "dark" ? "border-white/20 bg-white/10" : "border-white/40 bg-white/90"} backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
              {modalType === "inventory" ? "Add New Inventory" : "Add New Stock"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {fieldsByType[modalType].map((field) => {
                if (field === "medicineId") {
                  const medicineOptions = Array.isArray(allMedicines)
                    ? allMedicines.map((med) => ({
                        value: med.id,
                        label: `${med.brandName} `,
                      }))
                    : [];

                  return (
                    <Select
                      key={field}
                      name={field}
                      options={medicineOptions}
                      value={medicineOptions.find((opt) => opt.value === newEntry[field]) || null}
                      onChange={(selected) => handleChange({ target: { name: field, value: selected?.value } })}
                      placeholder="Select Medicine"
                      className="text-xs font-semibold w-full"
                      isClearable
                      isSearchable
                    />
                  );
                }

                if (field === "packagingId") {
                  const filteredPackages = Array.isArray(allPackages)
                    ? allPackages.filter((pack) => pack.medicineId === newEntry.medicineId)
                    : [];

                  const packageOptions = filteredPackages.map((pack) => ({
                    value: pack.id,
                    label: `${pack.packageType} - ${pack.unitsPerPack} ${pack.unitType}`,
                  }));

                  return (
                    <Select
                      key={field}
                      name={field}
                      options={packageOptions}
                      value={packageOptions.find((opt) => opt.value === newEntry[field]) || null}
                      onChange={(selected) => handleChange({ target: { name: field, value: selected?.value } })}
                      placeholder="Select Packaging"
                      className="text-xs font-semibold w-full"
                      isClearable
                      isSearchable
                      isDisabled={!newEntry.medicineId}
                    />
                  );
                }

                if (field === "pharmacyProductId") {
                  const pharmacyMedicineOptions = Array.isArray(allPharmacyMedicines)
                    ? allPharmacyMedicines.map((med) => ({
                        value: med.id,
                        label: `${med.medicine?.brandName} (${med.medicine?.genericName}) - ${med.packaging?.packageType} (${med.packaging?.unitsPerPack} ${med.packaging?.unitType})`,
                      }))
                    : [];

                  return (
                    <Select
                      key={field}
                      name={field}
                      options={pharmacyMedicineOptions}
                      value={pharmacyMedicineOptions.find((opt) => opt.value === newEntry[field]) || null}
                      onChange={(selected) => handleChange({ target: { name: field, value: selected?.value } })}
                      placeholder="Select Pharmacy Medicine"
                      className="text-xs font-semibold w-full"
                      isClearable
                      isSearchable
                    />
                  );
                }

                return (
                  <input
                    key={field}
                    type={field === "expiryDate" ? "date" : "text"}
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={newEntry[field] || ""}
                    onChange={handleChange}
                    className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${theme === "dark" ? "border-gray-300 text-white/90" : "border-black/40 text-primary-50"}`}
                  />
                );
              })}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setNewEntry({}); }}
                className="px-4 py-2 rounded-full bg-gray-400 text-white hover:bg-white/80 hover:text-primary-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-bg-50 hover:bg-selected-50 text-white rounded-full hover:bg-hf-100"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventry;
