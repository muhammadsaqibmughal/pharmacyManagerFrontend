import { useState, useEffect } from "react";
import { useTheme } from "../theme-support/ThemeContext";
import { items } from "../constants";
import { FaExpand } from "react-icons/fa"; // or any icon of your choice

const PosPage = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsData] = useState(items);
  const [cart, setCart] = useState([]);
  const [discountType, setDiscountType] = useState("fixed");
  const [discountValue, setDiscountValue] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Filtered products
  const filteredItems = itemsData.filter((product) =>
    product.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product) => {
    const exists = cart.find((item) => item.itemName === product.itemName);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.itemName === product.itemName
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (index, delta) => {
    const updatedCart = [...cart];
    const newQty = updatedCart[index].quantity + delta;
    if (newQty < 1) return;
    updatedCart[index].quantity = newQty;
    setCart(updatedCart);
  };

  const handleRemoveItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discountedTotal =
    discountType === "percentage"
      ? totalAmount - (totalAmount * discountValue) / 100
      : totalAmount - discountValue;

  return (
    <>
      <div className=" w-full flex items-end justify-end p-2">
        <button
          onClick={() => {
            const el = document.documentElement;
            if (!document.fullscreenElement) {
              el.requestFullscreen().catch((err) => console.error(err));
            } else {
              document.exitFullscreen();
            }
          }}
          className="text-xl bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-full shadow"
          title="Toggle Fullscreen"
        >
          <FaExpand />
        </button>
      </div>

      <div className="flex mt-5 w-full p-5">
        <div className="flex justify-center items-start gap-5 max-md:flex-col w-full">
          {/* LEFT: Product List */}
          {!isPrinting && (
            <div className="w-4/6 max-md:w-full">
              <div className="flex mb-4 bg-search-50 w-full rounded-full">
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="px-4 py-2 w-full outline-none font-semibold text-primary-50 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

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
                    <tr
                      className={`border-b ${
                        theme === "dark" ? "border-white/20" : "border-black/20"
                      }`}
                    >
                      <th className="px-4 py-2">Item Name</th>
                      <th className="px-4 py-2">Quantity</th>
                      <th className="px-4 py-2">Shelf</th>
                      <th className="px-4 py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((product, idx) => (
                      <tr
                        key={idx}
                        onClick={() => handleAddToCart(product)}
                        className={`cursor-pointer ${
                          theme === "dark"
                            ? "hover:bg-white/20"
                            : "hover:bg-black/20"
                        } px-4 py-2 text-xs font-medium border-b ${
                          theme === "dark"
                            ? "border-white/40"
                            : "border-black/50"
                        }`}
                      >
                        <td className="px-4 py-2">{product.itemName}</td>
                        <td className="px-4 py-2">{product.quantity}</td>
                        <td className="px-4 py-2">{product.shelfNo}</td>
                        <td className="px-4 py-2">
                          {product.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RIGHT: POS Table */}
          <div
            className={`flex flex-col print-area justify-between mt-8 rounded-md p-3 h-full  ${
              isPrinting ? "w-full" : "w-2/4 max-md:w-full"
            }`}
          >
            {" "}
            <div
              className={`overflow-x-auto  table-Main  rounded-md mb-2 ${
                theme === "dark"
                  ? "border-white/10 bg-white/10"
                  : "border-black/10 bg-white/60"
              }`}
            >
              <table
                className={`w-full table-auto  ${
                  theme === "dark" ? "text-light-50" : "text-primary-50"
                }`}
              >
                <thead className="text-xs text-left h-11 uppercase bg-bg-50 text-white/80">
                  <tr
                    className={`border-b ${
                      theme === "dark" ? "border-white/20" : "border-black/20"
                    }`}
                  >
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Subtotal</th>
                    {!isPrinting && <th className="px-4 py-2">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`cursor-pointer ${
                        theme === "dark"
                          ? "hover:bg-white/10"
                          : "hover:bg-gray-100"
                      } px-4 py-2 text-xs font-medium border-b ${
                        theme === "dark" ? "border-white/40" : "border-black/50"
                      }`}
                    >
                      <td className="px-4 text-[9px] py-2">{item.itemName}</td>
                      <td className="px-4 py-2">{item.price.toFixed(2)}</td>
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
                      <td className="px-4 py-2 text-center">
                        {(item.price * item.quantity).toFixed(2)}
                      </td>
                      {!isPrinting && (
                        <td className="px-4 py-2  text-center font-extrabold">
                          <button
                            onClick={() => handleRemoveItem(idx)}
                            className="text-red-500 text-center hover:text-red-700"
                          >
                            ✕
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* **************** only show when prinitng ********************** */}
              {isPrinting && (
                <div className=" print-net-total flex justify-center  items-center  ">
                  <span
                    className={` flex justify-center w-80 items-center text-center  rounded-full text-sm font-semibold p-2 mt-4 ${
                      theme === "dark"
                        ? "text-white/80 bg-bg-50"
                        : "text-white/80 bg-bg-50"
                    }`}
                  >
                    Net Total: {discountedTotal.toFixed(2)}
                  </span>
                </div>
              )}
              {/* **************************************************************** */}
            </div>
            {!isPrinting && (
              <div className="flex max-md:flex-wrap  w-full items-center justify-center gap-4 mt-4">
                {/* Discount Type Dropdown */}
                <div className="flex w-2/4  flex-col items-center gap-1">
                  <label
                    htmlFor="discountType"
                    className={`text-sm w-full text-start  font-medium ${
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
                      setDiscountValue(0); // reset input on type change
                    }}
                    className={`border text-xsfont-semibold px-3 py-2 outline-none rounded-full w-full ${
                      theme === "dark"
                        ? "border-gray-300 text-white/90 bg-primary-50"
                        : "border-black/40 text-primary-50 bg-white/80"
                    }`}
                  >
                    <option value="fixed"> Fixed </option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>

                {/* Discount Value Field */}
                <div className="flex flex-col w-1/2   items-center gap-2">
                  <label
                    htmlFor="discountValue"
                    className={`text-sm text-start w-full font-medium ${
                      theme === "dark" ? "text-white" : "text-primary-50"
                    }`}
                  >
                    {discountType === "fixed" ? "Amount:" : "Percentage:"}
                  </label>
                  <input
                    type="number"
                    id="discountValue"
                    className={`border text-xsfont-semibold px-3 py-2 outline-none rounded-full w-full ${
                      theme === "dark"
                        ? "border-gray-300 text-white/90 bg-primary-50"
                        : "border-black/40 text-primary-50 bg-white/80"
                    }`}
                    min="0"
                    max={discountType === "percentage" ? "100" : undefined}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                  />
                </div>
              </div>
            )}
            {/* Receipt Total */}
               {/* Receipt Total */}
              {!isPrinting && (
                <div className=" flex flex-col gap-5 justify-center  items-center  ">
                  <span
                    className={` flex justify-center w-80 items-center text-center  rounded-full text-sm font-semibold p-2 mt-4 ${
                      theme === "dark"
                        ? "text-white/80 bg-bg-50"
                        : "text-white/80 bg-bg-50"
                    }`}
                  >
                    Net Total: {discountedTotal.toFixed(2)}
                  </span>
                  <div className="flex  justify-center mb-10 gap-4">
                    <button
                      onClick={() => {
                        // Simulate save logic
                        console.log("Invoice saved", cart);
                        alert("Invoice saved!");
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-2 px-4 rounded-full"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        console.log("Invoice saved", cart);
                        setIsPrinting(true);
                        setTimeout(() => {
                          window.print();
                          setTimeout(() => setIsPrinting(false), 500); // restore view
                        }, 300); // delay for DOM render
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-2 px-4 rounded-full"
                    >
                      Save & Print
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PosPage;
