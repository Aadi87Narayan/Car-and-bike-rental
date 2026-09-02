import React from 'react';
import { Tag, ShieldCheck, Headphones, KeyRound } from 'lucide-react';
import './Benefits.css';

const BENEFITS = [
  {
    icon: Tag,
    title: "Best Price Guarantee",
    desc: "Find a lower published price elsewhere? We'll match it with an instant ₹500 travel credit.",
    badge: "100% Match"
  },
  {
    icon: KeyRound,
    title: "Wide Range of Cars",
    desc: "100+ meticulously maintained vehicles spanning Economy, Executive Sedans, 4x4 SUVs & Exotics.",
    badge: "5+ Categories"
  },
  {
    icon: Headphones,
    title: "24/7 Roadside Support",
    desc: "Dedicated concierge and roadside recovery ready 24/7 on highways and city routes nationwide.",
    badge: "Always On"
  },
  {
    icon: ShieldCheck,
    title: "Safe & Insured",
    desc: "Every rental comes with comprehensive zero-depreciation insurance and full sanitization checks.",
    badge: "Fully Covered"
  }
];

export function Benefits() {
  return (
    <section id="benefits" className="section benefits-section">
      <div className="container">
        <div className="benefits-grid">
          {BENEFITS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="benefit-card glass-card">
                <div className="benefit-header">
                  <div className="benefit-icon-wrapper">
                    <Icon size={24} className="benefit-icon" />
                  </div>
                  <span className="benefit-badge">{item.badge}</span>
                </div>
                <h3 className="benefit-title">{item.title}</h3>
                <p className="benefit-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
