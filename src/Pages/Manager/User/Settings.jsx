import React from "react";
import { useTheme } from "../../../theme-support/ThemeContext";
<<<<<<< HEAD

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
=======
import { changePassword } from "../../../api/pharmacyApi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Settings = () => {
  const { theme } = useTheme();
>>>>>>> da58c20cb16776c21a5a56724c8ec8efd9092ad0

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /[A-Z]/,
        "Password must contain at least one uppercase letter"
      )
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

  const handlePasswordChange = async (values, { setSubmitting, resetForm, setErrors }) => {
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
  return (
    <>
      <div className="flex justify-start px-10 mt-10 items-center  w-full  text-center">
        <div className="flex justify-start mb-4">
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-bg-50 hover:bg-selected-50 text-white rounded-full"
          >
            Back
          </button>
        </div>
  return (
    <>
      <div className="flex justify-start px-10 mt-10 items-center w-full text-center">
        <h2
          className={`text-xl tracking-widest text-left font-bold ${
            theme === "dark" ? "text-light-50" : "text-primary-50"
          }`}
        >
          Settings
        </h2>
      </div>

      <div
        className={`flex max-md:flex-col gap-5 p-10 ${
          theme === "dark"
            ? "bg-dark-50 text-white/90"
            : "bg-light-50 text-primary-50"
        }`}
      >
        <div className="w-1/2 max-md:w-full">
          <div
            className={`rounded-xl p-5 h-135 border ${
              theme === "dark"
                ? "border-white/20 bg-white/10"
                : "border-white/40 bg-white/90"
            } backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]`}
          >
            <h2 className="text-xl text-center mt-5 font-semibold mb-2">
              Change Password
            </h2>

            <Formik
              initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handlePasswordChange}
            >
              {({ isSubmitting }) => (
                <Form className="mt-15 flex flex-col gap-6">
                  {/* Current Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">
                      Current Password
                    </label>
                    <Field
                      type="password"
                      name="currentPassword"
                      placeholder="Enter current password"
                      className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${
                        theme === "dark"
                          ? "border-gray-300 text-white/90"
                          : "border-black/40 text-primary-50"
                      }`}
                    />
                    <ErrorMessage
                      name="currentPassword"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* New Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Field
                      type="password"
                      name="newPassword"
                      placeholder="Enter new password"
                      className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${
                        theme === "dark"
                          ? "border-gray-300 text-white/90"
                          : "border-black/40 text-primary-50"
                      }`}
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${
                        theme === "dark"
                          ? "border-gray-300 text-white/90"
                          : "border-black/40 text-primary-50"
                      }`}
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center mt-15 items-center w-full">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-bg-50 hover:bg-selected-50 text-white rounded-full hover:bg-hf-100"
                    >
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
