import React, { useEffect } from "react";
import { useState } from "react";
import Card, { CardContent } from "../../Landing/Card.jsx";
import { useTheme } from "../../../theme-support/ThemeContext.jsx";

import {
  Area,
  AreaChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
  Legend,
} from "recharts";

import {
  salesData,
  monthlySales,
  demandingProducts,
  topProducts,
  barColors,
  nearExpiryProducts,
} from "../../../constants/index.js";

import {
  getMonthlySales,
  getMostSaleProducts,
  getTotalProduct,
  getTotalReturn,
  getTotalSales,
  getWeeklySales,
} from "../../../api/dashboardAPI.js";
import { getExpiry } from "../../../api/inventoryAPI.js";

const ITEMS_PER_PAGE = 5;
const Dashboard = () => {
  const { theme } = useTheme();

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [weeklySales, setWeeklySales] = useState([]);
  const [expiryProducts, setExpiryProducts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all API calls in parallel
        const [
          totalSalesRes,
          totalProductsRes,
          totalReturnsRes,
          topProductsRes,
          monthlySalesRes,
          weeklySalesRes,
          expiryProductRes,
        ] = await Promise.all([
          getTotalSales(),
          getTotalProduct(),
          getTotalReturn(),
          getMostSaleProducts(),
          getMonthlySales(),
          getWeeklySales(),
          getExpiry(),
        ]);

        // Update states
        setTotalSales(totalSalesRes.data.totalSales || 0);
        setTotalProducts(totalProductsRes.data.totalProducts || 0);
        setTotalReturns(totalReturnsRes.totalReturn || 0);
        setTopProducts(topProductsRes.topSellingProducts || []);
        setMonthlySales(monthlySalesRes || []);
        setWeeklySales(weeklySalesRes || []);
        setExpiryProducts(expiryProductRes.data || []);
      } catch (error) {
        console.log("Dashboard data load failed", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(nearExpiryProducts.length / ITEMS_PER_PAGE);
  const totalPages2 = Math.ceil(topProducts.length / ITEMS_PER_PAGE);

  // Get items for current page
  // const paginatedProducts = nearExpiryProducts.slice(
  //   (currentPage - 1) * ITEMS_PER_PAGE,
  //   currentPage * ITEMS_PER_PAGE
  // );

  return (
    <div
      className={` p-10 ${theme === "dark" ? "bg-dark-50" : " bg-light-50"}`}
    >
      <h1
        className={`text-2xl ${
          theme === "dark" ? "text-white/90" : " text-primary-50"
        }  font-bold`}
      >
        Pharmacy Dashboard
      </h1>

      <div
        className={`rounded-xl mt-5 p-5 border ${
          theme === "dark"
            ? "border-white/20 bg-white/10"
            : "border-white/40 bg-white/90"
        }   backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]`}
      >
        <div className="grid p-5  grid-cols-1 sm:grid-cols-3 gap-6 ">
          <div
            className={`bg-[#cfe9c0] rounded-xl  backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-5`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${
                theme === "dark" ? "text-primary-50" : "text-primary-50"
              }`}
            >
              Total Sales
            </h2>
            <p className="text-2xl font-bold">{totalSales}</p>
          </div>

          <div
            className={`bg-[#d2d7ee] rounded-xl backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-5`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${
                theme === "dark" ? "text-primary-50" : "text-primary-50"
              }`}
            >
              Total Products
            </h2>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
          <div
            className={`bg-[#e8d9c5] rounded-xl backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-5`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${
                theme === "dark" ? "text-primary-50" : "text-primary-50"
              }`}
            >
              Total Returns
            </h2>
            <p className="text-2xl font-bold">{totalReturns}</p>
          </div>
        </div>
      </div>

      {/* Weekly Sales Chart */}
      <div className={`flex gap-5 mt-5 w-full max-lg:flex-col `}>
        <div
          className={`rounded-xl p-5 w-1/2 border ${
            theme === "dark"
              ? "border-white/20 bg-white/10"
              : "border-white/40 bg-white/90"
          }   backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]`}
        >
          {" "}
          <h2
            className={`text-xl font-semibold mb-4 ${
              theme === "dark" ? "text-light-50" : "text-primary-50"
            }`}
          >
            Weekly Sales
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklySales}>
              <XAxis dataKey="day" />
              <YAxis dataKey="sales" />
              <Tooltip />
              <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                {salesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={barColors[index % barColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Line Chart */}
        <div
          className={`rounded-xl p-5 w-1/2 border ${
            theme === "dark"
              ? "border-white/20 bg-white/10"
              : "border-white/40 bg-white/90"
          }   backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]`}
        >
          {" "}
          <h2
            className={`text-xl font-semibold mb-4 ${
              theme === "dark" ? "text-light-50" : "text-primary-50"
            }`}
          >
            {" "}
            Monthly Sales Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={monthlySales}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              {/* Background Grid */}
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

              {/* Axis Styling */}
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />

              {/* Tooltip Styling */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293c",
                  borderRadius: "10px",
                  border: "2px solid yellow",
                  color: "#f8fafc",
                }}
                labelStyle={{ color: "#f8fafc" }}
                itemStyle={{ color: "#bbf7d0" }}
                cursor={{ stroke: "#334155", strokeWidth: 1 }}
              />

              {/* Legend */}
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ color: "#cbd5e1", fontSize: "14px" }}
              />

              {/* Gradient Area fill (like shadow) */}
              <Area
                type="monotone"
                dataKey="sales"
                stroke="none"
                fill="url(#colorSales)"
              />

              {/* Sales Line */}
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#16A34A"
                strokeWidth={3}
                dot={{
                  r: 5,
                  stroke: "#16A34A",
                  strokeWidth: 2,
                  fill: "#fff",
                }}
                activeDot={{
                  r: 7,
                  stroke: "#22c55e",
                  strokeWidth: 3,
                  fill: "#fff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* <div
        className={`rounded-xl p-5 mt-8 border ${
          theme === "dark"
            ? "border-white/20 bg-white/10"
            : "border-white/40 bg-white/90"
        }   backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]`}
      >
        <p
          className={`text-md font-semibold mb-4 ${
            theme === "dark" ? "text-light-50" : "text-primary-50"
          }`}
        >
          {" "}
          Demanding Products
        </p>

        <div className="flex gap-1">
          <p
            className={`text-xs font-semibold mb-4 ${
              theme === "dark" ? "text-light-50" : "text-primary-50"
            }`}
          >
            {" "}
            Based on Recent Sales
          </p>
        </div>

        <div className="flex min-h-[180px]  flex-1 flex-col gap-8 py-4">
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart
              data={demandingProducts}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fff" stopOpacity={2.8} />
                  <stop offset="100%" stopColor="#2b3640" stopOpacity={0} />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="sales"
                stroke="#212121"
                strokeWidth={1}
                fill="url(#salesGradient)"
                dot={true}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#000" }}
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="flex justify-around flex-wrap gap-2">
            {demandingProducts.map((w, idx) => (
              <p
                key={idx}
                className="text-Secondary-50 text-[13px] font-bold leading-normal tracking-[0.015em] text-center w-[80px] truncate"
                title={w.product}
              >
                {w.product}
              </p>
            ))}
          </div>
        </div>
      </div> */}

      {/* Near Expiry Products */}
      <div
        className={`table-Main  p-5 ${
          theme === "dark"
            ? " border-white/10 bg-white/10"
            : " border-black/10 bg-white/60"
        }`}
      >
        <h2
          className={`text-md ${
            theme === "dark" ? "text-white/90" : " text-primary-50"
          }  font-bold`}
        >
          Products Near Expiry
        </h2>
        <div
          className={`table-Main  ${
            theme === "dark"
              ? " border-white/10 bg-white/10"
              : " border-black/10 bg-white/60"
          }`}
        >
          <table
            className={`w-full table-auto ${
              theme === "dark" ? "text-light-50" : " text-primary-50"
            }`}
          >
            <thead className="text-sm text-left uppercase h-11 bg-bg-50 text-white/80">
              <tr
                className={`border-b ${
                  theme === "dark" ? " border-white/20" : " border-black/20"
                }`}
              >
                <th className="py-2 px-4">Product Name</th>
                <th className="py-2 px-4">Formula</th>
                <th className="py-2 px-4">Expiry Date</th>
                <th className="py-2 px-4">Stock</th>
              </tr>
            </thead>
            <tbody>
              {expiryProducts.map((product, idx) => (
                <tr
                  key={idx}
                  className={` px-4 py-2 text-xs font-medium border-b ${
                    theme === "dark" ? " border-white/40" : " border-black/50"
                  }`}
                >
                  {" "}
                  <td className="py-2 px-4 font-semibold">
                    {product.brandName}
                  </td>
                  <td className="py-2 px-4 font-medium">
                    {product.genericName}
                  </td>
                  <td className="py-2 px-4 font-medium">
                    {new Date(product.earliestExpiry).toLocaleDateString(
                      "en-US"
                    )}
                  </td>
                  <td className="py-2 px-4 font-medium">
                    {product.totalQuantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Buttons */}
          <div
            className={`flex justify-between items-center px-4 py-3  border-t ${
              theme === "dark"
                ? "bg-white/20 border-white/20"
                : "bg-white/10 border-white/20"
            }`}
          >
            {" "}
            <button
              className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-Secondary-50">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Popular Products Table */}
      <div
        className={`table-Main  p-5 ${
          theme === "dark"
            ? " border-white/10 bg-white/10"
            : " border-black/10 bg-white/60"
        }`}
      >
        <h2
          className={`text-md ${
            theme === "dark" ? "text-white/90" : " text-primary-50"
          }  font-bold`}
        >
          Top Selling Peoducts
        </h2>
        <div
          className={`table-Main  ${
            theme === "dark"
              ? " border-white/10 bg-white/10"
              : " border-black/10 bg-white/60"
          }`}
        >
          <table
            className={`w-full table-auto ${
              theme === "dark" ? "text-light-50" : " text-primary-50"
            }`}
          >
            <thead className="text-sm text-left uppercase h-11 bg-bg-50 text-white/80">
              <tr
                className={`border-b ${
                  theme === "dark" ? " border-white/20" : " border-black/20"
                }`}
              >
                {" "}
                <th className="py-2 px-4">Product Name</th>
                {/* <th className="py-2 px-4">Category</th> */}
                <th className="py-2 px-4">Unit Sold</th>
                {/* <th className="py-2 px-4">Revenue</th> */}
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, idx) => (
                <tr
                  key={idx}
                  className={` px-4 py-2 text-xs font-medium border-b ${
                    theme === "dark" ? " border-white/40" : " border-black/50"
                  }`}
                >
                  {" "}
                  <td className="py-2 px-4 font-semibold">
                    {product.productName}
                  </td>
                  {/* <td className="py-2 px-4 font-medium">{product.category}</td> */}
                  <td className="py-2 px-4 font-medium">
                    {product.quantitySold}
                  </td>
                  {/* <td className="py-2 px-4 font-medium">{product.revenue}</td> */}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Buttons */}
          <div
            className={`flex justify-between items-center px-4 py-3  border-t ${
              theme === "dark"
                ? "bg-white/20 border-white/20"
                : "bg-white/10 border-white/20"
            }`}
          >
            {" "}
            <button
              className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
              onClick={() => setCurrentPage2((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage2 === 1}
            >
              Previous
            </button>
            <span className="text-sm text-Secondary-50">
              Page {currentPage2} of {totalPages2}
            </span>
            <button
              className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-50"
              onClick={() =>
                setCurrentPage2((prev) => Math.min(prev + 1, totalPages2))
              }
              disabled={currentPage2 === totalPages2}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
