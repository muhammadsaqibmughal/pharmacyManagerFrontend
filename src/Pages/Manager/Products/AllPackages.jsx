import { useState, useEffect } from "react";
import {
  getPackage,
  addPackage,
  getMedicinesForDropdown,
} from "../../../api/packageAPI";
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

const ITEM_PER_PAGE = 8;

const packageTypeOptions = [
  "Strip",
  "Blister Pack",
  "Bottle",
  "Box",
  "Tube",
  "Vial",
  "Ampoule",
  "Sachet",
  "Dropper Bottle",
  "Cartridge",
  "Pen",
  "Patch",
  "Spray Bottle",
  "Canister",
  "Jar",
  "Inhaler",
  "Pump Bottle",
  "Other",
];

const unitTypeOptions = [
  "tablet",
  "capsule",
  "ml",
  "g",
  "puff",
  "spray",
  "patch",
  "dose",
  "unit",
  "piece",
  "drop",
  "sachet",
  "application",
  "ampoule",
  "vial",
  "bottle",
  "strip",
  "other",
];

const AllPackages = () => {
  const { theme } = useTheme();

  const [packages, setPackages] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [newPackage, setNewPackage] = useState({
    medicineId: "",
    medicineBrandName: "",
    packageType: "",
    unitsPerPack: "",
    unitType: "",
  });

  // ---------------- Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [pkgRes, medRes] = await Promise.all([
        getPackage(),
        getMedicinesForDropdown(),
      ]);
        console.log("medicine" , medRes)

      setPackages(pkgRes.data || []);
      setMedicines(medRes
      );
    } catch (err) {
      setErrorMsg("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- Handlers
  const handleChange = (e) => {
    setNewPackage({ ...newPackage, [e.target.name]: e.target.value });
  };

  const handleDropdownSelect = (field, value, brandName = null) => {
    if (field === "medicineId") {
      setNewPackage((prev) => ({
        ...prev,
        medicineId: value,
        medicineBrandName: brandName,
      }));
    } else {
      setNewPackage((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddPackage = async () => {
    const { medicineId, packageType, unitsPerPack, unitType } = newPackage;
    const units = parseInt(unitsPerPack, 10);
    if (!medicineId || !packageType || !units || !unitType) {
      setErrorMsg("All fields are required with valid values.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await addPackage({
        medicineId,
        packageType,
        unitsPerPack: units,
        unitType,
      });
      if (res.status === 200 || res.status === 201) {
        setPackages((prev) => [res.data.data, ...prev]);
        setShowModal(false);
        resetForm();
      } else {
        setErrorMsg(res.message || "Failed to add package");
      }
    } catch (err) {
      setErrorMsg("Failed to add package");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewPackage({
      medicineId: "",
      medicineBrandName: "",
      packageType: "",
      unitsPerPack: "",
      unitType: "",
    });
    setErrorMsg("");
  };

  const filteredPackages = packages.filter((p) => {
    const term = searchTerm.toLowerCase();
    const medName =
      medicines.find((m) => m.id === p.medicineId)?.brandName?.toLowerCase() ||
      "";
    return (
      medName.includes(term) || p.packageType?.toLowerCase().includes(term)
    );
  });

  const total = filteredPackages.length;
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );
  const totalPageCount = Math.ceil(total / ITEM_PER_PAGE) || 1;

  const columns = [
    { key: "medicine", label: "Medicine" },
    { key: "packageType", label: "Package Type" },
    { key: "unitsPerPack", label: "Units Per Pack" },
    { key: "unitType", label: "Unit Type" },
  ];

  console.log("paginated" , paginatedPackages)
  const tableData = paginatedPackages.map((p) => {
  const medicineName =
    medicines.find((m) => m.id === p.medicineId)?.brandName || p.medicineId;

  return {
    medicine: medicineName,
    packageType: p.packageType,
    unitsPerPack: p.unitsPerPack,
    unitType: p.unitType,
  };
});

  return (
    <div className={`mt-8 p-10`}>
      <MainHeader
        title="All Packages"
        buttonText="Add Packages"
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
          data={tableData}
          pagination={
            <Pagination
              currentPage={currentPage}
              totalPages={totalPageCount}
              onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              onNext={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPageCount))
              }
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
        title="Add New Package"
        theme={theme}
      >
        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

        <div className="grid grid-cols-2 gap-4">
          <ModalDropdown
            options={medicines.map((m) => m.brandName)}
            value={newPackage.medicineBrandName}
            placeholder="Select medicine"
            onSelect={(val) =>
              handleDropdownSelect(
                "medicineId",
                medicines.find((m) => m.brandName === val)?.id,
                val
              )
            }
            theme={theme}
            className={"mt-3 "}
          />
          <ModalInput
            fields={[
              {
                name: "unitsPerPack",
                placeholder: "Units Per Pack",
                type: "number",
                min: 1,
              },
            ]}
            values={newPackage}
            onChange={handleChange}
            theme={theme}
          />
          <ModalDropdown
            options={packageTypeOptions}
            value={newPackage.packageType}
            placeholder="Package Type"
            onSelect={(val) => handleDropdownSelect("packageType", val)}
            theme={theme}
          />
          <ModalDropdown
            options={unitTypeOptions}
            value={newPackage.unitType}
            placeholder="Unit Type"
            onSelect={(val) => handleDropdownSelect("unitType", val)}
            theme={theme}
          />
        </div>

        <ModalButtons
          onCancel={() => {
            setShowModal(false);
            resetForm();
          }}
          onSubmit={handleAddPackage}
          isSubmitting={isSubmitting}
          submitText="Add Package"
        />
      </Modal>
    </div>
  );
};

export default AllPackages;