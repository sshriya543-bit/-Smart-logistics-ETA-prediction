import { useState } from "react";

function Modal({ title, formData, handleChange, onSubmit, onClose, predictedETA }) {
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    await onSubmit();
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-10 rounded-2xl text-center shadow-2xl">
          <h2 className="text-3xl font-semibold">Order Created ✅</h2>
          <p className="mt-3 text-lg opacity-90">
            Your order has been successfully created.
          </p>
        </div>
      </div>
    );
  }

  const inputStyle =
    "w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition";

  const labelStyle = "block text-sm text-gray-300 mb-1";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 p-10 rounded-2xl w-[650px] shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-semibold mb-8 text-white">{title}</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Customer */}
          <div>
            <label className={labelStyle}>Customer Name</label>
            <input
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Pickup */}
          <div>
            <label className={labelStyle}>Pickup Location</label>
            <input
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Delivery */}
          <div>
            <label className={labelStyle}>Delivery Location</label>
            <input
              name="delivery_location"
              value={formData.delivery_location}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Distance */}
          <div>
            <label className={labelStyle}>Distance (km)</label>
            <input
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Avg Speed */}
          <div>
            <label className={labelStyle}>Average Speed (km/h)</label>
            <input
              type="number"
              name="avg_speed"
              value={formData.avg_speed}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Weather */}
          <div>
            <label className={labelStyle}>Weather Condition</label>
            <select
              name="weather"
              value={formData.weather}
              onChange={handleChange}
              className={inputStyle + " bg-gray-800 text-white"}
            >
              <option className="bg-gray-800 text-white" value="">
                Select Weather
              </option>
              <option className="bg-gray-800 text-white" value="Clear">
                Clear
              </option>
              <option className="bg-gray-800 text-white" value="Rain">
                Rain
              </option>
              <option className="bg-gray-800 text-white" value="Fog">
                Fog
              </option>
            </select>
          </div>

          {/* Road Type */}
          <div>
            <label className={labelStyle}>Road Type</label>
            <select
              name="road_type"
              value={formData.road_type}
              onChange={handleChange}
              className={inputStyle}
            >
              <option className="bg-gray-800 text-white" value="">
                Select Road Type
              </option>
              <option className="bg-gray-800 text-white" value="Highway">
                Highway
              </option>
              <option className="bg-gray-800 text-white" value="City">
                City
              </option>
              <option className="bg-gray-800 text-white" value="Rural">
                Rural
              </option>
            </select>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className={labelStyle}>Vehicle Type</label>
            <select
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleChange}
              className={inputStyle}
            >
              <option className="bg-gray-800 text-white" value="">
                Select Vehicle
              </option>
              <option className="bg-gray-800 text-white" value="Bike">
                Bike
              </option>
              <option className="bg-gray-800 text-white" value="Car">
                Car
              </option>
              <option className="bg-gray-800 text-white" value="Truck">
                Truck
              </option>
            </select>
          </div>

          {/* Driver Rating */}
          <div>
            <label className={labelStyle}>Driver Rating (1-5)</label>
            <input
              type="number"
              step="0.1"
              name="driver_rating"
              value={formData.driver_rating}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </div>

        {predictedETA && (
          <div className="mt-8 bg-green-900 border border-green-500 text-green-300 px-6 py-4 rounded-lg text-lg">
            Predicted ETA: <strong>{predictedETA}</strong> minutes
          </div>
        )}

        <div className="flex justify-end mt-10 space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 font-semibold transition shadow-lg shadow-cyan-500/30"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;