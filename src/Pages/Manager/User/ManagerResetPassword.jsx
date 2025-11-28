import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup
import { managerResetPassword } from "../../../api/pharmacyApi";

const ManagerResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [serverMessage, setServerMessage] = useState("");
  const [error, setError] = useState("");

  // Yup validation schema defined inside component
  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      setServerMessage("");

      try {
        const response = await managerResetPassword(id, token, values.password);
        console.log(response);
        if (response.status === 200) {
          setServerMessage(
            "Password reset successful! Redirecting to login..."
          );
          setTimeout(() => navigate("/signup"), 3000);
        } else {
          setError(response.data.message || "Failed to reset password.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }

      setSubmitting(false);
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#F5F5F5] flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#298aaa] mb-6">
          Reset Password
        </h2>

        {serverMessage && (
          <div className="mb-4 text-center text-[#4CAF50] font-semibold">
            {serverMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 text-center text-[#D32F2F] font-semibold">
            {error}
          </div>
        )}

        {!serverMessage && (
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* PASSWORD FIELD */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                className={`w-full px-4 py-2 border rounded-md text-[#211221] shadow-sm focus:outline-none focus:ring-2 ${
                  formik.touched.password && formik.errors.password
                    ? "border-[#D32F2F] focus:ring-red-300"
                    : "border-gray-300 focus:ring-[#298aaa]"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />

              {formik.touched.password && formik.errors.password && (
                <p className="text-[#D32F2F] text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD FIELD */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className={`w-full px-4 py-2 border rounded-md text-[#211221] shadow-sm focus:outline-none focus:ring-2 ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "border-[#D32F2F] focus:ring-red-300"
                    : "border-gray-300 focus:ring-[#298aaa]"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />

              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-[#D32F2F] text-sm mt-1">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-[#298aaa] hover:bg-[#075c79] text-white font-semibold py-2 px-4 rounded-md transition duration-300"
            >
              {formik.isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-[#757575]">
          Remembered your password?{" "}
          <Link to="/manager/login" className="text-[#298aaa] hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManagerResetPassword;
