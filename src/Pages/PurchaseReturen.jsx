import { useState } from "react";
import { purchaseDataa } from "../constants";
import { Link } from "react-router-dom";
import { useTheme } from "../theme-support/ThemeContext";

const ITEM_PER_PAGE = 5;

const PurchaseReturn = () => {
  const { theme } = useTheme();

  const [purchaseData, setPurchaseData] = useState(purchaseDataa);
  const [newPurchase, setNewPurchase] = useState({
    supplier: "",
    invoiceNo: "",
    purchaseDate: "",
    totalAmount: "",
    discount: "",
    tax: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ****** Filter Supllier Data ****
  const filteredItems = purchaseDataa.filter((product) => {
    const term = searchTerm.toLowerCase();
    return product.supplier.toLowerCase().includes(term);
  });

  // *********** Table Pages Per Page **********
  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  // ************* handle Addind New Supplier **********
  const handleAddPurchase = () => {
    setPurchaseData([newPurchase, ...purchaseData]);
    setShowModal(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase({ ...newPurchase, [name]: value });
  };

  // *********** CLear Form Fields *************
  const resetForm = () => {
    setNewPurchase({
      supplier: "",
      invoiceNo: "",
      purchaseDate: "",
      totalAmount: "",
      discount: "",
      tax: "",
    });
  };

  return (
    <div
      className={`mt-8 p-10 ${
        theme === "dark" ? "bg-dark-50" : " bg-light-50"
      }`}
    >
      {/* *********** TOP ************ */}
      <div className="flex justify-between max-md:flex-col max-md:gap-2 max-md:justify-center items-center mb-4">
        <h2
          className={`text-2xl ${
            theme === "dark" ? "text-white/90" : " text-primary-50"
          }  font-bold`}
        >
          {" "}
          Purchase Return Data
        </h2>
      </div>

      {/* ********* Search Bar ********** */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search by supplier name..."
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ************ Table ************** */}

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
          <thead className="text-sm text-left h-14 uppercase bg-bg-50 text-white/80">
            <tr
              className={`border-b ${
                theme === "dark" ? " border-white/20" : " border-black/20"
              }`}
            >
              {" "}
              <th className="px-4 py-2 ">Supplier</th>
              <th className="px-4 py-2 ">Invoice No</th>
              <th className="px-4 py-2 ">Purchase Date</th>
              <th className="px-4 py-2 ">Total Amount</th>
              <th className="px-4 py-2 ">Discount</th>
              <th className="px-4 py-2 ">Tax</th>
            </tr>
            <tr className=" col-span-6  h-3"></tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product, idx) => (
              <tr
                key={idx}
                className={` px-4 py-2 text-xs font-medium border-b ${
                  theme === "dark" ? " border-white/40" : " border-black/50"
                }`}
              >
                <td className="px-4 py-2 text-xs font-medium">
                  <Link
                    to={`/pos/purchase-return/supplier/${encodeURIComponent(
                      product.supplier
                    )}`}
                    className="text-blue-400 hover:text-blue-600 hover:underline"
                  >
                    {product.supplier}
                  </Link>
                </td>
                <td className="px-4 py-2 text-xs font-medium">
                  {product.invoiceNo}
                </td>
                <td className="px-4 py-2 text-xs font-medium">
                  {new Date(product.purchaseDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-xs font-medium">
                  {product.totalAmount}
                </td>
                <td className="px-4 py-2 text-xs font-medium">
                  {product.discount}
                </td>
                <td className="px-4 py-2 text-xs font-medium">{product.tax}</td>
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
          {" "}
          <button
            className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
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
      {/* {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-10">
          <div className="bg-db-50 p-6 rounded-md w-full max-w-lg">
            <h2 className="text-xl text-primary-50 font-semibold mb-4">Add New Purchase</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(newPurchase).map((field) => (
                <div className="relative" key={field}>
                  <input
                    type="text"
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={newPurchase[field]}
                    onChange={handleChange}
                    className="border text-xs border-gray-300 font-semibold text-primary-50 px-3 py-2 rounded w-full"
                  />
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
                onClick={handleAddPurchase}
                className="px-4 py-2 bg-[#4F7942] text-white rounded hover:bg-hf-100"
              >
                Add Purchase
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default PurchaseReturn;
