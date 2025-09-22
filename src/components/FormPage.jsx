import React, { useState, useEffect } from 'react';
import { fields } from '../constants';
import TitleHeader from './TitleHeader';
import { Country, State, City } from 'country-state-city';

const FormPage = () => {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSection, setCurrentSection] = useState('personal');

  // New for dropdowns
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Update states when country changes
  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry));
      setSelectedState('');
      setCities([]);
    }
  }, [selectedCountry]);

  // Update cities when state changes
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

  const handleNext = () => {
    setCurrentSection('pharmacy');
  };

  return (
    <div className='w-full min-h-screen bg-db-50 flex flex-col  px-20 max-md:px-10 py-10'>
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

      {/* Form Fields */}
      <div className='flex flex-col  w-full items-center '>
        {fields
          .filter((field) => field.section === currentSection)
          .filter((field) => !['Country', 'State', 'City'].includes(field.label)) // REMOVE text inputs
          .map((field, index) => (
            <div
              key={index}
              className='flex flex-col w-full justify-center items-center'
            >
              <div className='flex flex-col gap-1 w-1/3 max-xl:w-1/2 max-lg:w-90 max-md:w-full p-2 max-sm:w-4/5'>
                <label className='labels text-Secondary-50 font-semibold fields'>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className='fields text-Secondary-50 text-xs bg-white border border-gray-300 p-2 rounded-xl'
                />
              </div>
            </div>
          ))}

        {/* Country Dropdown */}
        {currentSection === 'pharmacy' && (
          <div className='flex flex-col w-full items-center'>
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
          </div>
        )}

        {/* Location Button */}
        {currentSection === 'pharmacy' && (
          <div className='flex w-full justify-center items-center -mt-5 p-5'>
            <div className='flex flex-col gap-2 w-66 max-xl:w-1/2 max-lg:w-90 max-md:w-4/5'>
              <label className='labels text-Secondary-50 font-semibold'>Location</label>
              <input
                type='text'
                value={location}
                placeholder='Get Location'
                className='fields  text-Secondary-50 text-xs bg-white p-2 outline-none rounded-xl'
              />
            </div>
            <button
              onClick={getLocation}
              className='ml-3 w-20 h-10 mt-6 bg-hf-50 hover:bg-selected-50 text-white rounded-xl transition'
            >
              {loading ? 'Locating...' : 'Get'}
            </button>
          </div>
        )}

        {error && <span className='text-sm text-warning-50 mt-2'>{error}</span>}

        {/* Final Button */}
        <div className='flex justify-center items-center mt-10'>
          {currentSection === 'personal' ? (
            <button
              onClick={handleNext}
              className='bg-bg-50 labels hover:bg-selected-50 rounded-xl px-6 py-2 transition'
            >
              <span className='text-white font-semibold hover:text-white'>Next</span>
            </button>
          ) : (
            <button className='bg-bg-50 labels hover:bg-selected-50 rounded-xl px-6 py-2 transition'>
              <span className='text-white font-semibold hover:text-white'>Register</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormPage;
