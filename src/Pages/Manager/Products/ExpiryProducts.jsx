import { useState, useEffect } from "react";
import { useTheme } from "../../../theme-support/ThemeContext";
import dayjs from "dayjs";
import { getExpiry } from "../../../api/inventoryAPI";
import Loader from "../../../components/common/Loader";
import MainHeader from "../../../components/common/MainHeader";
import Table from "../../../components/common/Table";
import Search from "../../../components/common/Search";
import Pagination from "../../../components/common/Pagination";

const ITEM_PER_PAGE = 8;

const ExpiryProducts = () => {
  const { theme } = useTheme();

  const [expiryData, setExpiryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getExp = async () => {
      try {
        setLoading(true);
        const data = await getExpiry();
        setExpiryData(Array.isArray(data.data) ? data.data : []);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch expiry data.");
      } finally {
        setLoading(false);
      }
    };
    getExp();
  }, []);

  // Search filter
  const filteredItems = expiryData.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.brandName.toLowerCase().includes(term) ||
      product.genericName.toLowerCase().includes(term)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE) || 1;
  const paginatedProducts = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );
  console.log(paginatedProducts)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Format date
  const formatDate = (date) => dayjs(date).format("DD MMM YYYY");

  // Calculate days left
// Calculate days left
const getDaysLeft = (expiryDate) => {
  const days = dayjs(expiryDate).startOf("day").diff(dayjs().startOf("day"), "day");
  return days < 0 ? "Expired" : days;
};


  // ---------------- Table Columns ----------------
  const columns = [
    { key: "product", label: "Product" },
    { key: "quantity", label: "Quantity" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "daysLeft", label: "Days Left" },
  ];

  // ---------------- Map table data ----------------
// ---------------- Map table data ----------------
const tableData = paginatedProducts.map((item) => {
  const daysLeft = getDaysLeft(item.earliestExpiry);
  return {
    product: `${item.brandName}`,
    quantity: item.totalQuantity,
    expiryDate: formatDate(item.earliestExpiry),
    daysLeft,
    rowClass: daysLeft === "Expired" ? "text-red-500 font-bold" : "", // Highlight expired
  };
});


  return (
    <div className={`mt-8 p-10`}>
      <MainHeader title="Near Expiry Products" theme={theme} />
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 py-6">{error}</p>
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

export default ExpiryProducts;
