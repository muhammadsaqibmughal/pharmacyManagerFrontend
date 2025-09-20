import { useFormik } from "formik";
import * as Yup from "yup";
import { managerRegistration } from "../api/pharmacyApi";

const useRegisterFormik = (onSuccess, setFormError) => {
  return useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setFormError(""); // Clear any previous error
      try {
        const res = await managerRegistration(values);
        if (res.status === "success") {
          resetForm();
          onSuccess(values.email); // call navigation in the component
        } else {
          setFormError(res.message || "Registration failed");
        }
      } catch (err) {
        setFormError(err.response?.data?.message || "Something went wrong.");
      } finally {
        setSubmitting(false);
      }
    },
  });
};

export default useRegisterFormik;
