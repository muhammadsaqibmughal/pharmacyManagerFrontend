import { useState, useEffect, useMemo } from "react";
import { useTheme } from "../theme-support/ThemeContext";
import { FaExpand, FaUserCircle, FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa"; // Added icons
import { useNavigate } from "react-router-dom";
import { getPOSItems, addSale, getSales, returnSale } from "../api/posAPI";
import { getCounter } from "../api/counterAPI";

const OnlyCounter = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // State from first component
  const [selectedReturnItems, setSelectedReturnItems] = useState([]);
  const [isCounter, setIsCounter] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsData, setItemsData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [cart, setCart] = useState([]);
  const [discountType, setDiscountType] = useState("fixed");
  const [discountValue, setDiscountValue] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [counterId, setCounterId] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const userName = "Ahmad Raza";

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchSales = async () => {
    const salesRes = await getSales();
    if (salesRes.status === "success" && Array.isArray(salesRes.data)) {
      setSalesData(salesRes.data);
    }
  };

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

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const filteredItems = useMemo(() => {
    return itemsData.filter((p) =>
      (p?.itemName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [itemsData, searchTerm]);

  const filteredInvoices = useMemo(() => {
    // Show only sales that are not fully returned or cancelled
    return salesData.filter((inv) =>
      (inv?.invoiceNo || "").toLowerCase().includes(invoiceSearch.toLowerCase()) && inv.saleStatus !== 'Returned' // Assuming a status field
    );
  }, [salesData, invoiceSearch]);

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

  const handleQuantityChange = (index, delta) => {
    const updatedCart = [...cart];
    const item = updatedCart[index];
    const newQty = item.quantity + delta;
    
    // Max quantity check for returns: cannot return more than was sold (originalQuantity)
    if (!isCounter && newQty > (item.originalQuantity || item.maxReturnQuantity)) {
        alert(`Cannot return more than the original quantity: ${item.originalQuantity || item.maxReturnQuantity}`);
        return;
    }

    if (newQty < 1) {
        // In sale mode, quantity must be >= 1. In return mode, maybe allow removal if delta is -1
        if (isCounter || (!isCounter && delta === -1)) {
            handleRemoveItem(index);
        }
        return;
    }
    
    updatedCart[index].quantity = newQty;
    setCart(updatedCart);
    
    // If in return mode, update selection
    if (!isCounter) {
        if (newQty > 0 && !selectedReturnItems.includes(item.saleItemId)) {
            setSelectedReturnItems(prev => [...prev, item.saleItemId]);
        } else if (newQty === 0 && selectedReturnItems.includes(item.saleItemId)) {
            setSelectedReturnItems(prev => prev.filter(id => id !== item.saleItemId));
        }
    }
  };


  const handleDiscountChange = (index, value) => {
    const updatedCart = [...cart];
    updatedCart[index].discount = Number(value);
    setCart(updatedCart);
  };

  const handleRemoveItem = (index) => {
    const item = cart[index];
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);

    // If in return mode, deselect the item
    if (!isCounter && item.saleItemId) {
        setSelectedReturnItems(prev => prev.filter(id => id !== item.saleItemId));
    }
  };

  const handleSwitchToReturn = () => {
    setIsCounter(false);
    setCart([]);
    setSelectedReturnItems([]);
    setSelectedInvoice(null);
    setInvoiceSearch("");
  };

  const handleSwitchToSale = () => {
    setIsCounter(true);
    setCart([]);
    setSelectedReturnItems([]);
    setSelectedInvoice(null);
    setInvoiceSearch("");
  };

  const handleInvoiceSelect = (inv) => {
    setSelectedInvoice(inv);
    // Use `saleItemId` as the unique ID for items within a sale for return tracking.
    // Also, track the original quantity sold.
    const updatedItems = (inv?.items || []).map((i) => ({
      ...i,
      saleItemId: i._id, // Assuming the API returns a unique ID for the item in the sale
      itemName: i.productName || 'N/A', // Assuming name field is different for sales items
      sellingPrice: i.price,
      originalQuantity: i.quantity, // Store the original quantity sold
      quantity: i.quantity, // Set the current quantity to max for selection
      discount: i.discount || 0,
    }));
    setCart(updatedItems);
    // Pre-select all items for potential return
    setSelectedReturnItems(updatedItems.map(i => i.saleItemId));
  };

  // Simplified: selection now happens via quantity change/removal. 
  // This function can be used to select/deselect an item entirely.
  const toggleReturnSelection = (itemId) => {
    setSelectedReturnItems((prev) => {
      if (prev.includes(itemId)) {
        // Deselect: set quantity to 0
        setCart(cart.map(i => i.saleItemId === itemId ? { ...i, quantity: 0 } : i));
        return prev.filter((id) => id !== itemId);
      } else {
        // Select: set quantity back to original
        const itemToSelect = cart.find(i => i.saleItemId === itemId);
        if (itemToSelect) {
             setCart(cart.map(i => i.saleItemId === itemId ? { ...i, quantity: i.originalQuantity } : i));
        }
        return [...prev, itemId];
      }
    });
  };

  const handleSaveReturn = async () => {
    if (!selectedInvoice) {
      alert("Please select an invoice first.");
      return;
    }

    // Filter items that are actually selected (quantity > 0)
    const itemsToReturn = cart.filter(item => 
        selectedReturnItems.includes(item.saleItemId) && item.quantity > 0
    );

    if (itemsToReturn.length === 0) {
      alert("Please select at least one item and a quantity to return.");
      return;
    }

    const payload = {
      saleId: selectedInvoice.invoiceNo, // Assuming API uses invoiceNo as ID
      items: itemsToReturn.map((item) => ({
        saleItemId: item.saleItemId,
        quantity: item.quantity,
        // The return price/amount is often calculated server-side based on the original sale
      })),
      // Optionally include refund amount, discount, etc. if needed
    };

    console.log("Return Payload:", payload);
    const res = await returnSale(payload);
    
    if (res?.status === "success") {
      alert("Return successful!");
      fetchSales();
      fetchItems();
      handleSwitchToSale();
    } else {
      alert("Failed to process return.");
    }
  };
  
  // Calculate total return amount (credit to customer)
  const totalReturnAmount = cart
    .filter(item => selectedReturnItems.includes(item.saleItemId) && item.quantity > 0)
    .reduce((acc, item) => {
        // Use price from the invoice item
        const subtotal = (item.sellingPrice || item.price || 0) * (item.quantity || 0) - (item.discount || 0);
        return acc + subtotal;
    }, 0);

  // Sale calculations remain the same
  const totalAmount = cart.reduce((acc, item) => {
    const subtotal =
      (item.sellingPrice || item.price || 0) * (item.quantity || 0) -
      (item.discount || 0);
    return acc + subtotal;
  }, 0);

  const discountedTotal =
    discountType === "percentage"
      ? totalAmount - (totalAmount * discountValue) / 100
      : totalAmount - discountValue;

  const handleSave = async (print = false) => {
    // ... (Sale logic remains the same)
    if (cart.length === 0) {
        alert("Cart is empty. Please add items.");
        return;
    }
    
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
      alert("Sale successful!");
      setCart([]);
      fetchItems();

      if (print) {
        setIsPrinting(true);
        setTimeout(() => {
          window.print();
          setTimeout(() => setIsPrinting(false), 500);
        }, 300);
      }
    } else {
      alert("Failed to save sale.");
    }
  };

  // Cart/Return Display Logic (Refined for both modes)
  const renderCartTable = () => (
    <div
      className={`table-Main overflow-y-auto max-h-96 ${
        theme === "dark" ? "border-white/10" : "border-black/10"
      }`}
    >
      <table className="w-full table-auto">
        <thead
          className={`sticky top-0 z-10 text-xs text-left uppercase h-10 ${
            theme === "dark" ? "bg-gray-700 text-white/90" : "bg-gray-200 text-primary-50"
          }`}
        >
          <tr>
            {isCounter && <th className="px-2 py-1">#</th>}
            {!isCounter && <th className="px-2 py-1">Return</th>}
            <th className="px-2 py-1">Item</th>
            <th className="px-2 py-1">Qty</th>
            <th className="px-2 py-1">Price</th>
            <th className="px-2 py-1">Disc</th>
            <th className="px-2 py-1">Subtotal</th>
            <th className="px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className={`${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
          {cart.map((item, index) => {
            const isSelectedForReturn = !isCounter && selectedReturnItems.includes(item.saleItemId);
            const subtotal =
              (item.sellingPrice || item.price || 0) * (item.quantity || 0) -
              (item.discount || 0);

            return (
              <tr
                key={isCounter ? item.pharmacyProductId : item.saleItemId}
                className={`text-xs font-medium border-b ${
                    isSelectedForReturn && !isCounter ? (theme === 'dark' ? 'bg-green-800/50' : 'bg-green-100') : ''
                }`}
              >
                {!isCounter ? (
                  <td className="px-2 py-1">
                    <input
                      type="checkbox"
                      checked={isSelectedForReturn}
                      onChange={() => toggleReturnSelection(item.saleItemId)}
                      className="form-checkbox h-4 w-4 text-green-600 rounded"
                    />
                  </td>
                ) : (
                    <td className="px-2 py-1">{index + 1}</td>
                )}
                <td className="px-2 py-1">{item.itemName || "N/A"}</td>
                <td className="px-2 py-1">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(index, -1)}
                      className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-l text-xs"
                      disabled={!isCounter && item.quantity <= 0}
                    >
                      <FaMinus />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                          const newQty = Number(e.target.value);
                          if (newQty < 0) return;
                          
                          // Custom logic for return mode: update state directly and handle selection
                          if (!isCounter) {
                                // Max quantity check
                                if (newQty > (item.originalQuantity || 999)) {
                                    alert(`Cannot return more than the original quantity: ${item.originalQuantity}`);
                                    return;
                                }

                                const updatedCart = [...cart];
                                updatedCart[index].quantity = newQty;
                                setCart(updatedCart);

                                // Update selection based on quantity
                                if (newQty > 0 && !selectedReturnItems.includes(item.saleItemId)) {
                                    setSelectedReturnItems(prev => [...prev, item.saleItemId]);
                                } else if (newQty === 0 && selectedReturnItems.includes(item.saleItemId)) {
                                    setSelectedReturnItems(prev => prev.filter(id => id !== item.saleItemId));
                                }
                          } else {
                                // Sale mode: simple quantity change
                                const updatedCart = [...cart];
                                updatedCart[index].quantity = newQty;
                                setCart(updatedCart);
                          }
                      }}
                      className={`w-10 text-center text-xs outline-none ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}
                    />
                    <button
                      onClick={() => handleQuantityChange(index, 1)}
                      className="p-1 bg-green-500 hover:bg-green-600 text-white rounded-r text-xs"
                      // In return mode, prevent increasing beyond original quantity
                      disabled={!isCounter && item.quantity >= (item.originalQuantity || 999)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </td>
                <td className="px-2 py-1">
                  {(item.sellingPrice || item.price || 0).toFixed(2)}
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) => handleDiscountChange(index, e.target.value)}
                    className={`w-12 text-center text-xs outline-none rounded ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}
                    disabled={!isCounter} // Can't change discount on a return
                  />
                </td>
                <td className="px-2 py-1">{subtotal.toFixed(2)}</td>
                <td className="px-2 py-1">
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove Item"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* Top Bar */}
      <div
        className={`w-full flex items-center justify-between border-b p-2 gap-4 ${
          theme === "dark"
            ? "border-white/20 bg-gray-900"
            : "border-gray-300 bg-white"
        }`}
      >
        {/* Theme toggle, Current time, User & fullscreen (omitted for brevity, assume they work) */}
        {/* ... (Theme, Time, User/Fullscreen Bar) ... */}
        <label className="inline-flex items-center rounded p-2 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <span
            className={`ml-3 text-sm font-medium ${
              theme === "dark" ? "text-white/90" : "text-gray-900"
            }`}
          >
            {theme === "dark" ? "Dark" : "Light"} Mode
          </span>
          <div className="w-11 ml-3 h-6 bg-gray-600 rounded-full relative transition-colors duration-300 peer-checked:bg-green-400">
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5" />
          </div>
        </label>

        <div className={`text-sm font-medium ${theme === "dark" ? "text-white/80" : "text-black"}`}>
          {currentTime.toLocaleTimeString()}
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full"
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
                  onClick={() => navigate("/signUp")}
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
            className="text-lg bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow"
            title="Toggle Fullscreen"
          >
            <FaExpand />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full p-5 max-md:flex-col gap-5">
        {/* Left Side: Items or Invoices */}
        {!isPrinting && (
          <div className="w-4/6 mt-2 max-md:w-full">
            <div className="mb-4 flex gap-4">
                 <button
                    onClick={handleSwitchToSale}
                    className={`px-4 py-2 rounded font-semibold ${
                        isCounter
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                >
                    New Sale
                </button>
                <button
                    onClick={handleSwitchToReturn}
                    className={`px-4 py-2 rounded font-semibold ${
                        !isCounter
                        ? "bg-red-500 text-white"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                >
                    Process Return
                </button>
            </div>
            {isCounter ? (
              <>
                {/* Sale Items Search & Table */}
                <input
                    type="text"
                    placeholder="Search item by name..."
                    className={`px-4 py-2 w-full outline-none font-semibold text-sm rounded-full mb-4 ${
                        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900 border"
                    }`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div
                  className={`overflow-y-auto h-110 ${
                    theme === "dark"
                      ? "border-white/10 bg-gray-800"
                      : "border-gray-300 bg-white shadow"
                  }`}
                >
                  <table
                    className={`w-full table-auto ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}
                  >
                    <thead className={`sticky top-0 z-10 text-xs text-left uppercase h-10 ${theme === "dark" ? "bg-gray-700 text-white/80" : "bg-gray-200 text-gray-700"}`}>
                      <tr>
                        <th className="px-4 py-2">Item Name</th>
                        <th className="px-4 py-2">Stock</th>
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
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-100"
                          } text-xs font-medium border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                        >
                          <td className="px-4 py-2">{p?.itemName || "N/A"}</td>
                          <td className="px-4 py-2">{p?.quantity ?? 0}</td>
                          <td className="px-4 py-2">{p?.shelf || "-"}</td>
                          <td className="px-4 py-2">{(p?.sellingPrice || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                {/* Return Invoice Search & Table */}
                <input
                  type="text"
                  className={`px-4 py-2 w-full rounded-full outline-none font-semibold text-sm mb-4 ${
                    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900 border"
                  }`}
                  placeholder="Search by invoice number..."
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                />
                <div
                  className={`overflow-y-auto h-110 ${
                    theme === "dark"
                      ? "border-white/10 bg-gray-800"
                      : "border-gray-300 bg-white shadow"
                  }`}
                >
                  <table
                    className={`w-full table-auto ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}
                  >
                    <thead className={`sticky top-0 z-10 text-xs text-left uppercase h-10 ${theme === "dark" ? "bg-gray-700 text-white/80" : "bg-gray-200 text-gray-700"}`}>
                      <tr>
                        <th className="px-4 py-2">Invoice No</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((inv, idx) => (
                        <tr
                          key={idx}
                          onClick={() => handleInvoiceSelect(inv)}
                          className={`cursor-pointer ${
                            inv.invoiceNo === selectedInvoice?.invoiceNo
                                ? (theme === 'dark' ? 'bg-blue-800' : 'bg-blue-100')
                                : (theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100")
                          } text-xs font-medium border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                        >
                          <td className="px-4 py-2">{inv?.invoiceNo || "N/A"}</td>
                          <td className="px-4 py-2">
                            {inv?.saleDate
                              ? new Date(inv.saleDate).toLocaleDateString()
                              : "-"}
                          </td>
                           <td className="px-4 py-2">
                            {inv?.totalAmount ? inv.totalAmount.toFixed(2) : '0.00'}
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

        {/* Right Side: Cart/Return Details & Actions */}
        <div className={`w-2/6 max-md:w-full ${isPrinting ? 'hidden' : ''}`}>
          <div
            className={`rounded-lg p-4 shadow-lg h-full flex flex-col ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900 border"
            }`}
          >
            <h3 className="text-lg font-bold mb-4">
              {isCounter ? "Sale Cart" : `Return for Invoice: ${selectedInvoice?.invoiceNo || 'N/A'}`}
            </h3>

            {/* Cart Table */}
            {renderCartTable()}

            {/* Totals & Discounts */}
            <div className="mt-4 border-t pt-4">
              {isCounter ? (
                // Sale Totals and Discount Controls
                <>
                  <div className="flex justify-between font-semibold text-sm mb-2">
                    <span>Subtotal:</span>
                    <span>{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-semibold block mb-1">
                      Discount
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        className={`p-2 rounded w-1/3 text-xs ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                      >
                        <option value="fixed">Fixed</option>
                        <option value="percentage">%</option>
                      </select>
                      <input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                        className={`p-2 rounded w-2/3 text-xs outline-none ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                        placeholder="Value"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between font-bold text-xl border-t pt-2">
                    <span>TOTAL:</span>
                    <span>{discountedTotal.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                // Return Total
                <>
                    <div className="flex justify-between font-semibold text-sm mb-2">
                        <span>Original Sale Total:</span>
                        <span>{selectedInvoice?.totalAmount ? selectedInvoice.totalAmount.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl border-t pt-2 text-red-500">
                        <span>RETURN AMOUNT:</span>
                        <span>{totalReturnAmount.toFixed(2)}</span>
                    </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-4 flex flex-col gap-2">
              {isCounter ? (
                <>
                  <button
                    onClick={() => handleSave(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded shadow"
                    disabled={cart.length === 0}
                  >
                    Save & Print
                  </button>
                  <button
                    onClick={() => handleSave(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded shadow"
                    disabled={cart.length === 0}
                  >
                    Save Sale
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSaveReturn}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded shadow"
                  disabled={!selectedInvoice || totalReturnAmount <= 0}
                >
                  Process Return (Refund {totalReturnAmount.toFixed(2)})
                </button>
              )}
              <button
                onClick={() => setCart([])}
                className={`font-bold py-2 rounded shadow ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
              >
                Clear {isCounter ? 'Cart' : 'Return List'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Print View for Sale (Invisible unless printing) */}
      {isPrinting && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-[100] p-10 print:block hidden">
            {/* ... Invoice content here for printing ... */}
            <h1 className="text-center text-2xl font-bold mb-4">INVOICE (Counter #{counterId})</h1>
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Time: {new Date().toLocaleTimeString()}</p>
            <p>Cashier: {userName}</p>
            <hr className="my-2"/>
             <table className="w-full text-left text-sm">
                <thead>
                    <tr>
                        <th className="py-1">Item</th>
                        <th className="py-1">Qty</th>
                        <th className="py-1">Price</th>
                        <th className="py-1">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, index) => (
                        <tr key={index}>
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.sellingPrice.toFixed(2)}</td>
                            <td>{((item.sellingPrice * item.quantity) - (item.discount || 0)).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr className="my-2"/>
            <div className="flex justify-between font-semibold text-base">
                <span>Total:</span>
                <span>{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base">
                <span>Discount:</span>
                <span>{(totalAmount - discountedTotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t mt-1 pt-1">
                <span>NET TOTAL:</span>
                <span>{discountedTotal.toFixed(2)}</span>
            </div>
            <p className="mt-8 text-center text-xs">Thank you for your business!</p>
        </div>
      )}
    </div>
    
  );
};

export default OnlyCounter;