import { useState, useEffect, useMemo } from "react";
import { useTheme } from "../theme-support/ThemeContext";
import { FaExpand, FaUserCircle, FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getPOSItems, getSales, addSale, returnSale } from "../api/posAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OnlyCounter = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [isCounter, setIsCounter] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [saleCart, setSaleCart] = useState([]);
  const [returnCart, setReturnCart] = useState([]);
  const [selectedReturnItems, setSelectedReturnItems] = useState(new Set());
  const [discountType, setDiscountType] = useState("fixed");
  const [discountValue, setDiscountValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [itemsData, setItemsData] = useState([]);
  const [invoicesData, setInvoicesData] = useState([]);
  const [userName, setUserName] = useState("Admin");
  const [selectedCounterId, setSelectedCounterId] = useState(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("cash");

  // Load carts from localStorage
  useEffect(() => {
    const savedSaleCart = localStorage.getItem("pos_sale_cart");
    const savedReturnCart = localStorage.getItem("pos_return_cart");
    if (savedSaleCart) setSaleCart(JSON.parse(savedSaleCart));
    if (savedReturnCart) setReturnCart(JSON.parse(savedReturnCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("pos_sale_cart", JSON.stringify(saleCart));
  }, [saleCart]);

  useEffect(() => {
    localStorage.setItem("pos_return_cart", JSON.stringify(returnCart));
  }, [returnCart]);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getPOSItems();
        const items = Array.isArray(res) ? res : res.data || [];
        const normalizedItems = items.map((item) => ({
          ...item,
          id: item.pharmacyProductId,
          pharmacyProductId: item.pharmacyProductId,
        }));
        setItemsData(normalizedItems);
      } catch (err) {
        console.error("Error fetching items:", err);
        toast.error("Failed to fetch items");
      }
    };
    fetchItems();
  }, []);

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await getSales();
        const invoices = Array.isArray(res) ? res : res.sales || res.data?.sales || [];
        const normalizedInvoices = invoices.map((inv) => ({
          ...inv,
          id: inv.id || inv._id,
          items: inv.items?.map((item) => ({
            ...item,
            id: item.pharmacyProductId,
            saleItemId: item.id,
            sellingPrice: item.unitPrice || 0,
            brandName: item.pharmacyProduct?.medicine?.brandName || item.brandName,
          })) || [],
        }));
        setInvoicesData(normalizedInvoices);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        toast.error("Failed to fetch invoices");
      }
    };
    fetchInvoices();
  }, []);

  // Time updater
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredItems = useMemo(
    () => itemsData.filter((item) => (item.brandName || "").toLowerCase().includes(searchTerm.toLowerCase())),
    [itemsData, searchTerm]
  );

  const filteredInvoices = useMemo(
    () => invoicesData.filter((inv) => (inv.invoiceNo || "").toLowerCase().includes(invoiceSearch.toLowerCase())),
    [invoicesData, invoiceSearch]
  );

  const saleTotal = saleCart.reduce((acc, item) => acc + item.sellingPrice * item.quantity - (item.discount || 0), 0);
  const discountAmount = discountType === "percentage" ? (saleTotal * discountValue) / 100 : discountValue;
  const total = Math.max(0, saleTotal - discountAmount);

  // Cart handlers
  const handleAddToCart = (product) => {
    setSaleCart((prev) => {
      const index = prev.findIndex((item) => item.pharmacyProductId === product.pharmacyProductId);
      if (index !== -1) {
        const updated = [...prev];
        updated[index].quantity += 1;
        return updated;
      }
      return [...prev, { ...product, quantity: 1, discount: 0 }];
    });
  };

  const handleRemoveItem = (id, isReturnCart = false) => {
    if (isReturnCart) setReturnCart((prev) => prev.filter((item) => item.id !== id));
    else setSaleCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, quantity, isReturnCart = false) => {
    const qty = Number(quantity);
    if (qty < 1) return;
    const setCart = isReturnCart ? setReturnCart : setSaleCart;
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const handleDiscountChange = (id, value, isReturnCart = false) => {
    const setCart = isReturnCart ? setReturnCart : setSaleCart;
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, discount: Number(value) } : item)));
  };

  const handleSwitchMode = (counterMode) => {
    setIsCounter(counterMode);
    setSelectedReturnItems(new Set());
    setSelectedInvoice(null);
    setDiscountValue(0);
  };

  const toggleReturnSelection = (id) => {
    setSelectedReturnItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
    setReturnCart(invoice.items.map((item) => ({
      ...item,
      id: item.pharmacyProductId,
      saleItemId: item.saleItemId,
      sellingPrice: item.unitPrice,
      brandName: item.pharmacyProduct?.medicine?.brandName || item.brandName,
    })));
    setSelectedReturnItems(new Set());
  };

// Process return
const handleProcessReturn = async () => {
  if (!selectedReturnItems.size) return toast.error("Select items to return");
  if (!selectedInvoice) return toast.error("No invoice selected");

  setIsLoading(true);
  try {
    const itemsToReturn = returnCart
      .filter((item) => selectedReturnItems.has(item.id))
      .map((item) => ({ saleItemId: item.saleItemId, quantity: Number(item.quantity) }));

    const totalReturnAmount = itemsToReturn.reduce((sum, item) => {
      const cartItem = returnCart.find((ci) => ci.saleItemId === item.saleItemId);
      return sum + (cartItem ? cartItem.sellingPrice * item.quantity : 0);
    }, 0);

    const payload = {
      saleId: selectedInvoice.id,
      totalAmount: Math.max(0, totalReturnAmount),
      returnItems: itemsToReturn,
    };

    const result = await returnSale(payload);

    if (result.status === "success") {
      toast.success("Return processed successfully");
      setReturnCart([]);
      setSelectedReturnItems(new Set());
      setSelectedInvoice(null);
      setIsCounter(true);
    } else {
      toast.error(result.message || "Return failed");
    }
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Failed to process return");
  } finally {
    setIsLoading(false);
  }
};

  const handleSave = async () => {
    if (!saleCart.length) return toast.error("❌ Cart is empty");
    if (!selectedCounterId?.trim()) return toast.error("❌ Select a counter");
    if (!selectedPaymentMode) return toast.error("❌ Select payment mode");

    setIsLoading(true);
    try {
      const saleItems = saleCart.map((item) => ({
        pharmacyProductId: item.pharmacyProductId || item.id,
        quantity: Number(item.quantity),
        price: Number(item.sellingPrice),
        discount: Number(item.discount || 0),
      }));

      const subtotal = saleItems.reduce((acc, i) => acc + i.quantity * i.price - i.discount, 0);
      const totalAmount = Math.max(0, subtotal - discountAmount);

      const payload = {
        counterId: selectedCounterId.trim(),
        paymentMode: selectedPaymentMode,
        totalAmount,
        items: saleItems,
        totalDiscount: discountAmount || 0,
        discountType,
      };

      const result = await addSale(payload);

      if (result.status === "success") {
        toast.success("✅ Sale processed successfully!");
        setSaleCart([]);
        setDiscountValue(0);
        setSelectedCounterId(null);
        setSelectedPaymentMode("cash");
      } else {
        toast.error(result.message || "Transaction failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to process transaction");
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
                        <th className="px-4 py-3 text-left font-semibold">
                          Shelf
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
                            colSpan="5"
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
                              Rs. {product.sellingPrice?.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">{product.shelf}</td>
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
              {/* Return Mode */}
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

        {/* Right Panel */}
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

              {isCounter && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Counter ID"
                    value={selectedCounterId || ""}
                    onChange={(e) => setSelectedCounterId(e.target.value)}
                    className={`flex-1 p-2 rounded border outline-none ${
                      isDark
                        ? "bg-slate-700 text-white border-slate-600"
                        : "bg-white text-slate-900 border-gray-300"
                    }`}
                  />
                  <select
                    value={selectedPaymentMode}
                    onChange={(e) => setSelectedPaymentMode(e.target.value)}
                    className={`p-2 rounded border ${
                      isDark
                        ? "bg-slate-700 text-white border-slate-600"
                        : "bg-white text-slate-900 border-gray-300"
                    }`}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {(isCounter ? saleCart : returnCart).length === 0 ? (
                <div
                  className={`text-center py-12 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {isCounter ? "Add items to cart" : "Select an invoice first"}
                </div>
              ) : (
                (isCounter ? saleCart : returnCart).map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border-2 flex flex-col gap-1 transition-colors ${
                      isDark
                        ? "border-slate-700 hover:border-slate-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => !isCounter && toggleReturnSelection(item.id)}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm">{item.brandName}</p>
                      {isCounter ? (
                        <button
                          onClick={() => handleRemoveItem(item.id, false)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      ) : (
                        <input
                          type="checkbox"
                          checked={selectedReturnItems.has(item.id)}
                          readOnly
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Rs. {item.sellingPrice.toFixed(2)}
                    </p>

                    {isCounter && (
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity - 1,
                              false
                            )
                          }
                          className="p-1 bg-gray-300 rounded"
                        >
                          <FaMinus />
                        </button>
                        <input
                          type="number"
                          className={`w-12 text-center rounded border ...`}
                          value={item.quantity}
                          onChange={
                            (e) =>
                              handleQuantityChange(
                                item.id,
                                Number(e.target.value),
                                false
                              ) // ✅ false
                          }
                        />
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity + 1,
                              false
                            )
                          } // ✅ false
                          className="p-1 bg-gray-300 rounded"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            <div
              className={`px-6 py-4 border-t ${
                isDark ? "border-slate-700" : "border-gray-200"
              }`}
            >
              {isCounter ? (
                <>
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>Rs. {saleTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2 items-center mb-2">
                    Discount
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      className={`p-2 rounded border outline-none text-sm ${
                        isDark
                          ? "bg-slate-700 text-white border-slate-600"
                          : "bg-white text-slate-900 border-gray-300"
                      }`}
                    >
                      <option value="fixed">Fixed</option>
                      <option value="percentage">Percentage</option>
                    </select>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      placeholder={discountType === "percentage" ? "%" : "Rs."}
                      className={`flex-1 p-2 rounded border text-sm ${
                        isDark
                          ? "bg-slate-700 text-white border-slate-600"
                          : "bg-white text-slate-900 border-gray-300"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {discountType === "percentage" ? "%" : "Rs."}
                    </span>
                  </div>

                  <div className="flex justify-between font-bold text-lg mb-4">
                    <span>Total</span>
                    <span>Rs. {total.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-semibold rounded-lg transition-colors"
                  >
                    {isLoading ? "Processing..." : "Save Sale"}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex justify-between mb-2">
                    <span>Items Selected</span>
                    <span>{selectedReturnItems.size}</span>
                  </div>

                  <div className="flex justify-between mb-4 font-bold text-lg">
                    <span>Return Amount</span>
                    <span>
                      Rs.{" "}
                      {Array.from(selectedReturnItems)
                        .reduce((sum, itemId) => {
                          const item = returnCart.find((i) => i.id === itemId);
                          return (
                            sum + (item ? item.sellingPrice * item.quantity : 0)
                          );
                        }, 0)
                        .toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleProcessReturn}
                    disabled={isLoading || !selectedInvoice}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-semibold rounded-lg transition-colors"
                  >
                    {isLoading ? "Processing..." : "Process Return"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlyCounter;