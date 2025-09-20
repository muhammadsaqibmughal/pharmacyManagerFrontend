// formik/useOtpFormik.js
import { useFormik } from "formik";
import * as Yup from "yup";
import { verifyEmail } from "../api/pharmacyApi";
import { useNavigate } from "react-router-dom";

export const useOtpFormik = (email, setResendVisible, setServerMessage) => {
  const navigate = useNavigate();

  return useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .matches(/^\d{6}$/, "Enter a 6-digit OTP")
        .required("OTP is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await verifyEmail({ email, otp: values.otp });

        if (response.status === "success") {
          setServerMessage("");
          navigate("/signup");
        } else {
          setServerMessage(response.message || "Verification failed");
          if (response.message === "OTP has expired") {
            setResendVisible(true);
          }
        }
      } catch (err) {
        const msg = err.response?.data?.message || "Server error";
        setServerMessage(msg);
        if (msg === "OTP has expired") {
          setResendVisible(true);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });
};
