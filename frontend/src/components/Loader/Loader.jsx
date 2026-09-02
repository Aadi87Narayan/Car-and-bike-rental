import React from 'react';
import './Loader.css';

export function Loader({ text = "Loading DriveX Experience...", fullScreen = false }) {
  return (
    <div className={`loader-container ${fullScreen ? 'loader-fullscreen' : ''}`}>
      <div className="loader-ring">
        <div className="loader-inner-circle"></div>
        <div className="loader-car-pulse"></div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image skeleton-box"></div>
      <div className="skeleton-content">
        <div className="skeleton-title skeleton-box"></div>
        <div className="skeleton-row">
          <div className="skeleton-tag skeleton-box"></div>
          <div className="skeleton-tag skeleton-box"></div>
          <div className="skeleton-tag skeleton-box"></div>
        </div>
        <div className="skeleton-footer">
          <div className="skeleton-price skeleton-box"></div>
          <div className="skeleton-btn skeleton-box"></div>
        </div>
      </div>
    </div>
  );
}
