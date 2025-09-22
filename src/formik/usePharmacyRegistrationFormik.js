import { supabase } from "../utils/supabaseClient";
import { useFormik } from "formik";
import * as Yup from "yup";
import { pharmacyRegistration } from "../api/pharmacyApi";

const uploadFileToSupabase = async (file, pathPrefix) => {
  if (!file) throw new Error("No file provided for upload");

  const fileName = `${pathPrefix}/${Date.now()}-${file.name}`;
  try {
    console.log(" Uploading file:", file.name);

    const { data, error } = await supabase.storage
      .from("pharmacy-files")
      .upload(fileName, file);

    if (error) throw new Error(error.message);

    const { data: publicUrlData, error: urlError } = await supabase.storage
      .from("pharmacy-files")
      .getPublicUrl(fileName);

    if (urlError) throw new Error(urlError.message);

    console.log(" File uploaded successfully:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error(" File upload error:", error);
    throw new Error("File upload failed: " + error.message);
  }
};

const usePharmacyRegistrationFormik = (onSuccess, setFormError) => {
  return useFormik({
    initialValues: {
      phoneNumber: "",
      frontId: null,
      backId: null,
      pharmacyName: "",
      city: "",
      state: "",
      address: "",
      licenseNumber: "",
      licensePicture: null,
      location: "",
    },
    validationSchema: Yup.object({
      phoneNumber: Yup.string()
        .matches(/^0\d{10}$/, "Phone number must be exactly 11 digits, starting with 0")
        .required("Phone number is required"),
      frontId: Yup.mixed().required("Front ID image is required"),
      backId: Yup.mixed().required("Back ID image is required"),
      pharmacyName: Yup.string().required("Pharmacy name is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      address: Yup.string().required("Address is required"),
      licenseNumber: Yup.string()
        .required("License number is required")
        .min(3, "License number seems too short"),
      licensePicture: Yup.mixed().required("License picture is required"),
      location: Yup.string()
        .matches(
          /^Lat:-?\d+(\.\d+)?,Long:-?\d+(\.\d+)?$/,
          "Location must be in 'Lat:<latitude>,Long:<longitude>' format (e.g. Lat:31.52037,Long:74.35875)"
        )
        .required("Location is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setFormError("");
      console.log(" Submitting form with values:", values);

      try {

        const filesToUpload = [values.frontId, values.backId, values.licensePicture];
        if (filesToUpload.some((file) => !file)) {
          throw new Error("Please provide all required files.");
        }

        //  Upload files
        const [frontIdUrl, backIdUrl, licenseUrl] = await Promise.all([
          uploadFileToSupabase(values.frontId, "ids/front"),
          uploadFileToSupabase(values.backId, "ids/back"),
          uploadFileToSupabase(values.licensePicture, "licenses"),
        ]);

        const locationRegex = /^Lat:(-?\d+(\.\d+)?),Long:(-?\d+(\.\d+)?)$/;
        const match = values.location.match(locationRegex);

        if (!match) {
          throw new Error("Invalid location format. Use Lat:<latitude>,Long:<longitude>");
        }

        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[3]);

        if (
          isNaN(latitude) ||
          isNaN(longitude) ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          throw new Error("Latitude must be between -90 and 90, and longitude between -180 and 180.");
        }

        //  Build payload
        const payload = {
          pharmacyName: values.pharmacyName,
          phoneNumber: values.phoneNumber,
          state: values.state,
          city: values.city,
          address: values.address,
          licenseNumber: values.licenseNumber,
          latitude,
          longitude,
          idFrontUrl: frontIdUrl,
          idBackUrl: backIdUrl,
          licenseUrl,
          pharmacyImageUrl: null,
        };

        console.log(" Sending payload to API:", payload);

        //  Call API
        const res = await pharmacyRegistration(payload);
        console.log(" API response:", res);

        if (res.status === "success") {
          resetForm();
          onSuccess(payload.phoneNumber);
        } else {
          setFormError(res.message || "Registration failed.");
        }
      } catch (err) {
        console.error(" Form submission error:", err);
        setFormError(err.message || "Something went wrong.");
      } finally {
        setSubmitting(false);
      }
    },
  });
};

export default usePharmacyRegistrationFormik;
