import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  Users, 
  Fuel, 
  Settings2, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Gauge, 
  Zap, 
  Calendar, 
  MapPin, 
  Heart,
  Car,
  Clock,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { cars } from '../data/cars';
import { CarViewer3D } from '../components/ThreeDViewer/CarViewer3D';
import { useBooking } from '../context/BookingContext';
import { Loader } from '../components/Loader/Loader';
import './CarDetails.css';

export function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { searchParams, updateSearchParams, isFavorite, toggleFavorite } = useBooking();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local rental date calculator state
  const [pickupDate, setPickupDate] = useState(searchParams.pickupDate || '2026-08-25');
  const [dropoffDate, setDropoffDate] = useState(searchParams.dropoffDate || '2026-08-28');
  const [location, setLocation] = useState(searchParams.location || 'Bhilai');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCar = async () => {
      setLoading(true);
      try {
        const found = await api.getCarById(id);
        setCar(found);
        document.title = `DriveX | ${found.name}`;
      } catch (err) {
        // Fallback to static data
        const localCar = cars.find((c) => c.id === id);
        if (localCar) {
          setCar(localCar);
          document.title = `DriveX | ${localCar.name}`;
        } else {
          setError("Car not found");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  // Calculate rental duration in days
  const rentalDays = Math.max(
    1,
    Math.ceil((new Date(dropoffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)) || 1
  );

  const subtotal = car ? car.pricePerDay * rentalDays : 0;
  const deposit = car?.securityDeposit || 5000;
  const insurance = Math.round(subtotal * 0.08);
  const totalEstimated = subtotal + insurance;

  const handleProceedToBooking = () => {
    updateSearchParams({
      location,
      pickupDate,
      dropoffDate
    });
    navigate(`/booking/${car.id}`);
  };

  if (loading) {
    return (
      <div className="car-details-loading-page">
        <Loader text="Loading 3D Vehicle Studio..." fullScreen={false} />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="car-details-error-page container">
        <div className="glass-card error-card">
          <h2>Vehicle Not Found</h2>
          <p>The requested vehicle is unavailable or does not exist.</p>
          <Link to="/cars" className="btn btn-primary">
            <ArrowLeft size={16} /> Back to Cars
          </Link>
        </div>
      </div>
    );
  }

  const favorited = isFavorite(car.id);

  return (
    <div className="car-details-page-wrapper">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="details-nav-row">
          <button onClick={() => navigate(-1)} className="btn-back">
            <ArrowLeft size={16} />
            <span>Back to Fleet</span>
          </button>

          <button
            onClick={() => toggleFavorite(car.id)}
            className={`btn-fav-pill ${favorited ? 'is-fav' : ''}`}
            aria-label="Save vehicle"
          >
            <Heart size={16} fill={favorited ? "#ff4757" : "none"} color={favorited ? "#ff4757" : "#ffffff"} />
            <span>{favorited ? 'Saved to Wishlist' : 'Save Car'}</span>
          </button>
        </div>

        <div className="car-details-main-grid">
          {/* ================= LEFT COLUMN: 3D STUDIO & SPECS ================= */}
          <div className="details-showcase-column">
            {/* Title Header */}
            <div className="details-header-block">
              <div className="car-title-top">
                <span className="car-brand-tag">{car.brand}</span>
                <span className="car-category-tag">{car.category}</span>
                <div className="car-rating-box">
                  <Star size={14} fill="#ffb800" color="#ffb800" />
                  <span>{car.rating}</span>
                  <span className="rating-total">({car.reviewsCount} reviews)</span>
                </div>
              </div>
              <h1 className="details-vehicle-name">{car.name}</h1>
            </div>

            {/* 3D Interactive Car Studio Canvas */}
            <CarViewer3D car={car} fallbackImage={car.image} />

            {/* Performance Specifications Grid */}
            <div className="details-section-card glass-card">
              <h3 className="section-card-title">
                <Gauge size={18} className="text-accent" />
                <span>Performance & Engineering</span>
              </h3>
              <div className="specs-metrics-grid">
                <div className="spec-metric-item">
                  <span className="spec-metric-label">Max Power</span>
                  <span className="spec-metric-val">{car.specs?.power || '250 HP'}</span>
                </div>
                <div className="spec-metric-item">
                  <span className="spec-metric-label">0-100 km/h</span>
                  <span className="spec-metric-val">{car.specs?.acceleration || '5.8s'}</span>
                </div>
                <div className="spec-metric-item">
                  <span className="spec-metric-label">Top Speed</span>
                  <span className="spec-metric-val">{car.specs?.topSpeed || '240 km/h'}</span>
                </div>
                <div className="spec-metric-item">
                  <span className="spec-metric-label">Efficiency</span>
                  <span className="spec-metric-val">{car.specs?.mileage || '14 km/l'}</span>
                </div>
                <div className="spec-metric-item">
                  <span className="spec-metric-label">Drivetrain</span>
                  <span className="spec-metric-val">{car.specs?.drivetrain || 'All-Wheel Drive'}</span>
                </div>
                <div className="spec-metric-item">
                  <span className="spec-metric-label">Luggage Volume</span>
                  <span className="spec-metric-val">{car.specs?.luggage || '500 L'}</span>
                </div>
              </div>
            </div>

            {/* Overview Description */}
            <div className="details-section-card glass-card">
              <h3 className="section-card-title">Vehicle Overview</h3>
              <p className="vehicle-description-text">{car.description}</p>
            </div>

            {/* Premium Features List */}
            <div className="details-section-card glass-card">
              <h3 className="section-card-title">
                <Sparkles size={18} className="text-accent" />
                <span>Key Features & Comfort</span>
              </h3>
              <div className="features-checklist-grid">
                {car.features.map((feat, idx) => (
                  <div key={idx} className="feature-check-item">
                    <CheckCircle2 size={16} className="feature-check-icon" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Pick-up Locations */}
            <div className="details-section-card glass-card">
              <h3 className="section-card-title">
                <MapPin size={18} className="text-accent" />
                <span>Available Pick-up Hubs</span>
              </h3>
              <div className="hubs-pills-row">
                {car.availableLocations.map((hub) => (
                  <span key={hub} className="hub-pill">
                    <MapPin size={12} /> {hub}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: RENTAL CALCULATOR WIDGET ================= */}
          <aside className="details-sidebar-column">
            <div className="rental-calculator-widget glass-card">
              {/* Daily Rate Header */}
              <div className="calc-header">
                <div>
                  <span className="calc-rate-label">Daily Rental Rate</span>
                  <div className="calc-price-row">
                    <span className="calc-price-main">₹{car.pricePerDay.toLocaleString('en-IN')}</span>
                    <span className="calc-period">/ day</span>
                  </div>
                </div>
                <span className="badge badge-success">Instant Confirmation</span>
              </div>

              <hr className="calc-divider" />

              {/* Booking Criteria Configuration */}
              <div className="calc-form">
                {/* Pick-up Location */}
                <div className="calc-input-group">
                  <label className="calc-input-label">
                    <MapPin size={14} className="text-accent" /> Pick-up Location
                  </label>
                  <select 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    className="calc-select"
                  >
                    {car.availableLocations.map((loc) => (
                      <option key={loc} value={loc}>{loc} City Hub</option>
                    ))}
                  </select>
                </div>

                {/* Dates Row */}
                <div className="calc-dates-row">
                  <div className="calc-input-group">
                    <label className="calc-input-label">
                      <Calendar size={14} className="text-accent" /> Pick-up Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="calc-input"
                    />
                  </div>

                  <div className="calc-input-group">
                    <label className="calc-input-label">
                      <Calendar size={14} className="text-accent" /> Drop-off Date
                    </label>
                    <input
                      type="date"
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      className="calc-input"
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="calc-breakdown">
                <div className="breakdown-row">
                  <span>Rental ({rentalDays} {rentalDays === 1 ? 'day' : 'days'} × ₹{car.pricePerDay.toLocaleString('en-IN')})</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="breakdown-row">
                  <span>Comprehensive Insurance (Zero-Dep)</span>
                  <span>₹{insurance.toLocaleString('en-IN')}</span>
                </div>
                <div className="breakdown-row">
                  <span>Refundable Security Deposit</span>
                  <span className="deposit-tag">₹{deposit.toLocaleString('en-IN')} (Refundable)</span>
                </div>

                <div className="breakdown-total-row">
                  <div>
                    <span className="total-label">Estimated Total</span>
                    <p className="taxes-note">Includes GST & Roadside Assistance</p>
                  </div>
                  <span className="total-amount">₹{totalEstimated.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleProceedToBooking} 
                className="btn btn-primary btn-lg w-100 proceed-booking-btn"
              >
                <span>Proceed to Reserve</span>
                <ShieldCheck size={18} />
              </button>

              {/* Assurance Bullet Points */}
              <div className="calc-assurances">
                <div className="assurance-item">
                  <CheckCircle2 size={14} className="text-accent" />
                  <span>Free cancellation up to 24 hours before pickup</span>
                </div>
                <div className="assurance-item">
                  <CheckCircle2 size={14} className="text-accent" />
                  <span>Doorstep delivery & express key handover</span>
                </div>
                <div className="assurance-item">
                  <CheckCircle2 size={14} className="text-accent" />
                  <span>Unlimited KMs package available at checkout</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
