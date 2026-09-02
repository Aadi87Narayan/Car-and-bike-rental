import React from 'react';
import { Car, CalendarCheck, KeyRound, ArrowRight } from 'lucide-react';
import './HowItWorks.css';

const STEPS = [
  {
    step: "01",
    icon: Car,
    title: "Choose Your Car",
    desc: "Explore our verified fleet, inspect 360° 3D models, review transparent pricing, and pick the perfect vehicle."
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Set Your Schedule",
    desc: "Select your preferred pickup location, rental dates, and optional insurance coverage in under 60 seconds."
  },
  {
    step: "03",
    icon: KeyRound,
    title: "Drive Away",
    desc: "Instant digital verification. Pick up keys from our local hub or have your car delivered directly to your doorstep."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section how-it-works-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <span>Seamless 3-Step Process</span>
          </div>
          <h2 className="section-title">How DriveX Works</h2>
          <p className="section-subtitle">
            From initial browsing to hitting the open highway, our digital booking system is engineered for maximum speed and simplicity.
          </p>
        </div>

        <div className="how-steps-grid">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="step-card glass-card">
                <div className="step-number">{s.step}</div>
                <div className="step-icon-box">
                  <Icon size={26} className="step-icon" />
                </div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                {idx < STEPS.length - 1 && (
                  <div className="step-arrow-connector">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
