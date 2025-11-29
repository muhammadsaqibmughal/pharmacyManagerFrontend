import React, { useState, useEffect } from "react";
import { FileText, Download, Package, TrendingUp, Loader } from "lucide-react";
import { getSales, getPOSItems } from "../../../api/posAPI";
import { useTheme } from "../../../theme-support/ThemeContext";
import Pagination from "../../../components/common/Pagination";
import Table from "../../../components/common/Table";
import ModalDropdown from "../../../components/common/ModalDropdown";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [salesData, setSalesData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sales date filter
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Stock category filter
  const [stockCategory, setStockCategory] = useState("");

  // Pagination
  const [salesPage, setSalesPage] = useState(1);
  const [stockPage, setStockPage] = useState(1);
  const itemsPerPage = 10;

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Fetch data
  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      if (activeTab === "sales") {
        const res = await getSales();
        setSalesData(res.sales || []);
      } else {
        const res = await getPOSItems();
        setStockData(res);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  // Filter Sales by date
  const filteredSalesData = salesData.filter((record) => {
    if (!fromDate && !toDate) return true;
    const recordDate = new Date(record.createdAt).setHours(0, 0, 0, 0);
    const start = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
    const end = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;

    if (start && recordDate < start) return false;
    if (end && recordDate > end) return false;
    return true;
  });

  // Filter Stock by category
  const filteredStockData = stockData.filter((item) => {
    if (!stockCategory) return true;
    return item.category === stockCategory;
  });

  // Pagination
  const totalSalesPages = Math.ceil(filteredSalesData.length / itemsPerPage);
  const totalStockPages = Math.ceil(filteredStockData.length / itemsPerPage);

  const paginatedSalesData = filteredSalesData.slice(
    (salesPage - 1) * itemsPerPage,
    salesPage * itemsPerPage
  );

  const paginatedStockData = filteredStockData.slice(
    (stockPage - 1) * itemsPerPage,
    stockPage * itemsPerPage
  );

  const categoryOptions = [
    ...new Set(stockData.map((i) => i.category || "Uncategorized")),
  ];

  // Download CSV
  const downloadCSV = (type) => {
    const data =
      type === "sales"
        ? fromDate || toDate
          ? filteredSalesData
          : salesData
        : stockCategory
        ? filteredStockData
        : stockData;

    if (!data.length) return alert("No data to download");

    let csv = "";
    if (type === "sales") {
      csv = "Invoice No,Counter,Total Payment,Total Product,Date\n";
      data.forEach((row) => {
        csv += `${row.invoiceNo},${row.posCounter?.name},${parseFloat(
          row.totalAmount
        ).toFixed(2)},${row.items?.length},${new Date(
          row.createdAt
        ).toLocaleDateString()}\n`;
      });
    } else {
      csv = "Generic,Brand,Manufacture,Stock,Category\n";
      data.forEach((row) => {
        csv += `${row.genericName},${row.brandName},${row.manufacturer},${
          row.totalQuantity
        },${row.category || "N/A"}\n`;
      });
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Table columns
  const salesColumns = [
    {
      key: "counter",
      label: "Counter",
      render: (row) => row.posCounter?.name || "N/A",
    },
    { key: "invoiceNo", label: "Invoice No" },
    {
      key: "totalAmount",
      label: "Total Payment",
      render: (r) => parseFloat(r.totalAmount).toFixed(2),
    },
    {
      key: "items",
      label: "Total Product",
      render: (row) => row.items?.length,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
  ];

  const stockColumns = [
    { key: "brandName", label: "Brand" },
    { key: "genericName", label: "Generic" },
    { key: "manufacturer", label: "Manufacture" },
    {
      key: "totalQuantity",
      label: "Stock",
      render: (r) => `${r.totalQuantity} units`,
    },
    { key: "category", label: "Category" },
  ];

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText
              className={`w-10 h-10 mr-3 ${
                isDark ? "text-white" : "text-black"
              }`}
            />
            <h1
              className={`text-4xl font-bold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Reports Dashboard
            </h1>
          </div>

          <button
            onClick={() =>
              downloadCSV(activeTab === "sales" ? "sales" : "stock")
            }
            className={`flex items-center px-6 py-3 rounded-lg shadow-lg  ${
              isDark
                ? "bg-black text-white hover:bg-gray-600"
                : "bg-white text-black hover:bg-slate-100"
            }`}
          >
            <Download className="w-5 h-5 mr-2" />
            Download {activeTab === "sales" ? "Sales" : "Stock"} Report
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b-2 border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-6 py-3 font-semibold ${
              activeTab === "sales" ? "border-b-2 border-black" : ""
            } ${isDark ? "text-white" : "text-black"}`}
          >
            <TrendingUp className="w-5 h-5 inline mr-2" /> Sales Report
          </button>

          <button
            onClick={() => setActiveTab("stock")}
            className={`px-6 py-3 font-semibold ${
              activeTab === "stock" ? "border-b-2 border-black" : ""
            } ${isDark ? "text-white" : "text-black"}`}
          >
            <Package className="w-5 h-5 inline mr-2" /> Stock Report
          </button>
        </div>

        {/* Loader/Error */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader className="w-12 h-12 animate-spin" />
          </div>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* ---------------- Sales Table ---------------- */}
        {!loading && activeTab === "sales" && (
          <>
            <div className="flex gap-4 mb-6">
              {/* From Date */}
              <div className="flex flex-col">
                <label
                  className={`text-xs font-semibold mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className={`w-80 px-4 py-2.5 text-sm rounded-full backdrop-blur-lg transition-all duration-200 outline-none border 
                  ${
                    isDark
                      ? "bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                      : "bg-white/70 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
              </div>

              {/* To Date */}
              <div className="flex flex-col">
                <label
                  className={`text-xs font-semibold mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className={`w-80 px-4 py-2.5 text-sm rounded-full backdrop-blur-lg transition-all duration-200 outline-none border 
                  ${
                    isDark
                      ? "bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                      : "bg-white/70 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
              </div>
            </div>

            <Table
              columns={salesColumns}
              data={paginatedSalesData}
              theme={theme}
              pagination={
                totalSalesPages > 1 && (
                  <Pagination
                    currentPage={salesPage}
                    totalPages={totalSalesPages}
                    onPrev={() => setSalesPage((p) => Math.max(p - 1, 1))}
                    onNext={() =>
                      setSalesPage((p) => Math.min(p + 1, totalSalesPages))
                    }
                    theme={theme}
                  />
                )
              }
            />
          </>
        )}

        {/* ---------------- Stock Table ---------------- */}
        {!loading && activeTab === "stock" && (
          <>
            <div className="flex justify-end mb-4">
              <ModalDropdown
                options={["All Categories", ...categoryOptions]}
                value={stockCategory || "All Categories"}
                placeholder="Select Category"
                onSelect={(val) =>
                  setStockCategory(val === "All Categories" ? "" : val)
                }
                theme={theme}
                className="w-72"
              />
            </div>

            <Table
              columns={stockColumns}
              data={paginatedStockData}
              theme={theme}
              pagination={
                totalStockPages > 1 && (
                  <Pagination
                    currentPage={stockPage}
                    totalPages={totalStockPages}
                    onPrev={() => setStockPage((p) => Math.max(p - 1, 1))}
                    onNext={() =>
                      setStockPage((p) => Math.min(p + 1, totalStockPages))
                    }
                    theme={theme}
                  />
                )
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
