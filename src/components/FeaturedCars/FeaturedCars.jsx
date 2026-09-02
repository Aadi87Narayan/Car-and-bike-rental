import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import { cars } from '../../data/cars';
import { CarCard } from '../CarCard/CarCard';
import './FeaturedCars.css';

const FILTER_TABS = ['All', 'Sports', 'SUV', 'Sedan', 'Luxury', 'Cruiser', 'Superbike'];

export function FeaturedCars() {
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  const filteredCars = cars.filter((car) => {
    if (activeTab === 'All') return car.isFeatured;
    return car.isFeatured && car.category.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <section className="section featured-section">
      <div className="container">
        <div className="featured-header-row">
          <div className="featured-title-block">
            <div className="section-tag">
              <Flame size={14} />
              <span>Most Booked</span>
            </div>
            <h2 className="section-title">Popular Fleet In High Demand</h2>
            <p className="section-subtitle">
              Handpicked customer favorites offering exceptional luxury, driving dynamics, and pristine reliability.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="featured-tabs">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active-tab' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Cars Grid */}
        <div className="featured-cars-grid">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {/* View All Action */}
        <div className="featured-bottom-cta">
          <button 
            onClick={() => navigate('/cars')} 
            className="btn btn-secondary btn-lg view-all-btn"
          >
            <span>View All {cars.length} Fleet Vehicles</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
