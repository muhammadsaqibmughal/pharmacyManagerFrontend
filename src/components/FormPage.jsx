import React, { useState, useEffect } from 'react';
import { fields } from '../constants';
import TitleHeader from './TitleHeader';
import { Country, State, City } from 'country-state-city';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from "../utils/supabaseClient"; // Your supabase client import
import { pharmacyRegistration } from '../api/pharmacyApi'; // Adjust according to your API path

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

const FormPage = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        setLocation(`Lat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)}`);
        setLoading(false);
      },
      () => {
        setError('Permission denied or unavailable');
        setLoading(false);
      }
    );
  };

  // Formik hook
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
      location: location,
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
        const filesToUpload = [frontId, backId, licensePicture];
        if (filesToUpload.some((file) => !file)) {
          throw new Error('Please provide all required files.');
        }

        // Upload files to Supabase
        const [frontIdUrl, backIdUrl, licenseUrl] = await Promise.all([
          uploadFileToSupabase(frontId, 'ids/front'),
          uploadFileToSupabase(backId, 'ids/back'),
          uploadFileToSupabase(licensePicture, 'licenses'),
        ]);

        const locationRegex = /^Lat:(-?\d+(\.\d+)?),Long:(-?\d+(\.\d+)?)$/;
        const match = values.location.match(locationRegex);

        if (!match) {
          throw new Error("Invalid location format. Use Lat:<latitude>,Long:<longitude>");
        }

        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[3]);

        if (isNaN(latitude) || isNaN(longitude)) {
          throw new Error("Latitude and longitude must be valid numbers.");
        }

        // Prepare payload to send to the API
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
        if (res.status === 'success') {
          formik.resetForm();
          alert('Registration successful!');
        } else {
          setError(res.message || 'Registration failed.');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      }
    },
  });

  return (
    <div className='w-full min-h-screen bg-db-50 flex flex-col px-20 max-md:px-10 py-10'>
      <div className='title-Header text-center'>
        <TitleHeader title='Registration Form' />
      </div>

      {/* Section Toggle Buttons */}
      <div className='flex justify-center mb-10 gap-4'>
        <button
          onClick={() => formik.setFieldValue('currentSection', 'personal')}
          className={`p-2 rounded-xl border-2 border-bg-50 ${
            formik.values.currentSection === 'personal' ? 'bg-bg-50 text-white' : 'bg-white text-primary-50'
          } transition`}
        >
          Personal Info
        </button>
        <button
          onClick={() => formik.setFieldValue('currentSection', 'pharmacy')}
          className={`p-2 rounded-xl border-2 border-bg-50 ${
            formik.values.currentSection === 'pharmacy' ? 'bg-bg-50 text-white' : 'bg-white text-primary-50'
          } transition`}
        >
          Pharmacy Info
        </button>
      </div>

      {/* Form Fields */}
      <div className='flex flex-col w-full items-center'>
        {fields
          .filter((field) => field.section === formik.values.currentSection)
          .filter((field) => !['Country', 'State', 'City'].includes(field.label)) // REMOVE text inputs
          .map((field, index) => (
            <div key={index} className='flex flex-col w-full justify-center items-center'>
              <div className='flex flex-col gap-1 w-1/3 max-xl:w-1/2 max-lg:w-90 max-md:w-full p-2 max-sm:w-4/5'>
                <label className='labels text-Secondary-50 font-semibold fields'>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className='fields text-Secondary-50 text-xs bg-white border border-gray-300 p-2 rounded-xl'
                  {...formik.getFieldProps(field.name)}
                />
                {formik.touched[field.name] && formik.errors[field.name] && (
                  <div className="text-red-500 text-xs">{formik.errors[field.name]}</div>
                )}
              </div>
            </div>
          ))}

        {/* Country Dropdown */}
        <div className='w-1/3 max-xl:w-1/2 max-lg:w-90 max-md:w-full p-2 max-sm:w-4/5'>
          <label className='labels text-Secondary-50 font-semibold'>Country</label>
          <select
            className='fields bg-white text-xs text-Secondary-50 p-2 rounded-xl border border-gray-300 w-full'
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Select Country</option>
            {Country.getAllCountries().map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* State Dropdown */}
        <div className='w-1/3 max-xl:w-1/2 max-lg:w-90 max-md:w-full p-2 max-sm:w-4/5'>
          <label className='labels text-Secondary-50 font-semibold'>State</label>
          <select
            className='fields bg-white text-xs text-Secondary-50 p-2 rounded-xl border border-gray-300 w-full'
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

        {/* City Dropdown */}
        <div className='w-1/3 max-xl:w-1/2 max-lg:w-90 max-md:w-full p-2 max-sm:w-4/5'>
          <label className='labels text-Secondary-50 font-semibold'>City</label>
          <select
            className='fields bg-white text-xs text-Secondary-50 p-2 rounded-xl border border-gray-300 w-full'
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
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

        {/* Location Button */}
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
            onClick={getLocation}
            className='ml-3 w-20 h-10 mt-6 bg-hf-50 hover:bg-selected-50 text-white rounded-xl transition'
          >
            {loading ? 'Locating...' : 'Get'}
          </button>
        </div>

        {/* Error Message */}
        {error && <span className='text-sm text-warning-50 mt-2'>{error}</span>}

        {/* Submit Button */}
        <div className='flex justify-center items-center mt-10'>
          <button
            type='submit'
            onClick={formik.handleSubmit}
            className='bg-bg-50 labels hover:bg-selected-50 rounded-xl px-6 py-2 transition'
          >
            <span className='text-white font-semibold hover:text-white'>{formik.isSubmitting ? 'Submitting...' : 'Register'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
