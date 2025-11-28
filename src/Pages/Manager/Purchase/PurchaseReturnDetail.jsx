import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../theme-support/ThemeContext";
import InvoiceHeader from "../../../components/common/InvoiceHeader";
import Search from "../../../components/common/Search";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import Loader from "../../../components/common/Loader";

const ITEM_PER_PAGE = 10;

const PurchaseReturnDetail = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [returnData, setReturnData] = useState(location.state?.purchaseReturn || null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data if state is not present (optional: API call can be implemented)
  useEffect(() => {
    const fetchReturn = async () => {
      if (!returnData && id) {
        try {
          setIsLoading(true);
          // Example: call your API to fetch purchase return by id
          // const res = await getPurchaseReturnById(id);
          // setReturnData(res?.purchaseReturn || null);
        } catch (err) {
          console.error("Failed to fetch purchase return:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchReturn();
  }, [id, returnData]);

  if (!returnData) {
    return (
      <div className="flex items-center w-full min-h-screen justify-center py-4">
        <p className="text-red-500">
          Purchase return data not found. Please go back to the Purchase Return page.
        </p>
      </div>
    );
  }

  const items = returnData.items || [];

  // Helper functions
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
    const total = quantity * price;
    return total;
  };

  // Filter & paginate items
  const filteredItems = items.filter((item) =>
    (item.medicineName || item.genericName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  const totalLineSum = filteredItems.reduce(
    (acc, item) => acc + getLineTotal(item),
    0
  );

  // Table columns & data
  const columns = [
    { key: "productName", label: "Product Name" },
    { key: "genericName", label: "Generic Name" },
    { key: "packagingType", label: "Product Type" },
    { key: "quantity", label: "Returned Qty" },
    { key: "unitPrice", label: "Cost Price" },
    { key: "batchNumber", label: "Batch No" },
    { key: "expiryDate", label: "Expiry" },
    { key: "lineTotal", label: "Total" },
  ];

  const tableData = paginatedItems.map((item) => ({
    productName: item.medicineName || "N/A",
    genericName: item.genericName || "N/A",
    packagingType: item.packagingType || "N/A",
    quantity: item.quantity || 0,
    unitPrice: item.unitPrice || 0,
    batchNumber: item.batchNumber || "N/A",
    expiryDate: item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "N/A",
    lineTotal: formatCurrency(getLineTotal(item)),
  }));

  const totalRow = {
    productName: "Net Total",
    genericName: "",
    packagingType: "",
    quantity: "",
    unitPrice: "",
    batchNumber: "",
    expiryDate: "",
    lineTotal: formatCurrency(totalLineSum),
  };

  return (
    <div className="mt-8 p-10">
      <InvoiceHeader
        data={returnData}
        title="Purchase Return Details"
        className="w-80"
        theme={theme}
        link={() => navigate(-1)}
        formatDate={formatDate}
      />

      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search product..."
      />

      {isLoading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={[...tableData, totalRow]}
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

export default PurchaseReturnDetail;
