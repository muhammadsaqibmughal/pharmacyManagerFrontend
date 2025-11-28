import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { addPurchase, getPurchase } from "../../../api/purchaseAPI";
import { getSupplier } from "../../../api/supplierAPI";
import { useTheme } from "../../../theme-support/ThemeContext";

import MainHeader from "../../../components/common/MainHeader";
import Loader from "../../../components/common/Loader";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";

import Modal from "../../../components/common/Modal";
import ModalButtons from "../../../components/common/ModalButtons";
import ModalInput from "../../../components/common/ModalInput";
import ModalDropdown from "../../../components/common/ModalDropdown";

const ITEM_PER_PAGE = 5;

const AllPurchases = () => {
  const { theme } = useTheme();

  const [purchaseData, setPurchaseData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newPurchase, setNewPurchase] = useState({
    supplierId: "",
    supplierName: "",
    invoiceNo: "",
    purchaseDate: "",
    totalAmount: "",
    discount: "",
    tax: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  // ---------------- Fetch Data ----------------
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const purchasesRes = await getPurchase({
        page: currentPage,
        limit: ITEM_PER_PAGE,
        search: searchTerm,
      });

      setPurchaseData(purchasesRes?.data?.purchases || []);
      setTotalPages(purchasesRes?.data?.totalPages || 1);

      const supplierRes = await getSupplier();
      setSuppliers(
        supplierRes?.data?.map((s) => ({
          id: s.id,
          name: s.name,
        })) || []
      );
    } catch (err) {
      setErrorMsg("Failed to load purchase data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  // ---------------- Handlers ----------------
  const handleChange = (e) =>
    setNewPurchase({ ...newPurchase, [e.target.name]: e.target.value });

  const handleDropdownSelect = (value) => {
    setNewPurchase((prev) => ({
      ...prev,
      supplierId: suppliers.find((s) => s.name === value)?.id,
      supplierName: value,
    }));
  };

  const resetForm = () => {
    setNewPurchase({
      supplierId: "",
      supplierName: "",
      invoiceNo: "",
      purchaseDate: "",
      totalAmount: "",
      discount: "",
      tax: "",
    });
    setErrorMsg("");
  };

  const validateForm = () => {
    if (!newPurchase.supplierId) return "Supplier is required";
    if (!newPurchase.invoiceNo.trim()) return "Invoice number is required";
    if (!newPurchase.purchaseDate) return "Purchase date is required";
    if (!newPurchase.totalAmount) return "Total amount is required";
    if (isNaN(newPurchase.totalAmount)) return "Total must be a valid number";
    return null;
  };

  const handleAddPurchase = async () => {
    const error = validateForm();
    if (error) {
      setErrorMsg(error);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await addPurchase({
        supplierId: newPurchase.supplierId,
        invoiceNo: newPurchase.invoiceNo,
        purchaseDate: newPurchase.purchaseDate,
        totalAmount: parseFloat(newPurchase.totalAmount),
        discount: newPurchase.discount ? parseFloat(newPurchase.discount) : null,
        tax: newPurchase.tax ? parseFloat(newPurchase.tax) : null,
      });

      if (res?.status === 200 || res?.status === 201) {
        fetchData();
        setShowModal(false);
        resetForm();
      } else {
        setErrorMsg(res?.message || "Failed to add purchase");
      }
    } catch (err) {
      setErrorMsg("Failed to add purchase");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- Table Config ----------------

  const columns = [
    { key: "supplier", label: "Supplier" },
    { key: "contact", label: "Contact" },
    { key: "invoiceNo", label: "Invoice No" },
    { key: "purchaseDate", label: "Purchase Date" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "discount", label: "Discount" },
    { key: "tax", label: "Tax" },
  ];

  const tableData = purchaseData.map((purchase) => ({
    supplier: (
      <Link
        to={`/pos/purchase/${purchase.id}`}
        className="text-blue-500 hover:text-blue-700 hover:underline"
      >
        {purchase.supplier?.name || "-"}
      </Link>
    ),
    contact: purchase.supplier?.phone || "-",
    invoiceNo: purchase.invoiceNo || "N/A",
    purchaseDate: purchase.purchaseDate
      ? new Date(purchase.purchaseDate).toLocaleDateString()
      : "-",
    totalAmount: purchase.totalAmount ?? 0,
    discount: purchase.discount ?? 0,
    tax: purchase.tax ?? 0,
  }));

  return (
    <div className="mt-8 p-10">
      <MainHeader
        title="All Purchases"
        buttonText="Add New Purchase"
        onButtonClick={() => setShowModal(true)}
        theme={theme}
      />

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {isLoading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={tableData}
          theme={theme}
          pagination={
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1)) }
              onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              theme={theme}
            />
          }
        />
      )}

      {/* Modal */}
      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title="Add New Purchase"
        theme={theme}
      >
        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

        <ModalDropdown
          options={suppliers.map((s) => s.name)}
          value={newPurchase.supplierName}
          placeholder="Select Supplier"
          onSelect={handleDropdownSelect}
          theme={theme}
        />

        {/* <div className="grid grid-cols-2 gap-4 w-full mt-3"> */}
          <ModalInput
            fields={[
              { name: "invoiceNo", placeholder: "Invoice No", type: "text" },
              { name: "purchaseDate", placeholder: "Purchase Date", type: "date" },
              { name: "totalAmount", placeholder: "Total Amount", type: "number", min: 1 },
              { name: "discount", placeholder: "Discount", type: "number" },
              { name: "tax", placeholder: "Tax", type: "number" },
            ]}
            values={newPurchase}
            onChange={handleChange}
            theme={theme}
          />
        {/* </div> */}

        <ModalButtons
          onCancel={() => {
            setShowModal(false);
            resetForm();
          }}
          onSubmit={handleAddPurchase}
          isSubmitting={isSubmitting}
          submitText="Add Purchase"
        />
      </Modal>
    </div>
  );
};

export default AllPurchases;
