import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { categories } from '../../data/categories';
import './CarCategories.css';

export function CarCategories() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/cars?category=${categoryId}`);
  };

  return (
    <section className="section categories-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} />
            <span>Curated Fleet</span>
          </div>
          <h2 className="section-title">Browse by Car Type</h2>
          <p className="section-subtitle">
            Find the ideal vehicle engineered for your specific travel needs, from high-efficiency city cruisers to flagship executive sedans.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card glass-card"
              onClick={() => handleCategoryClick(cat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat.id)}
            >
              <div className="category-image-wrapper">
                <img src={cat.image} alt={cat.name} className="category-img" loading="lazy" />
                <div className="category-overlay-gradient" />
                <div className="category-badge-count">{cat.carCount} Models</div>
              </div>

              <div className="category-content">
                <div className="category-header-row">
                  <div>
                    <h3 className="category-name">{cat.name}</h3>
                    <p className="category-subtitle">{cat.subtitle}</p>
                  </div>
                  <div className="category-arrow-btn">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <div className="category-footer">
                  <span className="starting-label">Starting from</span>
                  <span className="starting-price">₹{cat.startingPrice.toLocaleString('en-IN')}<span className="price-unit"> / day</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
