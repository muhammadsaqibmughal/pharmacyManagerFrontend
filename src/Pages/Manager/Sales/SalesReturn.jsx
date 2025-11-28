import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../theme-support/ThemeContext";
import { getReturnSales } from "../../../api/posAPI";

import Loader from "../../../components/common/Loader";
import MainHeader from "../../../components/common/MainHeader";
import Pagination from "../../../components/common/Pagination";
import Table from "../../../components/common/Table";
import Search from "../../../components/common/Search";

const ITEM_PER_PAGE = 10;

const SalesReturn = () => {
  const { theme } = useTheme();

  const [returns, setReturns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Return Sales
  const fetchReturns = async () => {
    try {
      setIsLoading(true);
      const res = await getReturnSales({ page: 1, limit: 1000, search: searchTerm });
      if (res?.returnSales) {
        setReturns(res.returnSales);
        setTotalPages(Math.ceil(res.returnSales.length / ITEM_PER_PAGE));
      }
    } catch (err) {
      console.error("Failed to fetch return sales:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [searchTerm]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ---------------- Table Columns ----------------
  const columns = [
    { key: "invoiceNo", label: "Invoice No" },
    { key: "returnDate", label: "Return Date" },
    { key: "totalAmount", label: "Total Amount" },
  ];

  // ---------------- Paginate Data ----------------
  const paginatedReturns = returns.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  // ---------------- Map Table Data ----------------
  const tableData = paginatedReturns.map((ret) => {
    const totalAmount = ret.items?.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    return {
      invoiceNo: (
        <Link
          to={`/pos/sales/salesReturn/${ret.id}`}
          state={{ returnData: ret }}
          className="text-blue-500 hover:underline"
        >
          {ret.saleInvoiceNo || "N/A"}
        </Link>
      ),
      returnDate: ret.createdAt ? new Date(ret.createdAt).toLocaleDateString() : "N/A",
      totalAmount: totalAmount || 0,
    };
  });

  return (
    <div className="mt-8 p-10">
      <MainHeader title="Sales Return Records" theme={theme} />

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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

export default SalesReturn;
