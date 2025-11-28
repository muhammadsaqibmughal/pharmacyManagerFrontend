import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLoginFormik from "../../formik/useLoginFormik"
import useRegisterFormik from "../../formik/useRegisterFormik";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useTheme } from "../../theme-support/ThemeContext";
import { FaSpinner } from "react-icons/fa";

const SignUp = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formErrorLogin, setFormErrorLogin] = useState("");
  const [formErrorRegister, setFormErrorRegister] = useState("");
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);

  // Login Formik
  const loginFormik = useLoginFormik(setFormErrorLogin, setLoading);

  // Register Formik
  const registerFormik = useRegisterFormik(
    (email) => navigate(`/verify-email?email=${encodeURIComponent(email)}`),
    setFormErrorRegister
  );

  if (loading) {
    return (
      <div
        className={`flex items-center w-full min-h-screen justify-center py-4 ${
          theme === "dark" ? "bg-dark-50" : "bg-light-50"
        }`}
      >
        <FaSpinner className="animate-spin text-blue-500 text-8xl" />
      </div>
    );
  }

  const handleSwitchToSignUp = () => {
    setIsLogin(false);
    setFormErrorLogin("");
    loginFormik.resetForm();
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
    setFormErrorRegister("");
    registerFormik.resetForm();
  };

  return (
    <div
      className={`w-full min-h-screen overflow-hidden flex ${
        theme === "dark"
          ? "bg-dark-50 text-white/90"
          : "bg-light-50 text-primary-50"
      }`}
    >
      {/* Left Side */}
      <div className="flex max-md:hidden p-20 justify-center items-center w-1/2">
        <img src="/images/animated-banner.gif" alt="Banner" />
      </div>

      {/* Right Side */}
      <div className="flex w-1/2 max-md:w-full justify-center items-center">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl flex flex-col justify-center mb-70 items-center w-4/5 max-md:w-11/12 gap-3 p-10 transition-all duration-500">
          <h1
            className={`text-center text-3xl font-bold ${
              theme === "dark" ? "text-white/90" : "text-primary-50"
            }`}
          >
            PharmaConnect +
          </h1>
          <p className="text-xs text-center">
            {isLogin
              ? "Please login to continue your session!"
              : "Create your account to get started!"}
          </p>

          <div className="flex w-full mt-4 items-center justify-center relative">
            <div className="w-full max-w-md relative">
              {/* LOGIN FORM */}
              <form
                onSubmit={loginFormik.handleSubmit}
                className={`absolute top-15 left-0 w-full transition-all duration-500 ${
                  isLogin
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-90 pointer-events-none"
                }`}
              >
                <div className="flex flex-col gap-5">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${
                      theme === "dark"
                        ? "border-gray-300 text-white/90"
                        : "border-black/40 text-primary-50"
                    }`}
                    value={loginFormik.values.email}
                    onChange={loginFormik.handleChange}
                  />
                  {loginFormik.touched.email && loginFormik.errors.email && (
                    <div className="text-red-400 text-xs">
                      {loginFormik.errors.email}
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type={showPasswordLogin ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      className={`border-1 text-xs font-semibold px-3 py-2 rounded-full w-full ${
                        theme === "dark"
                          ? "border-gray-300 text-white/90"
                          : "border-black/40 text-primary-50"
                      }`}
                      value={loginFormik.values.password}
                      onChange={loginFormik.handleChange}
                    />
                    <span
                      className="absolute top-3 right-3 cursor-pointer"
                      onClick={() => setShowPasswordLogin((prev) => !prev)}
                    >
                      {showPasswordLogin ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </span>
                  </div>
                  {loginFormik.touched.password &&
                    loginFormik.errors.password && (
                      <div className="text-red-400 text-xs">
                        {loginFormik.errors.password}
                      </div>
                    )}

                  {formErrorLogin && (
                    <div className="text-red-400 text-sm text-center">
                      {formErrorLogin}
                    </div>
                  )}
                </div>

                <div className="w-full mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-blue-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loginFormik.isSubmitting}
                  className="w-full mt-7 py-2 bg-[#4F7942] text-white font-semibold rounded-xl hover:bg-green-700 transition"
                >
                  {loginFormik.isSubmitting ? "Logging In..." : "Log In"}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Don't have an account?
                    <button
                      type="button"
                      onClick={handleSwitchToSignUp}
                      className="ml-1 text-blue-400 hover:underline cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </form>

              {/* SIGNUP FORM */}
              <form
                onSubmit={registerFormik.handleSubmit}
                className={`absolute top-15 left-0 w-full transition-all duration-500 ${
                  !isLogin
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-90 pointer-events-none"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    className={`border-1 text-xs backdrop-blur-sm font-semibold px-3 py-2 rounded-full w-full ${
                      theme === "dark"
                        ? "border-gray-300 text-white/90"
                        : "border-black/40 text-primary-50"
                    }`}
                    value={registerFormik.values.name}
                    onChange={registerFormik.handleChange}
                  />
                  {registerFormik.touched.name &&
                    registerFormik.errors.name && (
                      <div className="text-red-400 text-xs">
                        {registerFormik.errors.name}
                      </div>
                    )}

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    className={`border-1 text-xs backdrop-blur-sm font-semibold px-3 py-2 rounded-full w-full ${
                      theme === "dark"
                        ? "border-gray-300 text-white/90"
                        : "border-black/40 text-primary-50"
                    }`}
                    value={registerFormik.values.email}
                    onChange={registerFormik.handleChange}
                  />
                  {registerFormik.touched.email &&
                    registerFormik.errors.email && (
                      <div className="text-red-400 text-xs">
                        {registerFormik.errors.email}
                      </div>
                    )}

                  <div className="relative">
                    <input
                      type={showPasswordRegister ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      className={`border-1 text-xs backdrop-blur-sm font-semibold px-3 py-2 rounded-full w-full ${
                        theme === "dark"
                          ? "border-gray-300 text-white/90"
                          : "border-black/40 text-primary-50"
                      }`}
                      value={registerFormik.values.password}
                      onChange={registerFormik.handleChange}
                    />
                    <span
                      className="absolute top-3 right-3 text-gray-300 cursor-pointer"
                      onClick={() =>
                        setShowPasswordRegister((prev) => !prev)
                      }
                    >
                      {showPasswordRegister ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </span>
                  </div>
                  {registerFormik.touched.password &&
                    registerFormik.errors.password && (
                      <div className="text-red-400 text-xs">
                        {registerFormik.errors.password}
                      </div>
                    )}

                  {formErrorRegister && (
                    <div className="text-red-400 text-sm text-center">
                      {formErrorRegister}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={registerFormik.isSubmitting}
                  className="w-full mt-7 py-2 bg-[#4F7942] font-semibold rounded-xl hover:bg-green-700 transition"
                >
                  {registerFormik.isSubmitting ? "Signing Up..." : "Sign Up"}
                </button>

                <div className="text-center mt-6">
                  <p className="text-sm">
                    Already have an account?
                    <button
                      type="button"
                      onClick={handleSwitchToLogin}
                      className="ml-1 text-blue-400 hover:underline cursor-pointer"
                    >
                      Log In
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
