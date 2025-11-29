import { useTheme } from "../../../theme-support/ThemeContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../../api/pharmacyApi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Lock, ArrowLeft, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";

const Settings = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@$!%*?&)"
      ),
    confirmPassword: Yup.string()
      .required("Please confirm your new password")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const handlePasswordChange = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
    try {
      const payload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };
      const response = await changePassword(payload);

      if (response.status === "success") {
        alert("Password changed successfully!");
        resetForm();
      } else {
        alert(response.data?.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

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

  const passwordRequirements = [
    { text: "At least 8 characters", regex: /.{8,}/ },
    { text: "One uppercase letter", regex: /[A-Z]/ },
    { text: "One lowercase letter", regex: /[a-z]/ },
    { text: "One number", regex: /\d/ },
    { text: "One special character (@$!%*?&)", regex: /[@$!%*?&]/ },
  ];

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                : "bg-white hover:bg-gray-50 text-gray-700 shadow-md"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Title Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`p-3 rounded-xl ${
                theme === "dark"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-blue-500/10 text-blue-600"
              }`}
            >
              <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              Security Settings
            </h1>
          </div>
          <p
            className={`text-sm sm:text-base ml-14 sm:ml-16 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Manage your account security and password
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Password Change Form */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-2xl p-6 sm:p-8 ${
                theme === "dark"
                  ? "bg-gray-800/50 backdrop-blur-xl border border-gray-700/50"
                  : "bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <Lock
                  className={`w-5 h-5 ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <h2
                  className={`text-xl sm:text-2xl font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Change Password
                </h2>
              </div>

              <Formik
                initialValues={{
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handlePasswordChange}
              >
                {({ isSubmitting, values, errors, touched }) => (
                  <Form className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <Field
                          type={showCurrent ? "text" : "password"}
                          name="currentPassword"
                          placeholder="Enter your current password"
                          className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 ${
                            theme === "dark"
                              ? "bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          } ${
                            errors.currentPassword && touched.currentPassword
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                            theme === "dark"
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {showCurrent ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name="currentPassword"
                        component="div"
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      />
                    </div>

                    {/* New Password */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <Field
                          type={showNew ? "text" : "password"}
                          name="newPassword"
                          placeholder="Enter your new password"
                          className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 ${
                            theme === "dark"
                              ? "bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          } ${
                            errors.newPassword && touched.newPassword
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                            theme === "dark"
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {showNew ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Field
                          type={showConfirm ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm your new password"
                          className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 ${
                            theme === "dark"
                              ? "bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          } ${
                            errors.confirmPassword && touched.confirmPassword
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                            theme === "dark"
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {showConfirm ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        theme === "dark"
                          ? "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-700 disabled:text-gray-500"
                          : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Update Password
                        </>
                      )}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Password Requirements Sidebar */}
          <div className="lg:col-span-1">
            <div
              className={`rounded-2xl p-6 sticky top-6 ${
                theme === "dark"
                  ? "bg-gray-800/50 backdrop-blur-xl border border-gray-700/50"
                  : "bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Password Requirements
              </h3>
              <div className="space-y-3">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        theme === "dark"
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className={`mt-6 p-4 rounded-lg ${
                  theme === "dark"
                    ? "bg-blue-500/10 border border-blue-500/20"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-blue-300" : "text-blue-700"
                  }`}
                >
                  <strong>Security Tip:</strong> Use a unique password that you
                  don't use on any other websites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;