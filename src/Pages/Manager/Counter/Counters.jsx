import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createCounter, getCounterList } from "../../../api/counterAPI";
import { useTheme } from "../../../theme-support/ThemeContext";
import Loader from "../../../components/common/Loader";
import MainHeader from "../../../components/common/MainHeader";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import Modal from "../../../components/common/Modal";
import ModalInput from "../../../components/common/ModalInput";
import ModalButtons from "../../../components/common/ModalButtons";

const ITEM_PER_PAGE = 5;

const Counter = () => {
  const { theme } = useTheme();

  const [counterData, setCounterData] = useState([]);
  const [newCounter, setNewCounter] = useState({ name: "", email: "" });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch counters
  const fetchCounters = async () => {
    try {
      setIsLoading(true);
      const response = await getCounterList();
      setCounterData(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error fetching counters", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounters();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCounter({ ...newCounter, [name]: value });
  };

  // Reset form
  const resetForm = () => {
    setNewCounter({ name: "", email: "" });
    setErrorMsg("");
  };

  // Add new counter
  const handleAddCounter = async () => {
    if (!newCounter.name.trim() || !newCounter.email.trim()) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createCounter(newCounter);

      if (response.status === 201 || response.status === 200) {
        setShowModal(false);
        resetForm();
        fetchCounters();
      } else {
        setErrorMsg(response.message || "Failed to add counter");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to add counter");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and paginate
  const filteredItems = counterData.filter((item) =>
    (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / ITEM_PER_PAGE) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  console.log(paginatedItems

  )
  // Table columns
  const columns = [
    { key: "name", label: "Counter Name" },
    { key: "staffName", label: "Staff Name" },
    { key: "email", label: "Email" },
  ];

  // Map data for table
  const tableData = paginatedItems.map((item) => {
    const mainStaff = item.staff?.[0] || {};
    return {
      name: (
        <Link
          to={`/pos/counter-detail`}
          state={{ counter: item }}
          className="text-blue-500 hover:underline"
        >
          {item.name || "N/A"}
        </Link>
      ),
      staffName: mainStaff.name || "N/A",
      email: mainStaff.email || "N/A",
    };
  });

  return (
    <div
      className={`mt-8 p-10 `}
    >
      <MainHeader
        title="All Counter"
        buttonText="Add New Counter"
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
              onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              theme={theme}
            />
          }
        />
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Counter"
        theme={theme}
      >
        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

        <ModalInput
          fields={[
            { name: "name", placeholder: "Name" },
            { name: "email", placeholder: "Email" },
          ]}
          values={newCounter}
          onChange={handleChange}
          theme={theme}
        />

        <ModalButtons
          onCancel={() => setShowModal(false)}
          onSubmit={handleAddCounter}
          isSubmitting={isSubmitting}
          submitText="Add Counter"
        />
      </Modal>
    </div>
  );
};

export default Counter;
