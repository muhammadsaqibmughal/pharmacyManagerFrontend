import { useState, useEffect } from "react";
import { addSupplier, getSupplier } from "../api/supplierAPI";
import { useTheme } from "../theme-support/ThemeContext";

const ITEMS_PER_PAGE = 8;

const Supplier = () => {
  const { theme } = useTheme();

  const [supplierData, setSupplierData] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // -------------------------
  // Fetch suppliers
  // -------------------------
  const fetchSuppliers = async () => {
    try {
      const response = await getSupplier();

      console.log(response);
    
      if (response?.status ===200) {
        setSupplierData(response.data ?? []);
      } else {
        console.error("Failed to fetch suppliers:", response?.message);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // -------------------------
  // Filtering & Pagination
  // -------------------------
  const filteredSuppliers = supplierData.filter((s) =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);

  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // -------------------------
  // Add supplier
  // -------------------------
  const handleAddSupplier = async () => {
    try {
      const response = await addSupplier(newSupplier);
      console.log(response);

      if (response?.status === 201 || response.status==200) {
        resetForm();
        setShowModal(false);
        fetchSuppliers();
      } else {
        alert(response?.message || "Failed to add supplier");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while adding supplier.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setNewSupplier({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  return (
    <div
      className={`mt-8 p-10 ${
        theme === "dark" ? "bg-dark-50" : "bg-light-50"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 max-md:flex-col max-md:gap-3">
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white/90" : "text-primary-50"
          }`}
        >
          Suppliers Data
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-bg-50 hover:bg-selected-50 text-white px-4 py-1 h-10 rounded-full cursor-pointer"
        >
          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
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
          <thead className="text-sm text-left uppercase h-11 bg-bg-50 text-white/80">
            <tr
              className={`border-b ${
                theme === "dark" ? "border-white/20" : "border-black/20"
              }`}
            >
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Address</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSuppliers.map((s, idx) => (
              <tr
                key={idx}
                className={`px-4 py-2 text-xs font-medium border-b ${
                  theme === "dark" ? "border-white/40" : "border-black/50"
                }`}
              >
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2">{s.phone}</td>
                <td className="px-4 py-2">{s.address}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          className={`flex justify-between items-center px-4 py-3 border-t ${
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
            className={`text-sm ${
              theme === "dark" ? "text-light-50" : "text-primary-50"
            }`}
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
            } backdrop-blur-lg shadow-lg`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${
                theme === "dark" ? "text-light-50" : "text-primary-50"
              }`}
            >
              Add New Supplier
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newSupplier.name}
                onChange={handleChange}
                className={`text-xs font-semibold px-3 py-2 rounded-full w-full border ${
                  theme === "dark"
                    ? "border-gray-300 text-white/90"
                    : "border-black/40 text-primary-50"
                }`}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newSupplier.email}
                onChange={handleChange}
                className={`text-xs font-semibold px-3 py-2 rounded-full w-full border ${
                  theme === "dark"
                    ? "border-gray-300 text-white/90"
                    : "border-black/40 text-primary-50"
                }`}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={newSupplier.phone}
                onChange={handleChange}
                className={`text-xs font-semibold px-3 py-2 rounded-full w-full border ${
                  theme === "dark"
                    ? "border-gray-300 text-white/90"
                    : "border-black/40 text-primary-50"
                }`}
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={newSupplier.address}
                onChange={handleChange}
                className={`text-xs font-semibold px-3 py-2 rounded-full w-full border ${
                  theme === "dark"
                    ? "border-gray-300 text-white/90"
                    : "border-black/40 text-primary-50"
                }`}
              />
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
                onClick={handleAddSupplier}
                className="px-4 py-2 bg-bg-50 hover:bg-selected-50 text-white rounded-full"
              >
                Add Supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;
