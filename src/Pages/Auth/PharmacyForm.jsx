import usePharmacyRegistrationFormik from "../../formik/usePharmacyRegistrationFormik"
import { fields } from "../../constants";

const PharmacyForm = ({
  currentSection,
  location,
  loading,
  error,
  formError,
  setFormError,
  getLocation,
  onSuccess,
  handleNext,
}) => {
  const formik = usePharmacyRegistrationFormik(onSuccess, setFormError);

  // Update formik value when location prop changes
  React.useEffect(() => {
    if (currentSection === "pharmacy") {
      console.log("📍 Location from props:", location); // ✅ Debug
      formik.setFieldValue("location", location);
    }
  }, [location]);

  const handleFileChange = (e, fieldName) => {
    const file = e.currentTarget.files[0];
    formik.setFieldValue(fieldName, file);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col w-full items-center"
    >
      {fields
        .filter((field) => field.section === currentSection)
        .map((field, index) => (
          <div
            key={index}
            className="flex flex-col w-full justify-center items-center"
          >
            <div className="flex flex-col gap-1 w-1/3 max-xl:w-1/2 max-lg:w-90 max-md:w-full p-2 max-sm:w-4/5">
              <label
                htmlFor={field.name}
                className="labels text-Secondary-50 font-semibold fields"
              >
                {field.label}
              </label>

              {field.type === "file" ? (
                <input
                  id={field.name}
                  name={field.name}
                  type="file"
                  onChange={(e) => handleFileChange(e, field.name)}
                  className="fields text-Secondary-50 text-xs bg-white border border-gray-300 p-2 rounded-xl"
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="fields text-Secondary-50 text-xs bg-white border border-gray-300 p-2 rounded-xl"
                />
              )}

              {formik.touched[field.name] && formik.errors[field.name] && (
                <div className="text-warning-50 text-xs mt-1">
                  {formik.errors[field.name]}
                </div>
              )}
            </div>
          </div>
        ))}

      {/* Location Field */}
      {currentSection === "pharmacy" && (
        <div className="flex w-full justify-center items-center -mt-5 p-5">
          <div className="flex flex-col gap-2 w-66 max-xl:w-1/2 max-lg:w-90 max-md:w-4/5">
            <label className="labels text-Secondary-50 font-semibold">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formik.values.location}
              placeholder="Get Location"
              readOnly
              className="fields text-Secondary-50 text-xs bg-white p-2 outline-none rounded-xl"
            />
          </div>
          <button
            type="button"
            onClick={getLocation}
            className="ml-3 w-20 h-10 mt-6 bg-hf-50 hover:bg-selected-50 text-white rounded-xl transition"
          >
            {loading ? "Locating..." : "Get"}
          </button>
        </div>
      )}

      {/* Error Message */}
      {(error || formError) && (
        <span className="text-sm text-warning-50 mt-2">
          {error || formError}
        </span>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center items-center mt-10">
        {currentSection === "personal" ? (
          <button
            type="button"
            onClick={handleNext}
            className="bg-bg-50 labels hover:bg-selected-50 rounded-xl px-6 py-2 transition"
          >
            <span className="text-white font-semibold">Next</span>
          </button>
        ) : (
          <button
            onClick={() => {
              console.log("login");
            }}
            type="submit"
            disabled={formik.isSubmitting}
            className="bg-bg-50 labels hover:bg-selected-50 rounded-xl px-6 py-2 transition"
          >
            <span className="text-white font-semibold">
              {formik.isSubmitting ? "Registering..." : "Register"}
            </span>
          </button>
        )}
      </div>
    </form>
  );
};

export default PharmacyForm;
