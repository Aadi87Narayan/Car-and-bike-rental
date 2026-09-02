import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Sparkles, Award, Film, Box } from 'lucide-react';
import { HeroVideo } from './HeroVideo';
import { HeroCar } from './HeroCar';
import { BookingSearch } from '../BookingSearch/BookingSearch';
import './Hero.css';

export function Hero() {
  const navigate = useNavigate();
  const [activeMedia, setActiveMedia] = useState('video'); // 'video' by default

  return (
    <section className="hero-section">
      {/* Background Graphic & Light Beams */}
      <div className="hero-backdrop">
        <div className="hero-glow-sphere" />
        <div className="hero-glow-blue" />
        <div className="hero-grid-lines" />
      </div>

      <div className="container hero-container">
        <div className="hero-grid">
          {/* Left Column: Hero Text & Value Props */}
          <div className="hero-content">
            <div className="hero-badge animate-fade-in">
              <Sparkles size={14} className="sparkle-icon" />
              <span>India's Premier Automotive Experience</span>
            </div>

            <h1 className="hero-main-title animate-fade-in">
              Find Your <br />
              <span className="hero-perfect-ride">Perfect Ride</span>
            </h1>

            <h2 className="hero-sub-title animate-fade-in">
              <span className="text-gradient">Explore. Drive. Enjoy</span>
            </h2>

            <p className="hero-description animate-fade-in">
              Experience the pinnacle of automotive freedom. Choose from pristine luxury cars, rugged 4x4 Thar ROXX SUVs, iconic Royal Enfield superbikes, and high-tech EV scooters with transparent upfront pricing.
            </p>

            {/* CTAs */}
            <div className="hero-cta-group animate-fade-in">
              <button 
                onClick={() => navigate('/cars')} 
                className="btn btn-primary btn-lg hero-primary-btn"
              >
                <span>Explore Fleet</span>
                <ArrowRight size={18} />
              </button>

              <a href="#how-it-works" className="btn btn-secondary btn-lg">
                <span>How It Works</span>
              </a>
            </div>

            {/* Media Mode Quick Switcher Pill (Video / 3D Car) */}
            <div className="hero-media-switch-pill animate-fade-in">
              <button 
                className={`media-pill-btn ${activeMedia === 'video' ? 'active-pill' : ''}`}
                onClick={() => setActiveMedia('video')}
              >
                <Film size={14} />
                <span>4K Cinema Reel</span>
              </button>
              <button 
                className={`media-pill-btn ${activeMedia === '3d' ? 'active-pill' : ''}`}
                onClick={() => setActiveMedia('3d')}
              >
                <Box size={14} />
                <span>Interactive 3D BMW</span>
              </button>
            </div>

            {/* Trust Micro-Metrics */}
            <div className="hero-trust-metrics animate-fade-in">
              <div className="trust-item">
                <div className="trust-icon-box">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="trust-val">100%</h4>
                  <p className="trust-lbl">Verified Fleet</p>
                </div>
              </div>

              <div className="trust-item-divider" />

              <div className="trust-item">
                <div className="trust-icon-box">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="trust-val">2 Mins</h4>
                  <p className="trust-lbl">Instant Booking</p>
                </div>
              </div>

              <div className="trust-item-divider" />

              <div className="trust-item">
                <div className="trust-icon-box">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="trust-val">₹0</h4>
                  <p className="trust-lbl">Hidden Fees</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Cinematic Video / 3D Model */}
          <div className="hero-visual-column">
            {activeMedia === 'video' ? (
              <HeroVideo />
            ) : (
              <HeroCar />
            )}
          </div>
        </div>

        {/* Floating Quick Search Bar Banner */}
        <div className="hero-search-wrapper animate-slide-up">
          <BookingSearch />
        </div>
      </div>
    </section>
  );
}

export default Hero;
