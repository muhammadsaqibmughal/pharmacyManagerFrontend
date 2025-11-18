// POSSystem.jsx
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "../theme-support/ThemeContext";
import {
  FaExpand,
  FaUserCircle,
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getPOSItems, addSale, getSales, returnSale } from "../api/posAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OnlyCounter = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  // States
  const [isCounter, setIsCounter] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedReturnItems, setSelectedReturnItems] = useState(new Set());
  const [discountType, setDiscountType] = useState("fixed");
  const [discountValue, setDiscountValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [itemsData, setItemsData] = useState([]);
  const [invoicesData, setInvoicesData] = useState([]);
  const [userName, setUserName] = useState("Admin");

  // Fetch POS Items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getPOSItems();
        const normalizedItems = res.data.map((item) => ({
          ...item,
          id: item.pharmacyProductId, // can keep this for React key
          pharmacyProductId: item.pharmacyProductId, // ensure consistent usage
        }));
        setItemsData(normalizedItems);

        console.log(res.data);
        setItemsData(normalizedItems);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch items");
      }
    };
    fetchItems();
  }, []);

  // Fetch Sales/Invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await getSales();
        const invoices = Array.isArray(res.data.sales) ? res.data.sales : [];
        const normalizedInvoices = invoices.map((inv) => ({
          ...inv,
          id: inv.id || inv._id,
          items: inv.items.map((item) => ({
            ...item,
            id: item.pharmacyProductId, // <- use pharmacyProductId here too
            sellingPrice: item.unitPrice || 0,
            brandName:
              item.pharmacyProduct?.brandName ||
              item.pharmacyProduct?.medicine?.brandName,
          })),
        }));
        setInvoicesData(normalizedInvoices);

        console.log(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch invoices");
        setInvoicesData([]);
      }
    };
    fetchInvoices();
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered lists
  const filteredItems = useMemo(
    () =>
      itemsData.filter((item) =>
        (item.brandName || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [itemsData, searchTerm]
  );

  const filteredInvoices = useMemo(
    () =>
      Array.isArray(invoicesData)
        ? invoicesData.filter((inv) =>
            (inv.invoiceNo || "")
              .toLowerCase()
              .includes(invoiceSearch.toLowerCase())
          )
        : [],
    [invoicesData, invoiceSearch]
  );

  // Cart calculations
  const subtotal = cart.reduce(
    (acc, item) =>
      acc + (item.sellingPrice || 0) * item.quantity - (item.discount || 0),
    0
  );
  const discountAmount =
    discountType === "percentage"
      ? (subtotal * discountValue) / 100
      : discountValue;
  const total = subtotal - discountAmount;

  // Handlers
  const handleAddToCart = (product) => {
    setCart((prev) => {
      // Use pharmacyProductId as the unique identifier
      const index = prev.findIndex(
        (item) => item.pharmacyProductId === product.pharmacyProductId
      );

      if (index !== -1) {
        const updated = [...prev];
        updated[index].quantity += 1;
        return updated;
      } else {
        return [...prev, { ...product, quantity: 1, discount: 0 }];
      }
    });
  };

  const handleRemoveItem = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleDiscountChange = (id, value) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, discount: Number(value) } : item
      )
    );
  };

  const handleSwitchMode = (counterMode) => {
    setIsCounter(counterMode);
    setCart([]);
    setSelectedReturnItems(new Set());
    setSelectedInvoice(null);
    setDiscountValue(0);
  };

  const toggleReturnSelection = (id) => {
    setSelectedReturnItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
    setCart(
      invoice.items.map((item) => ({
        ...item,
        id: item.pharmacyProductId, // ensure id matches products
        sellingPrice: item.unitPrice,
        brandName: item.pharmacyProduct?.brandName || item.brandName,
      }))
    );
    setSelectedReturnItems(new Set());
  };

  const handleSave = async (isPrint = false) => {
    if (!cart.length && isCounter) return toast.error("Cart is empty");
    if (!selectedReturnItems.size && !isCounter)
      return toast.error("Select items to return");

    setIsLoading(true);

    const payload = {
      type: isCounter ? "sale" : "return",
      items: cart.map((item) => ({
        pharmacyProductId: item.pharmacyProductId,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice || 0,
        discount: item.discount || 0,
      })),
      discountType: isCounter ? discountType : null,
      discountValue: isCounter ? discountValue : 0,
      invoiceId: isCounter ? null : selectedInvoice?.id,
    };

    try {
      // You can have a single API endpoint like /api/transaction
      const response = await saveTransaction(payload);

      toast.success(
        isCounter ? "Sale saved successfully" : "Return processed successfully"
      );

      if (isPrint) toast.info("Printing invoice...");

      // Reset states
      setCart([]);
      setDiscountValue(0);
      setSelectedReturnItems(new Set());
      setSelectedInvoice(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to process transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? "bg-slate-900 text-white" : "bg-gray-50 text-slate-900"
      }`}
    >
      <ToastContainer />

      {/* Header */}
      <header
        className={`border-b ${
          isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 max-md:flex-wrap gap-4">
          <div className="flex items-center gap-6 max-md:gap-3 max-md:flex-1">
            <h1 className="text-2xl max-md:text-xl font-bold">POS System</h1>
            <div
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {currentTime.toLocaleTimeString()}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isDark}
                onChange={toggleTheme}
              />
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  isDark ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
              <span className="text-sm font-medium">
                {isDark ? "Dark" : "Light"}
              </span>
            </label>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <FaUserCircle size={24} />
                <span className="text-sm font-semibold max-md:hidden">
                  {userName}
                </span>
              </button>
              {showDropdown && (
                <div
                  className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl z-50 ${
                    isDark ? "bg-slate-700" : "bg-white"
                  }`}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <button
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      isDark ? "hover:bg-slate-600" : "hover:bg-gray-100"
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 text-sm border-t transition-colors ${
                      isDark
                        ? "border-slate-600 hover:bg-slate-600"
                        : "border-gray-100 hover:bg-gray-100"
                    }`}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={() => {
                if (!document.fullscreenElement)
                  document.documentElement.requestFullscreen();
                else document.exitFullscreen();
              }}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              title="Toggle Fullscreen"
            >
              <FaExpand />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex gap-6 p-6 max-lg:flex-col">
        {/* Left Panel */}
        <div className="flex-1">
          {isCounter ? (
            <>
              {/* Product Search */}
              <div className="mb-4 relative">
                <span className="absolute left-3 top-3 text-gray-500">🔍</span>
                <input
                  type="text"
                  placeholder="Search products..."
                  className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-colors ${
                    isDark
                      ? "bg-slate-700 text-white placeholder-gray-400"
                      : "bg-white text-slate-900 placeholder-gray-500 border border-gray-200"
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Products Table */}
              <div
                className={`rounded-lg border overflow-hidden ${
                  isDark
                    ? "border-slate-700 bg-slate-800"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="overflow-y-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead
                      className={`sticky top-0 ${
                        isDark ? "bg-slate-700" : "bg-gray-50"
                      }`}
                    >
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Price
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.length === 0 ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No products found
                          </td>
                        </tr>
                      ) : (
                        filteredItems.map((product) => (
                          <tr
                            key={product.id}
                            className={`border-t transition-colors ${
                              isDark ? "hover:bg-slate-700" : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-4 py-3">{product.brandName}</td>
                            <td className="px-4 py-3">
                              {product.totalQuantity}
                            </td>
                            <td className="px-4 py-3">
                              Rs. {(product.sellingPrice || 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                Add
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Invoice Return Mode */}
              <div className="mb-4 relative">
                <span className="absolute left-3 top-3 text-gray-500">🔍</span>
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-colors ${
                    isDark
                      ? "bg-slate-700 text-white placeholder-gray-400"
                      : "bg-white text-slate-900 border border-gray-200 placeholder-gray-500"
                  }`}
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                />
              </div>
              <div
                className={`rounded-lg border overflow-hidden ${
                  isDark
                    ? "border-slate-700 bg-slate-800"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="overflow-y-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead
                      className={`sticky top-0 ${
                        isDark ? "bg-slate-700" : "bg-gray-50"
                      }`}
                    >
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                          Invoice No
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.length === 0 ? (
                        <tr>
                          <td
                            colSpan="2"
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No invoices found
                          </td>
                        </tr>
                      ) : (
                        filteredInvoices.map((inv) => (
                          <tr
                            key={inv.id}
                            onClick={() => handleInvoiceSelect(inv)}
                            className={`border-t transition-colors cursor-pointer ${
                              selectedInvoice?.id === inv.id
                                ? isDark
                                  ? "bg-blue-900"
                                  : "bg-blue-50"
                                : isDark
                                ? "hover:bg-slate-700"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-4 py-3">{inv.invoiceNo}</td>
                            <td className="px-4 py-3">
                              {new Date(inv.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Cart */}
        <div className="w-96 max-lg:w-full">
          <div
            className={`rounded-lg border overflow-hidden flex flex-col h-full ${
              isDark
                ? "border-slate-700 bg-slate-800"
                : "border-gray-200 bg-white"
            }`}
          >
            {/* Cart Header */}
            <div
              className={`px-6 py-4 border-b ${
                isDark ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handleSwitchMode(true)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                    isCounter
                      ? "bg-blue-600 text-white"
                      : isDark
                      ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  New Sale
                </button>
                <button
                  onClick={() => handleSwitchMode(false)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                    !isCounter
                      ? "bg-amber-600 text-white"
                      : isDark
                      ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Return
                </button>
              </div>
              <h2 className="text-lg font-bold">
                {isCounter ? "Sales Cart" : "Return Items"}
              </h2>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div
                  className={`text-center py-12 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {isCounter ? "Add items to cart" : "Select an invoice first"}
                </div>
              ) : !isCounter ? (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleReturnSelection(item.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border-2 ${
                        selectedReturnItems.has(item.id)
                          ? isDark
                            ? "border-blue-500 bg-blue-900/30"
                            : "border-blue-500 bg-blue-50"
                          : isDark
                          ? "border-slate-700 hover:border-slate-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm">{item.brandName}</p>
                        <input
                          type="checkbox"
                          checked={selectedReturnItems.has(item.id)}
                          readOnly
                          className="w-4 h-4 rounded"
                        />
                      </div>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Qty: {item.quantity} × Rs.{" "}
                        {(item.sellingPrice || 0).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border-2 flex flex-col gap-2 transition-colors ${
                        isDark
                          ? "border-slate-700 hover:border-slate-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm">{item.brandName}</p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="p-1 bg-gray-300 rounded"
                        >
                          <FaMinus />
                        </button>
                        <input
                          type="number"
                          className={`w-12 text-center rounded border ${
                            isDark
                              ? "bg-slate-700 border-slate-600 text-white"
                              : "bg-white border-gray-200 text-slate-900"
                          }`}
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              Number(e.target.value)
                            )
                          }
                        />
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="p-1 bg-gray-300 rounded"
                        >
                          <FaPlus />
                        </button>
                        <input
                          type="number"
                          className={`ml-auto w-20 text-center rounded border ${
                            isDark
                              ? "bg-slate-700 border-slate-600 text-white"
                              : "bg-white border-gray-200 text-slate-900"
                          }`}
                          value={item.discount}
                          onChange={(e) =>
                            handleDiscountChange(item.id, e.target.value)
                          }
                          placeholder="Discount"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            <div
              className={`px-6 py-4 border-t ${
                isDark ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Discount</span>
                <span>Rs. {discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mb-2">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => handleSave(false)}
                disabled={isLoading}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors mb-2"
              >
                {isLoading
                  ? "Processing..."
                  : isCounter
                  ? "Save Sale"
                  : "Process Return"}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isLoading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                {isLoading ? "Printing..." : "Save & Print"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlyCounter;
