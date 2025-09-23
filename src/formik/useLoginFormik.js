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
      setLoading(true);  // Set loading while submitting

      try {
        const res = await managerLogin(values);

        if (res.status === "success") {
          resetForm();
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: res.user.id,
              name: res.user.name,
              email: res.user.email,
              isRegistered: res.user.pharmacy?.isRegistered || false,
              isApproved: res.user.pharmacy?.isApproved || false,
            })
          );

          // Conditional navigation
          if (!res.user.pharmacy?.isRegistered) {
            navigate("/form");
          } else if (!res.user.pharmacy?.isApproved) {
            navigate("/pending-approval");
          } else {
            navigate("/pos/dashboard");
          }
        } else {
          setFormError(res.message || "Login failed");
        }
      } catch (err) {
        const msg = err.response?.data?.message || "Something went wrong.";
        if (msg.toLowerCase().includes("not verified")) {
          navigate(`/verify-email?email=${values.email}`);
        } else {
          setFormError(msg);
        }
      } finally {
        setSubmitting(false);
        setLoading(false); // Done loading
      }
    },
  });
};

export default useLoginFormik