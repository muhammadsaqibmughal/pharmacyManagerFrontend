import { useTheme } from "../../../theme-support/ThemeContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../../api/pharmacyApi";
import { Lock, ArrowLeft, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const handleClick = () => {
    if (user?.role === "staff") navigate("/onlyCounter");
    else navigate(-1);
  };

  const passwordRequirements = [
    { text: "At least 8 characters", regex: /.{8,}/ },
    { text: "One uppercase letter", regex: /[A-Z]/ },
    { text: "One lowercase letter", regex: /[a-z]/ },
    { text: "One number", regex: /\d/ },
    { text: "One special character (@$!%*?&)", regex: /[@$!%*?&]/ },
  ];

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      toast.error("Current password is required");
      return false;
    }
    if (!formData.newPassword) {
      toast.error("New password is required");
      return false;
    }

    for (let req of passwordRequirements) {
      if (!req.regex.test(formData.newPassword)) {
        toast.error(`New password must have: ${req.text}`);
        return false;
      }
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true); // Start submitting

  try {
    const payload = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    };
    const response = await changePassword(payload);

    if (response.status === "success") {
      toast.success("Password changed successfully!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      toast.error(response.data?.message || "Failed to update password");
    }
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message || "An unexpected error occurred. Please try again."
    );
  } finally {
    setIsSubmitting(false); // Always reset
  }
};


  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Header */}
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

        {/* Title */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`p-3 rounded-xl ${
                theme === "dark" ? "bg-blue-500/20 text-blue-400" : "bg-blue-500/10 text-blue-600"
              }`}
            >
              <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Security Settings
            </h1>
          </div>
          <p className={`text-sm sm:text-base ml-14 sm:ml-16 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Manage your account security and password
          </p>
        </div>

        {/* Form and Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-2xl p-6 sm:p-8 ${
                theme === "dark"
                  ? "bg-gray-800/50 backdrop-blur-xl border border-gray-700/50"
                  : "bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <Lock className={`w-5 h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                <h2 className={`text-xl sm:text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Change Password
                </h2>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <PasswordField
                  label="Current Password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  show={showCurrent}
                  setShow={setShowCurrent}
                  theme={theme}
                />
                <PasswordField
                  label="New Password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  show={showNew}
                  setShow={setShowNew}
                  theme={theme}
                />
                <PasswordField
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  show={showConfirm}
                  setShow={setShowConfirm}
                  theme={theme}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                    {isSubmitting ? "updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div
              className={`rounded-2xl p-6 sticky top-6 ${
                theme === "dark"
                  ? "bg-gray-800/50 backdrop-blur-xl border border-gray-700/50"
                  : "bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl"
              }`}
            >
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Password Requirements
              </h3>
              <div className="space-y-3">
                {passwordRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle
                      className={`w-5 h-5 ${
                        req.regex.test(formData.newPassword)
                          ? "text-green-500"
                          : theme === "dark"
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        req.regex.test(formData.newPassword)
                          ? "text-green-500"
                          : theme === "dark"
                          ? "text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PasswordField = ({ label, name, value, onChange, show, setShow, theme }) => (
  <div>
    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 ${
          theme === "dark"
            ? "bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        }`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className={`absolute right-4 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

export default Settings;