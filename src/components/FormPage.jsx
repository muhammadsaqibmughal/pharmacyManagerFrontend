import React, { useState } from 'react';
import TitleHeader from './TitleHeader';
import PharmacyForm from './PharmacyForm';

const FormPage = () => {
  const [currentSection, setCurrentSection] = useState('personal');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const handleNext = () => setCurrentSection('pharmacy');

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
        const loc = `Lat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)}`;
        setLocation(loc);
        setLoading(false);
      },
      () => {
        setError('Permission denied or unavailable');
        setLoading(false);
      }
    );
  };

  const handleSuccess = (email) => {
    alert(`Successfully registered. Confirmation sent to: ${email}`);
  };

  return (
    <div className='w-full min-h-screen bg-db-50 flex flex-col px-20 max-md:px-10 py-10'>
      {/* Title */}
      <div className='title-Header text-center'>
        <TitleHeader title='Registration Form' />
      </div>

      {/* Section Buttons */}
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

      {/* Form Component */}
      <PharmacyForm
        currentSection={currentSection}
        location={location}
        loading={loading}
        error={error}
        formError={formError}
        setFormError={setFormError}
        setLocation={setLocation}
        getLocation={getLocation}
        handleNext={handleNext}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default FormPage;
