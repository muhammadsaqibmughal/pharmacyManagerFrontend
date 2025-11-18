import { useFormik } from "formik";
import * as Yup from "yup";
import { managerLogin } from "../api/pharmacyApi";
import { useNavigate } from "react-router-dom";

const useLoginFormik = (setFormError, setLoading) => {
  const navigate = useNavigate();

  return useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setFormError("");
      setLoading(true);

      try {
        const response = await managerLogin(values);

        const httpStatus = response.status;
        const message = response.data?.message;
        const user = response.data?.data?.user || response.data?.user;

        // EMAIL NOT VERIFIED
        if (httpStatus === 403 && message?.toLowerCase().includes("not verified")) {
          return navigate(`/verify-email?email=${values.email}`);
        }

        // USER NOT FOUND
        if (httpStatus === 404) {
          setFormError("User not found. Please register first.");
          return;
        }

        // WRONG CREDENTIALS / INVALID PASSWORD
        if (httpStatus === 401) {
          setFormError("Invalid email or password.");
          return;
        }

        // ANY OTHER ERROR
        if (httpStatus !== 200) {
          setFormError(message || "Something went wrong.");
          return;
        }

        // SUCCESS LOGIN
        resetForm();

        // Save correct user info for ProtectedRoute
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isRegistered: user.isRegistered ?? false,
            isApproved: user.isApproved ?? false,
            pharmacyId: user.pharmacyId ?? null,
          })
        );

        // REDIRECTS
        if (!user.isRegistered) return navigate("/form");
        if (!user.isApproved) return navigate("/pending-approval");

        return navigate("/pos/dashboard");
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Something went wrong.";

        if (msg.toLowerCase().includes("not verified")) {
          return navigate(`/verify-email?email=${values.email}`);
        }

        setFormError(msg);
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });
};

export default useLoginFormik;
