import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLoginFormik from "../formik/useLoginFormik";
import useRegisterFormik from "../formik/useRegisterFormik";

const SignUp = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formErrorLogin, setFormErrorLogin] = useState("");
  const [formErrorRegister, setFormErrorRegister] = useState("");

  const loginFormik = useLoginFormik(
    () => navigate("/form"),
    setFormErrorLogin
  );

  const registerFormik = useRegisterFormik(
    (email) => navigate(`/verify-email?email=${encodeURIComponent(email)}`),
    setFormErrorRegister
  );

  return (
    <div className="w-full min-h-screen overflow-hidden bg-[#f8f8ee] flex">
      {/* Left Side */}
      <div className="flex max-md:hidden p-20 justify-center items-center w-1/2">
        <img src="/images/animated-banner.gif" alt="Banner" />
      </div>

      {/* Right Side */}
      <div className="flex bg-db-50 w-1/2 max-md:w-full justify-center items-center transition-all duration-500">
        <div className="flex flex-col justify-center -mt-80  items-center w-full gap-3 p-10">
          <h1 className="text-center text-bg-50 text-3xl font-bold">PharmaConnect +</h1>
          <p className="text-Secondary-50 text-xs text-center">
            {isLogin
              ? "Please login to continue your session!"
              : "Create your account to get started!"}
          </p>

          {/* Forms */}
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
                    placeholder="Enter your email address"
                    className="text-Secondary-50 text-xs p-3 h-10 bg-white rounded-xl outline-none"
                    value={loginFormik.values.email}
                    onChange={loginFormik.handleChange}
                  />
                  {loginFormik.touched.email && loginFormik.errors.email && (
                    <div className="text-red-400 text-xs">{loginFormik.errors.email}</div>
                  )}

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="p-3 h-10 text-xs bg-white text-Secondary-50 rounded-xl outline-none"
                    value={loginFormik.values.password}
                    onChange={loginFormik.handleChange}
                  />
                  {loginFormik.touched.password && loginFormik.errors.password && (
                    <div className="text-warning-50 text-xs">{loginFormik.errors.password}</div>
                  )}

                  {formErrorLogin && (
                    <div className="text-warning-50 text-sm text-center">{formErrorLogin}</div>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="w-full mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-blue-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginFormik.isSubmitting}
                  className="w-full mt-7 py-2 bg-bg-50 font-semibold text-primary-50 rounded-xl hover:bg-selected-50 hover:text-white transition"
                >
                  Log In
                </button>

                {/* Switch to Sign Up */}
                <div className="text-center mt-4">
                  <p className="text-sm text-Secondary-50">
                    Don't have an account?
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
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
                    placeholder="Enter your email address"
                    className="p-3 h-10 text-xs bg-white text-Secondary-50 rounded-xl outline-none"
                    value={registerFormik.values.email}
                    onChange={registerFormik.handleChange}
                  />
                  {registerFormik.touched.email && registerFormik.errors.email && (
                    <div className="text-red-400 text-xs">{registerFormik.errors.email}</div>
                  )}

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="p-3 h-10 text-xs bg-white text-Secondary-50 rounded-xl outline-none"
                    value={registerFormik.values.password}
                    onChange={registerFormik.handleChange}
                  />
                  {registerFormik.touched.password && registerFormik.errors.password && (
                    <div className="text-red-400 text-xs">{registerFormik.errors.password}</div>
                  )}

                  {formErrorRegister && (
                    <div className="text-red-400 text-sm text-center">{formErrorRegister}</div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={registerFormik.isSubmitting}
                  className="w-full mt-7 py-2 bg-bg-50 text-primary-50 rounded-xl hover:bg-black hover:text-white transition"
                >
                  Sign Up
                </button>

                {/* Switch to Login */}
                <div className="text-center mt-6">
                  <p className="text-sm text-Secondary-50">
                    Already have an account?
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="ml-1 text-blue-500 hover:underline cursor-pointer "
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
