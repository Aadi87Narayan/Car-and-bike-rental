import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  Car, 
  X, 
  Star, 
  Fuel, 
  Settings2,
  ChevronDown
} from 'lucide-react';
import { cars as defaultCars } from '../data/cars';
import { CarCard } from '../components/CarCard/CarCard';
import { Loader, SkeletonCard } from '../components/Loader/Loader';
import { api } from '../services/api';
import './Cars.css';

const CATEGORIES = ["All", "Economy", "Sedan", "SUV", "Luxury", "Convertible"];
const BRANDS = ["All", "BMW", "Mercedes-Benz", "Audi", "Toyota", "Porsche", "Hyundai", "Tata", "Ford", "Honda", "Maruti Suzuki", "Land Rover"];
const TRANSMISSIONS = ["All", "Automatic", "Manual"];
const FUELS = ["All", "Petrol", "Diesel", "Electric", "Hybrid"];
const SEAT_OPTIONS = ["All", "4", "5", "7"];

export function Cars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [carsList, setCarsList] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedSeats, setSelectedSeats] = useState('All');
  const [maxPrice, setMaxPrice] = useState(20000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('recommended');

  const locationFilter = searchParams.get('location') || '';

  // Initial Load
  useEffect(() => {
    document.title = "DriveX | Browse All Fleet Vehicles";
    window.scrollTo(0, 0);

    const loadCars = async () => {
      setLoading(true);
      try {
        const data = await api.getCars();
        setCarsList(data);
      } catch (e) {
        setCarsList(defaultCars);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  // Update category from URL param if user navigated via Category card
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      const match = CATEGORIES.find((c) => c.toLowerCase() === catParam.toLowerCase());
      if (match) setSelectedCategory(match);
    }
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredCars = useMemo(() => {
    return carsList.filter((car) => {
      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = car.name.toLowerCase().includes(q);
        const matchesBrand = car.brand.toLowerCase().includes(q);
        const matchesCategory = car.category.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }

      // Location Filter (from booking search)
      if (locationFilter && !car.availableLocations.some(l => l.toLowerCase().includes(locationFilter.toLowerCase()))) {
        return false;
      }

      // Category
      if (selectedCategory !== 'All' && car.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Brand
      if (selectedBrand !== 'All' && car.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // Transmission
      if (selectedTransmission !== 'All' && car.transmission.toLowerCase() !== selectedTransmission.toLowerCase()) {
        return false;
      }

      // Fuel
      if (selectedFuel !== 'All' && car.fuelType.toLowerCase() !== selectedFuel.toLowerCase()) {
        return false;
      }

      // Seats
      if (selectedSeats !== 'All' && car.seats < Number(selectedSeats)) {
        return false;
      }

      // Price
      if (car.pricePerDay > maxPrice) {
        return false;
      }

      // Rating
      if (minRating > 0 && car.rating < minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-high') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.rating - a.rating; // default recommended
    });
  }, [
    carsList,
    searchQuery,
    locationFilter,
    selectedCategory,
    selectedBrand,
    selectedTransmission,
    selectedFuel,
    selectedSeats,
    maxPrice,
    minRating,
    sortBy
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedTransmission('All');
    setSelectedFuel('All');
    setSelectedSeats('All');
    setMaxPrice(20000);
    setMinRating(0);
    setSortBy('recommended');
    setSearchParams({});
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory !== 'All') count++;
    if (selectedBrand !== 'All') count++;
    if (selectedTransmission !== 'All') count++;
    if (selectedFuel !== 'All') count++;
    if (selectedSeats !== 'All') count++;
    if (maxPrice < 20000) count++;
    if (minRating > 0) count++;
    if (locationFilter) count++;
    return count;
  }, [searchQuery, selectedCategory, selectedBrand, selectedTransmission, selectedFuel, selectedSeats, maxPrice, minRating, locationFilter]);

  return (
    <div className="cars-page-wrapper">
      {/* Header Banner */}
      <section className="cars-page-hero">
        <div className="container">
          <div className="cars-hero-content">
            <h1 className="cars-hero-title">Explore Our Premium Fleet</h1>
            <p className="cars-hero-desc">
              Compare specifications, configure custom finishes in 3D, and secure guaranteed instant reservations.
            </p>
          </div>
        </div>
      </section>

      <div className="container cars-main-container">
        <div className="cars-layout-grid">
          {/* ================= DESKTOP FILTER SIDEBAR ================= */}
          <aside className="filters-sidebar glass-card">
            <div className="filters-sidebar-header">
              <div className="sidebar-title-row">
                <SlidersHorizontal size={18} className="text-accent" />
                <h3>Filters</h3>
              </div>
              {activeFiltersCount > 0 && (
                <button onClick={resetFilters} className="reset-filter-btn" title="Reset all filters">
                  <RotateCcw size={13} />
                  <span>Reset ({activeFiltersCount})</span>
                </button>
              )}
            </div>

            {/* Filter: Category */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <div className="filter-options-grid">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-pill-btn ${selectedCategory === cat ? 'active-filter-pill' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Price Slider */}
            <div className="filter-group">
              <div className="filter-label-row">
                <label className="filter-label">Max Price / Day</label>
                <span className="price-slider-value">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1500"
                max="20000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-range-slider"
              />
              <div className="range-min-max">
                <span>₹1,500</span>
                <span>₹20,000+</span>
              </div>
            </div>

            {/* Filter: Brand Select */}
            <div className="filter-group">
              <label className="filter-label">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="filter-select"
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Filter: Transmission */}
            <div className="filter-group">
              <label className="filter-label">Transmission</label>
              <div className="filter-options-grid">
                {TRANSMISSIONS.map((t) => (
                  <button
                    key={t}
                    className={`filter-pill-btn ${selectedTransmission === t ? 'active-filter-pill' : ''}`}
                    onClick={() => setSelectedTransmission(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Fuel Type */}
            <div className="filter-group">
              <label className="filter-label">Fuel Type</label>
              <div className="filter-options-grid">
                {FUELS.map((f) => (
                  <button
                    key={f}
                    className={`filter-pill-btn ${selectedFuel === f ? 'active-filter-pill' : ''}`}
                    onClick={() => setSelectedFuel(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Seating Capacity */}
            <div className="filter-group">
              <label className="filter-label">Seating Capacity</label>
              <div className="filter-options-grid">
                {SEAT_OPTIONS.map((s) => (
                  <button
                    key={s}
                    className={`filter-pill-btn ${selectedSeats === s ? 'active-filter-pill' : ''}`}
                    onClick={() => setSelectedSeats(s)}
                  >
                    {s === 'All' ? 'Any' : `${s}+ Seats`}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Min Rating */}
            <div className="filter-group">
              <label className="filter-label">Minimum Rating</label>
              <div className="rating-filter-options">
                {[0, 4.7, 4.8, 4.9].map((rate) => (
                  <button
                    key={rate}
                    className={`rating-pill-btn ${minRating === rate ? 'active-rating-pill' : ''}`}
                    onClick={() => setMinRating(rate)}
                  >
                    {rate === 0 ? 'Any' : (
                      <>
                        <Star size={12} fill="#ffb800" color="#ffb800" />
                        <span>{rate}+</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ================= MAIN CARS LIST & CONTROLS ================= */}
          <main className="cars-results-column">
            {/* Top Toolbar */}
            <div className="cars-toolbar glass-card">
              {/* Search Box */}
              <div className="toolbar-search-box">
                <Search size={18} className="toolbar-search-icon" />
                <input
                  type="text"
                  placeholder="Search by model, brand (e.g. BMW, Fortuner)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="toolbar-search-input"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Mobile Filter Trigger Button */}
              <button 
                className="mobile-filter-toggle-btn btn btn-secondary btn-sm"
                onClick={() => setMobileFilterOpen(true)}
              >
                <SlidersHorizontal size={16} />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="toolbar-sort-wrapper">
                <span className="sort-label">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="toolbar-sort-select"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Active Filter Pills Summary */}
            {activeFiltersCount > 0 && (
              <div className="active-pills-bar">
                <span className="active-pills-count">
                  Showing <strong>{filteredCars.length}</strong> vehicles matching:
                </span>
                <div className="active-pills-list">
                  {locationFilter && (
                    <span className="active-pill">
                      Location: {locationFilter}
                      <X size={12} onClick={() => {
                        setSearchParams((prev) => {
                          const next = new URLSearchParams(prev);
                          next.delete('location');
                          return next;
                        });
                      }} />
                    </span>
                  )}
                  {selectedCategory !== 'All' && (
                    <span className="active-pill">
                      {selectedCategory}
                      <X size={12} onClick={() => {
                        setSelectedCategory('All');
                        setSearchParams((prev) => {
                          const next = new URLSearchParams(prev);
                          next.delete('category');
                          return next;
                        });
                      }} />
                    </span>
                  )}
                  {selectedBrand !== 'All' && (
                    <span className="active-pill">
                      Brand: {selectedBrand}
                      <X size={12} onClick={() => setSelectedBrand('All')} />
                    </span>
                  )}
                  {selectedTransmission !== 'All' && (
                    <span className="active-pill">
                      {selectedTransmission}
                      <X size={12} onClick={() => setSelectedTransmission('All')} />
                    </span>
                  )}
                  {selectedFuel !== 'All' && (
                    <span className="active-pill">
                      {selectedFuel}
                      <X size={12} onClick={() => setSelectedFuel('All')} />
                    </span>
                  )}
                  {selectedSeats !== 'All' && (
                    <span className="active-pill">
                      {selectedSeats}+ Seats
                      <X size={12} onClick={() => setSelectedSeats('All')} />
                    </span>
                  )}
                  {minRating > 0 && (
                    <span className="active-pill">
                      ★ {minRating}+
                      <X size={12} onClick={() => setMinRating(0)} />
                    </span>
                  )}
                  {maxPrice < 20000 && (
                    <span className="active-pill">
                      &lt; ₹{maxPrice.toLocaleString('en-IN')}
                      <X size={12} onClick={() => setMaxPrice(20000)} />
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Cars Grid / Skeleton Load / Empty State */}
            {loading ? (
              <div className="cars-grid">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredCars.length > 0 ? (
              <div className="cars-grid">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="cars-empty-state glass-card">
                <div className="empty-state-icon">
                  <Car size={42} />
                </div>
                <h3>No Vehicles Match Your Criteria</h3>
                <p>Try adjusting your search terms, price threshold, or reset the filters to browse our full collection.</p>
                <button onClick={resetFilters} className="btn btn-primary">
                  <RotateCcw size={16} /> Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="mobile-filter-modal-backdrop">
          <div className="mobile-filter-modal glass-card animate-fade-in">
            <div className="modal-header">
              <h3>Filter Fleet</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="close-modal-btn">
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Category */}
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <div className="filter-options-grid">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      className={`filter-pill-btn ${selectedCategory === cat ? 'active-filter-pill' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="filter-group">
                <div className="filter-label-row">
                  <label className="filter-label">Max Price / Day</label>
                  <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="20000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="price-range-slider"
                />
              </div>

              {/* Transmission */}
              <div className="filter-group">
                <label className="filter-label">Transmission</label>
                <div className="filter-options-grid">
                  {TRANSMISSIONS.map((t) => (
                    <button
                      key={t}
                      className={`filter-pill-btn ${selectedTransmission === t ? 'active-filter-pill' : ''}`}
                      onClick={() => setSelectedTransmission(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div className="filter-group">
                <label className="filter-label">Fuel Type</label>
                <div className="filter-options-grid">
                  {FUELS.map((f) => (
                    <button
                      key={f}
                      className={`filter-pill-btn ${selectedFuel === f ? 'active-filter-pill' : ''}`}
                      onClick={() => setSelectedFuel(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seats */}
              <div className="filter-group">
                <label className="filter-label">Seats</label>
                <div className="filter-options-grid">
                  {SEAT_OPTIONS.map((s) => (
                    <button
                      key={s}
                      className={`filter-pill-btn ${selectedSeats === s ? 'active-filter-pill' : ''}`}
                      onClick={() => setSelectedSeats(s)}
                    >
                      {s === 'All' ? 'Any' : `${s}+ Seats`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={resetFilters} className="btn btn-secondary w-50">Reset</button>
              <button onClick={() => setMobileFilterOpen(false)} className="btn btn-primary w-50">
                Show {filteredCars.length} Cars
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
