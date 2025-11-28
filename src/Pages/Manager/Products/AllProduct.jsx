import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { getProduct, addProduct } from "../../../api/productsApi";
import { useTheme } from "../../../theme-support/ThemeContext";

import Loader from "../../../components/common/Loader";
import MainHeader from "../../../components/common/MainHeader";
import Modal from "../../../components/common/Modal";
import Pagination from "../../../components/common/Pagination";
import Table from "../../../components/common/Table";
import Search from "../../../components/common/Search";
import ModalButtons from "../../../components/common/ModalButtons";
import ModalInput from "../../../components/common/ModalInput";
const ITEM_PER_PAGE = 5;

const AllProduct = () => {
  const { theme } = useTheme();

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newProduct, setNewProduct] = useState({
    brandName: "",
    manufacturer: "",
    barcode: "",
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await getProduct({
        page: currentPage,
        limit: ITEM_PER_PAGE,
        search: searchTerm,
      });

      console.log("API Response ===>", res);

      setProducts(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    if (
      !newProduct.brandName.trim() ||
      !newProduct.manufacturer.trim() ||
      !newProduct.barcode.trim()
    ) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const response = await addProduct({
        brandName: newProduct.brandName.trim(),
        manufacturer: newProduct.manufacturer.trim(),
        barcode: newProduct.barcode.trim(),
      });

      if (response.status === 201 || response.status === 200) {
        setShowModal(false);
        setNewProduct({ brandName: "", manufacturer: "", barcode: "" });
        fetchProducts();
      } else {
        setErrorMsg(response.message || "Failed to add product");
      }
    } catch (error) {
      setErrorMsg("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "brandName", label: "Brand" },
    { key: "genericName", label: "Generic" },
    { key: "manufacturer", label: "Manufacturer" },
    { key: "barcode", label: "Barcode" },
  ];

  return (
    <div
      className={`mt-8 p-10 `}
    >
      <MainHeader
        title="All Products"
        buttonText="Add Product"
        onButtonClick={() => setShowModal(true)}
        theme={theme}
      />

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={"Search by brandName..."} />

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Table
            columns={columns}
            data={products}
            theme={theme}
            pagination={
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                onNext={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                theme={theme}
              />
            }
          />
        </>
      )}

      {/* ===== Add Product Modal ===== */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Product"
        theme={theme}
      >
        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

        <ModalInput
          fields={[
            { name: "brandName", placeholder: "Brand Name" },
            { name: "manufacturer", placeholder: "Manufacturer" },
            { name: "barcode", placeholder: "Barcode" },
          ]}
          values={newProduct}
          onChange={handleInputChange}
          theme={theme}
        />

        <ModalButtons
          onCancel={() => setShowModal(false)}
          onSubmit={handleAddProduct}
          isSubmitting={isSubmitting}
          submitText="Add Product"
        />
      </Modal>
    </div>
  );
};

export default AllProduct;
