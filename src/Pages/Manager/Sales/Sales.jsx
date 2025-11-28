import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../theme-support/ThemeContext";
import { getSales } from "../../../api/posAPI";

import Loader from "../../../components/common/Loader";
import MainHeader from "../../../components/common/MainHeader";
import Pagination from "../../../components/common/Pagination";
import Table from "../../../components/common/Table";
import Search from "../../../components/common/Search";

const ITEM_PER_PAGE = 10;

const Sales = () => {
  const { theme } = useTheme();

  const [sales, setSales] = useState([]); // all sales fetched from backend
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Sales from backend
  const fetchSales = async () => {
    try {
      setIsLoading(true);
      const res = await getSales({
        page: 1, // fetch all items for frontend pagination
        limit: 1000, // adjust as needed to get all sales
        search: searchTerm,
      });

      if (res?.sales) {
        setSales(res.sales);
        setTotalPages(Math.ceil(res.sales.length / ITEM_PER_PAGE));
      }
    } catch (err) {
      console.error("Failed to fetch sales:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [searchTerm]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ---------------- Table Columns ----------------
  const columns = [
    { key: "invoiceNo", label: "Invoice No" },
    { key: "date", label: "Date" },
    { key: "counterName", label: "Counter Name" },
    { key: "totalItems", label: "Items" },
    { key: "totalAmount", label: "Amount" },
    { key: "paymentMode", label: "Payment" },
  ];

  // ---------------- Paginate Data ----------------
  const paginatedSales = sales.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  // ---------------- Map Table Data ----------------
  const tableData = paginatedSales.map((sale) => ({
    invoiceNo: (
      <Link
        to={`/pos/sale-detail/${sales.id}`}
        state={{ sale }} // pass the entire sale object
        className="text-blue-500 hover:underline"
      >
        {sale.invoiceNo || "N/A"}
      </Link>
    ),
    date: sale.createdAt?.slice(0, 10) || "N/A",
    counterName: sale.posCounter?.name || "N/A",
    totalItems: sale.items?.length || 0,
    totalAmount: sale.totalAmount || 0,
    paymentMode: sale.paymentMode || "N/A",
  }));

  return (
    <div className="mt-8 p-10">
      <MainHeader title="Sales Data" theme={theme} />

      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        type="date"
      />

      {isLoading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={tableData}
          theme={theme}
          pagination={
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              theme={theme}
            />
          }
        />
      )}
    </div>
  );
};

export default Sales;
