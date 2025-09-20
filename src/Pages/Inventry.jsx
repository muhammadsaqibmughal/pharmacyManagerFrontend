import { useState } from "react";
import Card, { CardContent } from "../components/Card";
import { pharmacyStockData } from "../constants"; // ✅ Import stock data


const ITEM_PER_PAGE = 8;

const Inventry = () => {
  const [products, setProducts] = useState(pharmacyStockData); // ✅ Use as initial data
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'inventory' or 'stock'
  const [searchTerm, setSearchTerm] = useState("");

  const [newEntry, setNewEntry] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  const handleAddProduct = () => {
    setProducts([newEntry, ...products]);
    setShowModal(false);
    setNewEntry({});
  };

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return Object.values(product).some((val) =>
      val?.toString().toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setNewEntry({});
  };

  // Fields for each modal type
  const fieldsByType = {
    inventory: ["medicine", "packaging", "shelfNo", "recordLevel"],
    stock: [
      "pharmacyProduct",
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-primary-50 font-bold">Inventory Management</h2>
        <div className="space-x-2">
          <button
            onClick={() => openModal("inventory")}
            className="bg-[#4F7942] text-white px-4 py-1 h-10 rounded-full hover:bg-hf-100"
          >
            Add Inventory
          </button>
          <button
            onClick={() => openModal("stock")}
            className="bg-[#4F7942] text-white px-4 py-1 h-10 rounded-full hover:bg-hf-100"
          >
            Add Stock
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 bg-[#acc5b0ff] rounded-full">
        <input
          type="text"
          placeholder="Search anything..."
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
                  {[
                    ...new Set(
                      products.flatMap((item) => Object.keys(item))
                    ),
                  ].map((key) => (
                    <th key={key} className="px-4 py-2">
                      {key}
                    </th>
                  ))}
                </tr>
                <tr className="colspan-4 h-3"></tr>
              </thead>
              <tbody className="text-left">
                {paginatedProducts.map((product, idx) => (
                  <tr key={idx} className="border-b">
                    {Object.values(product).map((value, i) => (
                    <td key={i} className="px-4 py-2 text-xs font-medium">
                        {value instanceof Date
                        ? value.toLocaleDateString() // Or value.toISOString()
                        : value?.toString()}
                    </td>
                    ))}
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
            <h2 className="text-xl text-primary-50 font-semibold mb-4">
              {modalType === "inventory" ? "Add New Inventory" : "Add New Stock"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {fieldsByType[modalType].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={newEntry[field] || ""}
                  onChange={handleChange}
                  className="border text-xs border-gray-300 font-semibold text-primary-50 px-3 py-2 rounded w-full"
                />
              ))}
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
