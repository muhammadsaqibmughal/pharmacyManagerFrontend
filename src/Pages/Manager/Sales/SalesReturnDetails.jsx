import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../theme-support/ThemeContext";
import InvoiceHeader from "../../../components/common/InvoiceHeader";
import Search from "../../../components/common/Search";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import Loader from "../../../components/common/Loader";
// import { getReturnSaleById } from "../../../api/posAPI"; // make sure this API exists

const ITEM_PER_PAGE = 10;

const SalesReturnDetail = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [returnData, setReturnData] = useState(
    location.state?.returnData || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data if state is not present
  useEffect(() => {
    const fetchReturn = async () => {
      if (!returnData && id) {
        try {
          setIsLoading(true);
          const res = await getReturnSaleById(id); // fetch by id
          setReturnData(res?.returnSale || null);
        } catch (err) {
          console.error("Failed to fetch return data:", err);
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
          Return data not found. Please go back to the Sales Return page.
        </p>
      </div>
    );
  }

  const items = returnData.items || [];

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

  // Filter & paginate
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

  const columns = [
    { key: "productName", label: "Product Name" },
    { key: "quantity", label: "Quantity" },
    { key: "discount", label: "Discount (%)" },
    { key: "lineTotal", label: "Line Total" },
  ];

  const tableData = paginatedItems.map((item) => {
    const name = item.medicineName || item.genericName || "Unnamed Product";
    return {
      productName: name,
      quantity: item.quantity || 0,
      discount: item.discount ?? 0,
      lineTotal: formatCurrency(getLineTotal(item)),
    };
  });

  const totalRow = {
    productName: "Net Total",
    quantity: "",
    discount: "",
    lineTotal: formatCurrency(totalLineSum),
  };

  return (
    <div className="mt-8 p-10">
      <InvoiceHeader
        data={returnData}
        title="Sale Return Details"
        className="w-80"
        theme={theme}
        link={() => navigate(-1)} // dynamic go back
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

export default SalesReturnDetail;
