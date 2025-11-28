import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {useOtpFormik} from "../../formik/useOtpFormik"
import { useTheme } from "../../theme-support/ThemeContext";

const OtpVerification = () => {
  const { theme } = useTheme();

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
        const clearedOtp = ["", "", "", "", "", ""];
        setOtpFields(clearedOtp);
        formik.setFieldValue("otp", "");
        inputRefs.current[0]?.focus();
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
    <div
      className={`flex min-h-screen items-center justify-center  p-5  ${
        theme === "dark" ? "bg-dark-50" : "bg-light-50"
      } `}
    >
      <div className="rounded-xl p-10 border border-white/20 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <h2
          className={`text-3xl text-center font-semibold mb-4  ${
            theme === "dark" ? "text-white/90" : " text-primary-50"
          }  `}
        >
          Verify OTP
        </h2>
        <p className="text-gray-300 text-sm text-center mb-6">
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
                className={`w-12 h-12 text-center text-white text-xl  ${
                  theme === "dark"
                    ? "text-white/90  bg-white/10 border-white/20"
                    : "text-primary-50 bg-black/10 border-black/20"
                }   rounded-md border border-white/20 bg-white/10 backdrop-blur-sm focus:outline-none focus:border-purple-400`}
              />
            ))}
          </div>

          {serverMessage && (
            <p className="text-yellow-400 text-sm text-center">
              {serverMessage}
            </p>
          )}
          {formik.errors.otp && formik.touched.otp && (
            <p className="text-red-400 text-sm text-center">
              {formik.errors.otp}
            </p>
          )}

          <button
            type="submit"
            className="bg-bg-50 text-white font-semibold rounded-xl px-6 py-2 hover:bg-selected-50 transition-all"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {resendVisible && (
          <p className="mt-4 text-sm text-gray-300">
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
