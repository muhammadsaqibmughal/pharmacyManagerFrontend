import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../theme-support/ThemeContext";
import InvoiceHeader from "../../../components/common/InvoiceHeader";
import Search from "../../../components/common/Search";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import Loader from "../../../components/common/Loader";

const ITEM_PER_PAGE = 10;

const SalesDetail = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const sale = location.state?.sale;
  const navigate = useNavigate()
  console.log("sale state " ,sale)
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!sale) {
    return (
      <div className="flex items-center w-full min-h-screen justify-center py-4">
        <p className="text-red-500">
          Sale data not found. Please go back to the Sales page.
        </p>
      </div>
    );
  }

  // ---------------- Helper Functions ----------------
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toISOString().split("T")[0] : "N/A";

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 2,
    }).format(value || 0);

  const getLineTotal = (item) => {
    const quantity = item.quantity || 0;
    const price = item.unitPrice || 0;
    const discount = item.discount || 0;

    const total = quantity * price;
    const discountAmount = total * (discount / 100);
    return total - discountAmount;
  };

  // ---------------- Filter & Pagination ----------------
  const filteredItems = (sale.items || []).filter((item) => {
    const name =
      item.pharmacyProduct?.medicine?.brandName ||
      item.pharmacyProduct?.medicine?.genericName ||
      "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  const totalLineSum = filteredItems.reduce(
    (acc, item) => acc + getLineTotal(item),
    0
  );

  // ---------------- Table Columns & Data ----------------
  const columns = [
    { key: "productName", label: "Product Name" },
    { key: "quantity", label: "Quantity" },
    { key: "discount", label: "Discount" },
    { key: "lineTotal", label: "Line Total" },
  ];

const tableData = paginatedItems.map((item) => {
  const name =
    item.pharmacyProduct?.medicine?.brandName ||
    item.pharmacyProduct?.medicine?.genericName ||
    "Unnamed Product";

  return {
    productName: name,
    quantity: item.quantity,
    discount: item.discount ?? 0,
    lineTotal: formatCurrency(getLineTotal(item)),
  };
});

// If your Table component supports a footer or custom render, you can pass total separately
const totalRow = {
  productName: "Net Total",
  quantity: "",
  discount: "",
  lineTotal: formatCurrency(totalLineSum),
};


  return (
    <div className={`mt-8 p-10 `}>
      {/* Invoice Header */}
      <InvoiceHeader title="Sale Details" data={sale} theme={theme} formatDate={formatDate} link={() => navigate(-1)} />

      {/* Search */}
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search product..."
      />

      {/* Table with Pagination */}
      {isLoading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={[...tableData , totalRow]}
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

export default SalesDetail;
