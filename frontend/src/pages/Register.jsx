import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ShieldCheck, Car, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    drivingLicense: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      await register(formData);
      navigate('/profile');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="container">
        <div className="auth-card-container glass-card animate-fade-in">
          <div className="auth-header">
            <div className="auth-brand-badge">
              <Car size={18} />
              <span>Join DriveX Club</span>
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Unlock member-only rates, instant keyless delivery, and priority booking.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <p className="field-error-msg">{error}</p>}

            <div className="auth-input-group">
              <label className="auth-label">Full Legal Name</label>
              <div className="auth-input-wrapper">
                <User size={16} className="auth-input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Mobile Number</label>
              <div className="auth-input-wrapper">
                <Phone size={16} className="auth-input-icon" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Driving License Number</label>
              <div className="auth-input-wrapper">
                <ShieldCheck size={16} className="auth-input-icon" />
                <input
                  type="text"
                  name="drivingLicense"
                  value={formData.drivingLicense}
                  onChange={handleChange}
                  placeholder="DL-042019008921"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Confirm Password</label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span>Creating profile...</span>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Register & Continue</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <span>Already have an account?</span>
            <Link to="/login" className="auth-switch-link">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
