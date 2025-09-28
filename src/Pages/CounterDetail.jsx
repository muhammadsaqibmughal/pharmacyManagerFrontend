import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { counterIndex } from "../constants"; // adjust path if needed

// Dummy sales data per counter
const dummySales = [
  {
    counterName: "Counter 1",
    date: "2025-09-21",
    name: "Ahmed Khan",
    email: "ahmed.khan@example.com",
  },
  {
    counterName: "Counter 1",
    date: "2025-09-22",
    name: "Ahmed Khan",
    email: "ahmed.khan@example.com",
  },
  {
    counterName: "Counter 1",
    date: "2025-09-23",
    name: "Ahmed Khan",
    email: "ahmed.khan@example.com",
  },
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
    <div
      className={`mt-8 p-10 ${
        theme === "dark" ? "bg-dark-50" : " bg-light-50"
      }`}
    >
      <div className="flex justify-between gap-2 items-center mb-2">
        <div className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-2 h-10 rounded-full hover:bg-hf-100">
          <Link to="/pos/purchase/purchase" className="text-sm text-primary-50">
            ← Back
          </Link>
        </div>
      </div>
      <h2
        className={`text-2xl ${
          theme === "dark" ? "text-white/90" : " text-primary-50"
        }  font-bold`}
      >
        {" "}
        Datewise Sales for {counter.counterName}
      </h2>

      {/* Search Input */}
      <div className="mb-4 bg-search-50 rounded-full">
        <input
          type="date"
          placeholder="Search by date (e.g. 2025-09-22)"
          className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm rounded-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              {" "}
              <th className="px-4 py-2 ">Date</th>
              <th className="px-4 py-2 ">Name</th>
              <th className="px-4 py-2 ">Email</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((sale, idx) => (
              <tr
                key={idx}
                className={` px-4 py-2 text-xs font-medium border-b ${
                  theme === "dark" ? " border-white/40" : " border-black/50"
                }`}
              >
                <td className="px-4 py-2 text-xs font-medium">
                  <Link
                    to={`/pos/sale-detail/${encodeURIComponent(
                      sale.name
                    )}/${encodeURIComponent(sale.date)}`}
                    className="text-blue-300 hover:text-blue-500 hover:underline"
                  >
                    {sale.date}
                  </Link>
                </td>
                <td className="px-4 py-2 text-xs font-medium">{sale.name}</td>
                <td className="px-4 py-2 text-xs font-medium">{sale.email}</td>
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
    </div>
  );
};

export default CounterDetail;
