import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Box
} from 'lucide-react';
import { api } from '../services/api';
import { cars } from '../data/cars';
import { CarViewer3D } from '../components/ThreeDViewer/CarViewer3D';
import { useBooking } from '../context/BookingContext';
import { Loader } from '../components/Loader/Loader';
import './CarDetails.css';

// =============================================
// 🎬 CINEMATIC HERO VIDEO PLAYER
// =============================================
function VehicleHeroVideo({ car }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [show3D, setShow3D] = useState(false);

  const videoSrc = car.heroVideo || car.video3D;

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.src = videoSrc;
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [videoSrc]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
    else { videoRef.current.play(); setIsPlaying(true); }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else videoRef.current.requestFullscreen?.();
  };

  if (show3D) {
    return (
      <div className="vehicle-hero-3d-wrap">
        <CarViewer3D car={car} fallbackImage={car.image} />
        <button className="hero-back-to-video-btn" onClick={() => setShow3D(false)}>
          ← Back to Video
        </button>
      </div>
    );
  }

  // Image fallback if no video
  if (!videoSrc) {
    return (
      <div className="vehicle-hero-img-wrap">
        <img src={car.image} alt={car.name} className="vehicle-hero-static-img" />
        <div className="vehicle-hero-img-overlay" />
      </div>
    );
  }

  return (
    <div
      className="vehicle-hero-video-wrap"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="vehicle-hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster={car.image}
      />

      {/* Cinematic gradient overlays */}
      <div className="hero-video-overlay-bottom" />
      <div className="hero-video-overlay-top" />

      {/* Controls */}
      <div className={`hero-video-controls ${showControls ? 'visible' : ''}`}>
        <button className="hero-vid-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button className="hero-vid-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button className="hero-vid-btn" onClick={toggleFullscreen} title="Fullscreen">
          <Maximize2 size={18} />
        </button>
        <button
          className="hero-vid-btn hero-3d-switch-btn"
          onClick={() => setShow3D(true)}
          title="Open 3D Configurator"
        >
          <Box size={16} /> 3D Studio
        </button>
      </div>

      {/* Live badge */}
      <div className="hero-live-badge">
        <span className="live-dot" />
        360° Live Preview
      </div>
    </div>
  );
}

// =============================================
// 📄 MAIN CAR DETAILS PAGE
// =============================================
export function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { searchParams, updateSearchParams, isFavorite, toggleFavorite } = useBooking();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const localCar = cars.find((c) => c.id === id);
        if (localCar) {
          setCar(localCar);
          document.title = `DriveX | ${localCar.name}`;
        } else {
          setError('Car not found');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const rentalDays = Math.max(
    1,
    Math.ceil((new Date(dropoffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)) || 1
  );

  const subtotal = car ? car.pricePerDay * rentalDays : 0;
  const deposit = car?.securityDeposit || 5000;
  const insurance = Math.round(subtotal * 0.08);
  const totalEstimated = subtotal + insurance;

  const handleProceedToBooking = () => {
    updateSearchParams({ location, pickupDate, dropoffDate });
    navigate(`/booking/${car.id}`);
  };

  if (loading) {
    return (
      <div className="car-details-loading-page">
        <Loader text="Loading Vehicle Studio..." fullScreen={false} />
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
      {/* ═══════════════════════════════════════════
          🎬 HERO VIDEO — FULL WIDTH AT THE TOP
      ═══════════════════════════════════════════ */}
      <div className="vehicle-hero-section">
        <VehicleHeroVideo car={car} />

        {/* Floating nav bar over the hero */}
        <div className="hero-nav-overlay">
          <button onClick={() => navigate(-1)} className="btn-back hero-back-btn">
            <ArrowLeft size={16} />
            <span>Back to Fleet</span>
          </button>

          <button
            onClick={() => toggleFavorite(car.id)}
            className={`btn-fav-pill ${favorited ? 'is-fav' : ''}`}
            aria-label="Save vehicle"
          >
            <Heart size={16} fill={favorited ? '#ff4757' : 'none'} color={favorited ? '#ff4757' : '#ffffff'} />
            <span>{favorited ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* Title block overlaid at the bottom of the hero */}
        <div className="hero-title-overlay">
          <div className="container">
            <div className="hero-title-inner">
              <div className="car-title-badges-row">
                <span className="car-brand-tag">{car.brand}</span>
                <span className="car-category-tag">{car.category}</span>
                {car.video3D && (
                  <span className="hero-360-tag">⟳ 360° Interactive</span>
                )}
              </div>
              <h1 className="hero-vehicle-title">{car.name}</h1>
              <div className="hero-rating-price-row">
                <div className="hero-rating-block">
                  <Star size={15} fill="#ffb800" color="#ffb800" />
                  <span className="hero-rating-val">{car.rating}</span>
                  <span className="hero-rating-cnt">({car.reviewsCount} reviews)</span>
                </div>
                <div className="hero-price-block">
                  <span className="hero-price-num">₹{car.pricePerDay.toLocaleString('en-IN')}</span>
                  <span className="hero-price-unit">/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          📋 DETAILS CONTENT BELOW HERO
      ═══════════════════════════════════════════ */}
      <div className="container car-details-content">
        <div className="car-details-main-grid">
          {/* LEFT COLUMN: SPECS, FEATURES, LOCATIONS */}
          <div className="details-showcase-column">

            {/* Performance Specifications Grid */}
            <div className="details-section-card glass-card">
              <h3 className="section-card-title">
                <Gauge size={18} className="text-accent" />
                <span>Performance &amp; Engineering</span>
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

            {/* Key Features */}
            <div className="details-section-card glass-card">
              <h3 className="section-card-title">
                <Sparkles size={18} className="text-accent" />
                <span>Key Features &amp; Comfort</span>
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

            {/* Pick-up Locations */}
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

            {/* 3D Interactive Section below details */}
            {car.video3D && (
              <div className="details-section-card glass-card">
                <h3 className="section-card-title">
                  <Sparkles size={18} className="text-accent" />
                  <span>3D Interactive Configurator</span>
                </h3>
                <CarViewer3D car={car} fallbackImage={car.image} />
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: RENTAL CALCULATOR */}
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

              {/* Booking Configuration */}
              <div className="calc-form">
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
                    <p className="taxes-note">Includes GST &amp; Roadside Assistance</p>
                  </div>
                  <span className="total-amount">₹{totalEstimated.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleProceedToBooking}
                className="btn btn-primary btn-lg w-100 proceed-booking-btn"
              >
                <span>Proceed to Reserve</span>
                <ShieldCheck size={18} />
              </button>

              {/* Assurances */}
              <div className="calc-assurances">
                <div className="assurance-item">
                  <CheckCircle2 size={14} className="text-accent" />
                  <span>Free cancellation up to 24 hours before pickup</span>
                </div>
                <div className="assurance-item">
                  <CheckCircle2 size={14} className="text-accent" />
                  <span>Doorstep delivery &amp; express key handover</span>
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
