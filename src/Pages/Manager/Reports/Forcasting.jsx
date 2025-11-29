import React, { useState, useEffect } from "react";
import { Calendar, TrendingUp, Package } from "lucide-react";
import { getProduct } from "../../../api/productsApi";
import { getForecast } from "../../../api/forcastingApi";

const MedicineForecast = () => {
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [forecastDays, setForecastDays] = useState("");
  // const [pharmacyName, setPharmacyName] = useState("");
  const [predictions, setPredictions] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch medicines from backend
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await getProduct({});
        setMedicines(response.data.map((item) => item.brandName));
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };
    fetchMedicines();
  }, []);

  const toggleMedicine = (med) => {
    setSelectedMedicines((prev) =>
      prev.includes(med) ? prev.filter((m) => m !== med) : [...prev, med]
    );
  };

const handlePredict = async () => {
  const payload = {
    medicine: selectedMedicines,
    days_ahead: Number(forecastDays),
    prediction_date: startDate,
  };

  try {
    setLoading(true);
    const response = await getForecast(payload);

    if (!response.success) {
      alert(response.message || "No predictions available");
      setPredictions(null);
      return;
    }

    setPredictions(response.predictions);
  } catch (error) {
    console.error("Prediction API error:", error.response?.data || error.message);
    alert(`Prediction failed: ${JSON.stringify(error.response?.data || error.message)}`);
  } finally {
    setLoading(false);
  }
};





  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return "text-green-600 bg-green-50";
    if (confidence >= 80) return "text-blue-600 bg-blue-50";
    return "text-yellow-600 bg-yellow-50";
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-12 h-12 text-black mr-3" />
            <h1 className="text-4xl font-bold text-black">
              Medicine Demand Forecasting
            </h1>
          </div>
          <p className="text-gray-600">
            Predict future medicine demands with advanced analytics
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Pharmacy Name */}
            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Package className="w-4 h-4 mr-2 text-blue-600" />
                Pharmacy Name
              </label>
              <input
                type="text"
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
                placeholder="Enter pharmacy name..."
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg"
              />
            </div> */}

            {/* Medicine Selection */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Package className="w-4 h-4 mr-2 text-blue-600" />
                Select Medicines
              </label>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-left"
              >
                {selectedMedicines.length === 0
                  ? "Choose medicines..."
                  : `${selectedMedicines.length} selected`}
              </button>
              {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {medicines.map((med) => (
                    <label
                      key={med}
                      className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMedicines.includes(med)}
                        onChange={() => toggleMedicine(med)}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 text-gray-700">{med}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                Starting Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg"
              />
            </div>

            {/* Forecast Days */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                Forecast Days
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={forecastDays}
                onChange={(e) => setForecastDays(e.target.value)}
                placeholder="Enter days..."
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {/* Predict Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handlePredict}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl"
            >
              {loading ? "Generating..." : "Generate Predictions"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {predictions && (
          <div className="space-y-6">
            {Object.entries(predictions).map(([medicine, forecast]) => (
              <div
                key={medicine}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Package className="w-6 h-6 mr-3" />
                    {medicine} - Demand Forecast
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Day
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Predicted Demand
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Confidence
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {forecast.map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50">
                          <td className="px-6 py-4">{row.day}</td>
                          <td className="px-6 py-4 text-gray-700 font-medium">
                            {row.date}
                          </td>
                          <td className="px-6 py-4 text-lg font-bold text-gray-800">
                            {row.predicted} units
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(
                                row.confidence
                              )}`}
                            >
                              {row.confidence}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {!predictions && (
          <div className="text-center py-16">
            <TrendingUp className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Select medicines and parameters to generate forecasts
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineForecast;
