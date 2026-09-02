import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Car, 
  Phone, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Calendar, 
  ShieldCheck, 
  Heart,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import './Navbar.css';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { favorites, bookings } = useBooking();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Car size={22} className="car-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">Drive<span className="accent-x">X</span></span>
            <span className="brand-subtitle">CAR RENTAL</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/cars" className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>
            Cars
          </NavLink>
          <a href="/#benefits" className="nav-link">
            Services
          </a>
          <a href="/#how-it-works" className="nav-link">
            How It Works
          </a>
          <a href="/#testimonials" className="nav-link">
            Reviews
          </a>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link admin-nav-pill ${isActive ? 'nav-active' : ''}`}>
              <LayoutDashboard size={14} /> Admin
            </NavLink>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="navbar-actions desktop-actions">
          <a href="tel:+919876543210" className="nav-phone">
            <Phone size={15} className="phone-icon" />
            <span>+91 98765 43210</span>
          </a>

          <button 
            onClick={() => navigate('/cars')} 
            className="btn btn-primary btn-sm nav-book-btn"
          >
            Book Now
          </button>

          {/* User Profile / Auth Button */}
          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <button 
                className="user-profile-trigger"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="User profile menu"
              >
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <span className="user-first-name">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className={`dropdown-chevron ${userDropdownOpen ? 'rotate' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="user-dropdown-menu glass-card">
                  <div className="dropdown-user-info">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                    <span className="user-tier-badge">{user.membershipTier || 'Member'}</span>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link to="/profile" className="dropdown-item">
                    <User size={16} /> My Profile
                  </Link>
                  <Link to="/my-bookings" className="dropdown-item">
                    <Calendar size={16} /> My Bookings
                    {bookings.length > 0 && <span className="item-count">{bookings.length}</span>}
                  </Link>
                  <Link to="/profile#saved" className="dropdown-item">
                    <Heart size={16} /> Saved Cars
                    {favorites.length > 0 && <span className="item-count">{favorites.length}</span>}
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item admin-item">
                      <LayoutDashboard size={16} /> Admin Fleet Panel
                    </Link>
                  )}
                  <hr className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm nav-login-btn">
              <User size={15} /> Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer glass-card animate-fade-in">
          <nav className="mobile-nav-links">
            <NavLink to="/" end className="mobile-nav-link">Home</NavLink>
            <NavLink to="/cars" className="mobile-nav-link">Browse Cars</NavLink>
            <a href="/#benefits" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="/#how-it-works" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="/#testimonials" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Customer Reviews</a>
            
            {isAuthenticated ? (
              <>
                <hr className="mobile-divider" />
                <NavLink to="/my-bookings" className="mobile-nav-link">My Bookings ({bookings.length})</NavLink>
                <NavLink to="/profile" className="mobile-nav-link">Profile & Settings</NavLink>
                {isAdmin && <NavLink to="/admin" className="mobile-nav-link text-accent">Admin Dashboard</NavLink>}
                <button onClick={handleLogout} className="mobile-logout-btn">
                  <LogOut size={16} /> Log Out ({user.name})
                </button>
              </>
            ) : (
              <div className="mobile-auth-actions">
                <Link to="/login" className="btn btn-secondary w-100">Log In</Link>
                <Link to="/register" className="btn btn-primary w-100">Sign Up</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
