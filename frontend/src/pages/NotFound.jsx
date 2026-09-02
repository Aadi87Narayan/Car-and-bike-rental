import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Car, ArrowLeft, Home } from 'lucide-react';
import './NotFound.css';

export function NotFound() {
  return (
    <div className="not-found-page-wrapper">
      <div className="container">
        <div className="not-found-card glass-card animate-fade-in">
          <div className="not-found-icon-box">
            <Compass size={56} className="compass-spin" />
          </div>
          <span className="not-found-error-code">404 Error</span>
          <h1 className="not-found-title">Road Ends Here</h1>
          <p className="not-found-description">
            Looks like you've navigated off our mapped GPS route. The vehicle or page you are looking for has either been reserved or moved.
          </p>

          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary btn-lg">
              <Home size={18} />
              <span>Back to Home</span>
            </Link>
            <Link to="/cars" className="btn btn-secondary btn-lg">
              <Car size={18} />
              <span>Explore Active Fleet</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
