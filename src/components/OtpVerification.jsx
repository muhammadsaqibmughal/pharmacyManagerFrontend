// OtpVerification.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useOtpFormik } from "../formik/useOtpFormik";

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";

  const [resendVisible, setResendVisible] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [otpFields, setOtpFields] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const formik = useOtpFormik(email, setResendVisible, setServerMessage);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otpFields];
    newOtp[index] = value;
    setOtpFields(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const otpString = newOtp.join("");
    formik.setFieldValue("otp", otpString);

    if (otpString.length === 6) {
      formik.submitForm();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpFields[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

 const handleResend = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/resend-otp",
      { email }
    );

    if (response.data.status === "success") {
      // Clear OTP input fields
      const clearedOtp = ["", "", "", "", "", ""];
      setOtpFields(clearedOtp);
      formik.setFieldValue("otp", "");
      inputRefs.current[0]?.focus(); // Optional: focus first field
      setResendVisible(false);
      setServerMessage("OTP resent to your email");
    } else {
      setServerMessage(response.data.message || "Failed to resend OTP");
    }
  } catch (err) {
    setServerMessage(err.response?.data?.message || "Resend failed");
  }
};

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f8ee] p-5">
      <div className="flex flex-col  bg-db-50 rounded-3xl p-10 shadow-xl w-[400px] max-w-full text-white items-center">
        <h2 className="text-3xl font-semibold mb-4 text-bg-50">Verify OTP</h2>
        <p className="text-primary-50 text-sm text-center mb-6">
          Enter the 6-digit OTP sent to <br />
          <span className="text-purple-400 font-semibold">{email}</span>
        </p>

        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col items-center gap-6"
        >
          <div className="flex justify-between gap-2">
            {otpFields.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 bg-[#e0e0e0] text-center text-primary-50 text-xl rounded-md focus:outline-none focus:border-bg-50"
              />
            ))}
          </div>

          {serverMessage && (
            <p className="text-warning-50 text-sm text-center">{serverMessage}</p>
          )}
          {formik.errors.otp && formik.touched.otp && (
            <p className="text-warning-50 text-sm text-center">
              {formik.errors.otp}
            </p>
          )}

          <button
            type="submit"
            className="bg-bg-50 text-primary-50 font-semibold rounded-xl px-6 py-2 hover:bg-selected-50 hover:text-white transition-all"
            disabled={formik.isSubmitting}
          >
            Verify OTP
          </button>
        </form>

        {resendVisible && (
          <p className="mt-4 text-sm text-gray-400">
            Didn’t receive or OTP expired?{" "}
            <button
              onClick={handleResend}
              className="text-purple-400 hover:underline"
            >
              Resend OTP
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default OtpVerification;
