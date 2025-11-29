import React, { useEffect, useState } from "react";
import ScannerQR from "../../../components/ScannerQR";
import api from "../../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const ScannerSetup = () => {
  const navigate = useNavigate();
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQr = async () => {
    try {
      setLoading(true);
      const response = await api.get("/scanner/qr");
      console.log(response.data);
      setQrData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch QR:", err);
      setError("Failed to generate QR code");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQr();

    // Auto-refresh QR every 5 minutes (optional)
    const interval = setInterval(fetchQr, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading scanner setup...</p>;
  if (error) return <p>{error}</p>;

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const handleClick = () => {
    if (user.role === "staff") {
      navigate("/onlyCounter");
    }
    if (user.role === "manager") {
      navigate(-1);
    }
  };

  return (
    <div
      style={{ textAlign: "center", marginTop: "50px", marginLeft: "100px" }}
    >
      <div className="flex justify-start mb-4">
        <button
          onClick={handleClick}
          className="px-4 py-2 bg-bg-50 hover:bg-selected-50 text-white rounded-full"
        >
          Back
        </button>
      </div>
      <h1>Scanner Setup</h1>
      <p>
        {qrData.type === "manager"
          ? "Connect your manager scanner app to your pharmacy system"
          : `Connect your scanner app to counter ID: ${qrData.counterId}`}
      </p>

      {/* Render QR code */}
      <ScannerQR qrData={qrData} onRefresh={fetchQr} />

      {/* Optional: Show user details */}
      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>User Type:</strong> {qrData.role}
        </p>
        <p>
          <strong>Pharmacy ID:</strong> {qrData.pharmacyId}
        </p>
        {qrData.type === "staff" && (
          <p>
            <strong>Counter ID:</strong> {qrData.counterId}
          </p>
        )}
      </div>
    </div>
  );
};

export default ScannerSetup;
