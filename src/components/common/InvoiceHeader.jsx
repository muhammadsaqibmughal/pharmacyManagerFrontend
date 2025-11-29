import React from "react";
import { Link } from "react-router-dom";

const InvoiceHeader = ({ data, title, link, className, theme, formatDate }) => {
  if (!data) return null;
  console.log(data)
  const supplier = data.supplier;
  const returnDate = data.returnDate

  return (
    <div className="mb-6">
      {/* Header & Back Button */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={ link }
          className="bg-bg-50 text-white px-4 py-2 rounded-full hover:bg-selected-50"
        >
          ← Back
        </button>
      </div>

      {/* Title & Supplier Info */}
      <div
        className={`w-full flex flex-col gap-2 justify-center items-center mb-6 ${
          theme === "dark"
            ? "border-white/90 text-light-50"
            : "border-primary-50 text-primary-50"
        }`}
      >
        {supplier && (
          <>
            <h2 className="text-2xl uppercase font-bold">
              {supplier?.name || "Supplier"}
            </h2>
            <p className="text-sm">{supplier?.email || "No Email Provided"}</p>
          </>
        )}
        <h1 className={`${className} text-2xl font-bold w-50 border-2 text-center`}>
          {title}
        </h1>
      </div>

      {/* Invoice / Sale Info */}
      <div
        className={`flex justify-between items-center text-sm ${
          theme === "dark" ? "text-light-50" : "text-primary-50"
        }`}
      >
        {/* Left Column */}
        <div className="space-y-2">
          {supplier ? (
            <>
              <p><b>Contact:</b> {supplier?.phone || "N/A"}</p>
              <p><b>Email:</b> {supplier?.email || "N/A"}</p>
              <p><b>Address:</b> {supplier?.address || "N/A"}</p>
              <p><b>Supplier:</b> {supplier?.name || "N/A"}</p>
            </>
          ) : (
            <>
              <p><strong>Invoice No:</strong> {data.invoiceNo || data.saleInvoiceNo || "N/A"}</p>
              <p><strong>Counter Name:</strong> {data.posCounter?.name || data.staff?.name || "N/A"}</p>
            </>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          {supplier ? (
            <>
              <p><b>Invoice No:</b> {data?.invoiceNo || data?.purchaseInfo?.invoiceNo || "N/A"}</p>
              <p>
                <b>Date:</b>{" "}
                {data?.purchaseDate
                  ? new Date(data.purchaseDate).toLocaleDateString()
                  : new Date(returnDate).toLocaleDateString()}
              </p>
              <p><b>Total Amount:</b> {data?.totalAmount || 0}</p>
              <p><b>Discount:</b> {data?.discount || 0}</p>
              <p><b>Tax:</b> {data?.tax || 0}</p>
            </>
          ) : (
            <>
              <p><strong>Payment Mode:</strong> {data.paymentMode || "N/A"}</p>
              <p><strong>Date:</strong> {formatDate(data.createdAt)}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
