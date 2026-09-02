import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, PhoneCall, Sparkles } from 'lucide-react';
import './CTA.css';

export function CTA() {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-card">
          <div className="cta-glow" />
          <div className="cta-content">
            <div className="cta-tag">
              <Sparkles size={14} />
              <span>Unlock The Road Today</span>
            </div>

            <h2 className="cta-title">
              Ready For Your Next <span className="text-gradient">Unforgettable Journey?</span>
            </h2>

            <p className="cta-description">
              Choose your dream car from our premier collection with zero paperwork hassle, transparent deposits, and guaranteed vehicle availability.
            </p>

            <div className="cta-actions">
              <button 
                onClick={() => navigate('/cars')} 
                className="btn btn-primary btn-lg cta-primary-btn"
              >
                <span>Explore Cars Now</span>
                <ArrowRight size={18} />
              </button>

              <a href="tel:+919876543210" className="btn btn-secondary btn-lg">
                <PhoneCall size={18} />
                <span>Call +91 98765 43210</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
