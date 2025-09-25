import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { counterIndex } from "../constants"; // adjust path if needed

// Dummy sales data per counter
const dummySales = [
  { counterName: "Counter 1", date: "2025-09-21", name: "Ahmed Khan", email: "ahmed.khan@example.com" },
  { counterName: "Counter 1", date: "2025-09-22", name: "Ahmed Khan", email: "ahmed.khan@example.com" },
  { counterName: "Counter 1", date: "2025-09-23", name: "Ahmed Khan", email: "ahmed.khan@example.com" },
];

const ITEM_PER_PAGE = 5;

const CounterDetail = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { name } = useParams();
  const decodedName = decodeURIComponent(name);

  const counter = counterIndex.find((c) => c.name === decodedName);

  const salesByThisCounter = dummySales.filter(
    (s) => s.counterName === counter?.counterName
  );

  if (!counter) {
    return <div className="p-6 text-white">Counter not found!</div>;
  }

  const filteredItems = salesByThisCounter.filter((sale) =>
    sale.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  return (
    <div className="p-10">
      <div className="flex justify-between gap-2 items-center mb-2">
        <div className="rounded-full px-4 py-2 bg-[#4F7942]">
          <Link to="/pos/customer/counter" className="text-sm text-white">← Back</Link>
        </div>
      </div>
      <h2 className="text-2xl text-white font-semibold mb-6">
        Datewise Sales for {counter.counterName}
      </h2>

      {/* Search Input */}
      <div className="mb-4 bg-[#acc5b0ff] rounded-full">
        <input
          type="date"
          placeholder="Search by date (e.g. 2025-09-22)"
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm rounded-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-y-auto mt-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <table className="w-full table-auto text-white text-sm">
          <thead className="text-left text-xs uppercase bg-bg-50 h-10 text-white/80">
            <tr>
              <th className="px-4 py-2 border-b border-white/10">Date</th>
              <th className="px-4 py-2 border-b border-white/10">Name</th>
              <th className="px-4 py-2 border-b border-white/10">Email</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((sale, idx) => (
              <tr
                key={idx}
                className="hover:bg-white/10 transition-all duration-200"
              >
                <td className="px-4 py-2 border-b border-white/10 font-medium">
                  <Link
                    to={`/pos/sale-detail/${encodeURIComponent(sale.name)}/${encodeURIComponent(sale.date)}`}
                    className="text-blue-300 hover:text-blue-500 hover:underline"
                  >
                    {sale.date}
                  </Link>
                </td>
                <td className="px-4 py-2 border-b border-white/10">{sale.name}</td>
                <td className="px-4 py-2 border-b border-white/10">{sale.email}</td>
              </tr>
            ))}
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
          <span className="text-sm text-gray-300">
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

export default CounterDetail;
