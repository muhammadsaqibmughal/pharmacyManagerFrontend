import React, { useState } from "react";
import { useTheme } from "../theme-support/ThemeContext"; // Adjust path if needed
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { theme } = useTheme();

  // Dummy user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    counterNo: 3,
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
      <div
        className={`flex justify-between p-10 items-center  ${
          theme === "dark" ? "bg-dark-50" : " bg-light-50"
        }`}
      >
        <Link
          to="/onlyCounter"
          className="bg-bg-50 text-white px-4 py-2 rounded-full hover:bg-selected-50"
        >
          ← Back
        </Link>
      </div>
      <div
        className={` flex justify-center items-center overflow-hidden p-10 -mt-10 w-full min-h-screen ${
          theme === "dark" ? "bg-dark-50" : " bg-light-50"
        }`}
      >
        <div className="w-2/4">
          <div
            className={`rounded-xl p-5 border ${
              theme === "dark"
                ? "border-white/20 bg-white/10 text-white/90"
                : "border-white/40 bg-white/90 text-primary-50"
            }   backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]`}
          >
            <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>

            {/* User Info Section */}
            <div className=" flex flex-col gap-3 justify-center items-center mb-5">
              <div className="text-[10px] flex gap-2 justify-center items-center">
                <label className="text-sm font-semibold">Name:</label>
                <div className="text-base">{user.name}</div>
              </div>
              <div className="text-[10px] flex gap-2 justify-center items-center">
                <label className="text-sm font-semibold">Email:</label>
                <div className="text-base">{user.email}</div>
              </div>
              <div className="text-[10px] flex gap-2 justify-center items-center">
                <label className="text-sm font-semibold">Counter No:</label>
                <div className="text-base">{user.counterNo}</div>
              </div>
            </div>

            {/* Password Change Form */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h2 className="text-xl font-semibold mb-2">Change Password</h2>

              <div>
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

              <div>
                <label className="text-sm font-medium">New Password</label>
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

              <div>
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

              <div className="flex justify-center items-center w-full">
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
      </div>
    </>
  );
};

export default ProfilePage;
