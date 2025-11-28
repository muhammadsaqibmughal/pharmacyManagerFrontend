import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../theme-support/ThemeContext";
import { getPurchaseReturns } from "../../../api/purchaseAPI";

import Loader from "../../../components/common/Loader";
import MainHeader from "../../../components/common/MainHeader";
import Pagination from "../../../components/common/Pagination";
import Table from "../../../components/common/Table";
import Search from "../../../components/common/Search";

const ITEM_PER_PAGE = 10;

const PurchaseReturn = () => {
  const { theme } = useTheme();

  const [purchaseReturns, setPurchaseReturns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch purchase returns
  const fetchReturns = async () => {
    try {
      setIsLoading(true);
      const res = await getPurchaseReturns(); // API should return array of purchase returns
      if (Array.isArray(res.data)) {
        setPurchaseReturns(res.data);
        setTotalPages(Math.ceil(res.data.length / ITEM_PER_PAGE));
      }
    } catch (err) {
      console.error("Failed to fetch purchase returns:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Table Columns
  const columns = [
    { key: "supplierName", label: "Supplier" },
    { key: "invoiceNo", label: "Invoice No" },
    { key: "purchaseDate", label: "Purchase Date" },
    { key: "totalAmount", label: "Total Amount" },
  ];

  // Paginate Data
  const paginatedReturns = purchaseReturns
    .filter((ret) =>
      (ret.supplier?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * ITEM_PER_PAGE, currentPage * ITEM_PER_PAGE);

  // Map Table Data
  const tableData = paginatedReturns.map((ret) => ({
    supplierName: (
      <Link
        to={`/pos/purchase-return/${ret.id}`}
        state={{ purchaseReturn: ret }}
        className="text-blue-500 hover:underline"
      >
        {ret.supplier?.name || "N/A"}
      </Link>
    ),
    invoiceNo: ret.purchaseInfo?.invoiceNo || "N/A",
    purchaseDate: ret.purchaseInfo?.purchaseDate
      ? new Date(ret.purchaseInfo.purchaseDate).toLocaleDateString()
      : "N/A",
    totalAmount: ret.totalAmount || 0,
  }));

  return (
    <div className="mt-8 p-10">
      <MainHeader title="Purchase Return Data" theme={theme} />

      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search by supplier name..."
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

export default PurchaseReturn;
