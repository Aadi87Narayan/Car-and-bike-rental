import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Users, 
  Fuel, 
  Settings2, 
  Heart, 
  ArrowRight,
  RotateCw,
  Play
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import './CarCard.css';

export function CarCard({ car }) {
  const { toggleFavorite, isFavorite } = useBooking();
  const navigate = useNavigate();
  const favorited = isFavorite(car.id);
  const [imgSrc, setImgSrc] = useState(car.image || car.fallbackImage);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  const handleBookNow = (e) => {
    e.stopPropagation();
    navigate(`/booking/${car.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(car.id);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && car.video3D) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const isBike = car.type === 'bike' || car.type === 'scooter';

  return (
    <div
      className="car-card glass-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Media Header */}
      <div className="car-card-media">
        {/* Static image — always rendered */}
        <img 
          src={imgSrc} 
          alt={`${car.brand} ${car.name}`} 
          className={`car-card-img ${isHovered && car.video3D ? 'img-hidden' : ''}`}
          loading="lazy" 
          onError={() => {
            if (car.fallbackImage && imgSrc !== car.fallbackImage) {
              setImgSrc(car.fallbackImage);
            }
          }}
        />

        {/* Video preview — plays on hover for vehicles with video3D */}
        {car.video3D && (
          <video
            ref={videoRef}
            className={`car-card-video ${isHovered ? 'video-visible' : ''}`}
            src={car.video3D}
            muted
            loop
            playsInline
            preload="none"
          />
        )}
        
        {/* Badges Overlay */}
        <div className="car-card-badges">
          <span className="car-cat-badge">{car.category}</span>
          
          {car.video3D && (
            <span className="car-3d-badge" title="360° Interactive Studio Available">
              <RotateCw size={11} className="spin-badge-icon" /> 360° 3D
            </span>
          )}

          {car.rating >= 4.9 && (
            <span className="car-top-rated-badge">
              <Star size={11} fill="#ffb800" color="#ffb800" /> Top Rated
            </span>
          )}
        </div>

        {/* Video play hint overlay */}
        {car.video3D && !isHovered && (
          <div className="card-video-hint">
            <Play size={14} />
            <span>Hover for preview</span>
          </div>
        )}

        {/* Favorite Wishlist Button */}
        <button
          className={`car-favorite-btn ${favorited ? 'is-favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove from saved cars' : 'Save car to favorites'}
        >
          <Heart size={16} fill={favorited ? '#ff4757' : 'none'} color={favorited ? '#ff4757' : '#ffffff'} />
        </button>
      </div>

      {/* Main Body */}
      <div className="car-card-body">
        {/* Brand & Name */}
        <div className="car-brand-row">
          <span className="car-brand-name">{car.brand}</span>
          <div className="car-rating">
            <Star size={13} fill="#ffb800" color="#ffb800" />
            <span className="rating-score">{car.rating}</span>
            <span className="rating-count">({car.reviewsCount})</span>
          </div>
        </div>

        <Link to={`/cars/${car.id}`} className="car-title-link">
          <h3 className="car-model-name">{car.name}</h3>
        </Link>

        {/* Quick Specs Icons */}
        <div className="car-spec-pills">
          <div className="spec-pill" title="Seating Capacity">
            <Users size={14} className="spec-icon" />
            <span>{isBike ? (car.seats === 1 ? 'Solo Rider' : '2 Seats') : `${car.seats} Seats`}</span>
          </div>
          <div className="spec-pill" title="Transmission">
            <Settings2 size={14} className="spec-icon" />
            <span>{car.transmission}</span>
          </div>
          <div className="spec-pill" title="Fuel Type">
            <Fuel size={14} className="spec-icon" />
            <span>{car.fuelType}</span>
          </div>
        </div>

        {/* Card Footer: Price & Actions */}
        <div className="car-card-footer">
          <div className="car-price-block">
            <span className="price-tag-label">Daily Rental</span>
            <div className="car-price-row">
              <span className="car-price-val">₹{car.pricePerDay.toLocaleString('en-IN')}</span>
              <span className="car-price-period">/day</span>
            </div>
          </div>

          <div className="car-card-actions">
            <Link to={`/cars/${car.id}`} className="btn btn-secondary btn-sm car-details-btn">
              <span>Details</span>
            </Link>
            <button onClick={handleBookNow} className="btn btn-primary btn-sm car-book-btn">
              <span>Book</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarCard;
