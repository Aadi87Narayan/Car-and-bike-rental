import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Search, AlertCircle } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import './BookingSearch.css';

const POPULAR_CITIES = [
  "Bhilai",
  "Raipur",
  "Delhi NCR",
  "Mumbai",
  "Bengaluru",
  "Goa"
];

const getTodayDate = () => new Date().toISOString().split('T')[0];
const getFutureDate = (daysAhead = 3) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

export function BookingSearch({ compact = false }) {
  const navigate = useNavigate();
  const { searchParams, updateSearchParams } = useBooking();

  const todayDate = getTodayDate();
  const defaultDropoff = getFutureDate(3);

  const [formData, setFormData] = useState({
    location: searchParams?.location || 'Bhilai',
    pickupDate: (searchParams?.pickupDate && searchParams.pickupDate >= todayDate) ? searchParams.pickupDate : todayDate,
    pickupTime: searchParams?.pickupTime || '10:00',
    dropoffDate: (searchParams?.dropoffDate && searchParams.dropoffDate >= todayDate) ? searchParams.dropoffDate : defaultDropoff,
    dropoffTime: searchParams?.dropoffTime || '10:00'
  });


  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.location.trim()) {
      newErrors.location = 'Please select a pick-up location';
    }

    if (!formData.pickupDate) {
      newErrors.pickupDate = 'Please select a pick-up date';
    }

    if (!formData.dropoffDate) {
      newErrors.dropoffDate = 'Please select a drop-off date';
    } else if (formData.pickupDate && new Date(formData.dropoffDate) < new Date(formData.pickupDate)) {
      newErrors.dropoffDate = 'Drop-off date must be after pick-up date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    updateSearchParams(formData);

    const query = new URLSearchParams({
      location: formData.location,
      pickup: formData.pickupDate,
      dropoff: formData.dropoffDate,
      time: formData.pickupTime
    }).toString();

    navigate(`/cars?${query}`);
  };

  return (
    <div className={`booking-search-card ${compact ? 'booking-search-compact' : ''}`}>
      <form onSubmit={handleSubmit} className="booking-search-form" noValidate>
        {/* Field 1: Pick-up Location */}
        <div className={`search-field-group ${errors.location ? 'field-has-error' : ''}`}>
          <label htmlFor="search-location" className="search-field-label">
            <MapPin size={16} className="field-icon" />
            <span>Pick-up Location</span>
          </label>
          <div className="search-input-wrapper">
            <select
              id="search-location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="search-select"
              aria-label="Pick-up Location"
            >
              <option value="">Select City / Hub</option>
              {POPULAR_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          {errors.location && (
            <span className="field-error-msg">
              <AlertCircle size={12} /> {errors.location}
            </span>
          )}
        </div>

        <div className="search-field-divider" />

        {/* Field 2: Pick-up Date */}
        <div className={`search-field-group ${errors.pickupDate ? 'field-has-error' : ''}`}>
          <label htmlFor="search-pickup-date" className="search-field-label">
            <Calendar size={16} className="field-icon" />
            <span>Pick-up Date</span>
          </label>
          <div className="search-input-wrapper">
            <input
              id="search-pickup-date"
              type="date"
              name="pickupDate"
              min={todayDate}
              value={formData.pickupDate}
              onChange={(e) => {
                const newPickup = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  pickupDate: newPickup,
                  dropoffDate: prev.dropoffDate < newPickup ? newPickup : prev.dropoffDate
                }));
              }}
              className="search-input"
              aria-label="Pick-up Date"
            />
          </div>
          {errors.pickupDate && (
            <span className="field-error-msg">
              <AlertCircle size={12} /> {errors.pickupDate}
            </span>
          )}
        </div>

        <div className="search-field-divider" />

        {/* Field 3: Pick-up Time */}
        <div className="search-field-group">
          <label htmlFor="search-pickup-time" className="search-field-label">
            <Clock size={16} className="field-icon" />
            <span>Time</span>
          </label>
          <div className="search-input-wrapper">
            <select
              id="search-pickup-time"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              className="search-select"
              aria-label="Pick-up Time"
            >
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="18:00">06:00 PM</option>
              <option value="20:00">08:00 PM</option>
            </select>
          </div>
        </div>

        <div className="search-field-divider" />

        {/* Field 4: Drop-off Date */}
        <div className={`search-field-group ${errors.dropoffDate ? 'field-has-error' : ''}`}>
          <label htmlFor="search-dropoff-date" className="search-field-label">
            <Calendar size={16} className="field-icon" />
            <span>Drop-off Date</span>
          </label>
          <div className="search-input-wrapper">
            <input
              id="search-dropoff-date"
              type="date"
              name="dropoffDate"
              min={formData.pickupDate || todayDate}
              value={formData.dropoffDate}
              onChange={handleChange}
              className="search-input"
              aria-label="Drop-off Date"
            />
          </div>
          {errors.dropoffDate && (
            <span className="field-error-msg">
              <AlertCircle size={12} /> {errors.dropoffDate}
            </span>
          )}
        </div>

        {/* Submit Action */}
        <div className="search-action-group">
          <button type="submit" className="btn btn-primary search-submit-btn">
            <Search size={18} />
            <span>Search Cars</span>
          </button>
        </div>
      </form>
    </div>
  );
}
