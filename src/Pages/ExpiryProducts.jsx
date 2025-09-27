import { useState, useEffect } from "react";
import { addSupplier, getSupplier } from "../api/supplierAPI";
import { useTheme } from "../theme-support/ThemeContext";
import { productList } from "../constants";

const ITEM_PER_PAGE = 8;

const ExpiryProducts = () => {
  const { theme } = useTheme();

  const [expiryData, setExpiryData] = useState(productList);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // get Expiry Product
  // useEffect(() => {
  //   const getExp = async () => {
  //     try {
  //       const response = await getSupplier();
  //       setExpiryData(Array.isArray(response.data) ? response.data : []);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   getExp();
  // }, []);

  // ****** Filter Supllier Data ****
  const filteredItems = expiryData.filter((product) => {
    const term = searchTerm.toLowerCase();
    return product.productName.toLowerCase().includes(term);
  });

  // *********** Table Pages Per Page **********
  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
          Near Expiry Product
        </h2>
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
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Expiry Date</th>
              <th className="px-4 py-2">Days Left</th>
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
                  {product.productName}
                </td>
                <td className="px-4 py-2 text-xs font-medium ">
                  {product.quantity}
                </td>
                <td className="px-4 py-2 text-xs font-medium ">
                  {product.expiryDate}
                </td>
                <td className="px-4 py-2 text-xs font-medium ">
                  {product.daysLeft}
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
    </div>
  );
};

export default ExpiryProducts;
