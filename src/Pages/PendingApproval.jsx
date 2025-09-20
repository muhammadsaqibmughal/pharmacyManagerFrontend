import React from "react";
import { useNavigate } from "react-router-dom";

const PendingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f8ee] flex flex-col items-center justify-center p-6">
      <div className="bg-db-50 rounded-2xl shadow-lg p-8 max-w-xl text-center">
        <h1 className="text-3xl font-bold text-bg-50 mb-4">
          Pharmacy Approval Pending
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Your pharmacy registration has been submitted and is currently under review.
          Once approved by the admin, you will gain access to the pharmacy dashboard.
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-bg-50 font-semibold text-black rounded-lg hover:bg-selected-50 hover:text-white transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
