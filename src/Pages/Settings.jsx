import { useTheme } from "../theme-support/ThemeContext";

import React, { useState } from "react";

const Settings = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    EMAIL_HOST: "",
    EMAIL_PORT: "",
    EMAIL_USER: "",
    EMAIL_PASS: "",
    EMAIL_FROM: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email Config Data:", formData);
    alert("Submitted! (Check console for values)");
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    alert("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  return (
    <>
      <div className="flex justify-start px-10 mt-10 items-center  w-full  text-center">
        <h2
          className={`text-xl tracking-widest text-left font-bold  ${
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
            : " bg-light-50 text-primary-50"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className={`rounded-xl p-5  w-1/2 max-md:w-full border ${
            theme === "dark"
              ? "border-white/20 bg-white/10"
              : "border-white/40 bg-white/90"
          }   backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] `}
        >
          <h2
            className={`text-xl text-center font-semibold mb-4 ${
              theme === "dark" ? "text-light-50" : "text-primary-50"
            }`}
          >
            Email Configuration
          </h2>

          {/* EMAIL_HOST */}
          <div className="mb-4   w-full">
            <label className="text-sm font-medium">EMAIL_HOST</label>
            <input
              type="text"
              name="EMAIL_HOST"
              placeholder="smtp.gmail.com"
              value={formData.EMAIL_HOST}
              onChange={handleChange}
              className={`border-1 text-xs  font-semibold px-3 py-2 rounded-full w-full ${
                theme === "dark"
                  ? "border-gray-300 text-white/90"
                  : "border-black/40 text-primary-50"
              }`}
            />
          </div>

          {/* EMAIL_PORT */}
          <div className="mb-4">
            <label className="text-sm font-medium">EMAIL_PORT</label>
            <input
              type="text"
              name="EMAIL_PORT"
              placeholder="587"
              value={formData.EMAIL_PORT}
              onChange={handleChange}
              className={`border-1 text-xs  font-semibold px-3 py-2 rounded-full w-full ${
                theme === "dark"
                  ? "border-gray-300 text-white/90"
                  : "border-black/40 text-primary-50"
              }`}
            />
          </div>

          {/* EMAIL_USER */}
          <div className="mb-4">
            <label className="text-sm font-medium">EMAIL_USER</label>
            <input
              type="email"
              name="EMAIL_USER"
              placeholder="randssolutions.tec@gmail.com"
              value={formData.EMAIL_USER}
              onChange={handleChange}
              className={`border-1 text-xs  font-semibold px-3 py-2 rounded-full w-full ${
                theme === "dark"
                  ? "border-gray-300 text-white/90"
                  : "border-black/40 text-primary-50"
              }`}
            />
          </div>

          {/* EMAIL_PASS */}
          <div className="mb-4">
            <label className="text-sm font-medium">EMAIL_PASS</label>
            <input
              type="password"
              name="EMAIL_PASS"
              placeholder="xsfr zckm iopz uodw"
              value={formData.EMAIL_PASS}
              onChange={handleChange}
              className={`border-1 text-xs  font-semibold px-3 py-2 rounded-full w-full ${
                theme === "dark"
                  ? "border-gray-300 text-white/90"
                  : "border-black/40 text-primary-50"
              }`}
            />
          </div>

          {/* EMAIL_FROM */}
          <div className="mb-6">
            <label className="text-sm font-medium">EMAIL_FROM</label>
            <input
              type="email"
              name="EMAIL_FROM"
              placeholder="randssolutions.tec@gmail.com"
              value={formData.EMAIL_FROM}
              onChange={handleChange}
              className={`border-1 text-xs  font-semibold px-3 py-2 rounded-full w-full ${
                theme === "dark"
                  ? "border-gray-300 text-white/90"
                  : "border-black/40 text-primary-50"
              }`}
            />
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="px-4 py-2  bg-bg-50 w-50 hover:bg-selected-50 text-white rounded-full hover:bg-hf-100"
            >
              Submit
            </button>
          </div>
        </form>

        <div className="w-1/2  max-md:w-full">
          <form
            onSubmit={handlePasswordChange}
            className={`rounded-xl p-5 h-135 border ${
              theme === "dark"
                ? "border-white/20 bg-white/10"
                : "border-white/40 bg-white/90"
            }   backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] `}
          >
            <h2 className="text-xl text-center mt-5 font-semibold mb-2">
              Change Password
            </h2>
            <div className="mt-15 flex flex-col gap-6">
              <div className="flex flex-col gap-2  ">
                <label className="text-sm font-medium">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`border-1 text-xs  font-semibold px-3 py-2 rounded-full w-full ${
                    theme === "dark"
                      ? "border-gray-300 text-white/90"
                      : "border-black/40 text-primary-50"
                  }`}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="flex flex-col gap-2  ">
                <label className="text-sm  font-medium">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`border-1 text-xs  font-semibold px-3 py-2 rounded-full w-full ${
                    theme === "dark"
                      ? "border-gray-300 text-white/90"
                      : "border-black/40 text-primary-50"
                  }`}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="flex flex-col gap-2  ">
                <label className="text-sm font-medium">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`border-1 text-xs  font-semibold px-3 py-2 rounded-full w-full ${
                    theme === "dark"
                      ? "border-gray-300 text-white/90"
                      : "border-black/40 text-primary-50"
                  }`}
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center mt-15 items-center w-full">
              <button
                type="submit"
                className="px-4 py-2 bg-bg-50 hover:bg-selected-50 text-white rounded-full hover:bg-hf-100"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Settings;
