import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../theme-support/ThemeContext";
import MainHeader from "../../../components/common/MainHeader";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import Loader from "../../../components/common/Loader"; // import your loader

const ITEM_PER_PAGE = 10;

const CounterDetail = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // loader state

  const counter = location.state?.counter;

  // Simulate loading on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // small delay for demonstration
    return () => clearTimeout(timer);
  }, []);

  if (!counter) {
    return (
      <div className="p-6 text-white">
        Counter data not found!{" "}
        <button
          onClick={() => navigate(-1)}
          className="underline text-blue-400"
        >
          Go Back
        </button>
      </div>
    );
  }

  const counterName = counter.name || "Unnamed Counter";
  const sales = counter.sales || [];
  console.log("sales" ,sales)

  // Filter sales by invoiceNo or date
  const filteredSales = sales.filter((sale) => {
    const date = sale.createdAt?.slice(0, 10) || "";
    return (
      sale.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      date.includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredSales.length / ITEM_PER_PAGE) || 1;
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );
  console.log("paginated" , paginatedSales)
  // Table columns
  const columns = [
    { key: "invoiceNo", label: "Invoice No" },
    { key: "date", label: "Date" },
    { key: "totalItems", label: "Total Items" },
  ];

  // Map sales to table data
  const tableData = paginatedSales.map((sale) => ({
    invoiceNo: (
      <Link
        to={`/pos/counter-sale-detail`}
        state={{
          sales: sale.items,
          counterName,
          date: sale.createdAt?.slice(0, 10),
        }}
        className="text-blue-500 hover:underline"
      >
        {sale.invoiceNo || "N/A"}
      </Link>
    ),
    date: sale.createdAt?.slice(0, 10) || "N/A",
    totalItems: sale.items?.length || 0,
  }));

  return (
    <div
      className={`mt-8 p-10`}
    >
      <MainHeader backButton="← Back" onButtonClick={() => navigate(-1)} title="All Counter Sales" theme={theme} />
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
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

export default CounterDetail;
