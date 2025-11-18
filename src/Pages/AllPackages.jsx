import { useState, useEffect } from "react";
import { addPackage, getPackage,getMedicinesForDropdown } from "../api/packageAPI";

import { useTheme } from "../theme-support/ThemeContext";
import { FaSpinner } from "react-icons/fa";

const packageTypeOptions = [
  "Strip", "Blister Pack", "Bottle", "Box", "Tube", "Vial", "Ampoule",
  "Sachet", "Dropper Bottle", "Cartridge", "Pen", "Patch", "Spray Bottle",
  "Canister", "Jar", "Inhaler", "Pump Bottle", "Other",
];

const unitTypeOptions = [
  "tablet", "capsule", "ml", "g", "puff", "spray", "patch", "dose",
  "unit", "piece", "drop", "sachet", "application", "ampoule", "vial",
  "bottle", "strip", "other",
];

const ITEM_PER_PAGE = 8;

const AllPackages = () => {
  const { theme } = useTheme();

  const [products, setProducts] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [dropdowns, setDropdowns] = useState({
    packageType: false,
    unitType: false,
    medicineId: false,
  });

  const [dropdownSearch, setDropdownSearch] = useState({
    packageType: "",
    unitType: "",
    medicineId: "",
  });

  const [newPackage, setNewPackage] = useState({
    medicineId: "",
    medicineBrandName: "",
    packageType: "",
    unitsPerPack: "",
    unitType: "",
  });

  // ---------------- Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [pkgRes, productRes] = await Promise.all([getPackage(), getMedicinesForDropdown()]);

        setProducts(Array.isArray(pkgRes.data) ? pkgRes.data : []);

        setMedicines(
          Array.isArray(productRes)
            ? productRes.map((prod) => ({
                id: prod.id,
                brandName: prod.brandName || prod.name || `Product ${prod.id}`,
              }))
            : []
        );
      } catch (error) {
        console.error(error);
        setErrorMsg("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---------------- Helpers
  const getMedicineBrandName = (medicineId) => {
    const med = medicines.find((m) => m.id === medicineId);
    return med ? med.brandName : medicineId;
  };

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const brandName = getMedicineBrandName(product.medicineId).toLowerCase();
    return (
      brandName.includes(term) ||
      product.packageType?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEM_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  // ---------------- Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPackage({ ...newPackage, [name]: value });
  };

  const handleDropdownSelect = (field, idOrValue, brandName = null) => {
    if (field === "medicineId") {
      setNewPackage((prev) => ({
        ...prev,
        medicineId: idOrValue,
        medicineBrandName: brandName,
      }));
    } else {
      setNewPackage((prev) => ({ ...prev, [field]: idOrValue }));
    }
    setDropdowns((prev) => ({ ...prev, [field]: false }));
    setDropdownSearch((prev) => ({ ...prev, [field]: "" }));
  };

  const resetForm = () => {
    setNewPackage({
      medicineId: "",
      medicineBrandName: "",
      packageType: "",
      unitsPerPack: "",
      unitType: "",
    });
    setDropdowns({ packageType: false, unitType: false, medicineId: false });
    setDropdownSearch({ packageType: "", unitType: "", medicineId: "" });
    setErrorMsg("");
  };

  const handleAddPackage = async () => {
    const { medicineId, packageType, unitsPerPack, unitType } = newPackage;
    const unitsPerPackInt = parseInt(unitsPerPack, 10);

    if (
      !medicineId ||
      !packageType ||
      !unitsPerPack ||
      !unitType ||
      isNaN(unitsPerPackInt) ||
      unitsPerPackInt <= 0
    ) {
      setErrorMsg("Please fill in all fields with valid values.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await addPackage({
        medicineId,
        packageType,
        unitsPerPack: unitsPerPackInt,
        unitType,
      });

      if (response.status === 201 || response.status==200) {
        setProducts((prev) => [response.data.data, ...prev]);
        setShowModal(false);
        resetForm();
      } else {
        setErrorMsg(response.message || "Failed to add package.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to add package.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- Dropdown Renderers
  const renderDropdown = (field, options) => (
    <div className="relative col-span-1">
      <div
        className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${
          theme === "dark"
            ? "border-gray-300 text-white/90"
            : "border-black/90 text-primary-50"
        }`}
        onClick={() =>
          setDropdowns({ ...dropdowns, [field]: !dropdowns[field] })
        }
      >
        {newPackage[field] || `${field}`}
      </div>
      {dropdowns[field] && (
        <div className="absolute mt-1 w-full max-h-48 px-2 py-2 overflow-y-auto rounded bg-search-50 z-50">
          <input
            type="text"
            placeholder="Search..."
            value={dropdownSearch[field]}
            onChange={(e) =>
              setDropdownSearch({ ...dropdownSearch, [field]: e.target.value })
            }
            className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${
              theme === "dark"
                ? "border-gray-300 text-white/90"
                : "border-black/40 text-primary-50"
            }`}
          />
          <ul className="text-xs max-h-40 overflow-auto">
            {options
              .filter((option) =>
                option
                  .toLowerCase()
                  .includes(dropdownSearch[field].toLowerCase())
              )
              .map((option) => (
                <li
                  key={option}
                  onClick={() => handleDropdownSelect(field, option)}
                  className="px-3 py-1 hover:bg-[#4CBB17] cursor-pointer"
                >
                  {option}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderMedicineDropdown = () => (
    <div className="relative col-span-1">
      <div
        className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${
          theme === "dark"
            ? "border-gray-300 text-white/90"
            : "border-black/40 text-primary-50"
        }`}
        onClick={() =>
          setDropdowns((prev) => ({ ...prev, medicineId: !prev.medicineId }))
        }
      >
        {newPackage.medicineBrandName || "Select medicine"}
      </div>
      {dropdowns.medicineId && (
        <div className="absolute mt-1 w-full max-h-48 px-2 py-2 overflow-y-auto rounded bg-search-50 z-50">
          <input
            type="text"
            placeholder="Search..."
            value={dropdownSearch.medicineId}
            onChange={(e) =>
              setDropdownSearch((prev) => ({
                ...prev,
                medicineId: e.target.value,
              }))
            }
            className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${
              theme === "dark"
                ? "border-gray-300 text-white/90"
                : "border-black/40 text-primary-50"
            }`}
          />
          <ul className="text-xs max-h-40 overflow-auto">
            {medicines
              .filter((med) =>
                med.brandName
                  .toLowerCase()
                  .includes(dropdownSearch.medicineId.toLowerCase())
              )
              .map((med) => (
                <li
                  key={med.id}
                  onClick={() =>
                    handleDropdownSelect("medicineId", med.id, med.brandName)
                  }
                  className="px-3 py-1 hover:bg-[#4CBB17] cursor-pointer"
                >
                  {med.brandName}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );

  // ---------------- JSX Render
  return (
    <>
      <div className={`mt-8 p-10 ${theme === "dark" ? "bg-dark-50" : "bg-light-50"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white/90" : "text-primary-50"}`}>
            All Packages
          </h2>
          <button
            onClick={() => {
              setShowModal(true);
              setErrorMsg("");
            }}
            className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-1 h-10 rounded-full"
          >
            Add Package
          </button>
        </div>

        <div className="mb-4 bg-search-50 rounded-full">
          <input
            type="text"
            placeholder="Search by medicine or package type..."
            className="px-4 py-2 w-full outline-none font-semibold text-primary-50 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <FaSpinner className="animate-spin text-blue-500 text-5xl" />
          </div>
        ) : (
          <div className={`table-Main ${theme === "dark" ? "border-white/10 bg-white/10" : "border-black/10 bg-white/60"}`}>
            <table className={`w-full table-auto ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
              <thead className="text-sm text-left uppercase bg-bg-50 text-white/80">
                <tr className={theme === "dark" ? "border-b border-white/20" : "border-b border-black/20"}>
                  <th className="px-4 py-2">Medicine</th>
                  <th className="px-4 py-2">Package Type</th>
                  <th className="px-4 py-2">Units Per Pack</th>
                  <th className="px-4 py-2">Unit Type</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={`${product.medicineId}-${product.packageType}-${product.unitsPerPack}`} className={theme === "dark" ? "border-b border-white/40" : "border-b border-black/50"}>
                    <td className="px-4 py-2 text-xs font-medium">{getMedicineBrandName(product.medicineId)}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.packageType}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.unitsPerPack}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.unitType}</td>
                  </tr>
                ))}
                {paginatedProducts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-xs py-4 text-gray-400">
                      No packages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className={`flex justify-between items-center px-4 py-3 border-t ${theme === "dark" ? "bg-white/20 border-white/20" : "bg-white/10 border-white/20"}`}>
              <button
                className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className={`text-sm ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-10">
          <div className={`rounded-xl p-5 border ${theme === "dark" ? "border-white/20 bg-white/10" : "border-white/40 bg-white/90"} shadow-xl`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
              Add New Package
            </h2>

            {errorMsg && <p className="text-sm text-warning-50 font-medium mb-2">{errorMsg}</p>}

            <div className="grid grid-cols-2 gap-4">
              {renderMedicineDropdown()}
              <input
                type="number"
                min="1"
                name="unitsPerPack"
                placeholder="Units Per Pack"
                value={newPackage.unitsPerPack}
                onChange={handleChange}
                className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${theme === "dark" ? "border-gray-300 text-white/90" : "border-black/40 text-primary-50"}`}
              />
              {renderDropdown("packageType", packageTypeOptions)}
              {renderDropdown("unitType", unitTypeOptions)}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 rounded-full bg-gray-400 text-white hover:bg-white/80 hover:text-primary-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPackage}
                disabled={isLoading}
                className="px-4 py-2 bg-bg-50 hover:bg-selected-50 text-white rounded-full hover:bg-hf-100"
              >
                {isLoading ? "Adding..." : "Add Package"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllPackages;
