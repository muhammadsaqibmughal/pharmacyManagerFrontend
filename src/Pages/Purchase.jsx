import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addPurchase, getPurchase } from "../api/purchaseAPI";
import { getSupplier } from "../api/supplierAPI";

const ITEM_PER_PAGE = 5;

const Purchase = () => {
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

  // Fetch purchases + suppliers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const purchasesRes = await getPurchase();
        if (
          purchasesRes?.status === "success" &&
          Array.isArray(purchasesRes.data)
        ) {
          setPurchaseData(purchasesRes.data);
        }

        const supplierRes = await getSupplier();
        if (
          supplierRes?.status === "success" &&
          Array.isArray(supplierRes.data)
        ) {
          setSuppliers(supplierRes.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Extract supplier name safely
  const getSupplierName = (supplier) => {
    if (typeof supplier === "string") return supplier;
    if (typeof supplier === "object" && supplier?.name) return supplier.name;
    return "Unknown";
  };

  // Extract supplier contact safely
  const getSupplierContact = (supplier) => {
    if (typeof supplier === "object" && supplier?.contact)
      return supplier.contact;
    return "-";
  };

  // Filter purchases by supplier name
  const filteredItems = purchaseData.filter((purchase) => {
    const term = searchTerm.toLowerCase();
    return getSupplierName(purchase.supplier).toLowerCase().includes(term);
  });

  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

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
    if (!newPurchase.totalAmount || isNaN(newPurchase.totalAmount))
      return "Total amount must be a number";
    return null;
  };

  // Handle add purchase
  const handleAddPurchase = async () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    // Convert to float before sending
    const purchasePayload = {
      ...newPurchase,
      totalAmount: parseFloat(newPurchase.totalAmount) || 0,
      discount: newPurchase.discount ? parseFloat(newPurchase.discount) : null,
      tax: newPurchase.tax ? parseFloat(newPurchase.tax) : null,
    };

    try {
      const response = await addPurchase(purchasePayload);
      if (response?.status === "success") {
        // refresh purchases
        const purchasesRes = await getPurchase();
        if (
          purchasesRes?.status === "success" &&
          Array.isArray(purchasesRes.data)
        ) {
          setPurchaseData(purchasesRes.data);
        }

        resetForm();
        setShowModal(false);
      } else {
        alert("Failed to add purchase");
      }
    } catch (err) {
      console.error(err);
      alert("Error while adding purchase");
    }
  };

  return (
    <div className="mt-8 p-10">
      {/* Header */}
      <div className="flex justify-between max-md:flex-col max-md:gap-2 max-md:justify-center items-center mb-4">
        <h2 className="text-2xl text-primary-50 max-md:text-xl font-bold">
          Purchase Data
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#4F7942] text-white max-md:text-sm px-4 py-1 h-10 rounded-full hover:bg-hf-100"
        >
          Add New Purchase
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 bg-[#acc5b0ff] rounded-full">
        <input
          type="text"
          placeholder="Search by supplier name..."
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-y-auto mt-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-lg">
        <table className="w-full table-auto text-primary-50">
          <thead className="text-xs text-left uppercase bg-bg-50 text-white/80">
            <tr>
              <th className="px-4 py-2 border-b">Supplier</th>
              <th className="px-4 py-2 border-b">Contact</th>
              <th className="px-4 py-2 border-b">Invoice No</th>
              <th className="px-4 py-2 border-b">Purchase Date</th>
              <th className="px-4 py-2 border-b">Total Amount</th>
              <th className="px-4 py-2 border-b">Discount</th>
              <th className="px-4 py-2 border-b">Tax</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((purchase, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-white/10 transition-all duration-200"
                >
                  <td className="px-4 py-2 border-b">
                    <Link
                      to={`/pos/purchase/${purchase.id}`} 
                      className="text-blue-300 hover:text-blue-500 hover:underline"
                    >
                      {getSupplierName(purchase.supplier)}{" "}
                     
                    </Link>
                  </td>

                  <td className="px-4 py-2 border-b">
                    {getSupplierContact(purchase.supplier)}
                  </td>
                  <td className="px-4 py-2 border-b">{purchase.invoiceNo}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b">{purchase.totalAmount}</td>
                  <td className="px-4 py-2 border-b">{purchase.discount}</td>
                  <td className="px-4 py-2 border-b">{purchase.tax}</td>
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
        <div className="flex justify-between items-center px-4 py-3 bg-white/10 border-t">
          <button
            className="px-4 py-1 bg-[#4F7942] text-white rounded-full disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-300">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-10">
          <div className="rounded-xl p-6 w-full max-w-lg border border-white/20 bg-white/10 backdrop-blur-lg shadow-lg">
            <h2 className="text-xl text-white/90 font-semibold mb-4">
              Add New Purchase
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="supplierId"
                value={newPurchase.supplierId}
                onChange={handleChange}
                className="px-3 py-2 rounded-full text-xs bg-white/5 text-white/90 border"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {[
                "invoiceNo",
                "purchaseDate",
                "totalAmount",
                "discount",
                "tax",
              ].map((field) => (
                <input
                  key={field}
                  type={field === "purchaseDate" ? "date" : "text"}
                  name={field}
                  placeholder={field}
                  value={newPurchase[field]}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-full text-xs bg-white/5 text-white/90 border"
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
              <button
                onClick={handleAddPurchase}
                className="px-4 py-2 bg-bg-50 text-white rounded-full hover:bg-hf-100"
              >
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
