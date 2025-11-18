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
      name: Yup.string().trim().required("Name is required"),
      email: Yup.string()
        .trim()
        .email("Invalid email")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setFormError("");

      try {
        const payload = {
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
        };

        const response = await managerRegistration(payload);

        // const data = response.data;
        const message = response.message;
        const status = response.status;

        if (status === 201 || status === 200) {
          resetForm();
          onSuccess(payload.email);
          return;
        }

        //  ANY OTHER STATUS
        setFormError(message || "Registration failed");
      } catch (error) {
        const serverError =
          error?.response?.message ||
          error.message ||
          "Something went wrong.";

        setFormError(serverError);
      } finally {
        setSubmitting(false);
      }
    },
  });
};

export default useRegisterFormik;
