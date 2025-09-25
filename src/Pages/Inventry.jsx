import { useState, useEffect } from "react";
import Card, { CardContent } from "../components/Card";
import {
  addPharmacyProduct,
  addStock,
  getPharmacyProduct,
  getAllPharmacyProduct, // actually maps to getInventoryByPharmacy
} from "../api/inventoryAPI";
import { getPackage } from "../api/packageAPI";
import { getProduct } from "../api/productsApi";
import Select from "react-select";

const ITEM_PER_PAGE = 8;

const Inventry = () => {
  const [products, setProducts] = useState([]); // inventory with stock entries
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

  // get data
  const fetchData = async () => {
    try {
      const [medsRes, packRes, inventoryRes, pharmacyRes] = await Promise.all([
        getProduct(),
        getPackage(),
        getAllPharmacyProduct(),
        getPharmacyProduct(),
      ]);

      setAllMedicines(Array.isArray(medsRes.data) ? medsRes.data : []);
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
        // Convert fields before sending
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

        response = await addStock(payload);
      }

      console.log("Added:", response);
      setShowModal(false);
      setNewEntry({});
      fetchData(); // refresh after adding
    } catch (error) {
      console.error("Failed to add:", error);
      alert("Failed to add. Please try again.");
    }
  };

  // filter products using search
  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.medicine?.brandName?.toLowerCase().includes(term) ||
      product.medicine?.genericName?.toLowerCase().includes(term) ||
      product.packaging?.packageType?.toLowerCase().includes(term) ||
      product.stockEntries?.some((s) =>
        s.batchNumber?.toLowerCase().includes(term)
      )
    );
  });

  // pagination
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

  // fields for each modal type
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
    <div className="mt-8 p-10">
      {/* Top Bar */}
      <div className="flex justify-between max-md:flex-col max-md:gap-2 max-md:justify-center items-center mb-4">
        <h2 className="text-2xl text-primary-50 max-md:text-xl font-bold">
          Inventory Management
        </h2>
        <div className="space-x-2 max-md:flex">
          <button
            onClick={() => openModal("inventory")}
            className="bg-[#4F7942] text-white max-md:text-sm px-4 py-1 h-10 rounded-full hover:bg-hf-100"
          >
            Add Inventory
          </button>
          <button
            onClick={() => openModal("stock")}
            className="bg-[#4F7942] text-white max-md:text-sm px-4 py-1 h-10 rounded-full hover:bg-hf-100"
          >
            Add Stock
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 bg-[#acc5b0ff] rounded-full">
        <input
          type="text"
          placeholder="Search medicine, package, batch..."
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Table */}
      <Card>
        <CardContent>
          <div className="overflow-y-auto mt-2">
            <table className="w-full">
              <thead className="text-sm text-left uppercase text-white bg-[#4F7942]">
                <tr>
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
                      <tr
                        key={`${product.id}-${stock.id}`}
                        className="border-b"
                      >
                        {/* Brand */}
                        <td className="px-4 py-2 text-xs font-medium">
                          {product.medicine?.brandName || "-"}
                        </td>

                        {/* Generic */}
                        <td className="px-4 py-2 text-xs font-medium">
                          {product.medicine?.genericName || "-"}
                        </td>

                        {/* Package */}
                        <td className="px-4 py-2 text-xs font-medium">
                          {product.packaging?.packageType || "-"}
                        </td>

                        {/* Units/Pack */}
                        <td className="px-4 py-2 text-xs font-medium">
                          {product.packaging?.unitsPerPack}{" "}
                          {product.packaging?.unitType}
                        </td>

                        {/* Shelf */}
                        <td className="px-4 py-2 text-xs font-medium">
                          {product.shelf || "-"}
                        </td>

                        {/* Record Level */}
                        <td className="px-4 py-2 text-xs font-medium">
                          {product.reorderLevel || "-"}
                        </td>

                        {/* Batch */}
                        <td className="px-4 py-2 text-xs font-medium">
                          {stock.batchNumber || "-"}
                        </td>

                        {/* Quantity */}
                        <td className="px-4 py-2 text-xs font-medium">
                          {stock.quantity}
                        </td>

                        {/* Expiry */}
                        <td className="px-4 py-2 text-xs font-medium">
                          {stock.expiryDate
                            ? new Date(stock.expiryDate).toLocaleDateString()
                            : "-"}
                        </td>

                        {/* Cost Price */}
                        <td className="px-4 py-2 text-xs font-medium">
                          {stock.costPrice}
                        </td>

                        {/* Selling Price */}
                        <td className="px-4 py-2 text-xs font-medium">
                          {stock.sellingPrice}
                        </td>

                        {/* Added On */}
                        <td className="px-4 py-2 text-xs font-medium">
                          {new Date(stock.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={`${product.id}-no-stock`} className="border-b">
                      <td className="px-4 py-2 text-xs font-medium">
                        {product.medicine?.brandName || "-"}
                      </td>
                      <td className="px-4 py-2 text-xs font-medium">
                        {product.medicine?.genericName || "-"}
                      </td>
                      <td className="px-4 py-2 text-xs font-medium">
                        {product.packaging?.packageType || "-"}
                      </td>
                      <td className="px-4 py-2 text-xs font-medium">
                        {product.packaging?.unitsPerPack}{" "}
                        {product.packaging?.unitType}
                      </td>
                      <td className="px-4 py-2 text-xs font-medium">
                        {product.shelf || "-"}
                      </td>
                      <td className="px-4 py-2 text-xs font-medium">
                        {product.recordLevel || "-"}
                      </td>
                      <td
                        colSpan="6"
                        className="px-4 py-2 text-xs font-medium text-center"
                      >
                        No Stock
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-1 max-md:px-2 bg-[#4F7942] max-md:text-sm text-white rounded-full disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm max-md:text-xs text-primary-50">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-1 max-md:px-2 bg-[#4F7942] max-md:text-sm text-white rounded-full disabled:opacity-50"
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
              {modalType === "inventory"
                ? "Add New Inventory"
                : "Add New Stock"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {fieldsByType[modalType].map((field) => {
                if (field === "medicineId") {
                  const medicineOptions = allMedicines?.map((med) => ({
                    value: med.id,
                    label: `${med.brandName} (${med.genericName})`,
                  }));

                  return (
                    <Select
                      key={field}
                      name={field}
                      options={medicineOptions}
                      value={
                        medicineOptions?.find(
                          (opt) => opt.value === newEntry[field]
                        ) || null
                      }
                      onChange={(selected) =>
                        handleChange({
                          target: { name: field, value: selected?.value },
                        })
                      }
                      placeholder="Select Medicine"
                      className="text-xs font-semibold w-full"
                      isClearable
                      isSearchable
                    />
                  );
                }

                // Packaging Dropdown
                if (field === "packagingId") {
                  const filteredPackages = allPackages?.filter(
                    (pack) => pack.medicineId === newEntry.medicineId
                  );

                  const packageOptions = filteredPackages?.map((pack) => ({
                    value: pack.id,
                    label: `${pack.packageType} - ${pack.unitsPerPack} ${pack.unitType}`,
                  }));

                  return (
                    <Select
                      key={field}
                      name={field}
                      options={packageOptions}
                      value={
                        packageOptions?.find(
                          (opt) => opt.value === newEntry[field]
                        ) || null
                      }
                      onChange={(selected) =>
                        handleChange({
                          target: { name: field, value: selected?.value },
                        })
                      }
                      placeholder="Select Packaging"
                      className="text-xs font-semibold w-full"
                      isClearable
                      isSearchable
                      isDisabled={!newEntry.medicineId}
                    />
                  );
                }

                // Pharmacy Product Dropdown
                if (field === "pharmacyProductId") {
                  const pharmacyMedicineOptions = allPharmacyMedicines?.map(
                    (med) => ({
                      value: med.id,
                      label: `${med.medicine?.brandName} (${med.medicine?.genericName}) - ${med.packaging?.packageType} (${med.packaging?.unitsPerPack} ${med.packaging?.unitType})`,
                    })
                  );

                  return (
                    <Select
                      key={field}
                      name={field}
                      options={pharmacyMedicineOptions}
                      value={
                        pharmacyMedicineOptions?.find(
                          (opt) => opt.value === newEntry[field]
                        ) || null
                      }
                      onChange={(selected) =>
                        handleChange({
                          target: { name: field, value: selected?.value },
                        })
                      }
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
                    className="border text-xs border-gray-300 font-semibold text-primary-50 px-3 py-2 rounded w-full"
                  />
                );
              })}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewEntry({});
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-[#4F7942] text-white rounded hover:bg-hf-100"
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
