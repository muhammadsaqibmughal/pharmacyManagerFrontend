import React from "react";
import { QRCodeSVG } from "qrcode.react";

const ScannerQR = ({ qrData, onRefresh }) => {
  if (!qrData) return <p>Loading QR code...</p>;
  
  // Create minimal JSON with shortened keys to reduce size
  const minimalData = {
    t: qrData.token, 
    ty: qrData.type, // Shortened key names
    id: qrData.id,
    ph: qrData.pharmacyId,
    ts: Date.now() // Timestamp for validation
  };
  
  // Use plain JSON (no base64 to avoid 33% size increase)
  const qrValue = JSON.stringify(minimalData);
  
  // Log size for debugging
  console.log("QR Data Size:", qrValue.length, "characters");

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{qrData.type === "manager" ? "Manager QR" : "Staff QR"}</h2>
      
      {/* Increased size and reduced error correction for less density */}
      <QRCodeSVG 
        value={qrValue} 
        size={400} 
        level="L" 
        includeMargin={true}
      />

      <p style={{ marginTop: "10px" }}>
        Scan this QR with your scanner app to connect.
      </p>
      
      {/* Show data info for debugging */}
      <div style={{ marginTop: "10px", fontSize: "10px", color: "#999" }}>
        <p>Data size: {qrValue.length} characters</p>
        <p style={{ wordBreak: "break-all", maxWidth: "400px", margin: "5px auto" }}>
          {qrValue}
        </p>
      </div>
      
      {onRefresh && (
        <button 
          onClick={onRefresh} 
          style={{ 
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "#10B981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Refresh QR
        </button>
      )}
    </div>
  );
};

export default ScannerQR;