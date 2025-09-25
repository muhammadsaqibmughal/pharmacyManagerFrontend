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
  const totalPrice = paginatedProducts.reduce((acc, item) => acc + item.price, 0);

  if (!counterInfo) {
    return <div className="p-10 text-white">Counter not found!</div>;
  }

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex justify-between gap-2 items-center mb-2">
        <div className="rounded-full px-4 py-2 bg-[#4F7942]">
          <Link to="/pos/customer/counter" className="text-sm text-white">← Back</Link>
        </div>
      </div>

      {/* Sale Info */}
      <div className="flex flex-col w-full items-center justify-center text-center space-y-2 text-white/90">
        <h2 className="text-2xl font-bold">{counterInfo.counterName}</h2>
        <p className="text-sm">{counterInfo.name}</p>
        <p className="text-sm">{counterInfo.email}</p>
        <p className="text-sm"><b>Date:</b> {decodedDate}</p>
        <h1 className="mt-5 border-2 w-50 font-bold text-2xl">Invoice</h1>
      </div>

      {/* Table */}
      <div className="overflow-y-auto mt-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <table className="w-full table-auto text-white">
          <thead className="text-[10px] text-left uppercase bg-bg-50 text-white/80">
            <tr>
              <th className="px-4 py-3 border-b border-white/10">Item</th>
              <th className="px-2 py-1 border-b border-white/10">Quantity</th>
              <th className="px-2 py-1 border-b border-white/10">Price</th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {paginatedProducts.map((product, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-2 border-b border-white/10">{product.item}</td>
                <td className="px-4 py-2 border-b border-white/10">{product.quantity}</td>
                <td className="px-4 py-2 border-b border-white/10">{product.price}</td>
              </tr>
            ))}

            {/* ✅ Total Price Row */}
            <tr className="bg-white/5 text-[11px] font-bold text-white">
              <td className="px-4 py-2 border-t border-white/10">Total</td>
              <td className="px-4 py-2 border-t border-white/10"></td>
              <td className="px-4 py-2 border-t border-white/10">{totalPrice}</td>
            </tr>
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 bg-white/10 border-t border-white/10">
          <button
            className="px-4 py-1 bg-[#4F7942] text-white rounded-full disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-1 bg-[#4F7942] text-white rounded-full disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
