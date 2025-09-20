import { useState } from "react";
import Card, { CardContent } from "../components/Card";
import { packageData } from "../constants";

// Dropdown options
const packageTypeOptions = [
  "Strip", "Blister Pack", "Bottle", "Box", "Tube", "Vial", "Ampoule", "Sachet",
  "Dropper Bottle", "Cartridge", "Pen", "Patch", "Spray Bottle", "Canister",
  "Jar", "Inhaler", "Pump Bottle", "Other"
];

const unitTypeOptions = [
  "tablet", "capsule", "ml", "g", "puff", "spray", "patch", "dose", "unit",
  "piece", "drop", "sachet", "application", "ampoule", "vial", "bottle",
  "strip", "other"
];

const ITEM_PER_PAGE = 8;

const AllPackages = () => {
  const [products, setProducts] = useState(packageData);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [dropdowns, setDropdowns] = useState({
    packageType: false,
    unitType: false,
  });

  const [dropdownSearch, setDropdownSearch] = useState({
    packageType: "",
    unitType: "",
  });

  const [newProduct, setNewProduct] = useState({
    medicine: "",
    packageType: "",
    unitsPerPack: "",
    unitType: "",
  });

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.medicine.toLowerCase().includes(term) ||
      product.packageType.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = () => {
    setProducts([newProduct, ...products]);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewProduct({
      medicine: "",
      packageType: "",
      unitsPerPack: "",
      unitType: "",
    });
    setDropdowns({ packageType: false, unitType: false });
    setDropdownSearch({ packageType: "", unitType: "" });
  };

  const handleDropdownSelect = (field, value) => {
    setNewProduct({ ...newProduct, [field]: value });
    setDropdowns({ ...dropdowns, [field]: false });
    setDropdownSearch({ ...dropdownSearch, [field]: "" });
  };

  const renderDropdown = (field, options) => (
    <div className="relative col-span-1">
      <div
        className="border text-xs border-gray-300 font-semibold text-Secondary-50 px-3 py-2 rounded w-full cursor-pointer"
        onClick={() =>
          setDropdowns({ ...dropdowns, [field]: !dropdowns[field] })
        }
      >
        {newProduct[field] || ` ${field}`}
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
          <ul className="text-xs">
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

  return (
    <div className="mt-8 p-10">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-primary-50 font-bold">All Packages</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#4F7942] text-white px-4 py-1 h-10 rounded-full hover:bg-hf-100"
        >
          Add Package
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 bg-[#acc5b0ff] rounded-full">
        <input
          type="text"
          placeholder="Search by medicine or package type..."
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
                  <th className="px-4 py-2">Medicine</th>
                  <th className="px-4 py-2">Package Type</th>
                  <th className="px-4 py-2">Units Per Pack</th>
                  <th className="px-4 py-2">Unit Type</th>
                </tr>
                <tr className="colspan-4 h-3"></tr>
              </thead>
              <tbody className="text-left">
                {paginatedProducts.map((product, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2 text-xs font-medium">{product.medicine}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.packageType}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.unitsPerPack}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.unitType}</td>
                  </tr>
                ))}
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
            <h2 className="text-xl text-primary-50 font-semibold mb-4">Add New Package</h2>

            <div className="grid grid-cols-3 gap-4">

              {["medicine", "unitsPerPack"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={newProduct[field]}
                  onChange={handleChange}
                  className="border text-xs border-gray-300 font-semibold text-primary-50 px-3 py-2 rounded w-full"
                />
              ))}
              {renderDropdown("packageType", packageTypeOptions)}
              {renderDropdown("unitType", unitTypeOptions)}
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
                onClick={handleAddProduct}
                className="px-4 py-2 bg-[#4F7942] text-white rounded hover:bg-hf-100"
              >
                Add Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPackages;
