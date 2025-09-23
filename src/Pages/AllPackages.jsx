import { useState, useEffect } from "react";
import Card, { CardContent } from "../components/Card";
import { addPackage, getPackage } from "../api/packageAPI";
import { getProduct } from "../api/productsApi";

const packageTypeOptions = [
  "Strip", "Blister Pack", "Bottle", "Box", "Tube", "Vial", "Ampoule", "Sachet",
  "Dropper Bottle", "Cartridge", "Pen", "Patch", "Spray Bottle", "Canister",
  "Jar", "Inhaler", "Pump Bottle", "Other",
];

const unitTypeOptions = [
  "tablet", "capsule", "ml", "g", "puff", "spray", "patch", "dose", "unit",
  "piece", "drop", "sachet", "application", "ampoule", "vial", "bottle",
  "strip", "other",
];

const ITEM_PER_PAGE = 8;

const AllPackages = () => {
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

  const [newProduct, setNewProduct] = useState({
    medicineId: "",
    medicineBrandName: "",
    packageType: "",
    unitsPerPack: "",
    unitType: "",
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [pkgRes, medRes] = await Promise.all([getPackage(), getProduct()]);
        setProducts(Array.isArray(pkgRes.data) ? pkgRes.data : []);
        setMedicines(Array.isArray(medRes.data) ? medRes.data : []);
      } catch (error) {
        console.error(error);
        setErrorMsg("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get brand name for table
  const getMedicineBrandName = (medicineId) => {
    const med = medicines.find((m) => m.id === medicineId);
    return med ? med.brandName : medicineId;
  };

  // Search + Pagination
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

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleDropdownSelect = (field, idOrValue, brandName = null) => {
    if (field === "medicineId") {
      setNewProduct((prev) => ({
        ...prev,
        medicineId: idOrValue,
        medicineBrandName: brandName,
      }));
    } else {
      setNewProduct((prev) => ({ ...prev, [field]: idOrValue }));
    }
    setDropdowns((prev) => ({ ...prev, [field]: false }));
    setDropdownSearch((prev) => ({ ...prev, [field]: "" }));
  };

  const resetForm = () => {
    setNewProduct({
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

  const handleAddProduct = async () => {
    const { medicineId, packageType, unitsPerPack, unitType } = newProduct;
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
      const addedPackage = await addPackage({
        medicineId,
        packageType,
        unitsPerPack: unitsPerPackInt,
        unitType,
      });
      const productToAdd = addedPackage.data || addedPackage;
      if (!productToAdd || !productToAdd.medicineId) {
        setErrorMsg("Invalid response from server.");
        return;
      }
      setProducts((prev) => [productToAdd, ...prev]);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to add package.");
    } finally {
      setIsLoading(false);
    }
  };

  // Dropdown Renderer (for package/unit type)
  const renderDropdown = (field, options) => (
    <div className="relative col-span-1">
      <div
        className="border-1 text-xs border-gray-300 font-semibold text-white/90 px-3 py-2 rounded-full w-full"
        onClick={() => setDropdowns({ ...dropdowns, [field]: !dropdowns[field] })}
      >
        {newProduct[field] || `Select ${field}`}
      </div>
      {dropdowns[field] && (
        <div className="absolute mt-1 w-full max-h-48 px-2 py-2 overflow-y-auto border rounded bg-[#618868] z-50">
          <input
            type="text"
            placeholder="Search..."
            value={dropdownSearch[field]}
            onChange={(e) =>
              setDropdownSearch({ ...dropdownSearch, [field]: e.target.value })
            }
            className="w-full px-2 py-1 text-primary-50 bg-[#acc5b0ff] rounded-full font-semibold text-xs outline-none"
          />
          <ul className="text-xs max-h-40 overflow-auto">
            {options
              .filter((option) =>
                option.toLowerCase().includes(dropdownSearch[field].toLowerCase())
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

  // Medicine Dropdown
  const renderMedicineDropdown = () => (
    <div className="relative col-span-1">
      <div
        className="border-1 text-xs border-gray-300 font-semibold text-white/90 px-3 py-2 rounded-full w-full"
        onClick={() =>
          setDropdowns((prev) => ({ ...prev, medicineId: !prev.medicineId }))
        }
      >
        {newProduct.medicineBrandName || "Select medicine"}
      </div>
      {dropdowns.medicineId && (
        <div className="absolute mt-1 w-full max-h-48 px-2 py-2 overflow-y-auto border rounded bg-[#618868] z-50">
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
            className="w-full px-2 py-1 text-primary-50 bg-[#acc5b0ff] rounded-full font-semibold text-xs outline-none"
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

  return (
    <div className="mt-8 p-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-white/90 font-bold">All Packages</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setErrorMsg("");
          }}
          className="bg-[#4F7942] text-white px-4 py-1 h-10 rounded-full hover:bg-hf-100"
        >
          Add Package
        </button>
      </div>

      <div className="mb-4 bg-[#acc5b0ff] rounded-full">
        <input
          type="text"
          placeholder="Search by medicine or package type..."
          className="px-4 py-2 w-full outline-none font-semibold text-primary-50  text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading packages...</div>
      ) : (
        <>
      <div className="overflow-y-auto mt-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <table className="w-full table-auto text-white">
          <thead className="text-sm text-left uppercase bg-bg-50 text-white/80">
            <tr>
              <th className="px-4 py-3  border-b border-white/10">Medicine</th>
              <th className="px-4 py-2 border-b border-white/10">Package Type</th>
              <th className="px-4 py-2 border-b border-white/10">Units Per Pack</th>
              <th className="px-4 py-2 border-b border-white/10">Unit Type</th>
            </tr>
          </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr
                  key={`${product.medicineId}-${product.packageType}-${product.unitsPerPack}`}
                >
                <td className="px-4 py-2 text-xs font-medium border-b border-white/10">
                    {getMedicineBrandName(product.medicineId)}
                  </td>
                <td className="px-4 py-2 text-xs font-medium border-b border-white/10">
                    {product.packageType}
                  </td>
                <td className="px-4 py-2 text-xs font-medium border-b border-white/10">
                    {product.unitsPerPack}
                  </td>
                <td className="px-4 py-2 text-xs font-medium border-b border-white/10">
                    {product.unitType}
                  </td>
                </tr>
              ))}
              {paginatedProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-xs py-4 text-gray-400"
                  >
                    No packages found.
                  </td>
                </tr>
              )}
            </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 bg-white/10 border-t border-white/10">
          <button
            className="px-4 py-1 bg-[#4F7942] text-white rounded-full disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
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

      </>
      )}
        {/* </CardContent>
      </Card> */}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-10">
          <div className="rounded-xl p-5 border border-white/20 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
            <h2 className="text-xl text-white/90 font-semibold mb-4">
              Add New Package
            </h2>

            {errorMsg && (
              <p className="text-sm text-warning-50 font-medium mb-2">
                {errorMsg}
              </p>
            )}

            <div className="grid grid-cols-4 gap-4">
              {renderMedicineDropdown()}
              <input
                type="number"
                min="1"
                name="unitsPerPack"
                placeholder="Units Per Pack"
                value={newProduct.unitsPerPack}
                onChange={handleChange}
                    className="border-1 text-xs border-gray-300 font-semibold text-white/90 px-3 py-2 rounded-full w-full"
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
                className="px-4 py-2 rounded-full bg-gray-400 text-white hover:bg-white/80 hover:text-primary-50 "
              >
                Cancel
              </button>

              <button
                onClick={handleAddProduct}
                disabled={isLoading}
                className="px-4 py-2 bg-bg-50 hover:bg-selected-50 text-white rounded-full hover:bg-hf-100"
              >
                {isLoading ? "Adding..." : "Add Package"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPackages;
