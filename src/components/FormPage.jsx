import React, { useState, useEffect } from 'react';
import { fields } from '../constants';
import TitleHeader from './TitleHeader';
import { Country, State, City } from 'country-state-city';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from "../utils/supabaseClient";
import { pharmacyRegistration } from '../api/pharmacyApi';
import { useNavigate } from 'react-router-dom';

// File upload helper function for Supabase
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

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState('personal');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry));
      setSelectedState('');
      setCities([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      setCities(City.getCitiesOfState(selectedCountry, selectedState));
      setSelectedCity('');
    }
  }, [selectedState]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('GeoLocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const loc = `Lat:${latitude.toFixed(5)},Long:${longitude.toFixed(5)}`;
        setLocation(loc);
        formik.setFieldValue('location', loc);
        setLoading(false);
      },
      () => {
        setError('Permission denied or unavailable');
        setLoading(false);
      }
    );
  };

  const handleNext = async () => {
    const errors = await formik.validateForm();
    if (errors.phoneNumber || errors.frontId || errors.backId) {
      setError("Please fill required fields first.");
      return;
    }

    setError('');
    setCurrentSection('pharmacy');
  };

  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
      frontId: null,
      backId: null,
      pharmacyName: '',
      city: '',
      state: '',
      address: '',
      licenseNumber: '',
      licensePicture: null,
      location: '',
    },
    validationSchema: Yup.object({
      phoneNumber: Yup.string()
        .matches(/^0\d{10}$/, 'Phone number must be exactly 11 digits, starting with 0')
        .required('Phone number is required'),
      frontId: Yup.mixed().required('Front ID image is required'),
      backId: Yup.mixed().required('Back ID image is required'),
      pharmacyName: Yup.string().required('Pharmacy name is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      address: Yup.string().required('Address is required'),
      licenseNumber: Yup.string().min(3, 'License number seems too short').required('License number is required'),
      licensePicture: Yup.mixed().required('License picture is required'),
      location: Yup.string()
        .matches(/^Lat:-?\d+(\.\d+)?,Long:-?\d+(\.\d+)?$/, 'Invalid location format')
        .required('Location is required'),
    }),
    onSubmit: async (values) => {
      try {
        const { frontId, backId, licensePicture } = values;

        if (!frontId || !backId || !licensePicture) {
          setError('Please upload all required images');
          return;
        }

        const [frontIdUrl, backIdUrl, licenseUrl] = await Promise.all([
          uploadFileToSupabase(frontId, 'ids/front'),
          uploadFileToSupabase(backId, 'ids/back'),
          uploadFileToSupabase(licensePicture, 'licenses'),
        ]);

        const locationRegex = /^Lat:(-?\d+(\.\d+)?),Long:(-?\d+(\.\d+)?)$/;
        const match = values.location.match(locationRegex);

        if (!match) throw new Error("Invalid location format.");

        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[3]);

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

        const res = await pharmacyRegistration(payload);
        console.log("API Response:", res);

        if (res.status === 'success') {
          formik.resetForm();
          alert('Registration successful!');
          navigate('/pending-approval');
        } else {
          setError(res.message || 'Registration failed.');
        }
      } catch (err) {
        console.error("Submit error:", err);
        setError(err.message || 'Something went wrong.');
      }
    }
  });

  return (
    <div className='w-full min-h-screen bg-db-50 flex flex-col px-20 max-md:px-10 py-10'>
      <div className='title-Header text-center'>
        <TitleHeader title='Registration Form' />
      </div>

      {/* Section Toggle Buttons */}
      <div className='flex justify-center mb-10 gap-4'>
        <button
          onClick={() => setCurrentSection('personal')}
          className={`p-2 rounded-xl border-2 border-bg-50 ${
            currentSection === 'personal' ? 'bg-bg-50 text-white' : 'bg-white text-primary-50'
          } transition`}
        >
          Personal Info
        </button>
        <button
          onClick={() => setCurrentSection('pharmacy')}
          className={`p-2 rounded-xl border-2 border-bg-50 ${
            currentSection === 'pharmacy' ? 'bg-bg-50 text-white' : 'bg-white text-primary-50'
          } transition`}
        >
          Pharmacy Info
        </button>
      </div>

      {/* ✅ FORM STARTS HERE */}
      <form className='flex flex-col w-full items-center' onSubmit={formik.handleSubmit}>
        {fields
          .filter((field) => field.section === currentSection)
          .filter((field) => !['Country', 'State', 'City'].includes(field.label))
          .map((field, index) => (
            <div key={index} className='flex flex-col w-full justify-center items-center'>
              <div className='flex flex-col gap-1 w-1/3 max-xl:w-1/2 max-lg:w-90 max-md:w-full p-2 max-sm:w-4/5'>
                <label className='labels text-Secondary-50 font-semibold fields'>{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className='fields text-Secondary-50 text-xs bg-white border border-gray-300 p-2 rounded-xl'
                  name={field.name}
                  onChange={(event) => {
                    if (field.type === "file") {
                      formik.setFieldValue(field.name, event.currentTarget.files[0]);
                    } else {
                      formik.handleChange(event);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  value={field.type === "file" ? undefined : formik.values[field.name]}
                />
                {formik.touched[field.name] && formik.errors[field.name] && (
                  <div className="text-red-500 text-xs">{formik.errors[field.name]}</div>
                )}
              </div>
            </div>
          ))}

        {/* Country / State / City Dropdowns */}
        {currentSection === "pharmacy" && (
          <div className="flex flex-col w-full items-center">
            {/* Country */}
            <div className="w-1/3 max-xl:w-1/2 max-lg:w-90 max-md:w-full p-2 max-sm:w-4/5">
              <label className="labels text-Secondary-50 font-semibold">Country</label>
              <select
                className="fields bg-white text-xs text-Secondary-50 p-2 rounded-xl border border-gray-300 w-full"
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedState('');
                  setSelectedCity('');
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
            <div className="w-1/3 max-xl:w-1/2 max-lg:w-90 max-md:w-full p-2 max-sm:w-4/5">
              <label className="labels text-Secondary-50 font-semibold">State</label>
              <select
                className="fields bg-white text-xs text-Secondary-50 p-2 rounded-xl border border-gray-300 w-full"
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
            <div className="w-1/3 max-xl:w-1/2 max-lg:w-90 max-md:w-full p-2 max-sm:w-4/5">
              <label className="labels text-Secondary-50 font-semibold">City</label>
              <select
                className="fields bg-white text-xs text-Secondary-50 p-2 rounded-xl border border-gray-300 w-full"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  formik.setFieldValue('city', e.target.value);
                  formik.setFieldValue('state', selectedState);
                }}
                disabled={!selectedState}
              >
                <option value="">Select City</option>
                {cities.map((city, idx) => (
                  <option key={idx} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Location */}
        {currentSection === "pharmacy" && (
          <div className='flex w-full justify-center items-center -mt-5 p-5'>
            <div className='flex flex-col gap-2 w-66 max-xl:w-1/2 max-lg:w-90 max-md:w-4/5'>
              <label className='labels text-Secondary-50 font-semibold'>Location</label>
              <input
                type='text'
                value={location}
                placeholder='Get Location'
                className='fields text-Secondary-50 text-xs bg-white p-2 outline-none rounded-xl'
                {...formik.getFieldProps('location')}
              />
            </div>
            <button
              type="button"
              onClick={getLocation}
              className='ml-3 w-20 h-10 mt-6 bg-hf-50 hover:bg-selected-50 text-white rounded-xl transition'
            >
              {loading ? 'Locating...' : 'Get'}
            </button>
          </div>
        )}

        {/* Error */}
        {error && <span className='text-sm text-warning-50 mt-2'>{error}</span>}

        {/* Final Button */}
        <div className='flex justify-center items-center mt-10'>
          {currentSection === 'personal' ? (
            <button
              type="button"
              onClick={handleNext}
              className='bg-bg-50 labels hover:bg-selected-50 rounded-xl px-6 py-2 transition'
            >
              <span className='text-white font-semibold hover:text-white'>Next</span>
            </button>
          ) : (
            <button
              type="submit"
              className='bg-bg-50 labels hover:bg-selected-50 rounded-xl px-6 py-2 transition'
            >
              <span className='text-white font-semibold hover:text-white'>Register</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormPage;
