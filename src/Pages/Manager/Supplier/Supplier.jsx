import { useState, useEffect } from "react";
import { addSupplier, getSupplier } from "../../../api/supplierAPI";
import { useTheme } from "../../../theme-support/ThemeContext";

import MainHeader from "../../../components/common/MainHeader";
import Loader from "../../../components/common/Loader";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import Modal from "../../../components/common/Modal";
import ModalButtons from "../../../components/common/ModalButtons";
import ModalInput from "../../../components/common/ModalInput";

const ITEMS_PER_PAGE = 8;

const AllSuppliers = () => {
  const { theme } = useTheme();

  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // ---------------- Fetch suppliers ----------------
  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const response = await getSupplier();

      if (response?.status === 200) {
        setSuppliers(response.data ?? []);
      } else {
        setErrorMsg("Failed to fetch suppliers");
      }
    } catch (err) {
      setErrorMsg("Failed to fetch suppliers");
    } finally {
      setIsLoading(false);
    }
  };
  console.log(suppliers)
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // ---------------- Handlers ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSupplier = async () => {
    const { name, email, phone, address } = newSupplier;
    if (!name || !email || !phone || !address) {
      setErrorMsg("All fields are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await addSupplier(newSupplier);
      if (response?.status === 200 || response?.status === 201) {
        setSuppliers((prev) => [response.data.data || newSupplier, ...prev]);
        setShowModal(false);
        resetForm();
      } else {
        setErrorMsg(response?.message || "Failed to add supplier");
      }
    } catch (err) {
      setErrorMsg("Failed to add supplier");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () =>
    setNewSupplier({ name: "", email: "", phone: "", address: "" });

  // ---------------- Filtering & Pagination ----------------
  const filteredSuppliers = suppliers.filter((s) =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE) || 1;

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
  ];

  // ---------------- Render ----------------
  return (
    <div className="mt-8 p-10">
      <MainHeader
        title="Suppliers Data"
        buttonText="Add New Supplier"
        onButtonClick={() => setShowModal(true)}
        theme={theme}
      />

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {isLoading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          theme={theme}
          data={paginatedSuppliers}
          pagination={
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              theme={theme}
            />
          }
        />
      )}

      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title="Add New Supplier"
        theme={theme}
      >
        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

        <ModalInput
          fields={[
            { name: "name", placeholder: "Supplier Name", type: "text" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "phone", placeholder: "Phone", type: "text" },
            { name: "address", placeholder: "Address", type: "text" },
          ]}
          values={newSupplier}
          onChange={handleChange}
          theme={theme}
        />

        <ModalButtons
          onCancel={() => {
            setShowModal(false);
            resetForm();
          }}
          onSubmit={handleAddSupplier}
          isSubmitting={isSubmitting}
          submitText="Add Supplier"
        />
      </Modal>
    </div>
  );
};

export default AllSuppliers;
