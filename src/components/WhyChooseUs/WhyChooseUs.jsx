import React from 'react';
import { ShieldCheck, CheckCircle2, DollarSign, Clock, Award, Sparkles } from 'lucide-react';
import './WhyChooseUs.css';

const ADVANTAGES = [
  {
    title: "150-Point Inspection",
    desc: "Every car undergoes exhaustive mechanical, electronic, and safety checks before every handoff."
  },
  {
    title: "Zero Hidden Surcharges",
    desc: "Transparent bills covering GST, standard insurance, and upfront refundable security deposit terms."
  },
  {
    title: "Flexible Instant Rescheduling",
    desc: "Plans changed? Modify booking dates or cancel up to 24 hours prior with full digital refund."
  },
  {
    title: "Doorstep Delivery & Airport Pickup",
    desc: "Have your vehicle delivered directly to your home, office, or airport arrival terminal."
  }
];

export function WhyChooseUs() {
  return (
    <section className="section why-choose-section">
      <div className="container">
        <div className="why-choose-grid">
          {/* Left Column: Visual Showcase */}
          <div className="why-visual-block">
            <div className="why-img-container">
              <img 
                src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80" 
                alt="DriveX Luxury Car Interior" 
                className="why-main-img" 
                loading="lazy"
              />
              <div className="why-accent-card glass-card">
                <div className="accent-badge-icon">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="accent-badge-val">99.8%</h4>
                  <p className="accent-badge-label">Customer Satisfaction Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Pillars */}
          <div className="why-content-block">
            <div className="section-tag">
              <Sparkles size={14} />
              <span>The DriveX Advantage</span>
            </div>

            <h2 className="why-title">
              Crafted For Discerning Drivers Who Demand Excellence
            </h2>

            <p className="why-subtitle">
              We eliminate rental friction with cutting-edge 3D vehicle inspection, premium vehicle maintenance standards, and customer-first policies.
            </p>

            <div className="advantages-list">
              {ADVANTAGES.map((item, idx) => (
                <div key={idx} className="advantage-item">
                  <div className="advantage-check">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="advantage-text">
                    <h4 className="advantage-title">{item.title}</h4>
                    <p className="advantage-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
