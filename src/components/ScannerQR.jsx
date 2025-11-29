import React from "react";
import { QRCodeSVG } from "qrcode.react";

const ScannerQR = ({ qrData, onRefresh }) => {
  if (!qrData) return <p>Loading QR code...</p>;

  // Build compact payload with both manager + staff handling
  const minimalData =
    qrData.type === "manager"
      ? {
          t: qrData.token,   
          ty: "m",           
          uid: qrData.userId,
          ph: qrData.pharmacyId,
          ts: Date.now(),
        }
      : {
          t: qrData.token,
          ty: "s",           
          uid: qrData.userId,
          ph: qrData.pharmacyId,
          c: qrData.counterId, 
          ts: Date.now(),
        };

  const qrValue = JSON.stringify(minimalData);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{qrData.type === "manager" ? "Manager QR" : "Staff QR"}</h2>

      <QRCodeSVG
        value={qrValue}
        size={400}
        level="L"
        includeMargin={true}
      />

      <p style={{ marginTop: "10px" }}>
        Scan this QR with your scanner app to connect.
      </p>

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
            cursor: "pointer",
          }}
        >
          Refresh QR
        </button>
      )}
    </div>
  );
};

export default ScannerQR;
