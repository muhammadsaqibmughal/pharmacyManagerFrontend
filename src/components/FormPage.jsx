import React, { useState, useEffect, useRef } from "react";
import { fields } from "../constants";
import TitleHeader from "./TitleHeader";
import { Country, State, City } from "country-state-city";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "../utils/supabaseClient";
import { pharmacyRegistration } from "../api/pharmacyApi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme-support/ThemeContext";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FxaWIxMjMzIiwiYSI6ImNtaHp4bzduODA2OWkya3BrNXFzMnBvYTcifQ._ZqfkUKxR6zoSopOWDIhiQ";

const uploadFileToSupabase = async (file, pathPrefix) => {
  if (!file) throw new Error("No file provided for upload");

  const fileName = `${pathPrefix}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("pharmacy-files")
    .upload(fileName, file);

  if (error) throw new Error(error.message);

  const { data: publicUrlData, error: urlError } = await supabase.storage
    .from("pharmacy-files")
    .getPublicUrl(fileName);

  if (urlError) throw new Error(urlError.message);

  return publicUrlData.publicUrl;
};

const FormPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState("personal");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry));
      setSelectedState("");
      setCities([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      setCities(City.getCitiesOfState(selectedCountry, selectedState));
      setSelectedCity("");
    }
  }, [selectedState]);

  // Initialize Mapbox map with geocoder
  useEffect(() => {
    if (!map && currentSection === "pharmacy") {
      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12", // Colored theme map
        center: [0, 0],
        zoom: 2,
      });

      mapInstance.addControl(new mapboxgl.NavigationControl());

      // Add geocoder (search box)
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false, // We'll handle marker ourselves
        placeholder: "Search for a location",
      });

      mapInstance.addControl(geocoder);

      // Handle search result
      geocoder.on("result", (e) => {
        const { center } = e.result; // [lng, lat]

        if (!marker) {
          const newMarker = new mapboxgl.Marker({ color: "#f00" })
            .setLngLat(center)
            .addTo(mapInstance);
          setMarker(newMarker);
        } else {
          marker.setLngLat(center);
        }

        formik.setFieldValue(
          "location",
          `Lat:${center[1].toFixed(5)},Long:${center[0].toFixed(5)}`
        );

        mapInstance.flyTo({ center, zoom: 12, essential: true });
      });

      // Handle manual map click
      mapInstance.on("click", (e) => {
        const { lng, lat } = e.lngLat;

        if (!marker) {
          const newMarker = new mapboxgl.Marker({ color: "#f00" })
            .setLngLat([lng, lat])
            .addTo(mapInstance);
          setMarker(newMarker);
        } else {
          marker.setLngLat([lng, lat]);
        }

        formik.setFieldValue(
          "location",
          `Lat:${lat.toFixed(5)},Long:${lng.toFixed(5)}`
        );
      });

      setMap(mapInstance);
    }
  }, [map, marker, currentSection]);

  // Fly map to selected country/state/city
  useEffect(() => {
    if (map) {
      let center = [0, 0]; // default

      if (selectedCountry) {
        const country = Country.getAllCountries().find(
          (c) => c.isoCode === selectedCountry
        );
        if (country)
          center = [
            parseFloat(country.longitude),
            parseFloat(country.latitude),
          ];
      }

      if (selectedState) {
        const state = State.getStatesOfCountry(selectedCountry).find(
          (s) => s.isoCode === selectedState
        );
        if (state)
          center = [parseFloat(state.longitude), parseFloat(state.latitude)];
      }

      if (selectedCity) {
        const city = City.getCitiesOfState(selectedCountry, selectedState).find(
          (c) => c.name === selectedCity
        );
        if (city)
          center = [parseFloat(city.longitude), parseFloat(city.latitude)];
      }

      map.flyTo({
        center,
        zoom: selectedCity ? 12 : selectedState ? 8 : 4,
        essential: true,
      });
    }
  }, [selectedCountry, selectedState, selectedCity, map]);

  const handleNext = async () => {
    const errors = await formik.validateForm();
    if (errors.phoneNumber || errors.frontId || errors.backId) {
      setError("Please fill required fields first.");
      return;
    }

    setError("");
    setCurrentSection("pharmacy");
  };

  const formik = useFormik({
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
        .matches(
          /^0\d{10}$/,
          "Phone number must be exactly 11 digits, starting with 0"
        )
        .required("Phone number is required"),
      frontId: Yup.mixed().required("Front ID image is required"),
      backId: Yup.mixed().required("Back ID image is required"),
      pharmacyName: Yup.string().required("Pharmacy name is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      address: Yup.string().required("Address is required"),
      licenseNumber: Yup.string()
        .min(3, "License number seems too short")
        .required("License number is required"),
      licensePicture: Yup.mixed().required("License picture is required"),
      location: Yup.string()
        .matches(
          /^Lat:-?\d+(\.\d+)?,Long:-?\d+(\.\d+)?$/,
          "Invalid location format"
        )
        .required("Location is required"),
    }),
    onSubmit: async (values) => {
      try {
        setError("");
        setLoading(true);

        const { frontId, backId, licensePicture } = values;

        if (!frontId || !backId || !licensePicture) {
          setError("Please upload all required images");
          setLoading(false);
          return;
        }

        // Upload files
        const [frontIdUrl, backIdUrl, licenseUrl] = await Promise.all([
          uploadFileToSupabase(frontId, "ids/front"),
          uploadFileToSupabase(backId, "ids/back"),
          uploadFileToSupabase(licensePicture, "licenses"),
        ]);

        // Parse location
        const locationRegex = /^Lat:(-?\d+(\.\d+)?),Long:(-?\d+(\.\d+)?)$/;
        const match = values.location.match(locationRegex);
        if (!match) throw new Error("Invalid location format.");
        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[3]);

        // Build payload
        const payload = {
          pharmacyName: values.pharmacyName,
          phoneNumber: values.phoneNumber,
          country: selectedCountry,
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

        // Call API
        const response = await pharmacyRegistration(payload);
        // console.log(response.data.data.user);
        // console.log(response.status);

        // // FIXED RESPONSE VALIDATION
        if (!response?.status==201) {
          console.log(response.data.user);
          setError("Unexpected server response.");
          setLoading(false);
          return;
        }

        // Extract user from backend response
        const user = response.data.data.user;

        // Save in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,
            role: user.role,
            isRegistered: user.isRegistered,
            isApproved: user.isApproved,
            pharmacyId: user.pharmacyId,
          })
        );

        formik.resetForm();
        alert(response.message || "Registration successful!");
        navigate("/pending-approval");
      } catch (err) {
        console.error("Submit error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div
      className={`w-full min-h-screen ${
        theme === "dark"
          ? "bg-dark-50 text-white/90"
          : "bg-light-50 text-primary-50"
      } px-20 max-md:px-10 py-10`}
    >
      <form
        className="flex flex-col w-full items-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] px-10 py-10"
        onSubmit={formik.handleSubmit}
      >
        <div className="title-Header text-center">
          <TitleHeader title="Registration Form" />
        </div>

        {/* Section Toggle Buttons */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setCurrentSection("personal")}
            className={`p-2 rounded-xl border-2 border-bg-50 ${
              currentSection === "personal"
                ? "bg-bg-50 text-white"
                : "bg-white text-primary-50"
            } transition`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setCurrentSection("pharmacy")}
            className={`p-2 rounded-xl border-2 border-bg-50 ${
              currentSection === "pharmacy"
                ? "bg-bg-50 text-white"
                : "bg-white text-primary-50"
            } transition`}
          >
            Pharmacy Info
          </button>
        </div>

        <div className="w-full h-[1px] bg-db-50" />

        <div className=" w-full mt-2">
          {fields
            .filter((field) => field.section === currentSection)
            .filter(
              (field) =>
                !["Country", "State", "City", "Location"].includes(field.label)
            )
            .map((field, index) => (
              <div
                key={index}
                className="flex flex-col w-full justify-center items-center"
              >
                <div className="flex flex-col gap-1 w-1/3 max-xl:w-1/2 max-lg:w-90 max-md:w-full p-2 max-sm:w-4/5">
                  <label className="labels text-Secondary-50 font-semibold fields">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className={`text-xs ${
                      theme === "dark"
                        ? "text-white/90 bg-white/10 border-white/20"
                        : "text-primary-50 bg-black/10 border-black/20"
                    } backdrop-blur-sm border p-2 rounded-xl outline-none`}
                    name={field.name}
                    onChange={(event) => {
                      if (field.type === "file") {
                        formik.setFieldValue(
                          field.name,
                          event.currentTarget.files[0]
                        );
                      } else {
                        formik.handleChange(event);
                      }
                    }}
                    onBlur={formik.handleBlur}
                    value={
                      field.type === "file"
                        ? undefined
                        : formik.values[field.name]
                    }
                  />
                  {formik.touched[field.name] && formik.errors[field.name] && (
                    <div className="text-red-500 text-xs">
                      {formik.errors[field.name]}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Country / State / City Dropdowns */}
        {currentSection === "pharmacy" && (
          <div className="flex flex-col w-full items-center">
            {/* Country */}
            <div className="flex flex-col gap-1 w-1/3 max-xl:w-1/2 max-lg:w-90 max-md:w-full p-2 max-sm:w-4/5">
              <label className="labels text-Secondary-50 font-semibold">
                Country
              </label>
              <select
                className={`text-xs ${
                  theme === "dark"
                    ? "text-white/90  bg-white/10 border-white/20"
                    : "text-primary-50 bg-black/10 border-black/20"
                } backdrop-blur-sm border p-2 rounded-xl outline-none`}
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedState("");
                  setSelectedCity("");
                }}
              >
                <option value="">Select Country</option>
                {Country.getAllCountries().map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div className="flex flex-col gap-1 w-1/3 max-xl:w-1/2 max-lg:w-90 max-md:w-full p-2 max-sm:w-4/5">
              <label className="labels text-Secondary-50 font-semibold">
                State
              </label>
              <select
                className={`text-xs ${
                  theme === "dark"
                    ? "text-white/90  bg-white/10 border-white/20"
                    : "text-primary-50 bg-black/10 border-black/20"
                } backdrop-blur-sm border p-2 rounded-xl outline-none`}
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                disabled={!selectedCountry}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="flex flex-col gap-1 w-1/3 max-xl:w-1/2 max-lg:w-90 max-md:w-full p-2 max-sm:w-4/5">
              <label className="labels text-Secondary-50 font-semibold">
                City
              </label>
              <select
                className={`text-xs ${
                  theme === "dark"
                    ? "text-white/90  bg-white/10 border-white/20"
                    : "text-primary-50 bg-black/10 border-black/20"
                } backdrop-blur-sm border p-2 rounded-xl outline-none`}
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  formik.setFieldValue("city", e.target.value);
                  formik.setFieldValue("state", selectedState);
                }}
                disabled={!selectedState}
              >
                <option value="">Select City</option>
                {cities.map((city, idx) => (
                  <option key={idx} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Mapbox Location Picker */}
        {currentSection === "pharmacy" && (
          <div className="flex flex-col w-full items-center mt-5">
            <label className="labels ml-4 text-Secondary-50 font-semibold mb-2">
              Select Location on Map
            </label>
            <div
              ref={mapContainerRef}
              className="w-2/3 h-80 max-xl:w-1/2 max-lg:w-90 max-md:w-full rounded-xl"
            />
            {formik.touched.location && formik.errors.location && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.location}
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && <span className="text-sm text-warning-50 mt-2">{error}</span>}

        {/* Final Button */}
        <div className="flex justify-center items-center mt-10">
          {currentSection === "personal" ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-bg-50 labels hover:bg-selected-50 rounded-xl px-6 py-2 transition"
            >
              <span className="text-white font-semibold hover:text-white">
                Next
              </span>
            </button>
          ) : (
            <button
              type="submit"
              className="bg-bg-50 labels hover:bg-selected-50 rounded-xl px-6 py-2 transition"
            >
              <span className="text-white font-semibold hover:text-white">
                Register
              </span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormPage;
