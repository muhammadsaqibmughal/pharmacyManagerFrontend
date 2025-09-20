import { useState } from "react";
import Card, { CardContent } from "../components/Card";
import { initialData } from "../constants";

const ITEM_PER_PAGE = 10;

const AllProduct = () => {
  const [products, setProducts] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [newProduct, setNewProduct] = useState({
    brandName: "",
    genericName: "",
    strength: "",
    dosageForm: "",
    manufacturer: "",
    barcode: "",
  });

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.brandName.toLowerCase().includes(term) ||
      product.genericName.toLowerCase().includes(term) ||
      product.barcode.includes(term)
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
    // Prevent adding if duplicate
    const exists = products.find(
      (p) => p.brandName.toLowerCase() === newProduct.brandName.toLowerCase()
    );
    if (exists) {
      setErrorMsg("Product already exists!");
      return;
    }

    setProducts([newProduct, ...products]);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewProduct({
      brandName: "",
      genericName: "",
      strength: "",
      dosageForm: "",
      manufacturer: "",
      barcode: "",
    });
    setIsLocked(false);
    setIsLoading(false);

    if (!keepError) {
      setErrorMsg("");
    }
  };

  const handleBrandBlur = async () => {
    if (!newProduct.brandName.trim()) return;

    setIsLoading(true);
    setIsLocked(true);
    setErrorMsg("");

    const response = await new Promise((resolve) =>
      setTimeout(() => {
        const found = products.find(
          (p) =>
            p.brandName.toLowerCase() ===
            newProduct.brandName.trim().toLowerCase()
        );
        resolve(found);
      }, 1500)
    );

    if (response) {
      // Product already exists
      setErrorMsg("Product already exists!");
      resetForm(true);
    } else {
      // No duplicate found
      setIsLocked(false);
    }

    setIsLoading(false);
  };

  return (
    <div className="mt-8 p-10">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-primary-50 font-bold">All Products</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setErrorMsg("");
          }}
          className="bg-[#4F7942] text-white px-4 py-1 h-10 rounded-full hover:bg-hf-100"
        >
          Add Product
        </button>
      </div>

      {/* 🔍 Search Bar */}
      <div className="mb-4 bg-[#acc5b0ff]  rounded-full">
        <input
          type="text"
          placeholder="Search by Brand or Generic Name or barcode..."
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none  text-sm"
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
                <tr className="row-span-3">
                  <th className="px-4 py-2">Brand Name</th>
                  <th className="px-4 py-2">Generic Name</th>
                  <th className="px-4 py-2">Strength</th>
                  <th className="px-4 py-2">Dosage Form</th>
                  <th className="px-4 py-2">Manufacturer</th>
                  <th className="px-4 py-2">Barcode</th>
                </tr>
                <tr className=" col-span-6  h-3">

                </tr>
              </thead>
              <tbody className="text-left">
                {paginatedProducts.map((product, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2 text-xs font-medium">{product.brandName}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.genericName}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.strength}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.dosageForm}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.manufacturer}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.barcode}</td>
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
            <h2 className="text-xl text-primary-50 font-semibold mb-4">Add New Product</h2>
            
            {/* ❗ Error Message */}
            {errorMsg && (
              <p className="text-warning-50 text-sm mb-2">{errorMsg}</p>
            )}

            <div className="grid grid-cols-3 gap-4">
              {Object.keys(newProduct).map((field) => (
                <div className="relative" key={field}>
                  <input
                    type="text"
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={newProduct[field]}
                    onChange={handleChange}
                    onBlur={field === "brandName" ? handleBrandBlur : undefined}
                    disabled={field !== "brandName" && (isLocked || isLoading)}
                    className="border text-xs border-gray-300 font-semibold text-primary-50 px-3 py-2 rounded w-full"
                  />
                  {isLocked && field !== "brandName" && (
                    <span className="absolute right-2 top-1 text-sm text-gray-400">🔒</span>
                  )}
                  {isLoading && field === "brandName" && (
                    <span className="absolute right-2 top-1 text-xs text-gray-400 animate-spin">⏳</span>
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
                onClick={handleAddProduct}
                className="px-4 py-2 bg-[#4F7942] text-white rounded hover:bg-hf-100"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProduct;
