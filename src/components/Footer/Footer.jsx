import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Linkedin, 
  Facebook, 
  Twitter, 
  Send,
  CheckCircle2
} from 'lucide-react';
import './Footer.css';

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand">
              <div className="brand-icon">
                <Car size={20} />
              </div>
              <div className="brand-text">
                <span className="brand-title">Drive<span className="accent-x">X</span></span>
                <span className="brand-subtitle">CAR RENTAL</span>
              </div>
            </Link>
            <p className="footer-about">
              India's premier 3D automotive rental ecosystem. Offering an immaculate fleet of self-drive luxury cars, SUVs, and city commuters with 100% transparent pricing.
            </p>
            <div className="footer-social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/cars">Browse All Cars</Link></li>
              <li><a href="/#how-it-works">How It Works</a></li>
              <li><a href="/#benefits">Our Services</a></li>
              <li><a href="/#testimonials">Customer Reviews</a></li>
              <li><Link to="/my-bookings">Manage Bookings</Link></li>
            </ul>
          </div>

          {/* Fleet Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Fleet Categories</h4>
            <ul className="footer-links-list">
              <li><Link to="/cars?category=suv">Luxury SUVs (4x4)</Link></li>
              <li><Link to="/cars?category=sedan">Executive Sedans</Link></li>
              <li><Link to="/cars?category=luxury">Prestige Luxury</Link></li>
              <li><Link to="/cars?category=convertible">Sports Convertibles</Link></li>
              <li><Link to="/cars?category=economy">Economy City Cars</Link></li>
            </ul>
          </div>

          {/* Contact & Hubs */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact & Hubs</h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={16} className="contact-icon" />
                <span>Primary Hub: Supela, Bhilai, CG 490023</span>
              </li>
              <li>
                <MapPin size={16} className="contact-icon" />
                <span>Airports: Raipur (RPR), Delhi (DEL), Mumbai (BOM)</span>
              </li>
              <li>
                <Phone size={16} className="contact-icon" />
                <span>+91 98765 43210</span>
              </li>
              <li>
                <Mail size={16} className="contact-icon" />
                <span>support@drivex-rentals.in</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="footer-newsletter">
              <p className="newsletter-title">Subscribe for Special Rates</p>
              {subscribed ? (
                <div className="newsletter-success-msg" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontSize: '0.88rem', padding: '10px 0' }}>
                  <CheckCircle2 size={16} />
                  <span>Subscribed! You will receive VIP fleet updates.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Enter your email..." 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="newsletter-input" 
                    required 
                  />
                  <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe to newsletter">
                    <Send size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {new Date().getFullYear()} DriveX Automotive Rentals Pvt. Ltd. All rights reserved.
          </p>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Rental</a>
            <a href="#security">Security & Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
