import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { testimonials } from '../../data/testimonials';
import './Testimonials.css';

export function Testimonials() {
  return (
    <section id="testimonials" className="section testimonials-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <Star size={14} />
            <span>Driver Stories</span>
          </div>
          <h2 className="section-title">Trusted By Thousands of Travelers</h2>
          <p className="section-subtitle">
            See how DriveX delivers unforgettable journeys for executive business trips, scenic weekend getaways, and luxury events.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((item) => (
            <div key={item.id} className="testimonial-card glass-card">
              <div className="testimonial-quote-icon">
                <Quote size={24} />
              </div>

              {/* Star Rating */}
              <div className="testimonial-stars">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#ffb800" color="#ffb800" />
                ))}
              </div>

              <p className="testimonial-comment">"{item.comment}"</p>

              <div className="testimonial-footer">
                <img src={item.avatar} alt={item.name} className="testimonial-avatar" />
                <div className="testimonial-author-info">
                  <div className="author-name-row">
                    <h4 className="author-name">{item.name}</h4>
                    <CheckCircle size={14} className="verified-driver-icon" title="Verified Driver" />
                  </div>
                  <p className="author-role">{item.role} • {item.location}</p>
                  <span className="rented-car-pill">{item.carRented}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
