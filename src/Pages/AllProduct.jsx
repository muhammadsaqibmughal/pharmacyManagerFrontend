import { useState, useEffect } from "react";
import Card, { CardContent } from "../components/Card";
import { getProduct, addProduct } from "../api/productsApi";
import { useTheme } from "../theme-support/ThemeContext";

const ITEM_PER_PAGE = 10;

const AllProduct = () => {
  const { theme } = useTheme();

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [newProduct, setNewProduct] = useState({
    brandName: "",
    manufacturer: "",
    barcode: "",
  });

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProduct();
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.log(error);
        setErrorMsg("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      (product.brandName && product.brandName.toLowerCase().includes(term)) ||
      (product.genericName &&
        product.genericName.toLowerCase().includes(term)) ||
      (product.barcode && product.barcode.includes(term))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    const exists = products.find(
      (p) => p.brandName.toLowerCase() === newProduct.brandName.toLowerCase()
    );
    if (exists) {
      setErrorMsg("Product already exists!");
      return;
    }

    try {
      setIsLoading(true);
      const addedProduct = await addProduct(newProduct);

      console.log("Added product response:", addedProduct);
      const productToAdd = addedProduct.data || addedProduct;

      if (!productToAdd || !productToAdd.brandName) {
        setErrorMsg("Invalid product data returned from server");
        return;
      }

      setProducts((prev) => [productToAdd, ...prev]);
      setShowModal(false);
      resetForm();
    } catch (error) {
      setErrorMsg("Failed to add product");
      console.error("Add product error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = (keepError = false) => {
    setNewProduct({
      brandName: "",
      manufacturer: "",
      barcode: "",
    });
    setIsLocked(false);
    setIsLoading(false);

    if (!keepError) {
      setErrorMsg("");
    }
  };

  const handleBrandBlur = () => {
    if (!newProduct.brandName.trim()) return;

    setIsLoading(true);
    setIsLocked(true);
    setErrorMsg("");

    const found = products.find(
      (p) =>
        p.brandName.toLowerCase() === newProduct.brandName.trim().toLowerCase()
    );

    if (found) {
      setErrorMsg("Product already exists!");
      resetForm(true);
    } else {
      setIsLocked(false);
    }

    setIsLoading(false);
  };

  return (
    <div
      className={`mt-8 p-10 ${
        theme === "dark" ? "bg-dark-50" : " bg-light-50"
      }`}
    >
      {" "}
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-2xl ${
            theme === "dark" ? "text-white/90" : " text-primary-50"
          }  font-bold`}
        >
          {" "}
          All Products
        </h2>
        <button
          onClick={() => {
            setShowModal(true);
            setErrorMsg("");
          }}
          className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-1 h-10 rounded-full hover:bg-hf-100"
        >
          Add Product
        </button>
      </div>
      {/* Search Bar */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search by Brand or Generic Name or barcode..."
          className="px-4 py-2 w-full outline-none font-semibold text-primary-50   text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Product Table */}
      <div
        className={`table-Main  ${
          theme === "dark"
            ? " border-white/10 bg-white/10"
            : " border-black/10 bg-white/60"
        }`}
      >
        <table
          className={`w-full table-auto ${
            theme === "dark" ? "text-light-50" : " text-primary-50"
          }`}
        >
          <thead className="text-sm text-left uppercase bg-bg-50 text-white/80">
            <tr
              className={`border-b ${
                theme === "dark" ? " border-white/20" : " border-black/20"
              }`}
            >
              <th className="px-4 py-3">Brand Name</th>
              <th className="px-4 py-3">Generic Name</th>
              <th className="px-4 py-3">Manufacturer</th>
              <th className="px-4 py-3">Barcode</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr
                key={product.id || product.barcode || product.brandName}
                className={` px-4 py-2 text-xs font-medium border-b ${
                  theme === "dark" ? " border-white/40" : " border-black/50"
                }`}
              >
                <td className="px-4 py-2 text-xs font-medium">
                  {product.brandName}
                </td>
                <td className="px-4 py-2 text-xs font-medium">
                  {product.genericName}
                </td>
                <td className="px-4 py-2 text-xs font-medium">
                  {product.manufacturer}
                </td>
                <td className="px-4 py-2 text-xs font-medium">
                  {product.barcode}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          className={`flex justify-between items-center px-4 py-3  border-t ${
            theme === "dark"
              ? "bg-white/20 border-white/20"
              : "bg-white/10 border-white/20"
          }`}
        >
          <button
            className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span
            className={`text-sm text-center ${
              theme === "dark" ? "text-light-50" : "text-primary-50"
            } `}
          >
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
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
          <div
            className={`rounded-xl p-5 border ${
              theme === "dark"
                ? "border-white/20 bg-white/10"
                : "border-white/40 bg-white/90"
            }   backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${
                theme === "dark" ? "text-light-50" : "text-primary-50"
              }`}
            >
              Add New Product
            </h2>

            {/* Error Message */}
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
                    className={`border-1 text-xs  font-semibold px-3 py-2 rounded-full w-full ${
                      theme === "dark"
                        ? "border-gray-300 text-white/90"
                        : "border-black/40 text-primary-50"
                    }`}
                  />
                  {isLocked && field !== "brandName" && (
                    <span className="absolute right-2 top-1 text-sm text-gray-400">
                      🔒
                    </span>
                  )}
                  {isLoading && field === "brandName" && (
                    <span className="absolute right-2 top-1 text-xs text-gray-400 animate-spin">
                      ⏳
                    </span>
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
                className="px-4 py-2 rounded-full bg-gray-400 text-white hover:bg-white/80 hover:text-primary-50 "
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={isLoading}
                className="px-4 py-2 bg-bg-50 hover:bg-selected-50 text-white rounded-full hover:bg-hf-100"
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
