import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLoginFormik from "../formik/useLoginFormik";
import useRegisterFormik from "../formik/useRegisterFormik";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SignUp = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formErrorLogin, setFormErrorLogin] = useState("");
  const [formErrorRegister, setFormErrorRegister] = useState("");
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);

  const loginFormik = useLoginFormik(
    () => navigate("/form"),
    setFormErrorLogin
  );

  const registerFormik = useRegisterFormik(
    (email) => navigate(`/verify-email?email=${encodeURIComponent(email)}`),
    setFormErrorRegister
  );

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
    <div className="w-full min-h-screen overflow-hidden bg-[#f8f8ee] flex">
      {/* Left Side */}
      <div className="flex max-md:hidden p-20 justify-center items-center w-1/2">
        <img src="/images/animated-banner.gif" alt="Banner" />
      </div>

      {/* Right Side */}
      <div className="flex bg-db-50 w-1/2 max-md:w-full justify-center items-center transition-all duration-500">
        <div className="flex flex-col justify-center mt-[-80px] items-center w-full gap-3 p-10">
          <h1 className="text-center text-bg-50 text-3xl font-bold">PharmaConnect +</h1>
          <p className="text-Secondary-50 text-xs text-center">
            {isLogin
              ? "Please login to continue your session!"
              : "Create your account to get started!"}
          </p>

          <div className="flex w-full mt-4 items-center justify-center relative">
            <div className="w-2/3 relative">
              {/* LOGIN FORM */}
              <form
                onSubmit={loginFormik.handleSubmit}
                className={`absolute top-5 left-0 w-full transition-all duration-500 ${
                  isLogin
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-90 pointer-events-none"
                }`}
              >
                <div className="flex flex-col gap-5">
                  <input
                    type="email"
                    name="email"
                    aria-label="Email"
                    placeholder="Enter your email address"
                    className="text-Secondary-50 text-xs p-3 h-10 bg-white rounded-xl outline-none"
                    value={loginFormik.values.email}
                    onChange={loginFormik.handleChange}
                  />
                  {loginFormik.touched.email && loginFormik.errors.email && (
                    <div className="text-red-400 text-xs">{loginFormik.errors.email}</div>
                  )}

                  <div className="relative">
                    <input
                      type={showPasswordLogin ? "text" : "password"}
                      name="password"
                      aria-label="Password"
                      placeholder="Enter your password"
                      className="p-3 h-10 w-full text-xs bg-white text-Secondary-50 rounded-xl outline-none"
                      value={loginFormik.values.password}
                      onChange={loginFormik.handleChange}
                    />
                    <span
                      className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                      onClick={() => setShowPasswordLogin((prev) => !prev)}
                    >
                      {showPasswordLogin ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </span>
                  </div>
                  {loginFormik.touched.password && loginFormik.errors.password && (
                    <div className="text-warning-50 text-xs">{loginFormik.errors.password}</div>
                  )}

                  {formErrorLogin && (
                    <div className="text-warning-50 text-sm text-center">{formErrorLogin}</div>
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
                  className="w-full mt-7 py-2 bg-bg-50 font-semibold text-primary-50 rounded-xl hover:bg-selected-50 hover:text-white transition"
                >
                  {loginFormik.isSubmitting ? "Logging In..." : "Log In"}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm text-Secondary-50">
                    Don't have an account?
                    <button
                      type="button"
                      onClick={handleSwitchToSignUp}
                      className="ml-1 text-blue-500 hover:underline cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </form>

              {/* SIGNUP FORM */}
              <form
                onSubmit={registerFormik.handleSubmit}
                className={`absolute top-0 left-0 w-full transition-all duration-500 ${
                  !isLogin
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-90 pointer-events-none"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    name="name"
                    aria-label="Full Name"
                    placeholder="Enter your name"
                    className="p-3 h-10 text-xs bg-white text-Secondary-50 rounded-xl outline-none"
                    value={registerFormik.values.name}
                    onChange={registerFormik.handleChange}
                  />
                  {registerFormik.touched.name && registerFormik.errors.name && (
                    <div className="text-red-400 text-xs">{registerFormik.errors.name}</div>
                  )}

                  <input
                    type="email"
                    name="email"
                    aria-label="Email"
                    placeholder="Enter your email address"
                    className="p-3 h-10 text-xs bg-white text-Secondary-50 rounded-xl outline-none"
                    value={registerFormik.values.email}
                    onChange={registerFormik.handleChange}
                  />
                  {registerFormik.touched.email && registerFormik.errors.email && (
                    <div className="text-red-400 text-xs">{registerFormik.errors.email}</div>
                  )}

                  <div className="relative">
                    <input
                      type={showPasswordRegister ? "text" : "password"}
                      name="password"
                      aria-label="Password"
                      placeholder="Enter your password"
                      className="p-3 h-10 w-full text-xs bg-white text-Secondary-50 rounded-xl outline-none"
                      value={registerFormik.values.password}
                      onChange={registerFormik.handleChange}
                    />
                    <span
                      className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                      onClick={() => setShowPasswordRegister((prev) => !prev)}
                    >
                      {showPasswordRegister ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </span>
                  </div>
                  {registerFormik.touched.password && registerFormik.errors.password && (
                    <div className="text-red-400 text-xs">{registerFormik.errors.password}</div>
                  )}

                  {formErrorRegister && (
                    <div className="text-red-400 text-sm text-center">{formErrorRegister}</div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={registerFormik.isSubmitting}
                  className="w-full mt-7 py-2 bg-bg-50 text-primary-50 rounded-xl hover:bg-black hover:text-white transition"
                >
                  {registerFormik.isSubmitting ? "Signing Up..." : "Sign Up"}
                </button>

                <div className="text-center mt-6">
                  <p className="text-sm text-Secondary-50">
                    Already have an account?
                    <button
                      type="button"
                      onClick={handleSwitchToLogin}
                      className="ml-1 text-blue-500 hover:underline cursor-pointer"
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
