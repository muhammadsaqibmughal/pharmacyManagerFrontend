import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { getProduct, addProduct } from "../api/productsApi";
import { useTheme } from "../theme-support/ThemeContext";

const ITEM_PER_PAGE = 10;

const AllProduct = () => {
  const { theme } = useTheme();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const [newProduct, setNewProduct] = useState({
    brandName: "",
    manufacturer: "",
    barcode: "",
  });

  // ----------------------------------------- Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await getProduct({
        page: currentPage,
        limit: ITEM_PER_PAGE,
        search: searchTerm,
      });

      setProducts(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      setErrorMsg("Failed to load products");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  const totalPages = Math.ceil(total / ITEM_PER_PAGE);

  // ----------------------------------------- Input Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // ----------------------------------------- Success Toast
  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 2000);
  };

  // ----------------------------------------- Add Product
  const handleAddProduct = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");

      const payload = {
        brandName: newProduct.brandName.trim(),
        manufacturer: newProduct.manufacturer.trim(),
        barcode: newProduct.barcode.trim(),
      };

      const response = await addProduct(payload);

      if (!response.status==201 || !response.status==200) {
        setErrorMsg(response.message || "Failed to add product");
        return;
      }

      // Success
      resetForm();
      setShowModal(false);
      fetchProducts();
      showToast("Medicine added successfully!");

    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------- Reset Form
  const resetForm = () => {
    setNewProduct({
      brandName: "",
      manufacturer: "",
      barcode: "",
    });
    setErrorMsg("");
  };

  // ----------------------------------------- Validation Check
  const isFormValid =
    newProduct.brandName.trim() !== "" &&
    newProduct.manufacturer.trim() !== "" &&
    newProduct.barcode.trim() !== "";

  return (
    <div className={`mt-8 p-10 ${theme === "dark" ? "bg-dark-50" : "bg-light-50"}`}>

      {/* TOAST */}
      {successToast && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-slideIn">
          {successToast}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white/90" : "text-primary-50"}`}>
          All Products
        </h2>

        <button
          onClick={() => {
            setShowModal(true);
            resetForm();
          }}
          className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-1 h-10 rounded-full"
        >
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search by brand, generic, manufacturer, or barcode..."
          className="px-4 py-2 w-full outline-none text-sm font-semibold text-primary-50"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        </div>
      ) : (
        <div
          className={`table-Main ${
            theme === "dark"
              ? "border-white/10 bg-white/10"
              : "border-black/10 bg-white/60"
          }`}
        >
          <table
            className={`w-full table-auto ${
              theme === "dark" ? "text-light-50" : "text-primary-50"
            }`}
          >
            <thead className="uppercase text-sm bg-bg-50 text-white/80">
              <tr>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Generic</th>
                <th className="px-4 py-3">Manufacturer</th>
                <th className="px-4 py-3">Barcode</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`border-b ${
                    theme === "dark" ? "border-white/20" : "border-black/20"
                  }`}
                >
                  <td className="px-4 py-2">{product.brandName}</td>
                  <td className="px-4 py-2">{product.genericName}</td>
                  <td className="px-4 py-2">{product.manufacturer}</td>
                  <td className="px-4 py-2">{product.barcode}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between px-4 py-3 bg-white/10 border-t">
            <button
              className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-40"
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-10 animate-fadeIn">
          <div className="rounded-xl p-5 bg-white shadow-xl min-w-[500px] animate-scaleIn">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>

            {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

            <div className="grid grid-cols-2 gap-4">
              <input
                name="brandName"
                placeholder="Brand Name"
                className={`border p-2 rounded ${
                  newProduct.brandName.trim() === "" ? "border-red-400" : ""
                }`}
                value={newProduct.brandName}
                onChange={handleChange}
              />

              <input
                name="manufacturer"
                placeholder="Manufacturer"
                className={`border p-2 rounded ${
                  newProduct.manufacturer.trim() === "" ? "border-red-400" : ""
                }`}
                value={newProduct.manufacturer}
                onChange={handleChange}
              />

              <input
                name="barcode"
                placeholder="Barcode"
                className={`border p-2 rounded ${
                  newProduct.barcode.trim() === "" ? "border-red-400" : ""
                }`}
                value={newProduct.barcode}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
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
                className={`px-4 py-2 bg-bg-50 text-white rounded flex items-center gap-2 ${
                  !isFormValid ? "opacity-40 cursor-not-allowed" : ""
                }`}
                disabled={!isFormValid || isLoading}
                onClick={handleAddProduct}
              >
                {isLoading && <FaSpinner className="animate-spin" />}
                {isLoading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AllProduct;
