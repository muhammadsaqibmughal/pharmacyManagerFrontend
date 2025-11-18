import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addPurchase, getPurchase } from "../api/purchaseAPI";
import { getSupplier } from "../api/supplierAPI";
import { useTheme } from "../theme-support/ThemeContext";

const ITEM_PER_PAGE = 5;

const Purchase = () => {
  const { theme } = useTheme();

  const [purchaseData, setPurchaseData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [newPurchase, setNewPurchase] = useState({
    supplierId: "",
    invoiceNo: "",
    purchaseDate: "",
    totalAmount: "",
    discount: "",
    tax: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch purchases + suppliers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const purchasesRes = await getPurchase({ page: currentPage, limit: ITEM_PER_PAGE, search: searchTerm });
        setPurchaseData(purchasesRes?.data?.purchases || []);
        setTotalPages(purchasesRes?.data?.totalPages || 1);

        const supplierRes = await getSupplier();
        setSuppliers(supplierRes?.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [currentPage, searchTerm]);

  // Extract supplier info safely
  const getSupplierName = (purchase) => purchase.supplier?.name || "-";
  const getSupplierContact = (purchase) => purchase.supplier?.phone || "-";

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase({ ...newPurchase, [name]: value });
  };

  // Reset form
  const resetForm = () => {
    setNewPurchase({
      supplierId: "",
      invoiceNo: "",
      purchaseDate: "",
      totalAmount: "",
      discount: "",
      tax: "",
    });
  };

  // Validation
  const validateForm = () => {
    if (!newPurchase.supplierId) return "Supplier is required";
    if (!newPurchase.invoiceNo.trim()) return "Invoice number is required";
    if (!newPurchase.purchaseDate) return "Purchase date is required";
    if (!newPurchase.totalAmount || isNaN(newPurchase.totalAmount)) return "Total amount must be a number";
    return null;
  };

  // Handle add purchase
  const handleAddPurchase = async () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    const purchasePayload = {
      ...newPurchase,
      totalAmount: parseFloat(newPurchase.totalAmount) || 0,
      discount: newPurchase.discount ? parseFloat(newPurchase.discount) : null,
      tax: newPurchase.tax ? parseFloat(newPurchase.tax) : null,
    };

    try {
      const response = await addPurchase(purchasePayload);
      if (response?.status === 201 || response?.status === 200) {
        const purchasesRes = await getPurchase({ page: currentPage, limit: ITEM_PER_PAGE, search: searchTerm });
        setPurchaseData(purchasesRes?.data?.purchases || []);
        setTotalPages(purchasesRes?.data?.totalPages || 1);

        resetForm();
        setShowModal(false);
      } else {
        alert(response?.message || "Failed to add purchase");
      }
    } catch (err) {
      console.error(err);
      alert("Error while adding purchase");
    }
  };

  return (
    <div className={`mt-8 p-10 ${theme === "dark" ? "bg-dark-50" : "bg-light-50"}`}>
      {/* Header */}
      <div className="flex justify-between max-md:flex-col max-md:gap-2 max-md:justify-center items-center mb-4">
        <h2 className={`text-2xl ${theme === "dark" ? "text-white/90" : "text-primary-50"} font-bold`}>
          Purchase Data
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-1 h-10 rounded-full hover:bg-hf-100"
        >
          Add New Purchase
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search by supplier name..."
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
        />
      </div>

      {/* Table */}
      <div className={`table-Main ${theme === "dark" ? "border-white/10 bg-white/10" : "border-black/10 bg-white/60"}`}>
        <table className={`w-full table-auto ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
          <thead className="text-sm text-left h-11 uppercase bg-bg-50 text-white/80">
            <tr className={`border-b ${theme === "dark" ? "border-white/20" : "border-black/20"}`}>
              <th className="px-4 py-2">Supplier</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Invoice No</th>
              <th className="px-4 py-2">Purchase Date</th>
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Discount</th>
              <th className="px-4 py-2">Tax</th>
            </tr>
          </thead>
          <tbody>
            {purchaseData.length > 0 ? (
              purchaseData.map((purchase, idx) => (
                <tr
                  key={idx}
                  className={`px-4 py-2 text-xs font-medium border-b ${theme === "dark" ? "border-white/40" : "border-black/50"}`}
                >
                  <td className="px-4 py-2 text-xs font-medium">
                    <Link
                      to={`/pos/purchase/${purchase.id}`}
                      className="text-blue-500 hover:text-blue-700 hover:underline"
                    >
                      {getSupplierName(purchase)}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-xs font-medium">{getSupplierContact(purchase)}</td>
                  <td className="px-4 py-2 text-xs font-medium">{purchase.invoiceNo || "-"}</td>
                  <td className="px-4 py-2 text-xs font-medium">
                    {purchase.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-2 text-xs font-medium">{purchase.totalAmount}</td>
                  <td className="px-4 py-2 text-xs font-medium">{purchase.discount || 0}</td>
                  <td className="px-4 py-2 text-xs font-medium">{purchase.tax || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-2 text-center text-gray-400">
                  No purchases found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          className={`flex justify-between items-center px-4 py-3 border-t ${theme === "dark" ? "bg-white/20 border-white/20" : "bg-white/10 border-white/20"}`}
        >
          <button
            className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className={`text-sm text-center ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-10">
          <div
            className={`rounded-xl p-5 border ${
              theme === "dark" ? "border-white/20 bg-white/10" : "border-white/40 bg-white/90"
            } backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]`}
          >
            <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
              Add New Purchase
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="supplierId"
                value={newPurchase.supplierId}
                onChange={handleChange}
                className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${
                  theme === "dark" ? "border-gray-300 text-white/90" : "border-black/40 text-primary-50"
                }`}
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id} className="text-primary-50">
                    {s.name}
                  </option>
                ))}
              </select>
              {["invoiceNo", "purchaseDate", "totalAmount", "discount", "tax"].map((field) => (
                <input
                  key={field}
                  type={field === "purchaseDate" ? "date" : "text"}
                  name={field}
                  placeholder={field}
                  value={newPurchase[field]}
                  onChange={handleChange}
                  className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${
                    theme === "dark" ? "border-gray-300 text-white/90" : "border-black/40 text-primary-50"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 rounded-full bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button onClick={handleAddPurchase} className="px-4 py-2 bg-bg-50 text-white rounded-full hover:bg-hf-100">
                Add Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchase;
