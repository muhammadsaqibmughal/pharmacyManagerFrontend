import { useState, useEffect } from "react";
import { addSupplier, getSupplier } from "../api/supplierAPI";
import { useTheme } from "../theme-support/ThemeContext";

const ITEM_PER_PAGE = 8;

const Supplier = () => {
  const { theme } = useTheme();

  const [supplierData, setSupplierData] = useState([]);
  const [newUser, setNewUser] = useState({
    supplier: "",
    name: "",
    email: "",
    contact: "",
    address: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // get supplier
  useEffect(() => {
    const getSupl = async () => {
      try {
        const response = await getSupplier();
        setSupplierData(Array.isArray(response.data) ? response.data : []);
        console.log("supplier",response )
      } catch (e) {
        console.log(e);
      }
    };
    getSupl();
  }, []);
  // ****** Filter Supllier Data ****
  const filteredItems = supplierData.filter((product) => {
    const term = searchTerm.toLowerCase();
    return product.name.toLowerCase().includes(term);
  });

  // *********** Table Pages Per Page **********
  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  // ************* handle Addind New Supplier **********
  const handleAddSupplier = async () => {
    try {
      const response = await addSupplier(newUser); // await here

      if (response?.status === "success") {
        resetForm();
        setShowModal(false);
        // refresh list
        const updatedList = await getSupplier();
        setSupplierData(
          Array.isArray(updatedList.data) ? updatedList.data : []
        );
      } else {
        alert("Failed to add supplier. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Error occurred while adding supplier.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  // *********** CLear Form Fields *************
  const resetForm = () => {
    setNewUser({
      supplier: "",
      name: "",
      email: "",
      contact: "",
      address: "",
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
          Suppliers Data
        </h2>
        <div className="space-x-2  max-md:flex">
          <button
            onClick={() => setShowModal(true)}
            className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-1 h-10 rounded-full hover:bg-hf-100"
          >
            Add Supplier
          </button>
        </div>
      </div>

      {/* ********* Search Bar ********** */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="text"
          placeholder="Search by name..."
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
          <thead className="text-sm text-left uppercase h-11 bg-bg-50 text-white/80">
            <tr
              className={`border-b ${
                theme === "dark" ? " border-white/20" : " border-black/20"
              }`}
            >
              <th className="px-4 py-2">Supplier</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone No</th>
              <th className="px-4 py-2">Address</th>
            </tr>
            {/* <tr className=" col-span-6  h-3"></tr> */}
          </thead>
          <tbody>
            {paginatedProducts.map((product, idx) => (
              <tr
                key={idx}
                className={` px-4 py-2 text-xs font-medium border-b ${
                  theme === "dark" ? " border-white/40" : " border-black/50"
                }`}
              >
                <td className="px-4 py-2 text-xs font-medium ">
                  {product.supplier}
                </td>
                <td className="px-4 py-2 text-xs font-medium ">
                  {product.name}
                </td>
                <td className="px-4 py-2 text-xs font-medium ">
                  {product.email}
                </td>
                <td className="px-4 py-2 text-xs font-medium ">
                  {product.contact}
                </td>
                <td className="px-4 py-2 text-xs font-medium ">
                  {product.address}
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
          {" "}
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
            {" "}
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
              {" "}
              Add New Supplier
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(newUser).map((field) => (
                <div className="relative" key={field}>
                  <input
                    type="text"
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={newUser[field]}
                    onChange={handleChange}
                    className={`border-1 text-xs  font-semibold px-3 py-2 rounded-full w-full ${
                      theme === "dark"
                        ? "border-gray-300 text-white/90"
                        : "border-black/40 text-primary-50"
                    }`}
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
                className="px-4 py-2 rounded-full bg-gray-400 text-white hover:bg-white/80 hover:text-primary-50 "
              >
                Cancel
              </button>
              <button
                onClick={handleAddSupplier}
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

export default Supplier;
