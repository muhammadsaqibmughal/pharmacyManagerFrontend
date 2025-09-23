import React from 'react';
import { useState } from "react";
import Card, { CardContent } from '../components/Card';
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
} from 'recharts';


import {salesData , monthlySales , demandingProducts, topProducts ,barColors, nearExpiryProducts} from '../constants/index.js'


const ITEMS_PER_PAGE = 5;
const Dashboard = () => {



  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(nearExpiryProducts.length / ITEMS_PER_PAGE);
  const totalPages2 = Math.ceil(topProducts.length / ITEMS_PER_PAGE)

  // Get items for current page
  const paginatedProducts = nearExpiryProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

    const paginatedProducts2 = topProducts.slice(
    (currentPage2 - 1) * ITEMS_PER_PAGE,
    currentPage2 * ITEMS_PER_PAGE
  );


  return (
    <div className="p-6 w-full overflow-hidden text-primary-50 min-h-screen">
      <h1 className="text-2xl text-primary-50 font-semibold mb-6">Pharmacy Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid p-5  grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card   className=' bg-[#cfe9c0] shadow-none '>
          <CardContent >
            <h2 className="text-lg font-medium text-primary-50">Total Sales</h2>
            <p className="text-2xl font-bold">2,500</p>
          </CardContent>
        </Card>

        <Card className='bg-[#d2d7ee] shadow-2xl '>
          <CardContent>
            <h2 className="text-lg font-medium text-primary-50">Total Products</h2>
            <p className="text-2xl font-bold">3,800</p>
          </CardContent>
        </Card>

        <Card className='bg-[#e8d9c5] shadow-2xl '>
          <CardContent>
            <h2 className="text-lg font-medium text-primary-500">Customer Visits</h2>
            <p className="text-2xl font-bold">1,340</p>
          </CardContent>
        </Card>
      </div>


      {/* Weekly Sales Chart */}
        <div className="flex gap-5 p-5  max-lg:flex-col">
      <Card className="mb-8 shadow-lg  flex-2">
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">Weekly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="day" />
              <YAxis dataKey='sales' />
              <Tooltip />
              <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                {salesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>


        {/* Monthly Line Chart */}
        <Card className="mb-8 w-full flex-1   color-white rounded-2xl shadow-md">
        <CardContent>
          <h2 className="text-lg font-semibold mb-4 text-primary-50"> Monthly Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={monthlySales}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              {/* Gradient Definitions */}
              {/* <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity={0.05} />
                </linearGradient>
              </defs> */}

              {/* Background Grid */}
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

              {/* Axis Styling */}
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />

              {/* Tooltip Styling */}
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293c',
                  borderRadius: '10px',
                  border: '2px solid yellow',
                  color: '#f8fafc',
                }}
                labelStyle={{ color: '#f8fafc' }}
                itemStyle={{ color: '#bbf7d0' }}
                cursor={{ stroke: '#334155', strokeWidth: 1 }}
              />

              {/* Legend */}
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ color: '#cbd5e1', fontSize: '14px' }}
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
                dot={{ r: 5, stroke: '#16A34A', strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 7, stroke: '#22c55e', strokeWidth: 3, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
        </Card>
      </div>



      {/* Demanding Products  */}
       {/* <div className="flex min-w-72 flex-1 flex-col gap-4 rounded-xl border border-[#3d4d5c] p-6">
        <p className="text-white text-base font-medium">Top 20 Demanding Products</p>
        <p className="text-white text-[32px] font-bold leading-tight truncate">
          Based on Recent Sales
        </p>

        <div className="flex min-h-[400px] flex-1 flex-col gap-6 py-4">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={demandingProducts}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              <XAxis type="number" hide />
              <YAxis
                dataKey="product"
                type="category"
                tick={{ fill: "#9daebe", fontSize: 12 }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#bbf7d0" }}
              />
              <Bar
                dataKey="sales"
                fill="url(#barGradient)"
                radius={[0, 10, 10, 0]}
                barSize={10}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      <div  style={{ boxShadow: "4px 5px 8px 2px  rgba(0,0,0,0.3)" }} className="flex min-w-72 flex-1  flex-col gap-2 rounded-xl  p-6">
        <p className="text-primary-50 text-base font-semibold leading-normal">Demanding Products</p>

        <div className="flex gap-1">
          <p className="text-Secondary-50 text-base font-normal leading-normal">Based on Recent Sales</p>
        </div>

        <div className="flex min-h-[180px]  flex-1 flex-col gap-8 py-4">
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={demandingProducts} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2b3640" stopOpacity={2.8} />
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
      </div>







      {/* Near Expiry Products */}
    <div className="mt-8">
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">Products Near Expiry</h2>
          <div className="overflow-y-auto max-h-[400px]">
            <table className="w-full overflow-x-auto text-sm text-left text-white-700">
              <thead className="text-xs uppercase text-white bg-bg-50">
                <tr>
                  <th className="py-2 px-4">Product Name</th>
                  <th className="py-2 px-4">Category</th>
                  <th className="py-2 px-4">Expiry Date</th>
                  <th className="py-2 px-4">Stock</th>
                </tr>
              </thead>
              <tbody  >
                {paginatedProducts.map((product, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-4 font-semibold">{product.name}</td>
                    <td className="py-2 px-4 font-medium">{product.category}</td>
                    <td className="py-2 px-4 font-medium">{product.expiry}</td>
                    <td className="py-2 px-4 font-medium">{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Buttons */}
          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-1 bg-bg-50 text-white rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span className="text-sm text-Secondary-50">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="px-4 py-1 bg-bg-50 text-white rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </CardContent>
      </Card>
    </div>

      {/* Popular Products Table */}
    <div className="mt-8">
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">Products Near Expiry</h2>
          <div className="overflow-y-auto max-h-[400px]">
            <table className="w-full overflow-x-auto text-sm text-left text-white-700">
              <thead className="text-xs uppercase text-white bg-bg-50">
                <tr>
                  <th className="py-2 px-4">Product Name</th>
                  <th className="py-2 px-4">Category</th>
                  <th className="py-2 px-4">Unit Sold</th>
                  <th className="py-2 px-4">Revenue</th>
                </tr>
              </thead>
              <tbody  >
                {paginatedProducts2.map((product, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-4 font-semibold">{product.name}</td>
                    <td className="py-2 px-4 font-medium">{product.category}</td>
                    <td className="py-2 px-4 font-medium">{product.units}</td>
                    <td className="py-2 px-4 font-medium">{product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Buttons */}
          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-1 bg-bg-50 text-white rounded disabled:opacity-50"
              onClick={() => setCurrentPage2((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage2 === 1}
            >
              Previous
            </button>

            <span className="text-sm text-Secondary-50">
              Page {currentPage2} of {totalPages2}
            </span>

            <button
              className="px-4 py-1 bg-bg-50 text-white rounded disabled:opacity-50"
              onClick={() => setCurrentPage2((prev) => Math.min(prev + 1, totalPages2))}
              disabled={currentPage2 === totalPages2}
            >
              Next
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default Dashboard;
