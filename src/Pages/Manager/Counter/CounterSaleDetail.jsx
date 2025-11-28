import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../theme-support/ThemeContext";
import { useState } from "react";

import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import MainHeader from "../../../components/common/MainHeader";
import Search from "../../../components/common/Search";

const ITEM_PER_PAGE = 10;

const CounterSaleDetail = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const { sales = [], counterName, date } = location.state || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  if (!sales || sales.length === 0) {
    return (
      <div className="p-6 text-white">
        No sale items found!{" "}
        <span
          onClick={() => navigate(-1)}
          className="underline text-blue-400 cursor-pointer"
        >
          Go Back
        </span>
      </div>
    );
  }

  // Search filter
  const filteredSales = sales.filter((item) => {
    const term = searchTerm.toLowerCase();
    const brand = item?.pharmacyProduct?.medicine?.brandName?.toLowerCase() || "";
    const generic = item?.pharmacyProduct?.medicine?.genericName?.toLowerCase() || "";
    return brand.includes(term) || generic.includes(term);
  });

  const totalPages = Math.ceil(filteredSales.length / ITEM_PER_PAGE) || 1;
  const paginatedItems = filteredSales.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  const totalPrice = filteredSales.reduce(
    (sum, item) => sum + (item.unitPrice || 0),
    0
  );

// Table columns
const columns = [
  { key: "item", label: "Item" },
  { key: "quantity", label: "Quantity" },
  { key: "price", label: "Price" },
];

// Map data for table
const tableData = paginatedItems.map((item) => ({
  item: item?.pharmacyProduct?.medicine?.brandName || "Unknown",
  quantity: item.quantity || 0,
  price: item.unitPrice || 0,
}));

// Add total row
if (paginatedItems.length > 0) {
  tableData.push({
    item: "Total",
    quantity: "",
    price: totalPrice,
  });
}

  return (
    <div className={`mt-8 p-10`}>
      {/* Header */}
      <MainHeader
        title={`Counter Sale - ${counterName}`}
        buttonText="Back"
        onButtonClick={() => navigate(-1)}
        theme={theme}
      />

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

      {/* Table */}
      <Table
        columns={columns}
        data={tableData}
        theme={theme}
        noDataText="No sale items found."
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
    </div>
  );
};

export default CounterSaleDetail;
