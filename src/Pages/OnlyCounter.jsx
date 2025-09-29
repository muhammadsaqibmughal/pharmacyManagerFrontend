import { useState, useEffect, useMemo } from "react";
import { useTheme } from "../theme-support/ThemeContext";
import { FaExpand, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getPOSItems, addSale, getSales, returnSale } from "../api/posAPI";
import { getCounter } from "../api/counterAPI";

const OnlyCounter = () => {
  const { theme, toggleTheme } = useTheme();

  const [selectedReturnItems, setSelectedReturnItems] = useState([]);
  const [isCounter, setIsCounter] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsData, setItemsData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [cart, setCart] = useState([]);
  const [discountType, setDiscountType] = useState("fixed");
  const [discountValue, setDiscountValue] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [returnCart, setReturnCart] = useState([]);

  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [counterId, setCounterId] = useState("");

  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const userName = "John Doe";

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch invoices
  const fetchSales = async () => {
    const salesRes = await getSales();
    if (salesRes.status === "success" && Array.isArray(salesRes.data)) {
      setSalesData(salesRes.data);
    }
  };

  // Fetch items & counter
  const fetchItems = async () => {
    const counterRes = await getCounter();
    if (counterRes.status === "success") {
      setCounterId(counterRes.data.assignedCounterId);
    }
    const response = await getPOSItems();
    if (response?.status === "success" && Array.isArray(response.data)) {
      const normalized = response.data.map((p) => ({
        pharmacyProductId: p.pharmacyProductId,
        medicineId: p.medicineId,
        itemName: `${p.brandName} (${p.genericName})`,
        brandName: p.brandName,
        genericName: p.genericName,
        barcode: p.barcode,
        manufacturer: p.manufacturer,
        packaging: p.packaging,
        shelf: p.shelf || "-",
        quantity: p.totalQuantity ?? 0,
        unitType: p.unitType,
        unitsPerPack: p.unitsPerPack,
        sellingPrice: p.sellingPrice ?? 0,
        costPrice: p.costPrice ?? 0,
      }));
      setItemsData(normalized);
    } else {
      setItemsData([]);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchSales();
  }, []);

  // Escape exits fullscreen
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Filters
  const filteredItems = useMemo(
    () =>
      itemsData.filter((p) =>
        (p?.itemName || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [itemsData, searchTerm]
  );

  const filteredInvoices = useMemo(
    () =>
      salesData.filter((inv) =>
        (inv?.id || "").toLowerCase().includes(invoiceSearch.toLowerCase())
      ),
    [salesData, invoiceSearch]
  );

  // Add to cart
  const handleAddToCart = (product) => {
    const exists = cart.find(
      (i) => i.pharmacyProductId === product.pharmacyProductId
    );
    if (exists) {
      setCart(
        cart.map((i) =>
          i.pharmacyProductId === product.pharmacyProductId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1, discount: 0 }]);
    }
  };

  // Cart operations
  const handleQuantityChange = (index, delta) => {
    const updatedCart = [...cart];
    const newQty = updatedCart[index].quantity + delta;
    if (newQty < 1) return;
    updatedCart[index].quantity = newQty;
    setCart(updatedCart);
  };

  const handleDiscountChange = (index, value) => {
    const updatedCart = [...cart];
    updatedCart[index].discount = Number(value);
    setCart(updatedCart);
  };

  const handleRemoveItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  // Totals
  const totalAmount = cart.reduce((acc, item) => {
    const subtotal =
      (item.sellingPrice || 0) * (item.quantity || 0) - (item.discount || 0);
    return acc + (item.isReturn ? -subtotal : subtotal);
  }, 0);

  const discountedTotal =
    discountType === "percentage"
      ? totalAmount - (totalAmount * discountValue) / 100
      : totalAmount - discountValue;

  // Mode switch
  const handleSwitchToReturn = () => {
    setIsCounter(false);
    setSelectedInvoice(null);
    setInvoiceSearch("");
  };

  const handleSwitchToSale = () => {
    setIsCounter(true);
    setCart([...returnCart]);
    setReturnCart([]);
  };

  // Return flow
  const handleReturnItem = (index) => {
    const returnItem = { ...cart[index], isReturn: true };
    if (!returnCart.find((i) => i.itemName === returnItem.itemName)) {
      setReturnCart([...returnCart, returnItem]);
    }
    alert("Item marked for return");
  };

  const handleSaveReturn = async () => {
    try {
      if (!selectedInvoice) {
        alert("Select an invoice to return items from!");
        return;
      }
      if (selectedReturnItems.length === 0) {
        alert("No items selected for return");
        return;
      }

      const payload = {
        saleId: selectedInvoice.id,
        items: selectedReturnItems.map((item) => ({
          saleItemId: item.id,
          quantity: item.quantity,
        })),
      };

      const res = await returnSale(payload);
      if (res?.status === "success") {
        alert("Return processed successfully!");
        setSelectedReturnItems([]);
        setSelectedInvoice(null);
        fetchItems();
        fetchSales();
      } else {
        alert("Failed to process return");
      }
    } catch (err) {
      console.error("Return save error:", err);
      alert("Error processing return");
    }
  };

  // Save Sale
  const handleSave = async (print = false) => {
    try {
      const payload = {
        counterId,
        totalAmount: discountedTotal,
        paymentMode: "cash",
        totalDiscount:
          discountType === "percentage"
            ? (totalAmount * discountValue) / 100
            : discountValue,
        items: cart.map((item) => ({
          pharmacyProductId: item.pharmacyProductId,
          quantity: item.quantity,
          price: item.sellingPrice,
          discount: item.discount || 0,
        })),
      };

      const res = await addSale(payload);

      if (res?.status === "success") {
        alert("Sale saved successfully!");
        setCart([]);
        await fetchItems();

        if (print) {
          if (res?.type === "pdf" && res.data) {
            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const printWindow = window.open(url);

            if (printWindow) {
              printWindow.focus();
              printWindow.onload = () => printWindow.print();
            } else {
              alert("Popup blocked! Allow popups to print receipt.");
            }
          } else {
            setIsPrinting(true);
            setTimeout(() => {
              window.print();
              setTimeout(() => setIsPrinting(false), 500);
            }, 300);
          }
        }
      } else {
        alert("Failed to save sale!");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving sale");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-dark-50" : "bg-light-50"
      }`}
    >
      {/*  Top Bar */}
      <div
        className={`w-full flex items-center justify-between border-b p-2 gap-4 ${
          theme === "dark"
            ? "border-white/90 bg-dark-50"
            : "border-black/90 bg-light-50"
        }`}
      >
        {/* Theme toggle */}
        <label className="inline-flex items-center rounded p-2 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <span
            className={`ml-3 text-sm font-medium ${
              theme === "dark" ? "text-white/90" : "text-primary-50"
            }`}
          >
            {theme === "dark" ? "Dark" : "Light"} Mode
          </span>
          <div className="w-11 ml-3 h-6 bg-gray-900 rounded-full relative transition-colors duration-300 peer-checked:bg-green-400">
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5" />
          </div>
        </label>

        {/* Current time */}
        <div
          className={`text-sm font-medium ${
            theme === "dark" ? "text-white/80" : "text-black"
          }`}
        >
          {currentTime.toLocaleTimeString()}
        </div>

        {/* User & fullscreen */}
        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded-full"
            >
              <FaUserCircle className="text-lg" />
              <span className="text-sm font-semibold">{userName}</span>
            </button>
            {showDropdown && (
              <div
                className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg rounded-md z-50"
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate("/logout")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              const el = document.documentElement;
              if (!document.fullscreenElement) el.requestFullscreen();
              else document.exitFullscreen();
            }}
            className="text-lg bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-full shadow"
            title="Toggle Fullscreen"
          >
            <FaExpand />
          </button>
        </div>
      </div>

      {/*  Main Content */}
      <div className="flex w-full p-5 max-md:flex-col gap-5">
        {/* Left Side */}
        {!isPrinting && (
          <div className="w-4/6 mt-2 max-md:w-full">
            {isCounter ? (
              <>
                {/* Items Search */}
                <div className="flex bg-search-50 w-full rounded-full">
                  <input
                    type="text"
                    placeholder="Search by name..."
                    className="px-4 py-2 w-full outline-none font-semibold text-primary-50 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* Items Table */}r
                <div
                  className={`table-Main h-110 overflow-y-auto ${
                    theme === "dark"
                      ? "border-white/10 bg-white/10"
                      : "border-black/10 bg-white/60"
                  }`}
                >
                  <table
                    className={`w-full table-auto ${
                      theme === "dark" ? "text-light-50" : "text-primary-50"
                    }`}
                  >
                    <thead className="sticky top-0 z-10 text-sm text-left uppercase h-11 bg-bg-50 text-white/80">
                      <tr>
                        <th className="px-4 py-2">Item Name</th>
                        <th className="px-4 py-2">Quantity</th>
                        <th className="px-4 py-2">Shelf</th>
                        <th className="px-4 py-2">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((p, idx) => (
                        <tr
                          key={idx}
                          onClick={() => handleAddToCart(p)}
                          className={`cursor-pointer ${
                            theme === "dark"
                              ? "hover:bg-white/20"
                              : "hover:bg-black/20"
                          } px-4 py-2 text-xs font-medium border-b`}
                        >
                          <td className="px-4 py-2">{p?.itemName || "N/A"}</td>
                          <td className="px-4 py-2">{p?.quantity ?? 0}</td>
                          <td className="px-4 py-2">{p?.shelf || "-"}</td>
                          <td className="px-4 py-2">
                            {(p?.sellingPrice || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                {/* Invoice Search */}
                <input
                  type="text"
                  className="px-4 py-2 w-full rounded-full outline-none font-semibold text-primary-50 text-sm bg-search-50"
                  placeholder="Search by invoice number..."
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                />
                {/* Invoices Table */}
                <div
                  className={`table-Main h-110 overflow-y-auto ${
                    theme === "dark"
                      ? "border-white/10 bg-white/10"
                      : "border-black/10 bg-white/60"
                  }`}
                >
                  <table
                    className={`w-full table-auto ${
                      theme === "dark" ? "text-light-50" : "text-primary-50"
                    }`}
                  >
                    <thead className="sticky top-0 z-10 text-sm text-left uppercase h-11 bg-bg-50 text-white/80">
                      <tr>
                        <th className="px-4 py-2">Invoice No</th>
                        <th className="px-4 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((inv, idx) => (
                        <tr
                          key={idx}
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setCart(
                              (inv?.items || []).map((i) => ({
                                ...i,
                                discount: 0,
                              }))
                            );
                          }}
                          className={`cursor-pointer ${
                            theme === "dark"
                              ? "hover:bg-white/20"
                              : "hover:bg-black/20"
                          } px-4 py-2 text-xs font-medium border-b`}
                        >
                          <td className="px-4 py-2">{inv?.id || "N/A"}</td>
                          <td className="px-4 py-2">
                            {inv?.createdAt
                              ? new Date(inv.createdAt).toLocaleDateString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
        {/* Right Side */}
        <div className="w-full flex flex-col gap-1">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleSwitchToSale}
              className="bg-bg-50 hover:bg-selected-50 text-white px-4 py-1 h-10 rounded-full"
            >
              New Sale
            </button>
            <button
              onClick={handleSwitchToReturn}
              className="bg-bg-50 hover:bg-selected-50 text-white px-4 py-1 h-10 rounded-full"
            >
              Return
            </button>
          </div>

          {/* POS table */}
          <div
            className={`overflow-x-auto table-Main rounded-md ${
              theme === "dark"
                ? "border-white/10 bg-white/10"
                : "border-black/10 bg-white/60"
            }`}
          >
            <table
              className={`w-full table-auto ${
                theme === "dark" ? "text-light-50" : "text-primary-50"
              }`}
            >
              <thead className="text-xs text-left h-11 uppercase bg-bg-50 text-white/80">
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Quantity</th>
                  {isCounter && <th className="px-4 py-2">Discount</th>}
                  <th className="px-4 py-2">Subtotal</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`text-xs font-medium border-b ${
                      theme === "dark"
                        ? "border-white/40 hover:bg-white/10"
                        : "border-black/50 hover:bg-gray-100"
                    } ${item.isReturn ? "bg-red-200" : ""}`}
                  >
                    <td className="px-4 text-[9px] py-2">{item.itemName}</td>
                    <td className="px-4 py-2">
                      {Number(item.sellingPrice ?? item.price ?? 0).toFixed(2)}
                    </td>

                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {!isPrinting && (
                          <button
                            onClick={() => handleQuantityChange(idx, -1)}
                            className="w-6 h-6 text-xs rounded-full bg-red-400 text-white"
                          >
                            -
                          </button>
                        )}
                        <span>{item.quantity}</span>
                        {!isPrinting && (
                          <button
                            onClick={() => handleQuantityChange(idx, 1)}
                            className="w-6 h-6 text-xs rounded-full bg-green-400 text-white"
                          >
                            +
                          </button>
                        )}
                      </div>
                    </td>
                    {isCounter && (
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={item.discount || 0}
                          min="0"
                          className="w-16 text-xs rounded px-2 py-1 border"
                          onChange={(e) =>
                            handleDiscountChange(idx, e.target.value)
                          }
                        />
                      </td>
                    )}
                    <td className="px-4 py-2 text-center">
                      {(
                        item.sellingPrice * item.quantity -
                        (item.discount || 0)
                      ).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {isCounter ? (
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReturnItem(idx)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!isPrinting && isCounter && (
            <>
              {/* Discount controls */}
              <div className="flex flex-wrap w-full items-center justify-center mt-10 gap-4">
                <div className="flex flex-col w-full md:w-2/4 items-center gap-1">
                  <label
                    htmlFor="discountType"
                    className={`text-sm w-full text-start font-medium ${
                      theme === "dark" ? "text-white" : "text-primary-50"
                    }`}
                  >
                    Discount Type
                  </label>
                  <select
                    id="discountType"
                    value={discountType}
                    onChange={(e) => {
                      setDiscountType(e.target.value);
                      setDiscountValue(0);
                    }}
                    className={`border text-xs font-semibold px-3 py-2 outline-none rounded-full w-full ${
                      theme === "dark"
                        ? "border-gray-300 text-white/90 bg-primary-50"
                        : "border-black/40 text-primary-50 bg-white/80"
                    }`}
                  >
                    <option value="fixed">Fixed</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
                <div className="flex flex-col w-full md:w-2/4 items-center gap-1">
                  <label
                    htmlFor="discountValue"
                    className={`text-sm w-full text-start font-medium ${
                      theme === "dark" ? "text-white" : "text-primary-50"
                    }`}
                  >
                    {discountType === "fixed" ? "Amount:" : "Percentage:"}
                  </label>
                  <input
                    id="discountValue"
                    type="number"
                    min="0"
                    max={discountType === "percentage" ? "100" : undefined}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className={`border text-xs font-semibold px-3 py-2 outline-none rounded-full w-full ${
                      theme === "dark"
                        ? "border-gray-300 text-white/90 bg-primary-50"
                        : "border-black/40 text-primary-50 bg-white/80"
                    }`}
                  />
                </div>
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-5 justify-center items-center mt-4 mb-10">
                <span className="flex justify-center w-80 items-center text-center rounded-full text-sm font-semibold p-2 bg-bg-50 text-white/80">
                  Net Total: {discountedTotal.toFixed(2)}
                </span>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleSave(false)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-2 px-4 rounded-full"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleSave(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-2 px-4 rounded-full"
                  >
                    Save & Print
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnlyCounter;
