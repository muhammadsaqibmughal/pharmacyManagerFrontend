import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createCounter, getCounterList } from "../api/counterAPI";
import { useTheme } from "../theme-support/ThemeContext";

const ITEM_PER_PAGE = 5;

const Counter = () => {
  const { theme } = useTheme();

  const [counterData, setCounterData] = useState([]);
  const [newCounter, setNewCounter] = useState({
    name: "",
    email: "",
    hasPrinter: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered data
  const filteredItems = counterData.filter((product) =>
    (product.counterName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  // Fetch counters from API
  const fetchCounters = async () => {
    try {
      const response = await getCounterList();
      setCounterData(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching counters", err.message);
    }
  };

  useEffect(() => {
    fetchCounters();
  }, []);

  // Add new counter
  const handleAddCounter = async () => {
    try {
      const response = await createCounter(newCounter);
      if (response.status === "success") {
        alert("Counter created successfully!");
        fetchCounters();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error creating new counter", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCounter({ ...newCounter, [name]: value });
  };

  const resetForm = () => {
    setNewCounter({
      name: "",
      email: "",
      hasPrinter: false,
    });
  };

  return (
    <div
      className={`mt-8 p-10 ${theme === "dark" ? "bg-dark-50" : "bg-light-50"}`}
    >
      {/* Top Bar */}
      <div className="flex justify-between max-md:flex-col max-md:gap-2 items-center mb-4">
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white/90" : "text-primary-50"
          }`}
        >
          All Counters
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-bg-50 hover:bg-selected-50 text-white px-4 py-1 h-10 rounded-full"
        >
          Add New Counter
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search by counter name..."
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div
        className={`table-Main ${
          theme === "dark"
            ? "bg-white/10 border-white/10"
            : "bg-white/60 border-black/10"
        }`}
      >
        <table
          className={`w-full table-auto ${
            theme === "dark" ? "text-light-50" : "text-primary-50"
          }`}
        >
          <thead className="text-sm text-left uppercase bg-bg-50 text-white/80">
            <tr
              className={`border-b ${
                theme === "dark" ? "border-white/20" : "border-black/20"
              }`}
            >
              <th className="px-4 py-2">Counter Name</th>
              <th className="px-4 py-2">Staff Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Printer Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((product, idx) => {
              // Get unique users who created sales for this counter
              const usersMap = new Map();
              (product.sales || []).forEach((sale) => {
                if (sale.createdBy?.id && !usersMap.has(sale.createdBy.id)) {
                  usersMap.set(sale.createdBy.id, sale.createdBy);
                }
              });
              const uniqueUsers = Array.from(usersMap.values());
              const mainStaff = uniqueUsers[0] || {};

              return (
                <tr
                  key={idx}
                  className={`text-xs font-medium border-b ${
                    theme === "dark" ? "border-white/40" : "border-black/50"
                  }`}
                >
                  {/* Counter Name */}
                  <td className="px-4 py-2 align-top">
                    <Link
                      to={`/pos/counter-detail`}
                      state={{ counter: product, sales: product.sales }}
                      className="text-blue-600 hover:underline"
                    >
                      {product.counterName || "N/A"}
                    </Link>
                  </td>

                  {/* Staff Name */}
                  <td className="px-4 py-2">{mainStaff.name || "N/A"}</td>

                  {/* Email */}
                  <td className="px-4 py-2">{mainStaff.email || "N/A"}</td>

                  {/* Printer Status */}
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-[11px] font-semibold ${
                        product.hasPrinter ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {product.hasPrinter ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              );
            })}
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
          <span className="text-sm text-gray-300">
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
            className={`rounded-xl p-5 border backdrop-blur-lg shadow-lg ${
              theme === "dark"
                ? "border-white/20 bg-white/10"
                : "border-white/40 bg-white/90"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${
                theme === "dark" ? "text-light-50" : "text-primary-50"
              }`}
            >
              Add New Counter
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newCounter.name}
                onChange={handleChange}
                className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${
                  theme === "dark"
                    ? "border-gray-300 text-white/90"
                    : "border-black/40 text-primary-50"
                }`}
              />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={newCounter.email}
                onChange={handleChange}
                className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${
                  theme === "dark"
                    ? "border-gray-300 text-white/90"
                    : "border-black/40 text-primary-50"
                }`}
              />
              <select
                name="hasPrinter"
                value={newCounter.hasPrinter}
                onChange={(e) =>
                  setNewCounter({
                    ...newCounter,
                    hasPrinter: e.target.value === "true",
                  })
                }
                className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${
                  theme === "dark"
                    ? "border-gray-300 text-white/90"
                    : "border-black/40 text-primary-50"
                }`}
              >
                <option value="false">No Printer</option>
                <option value="true">Has Printer</option>
              </select>
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
                onClick={handleAddCounter}
                className="px-4 py-2 bg-bg-50 hover:bg-selected-50 text-white rounded-full hover:bg-hf-100"
              >
                Add Counter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Counter;
