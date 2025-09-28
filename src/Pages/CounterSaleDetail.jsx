import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { counterIndex, itemIndex } from "../constants";

const ITEM_PER_PAGE = 10;

const CounterSaleDetail = () => {
  const { name, date } = useParams();
  const decodedName = decodeURIComponent(name);
  const decodedDate = decodeURIComponent(date);

  const counterInfo = counterIndex.find((c) => c.name === decodedName);
  const [purchaseData] = useState(itemIndex); // show all items
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(purchaseData.length / ITEM_PER_PAGE);
  const paginatedProducts = purchaseData.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  // ✅ Calculate total price of paginated products
  const totalPrice = paginatedProducts.reduce(
    (acc, item) => acc + item.price,
    0
  );

  if (!counterInfo) {
    return <div className="p-10 text-white">Counter not found!</div>;
  }

  return (
    <div
      className={`mt-8 p-10 ${
        theme === "dark" ? "bg-dark-50" : " bg-light-50"
      }`}
    >
      {" "}
      {/* Header */}
      <div className="flex justify-between gap-2 items-center mb-2">
        <div className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-2 h-10 rounded-full hover:bg-hf-100">
          <Link to="/pos/purchase/purchase" className="text-sm text-primary-50">
            ← Back
          </Link>
        </div>
      </div>
      {/* Sale Info */}
      <div
        className={`flex flex-col w-full items-center justify-center text-center space-y-2 ${
          theme === "dark" ? "text-white/90" : " text-primary-50"
        }`}
      >
        <h2 className="text-2xl font-bold">{counterInfo.counterName}</h2>
        <p className="text-sm">{counterInfo.name}</p>
        <p className="text-sm">{counterInfo.email}</p>
        <p className="text-sm">
          <b>Date:</b> {decodedDate}
        </p>
        <h1 className="mt-5 border-2 w-50 font-bold text-2xl">Invoice</h1>
      </div>
      {/* Table */}
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
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {paginatedProducts.map((product, idx) => (
              <tr
                key={idx}
                className={` px-4 py-2 text-xs font-medium border-b ${
                  theme === "dark" ? " border-white/40" : " border-black/50"
                }`}
              >
                <td className="px-4 py-2 text-xs font-medium">
                  {product.item}
                </td>
                <td className="px-4 py-2 text-xs font-medium">
                  {product.quantity}
                </td>
                <td className="px-4 py-2 text-xs font-medium">
                  {product.price}
                </td>
              </tr>
            ))}

            {/* ✅ Total Price Row */}
            <tr className=" text-[11px] font-bold ">
              <td className="px-4 py-2 text-xs font-bold">Total</td>
              <td className="px-4 py-2 text-xs font-medium"></td>
              <td className="px-4 py-2 text-xs font-bold">{totalPrice}</td>
            </tr>
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
    </div>
  );
};

export default CounterSaleDetail;
