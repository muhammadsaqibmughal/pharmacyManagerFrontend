import React from "react";
import { useNavigate } from "react-router-dom";

const PendingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-6">
        <div className="backdrop-blur-xl  bg-white/10 border border-white/20  shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl flex flex-col justify-center  items-center w-4/5 max-md:w-11/12 gap-3 p-10 transition-all duration-500">
        <h1 className="text-3xl font-bold max-sm:text-center max-sm:font-semibold max-sm:text-lg text-bg-50 mb-4">
          Pharmacy Approval Pending
        </h1>
        <p className="text-white/90 text-lg mb-6 max-sm:text-center ">
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
