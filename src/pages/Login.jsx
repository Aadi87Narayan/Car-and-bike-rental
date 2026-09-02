import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ShieldCheck, Eye, EyeOff, LogIn, UserPlus, Car, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, isLoading, isAuthenticated, user } = useAuth();

  // If already authenticated, redirect to Home or Admin immediately
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Synchronize state with URL pathname (/register vs /login)
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/register');

  useEffect(() => {
    setIsSignUp(location.pathname === '/register');
  }, [location.pathname]);

  const toggleMode = (signUpMode) => {
    setIsSignUp(signUpMode);
    navigate(signUpMode ? '/register' : '/login', { replace: true });
    setError('');
    setSuccess('');
  };

  // ── Login form state ──────────────────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPass, setShowLoginPass] = useState(false);

  // ── Register form state (Client Details with Passport & DL) ───────────
  const [reg, setReg] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    drivingLicenseNumber: '',
    passportNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // ── Feedback alerts ───────────────────────────────────────────────────
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Please enter both your email address and password.');
      return;
    }
    try {
      const authUser = await login(loginEmail, loginPassword);
      if (authUser) {
        navigate(authUser.role === 'admin' ? '/admin' : '/');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify and try again.');
    }
  };

  const handleRegChange = (e) => {
    setReg(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const { firstName, lastName, email, phone, drivingLicenseNumber, passportNumber, password, confirmPassword } = reg;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Please complete all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    try {
      const newUser = await register({
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        drivingLicenseNumber,
        passportNumber,
        password
      });
      setSuccess('Account created successfully! Welcome to DriveX.');
      setTimeout(() => {
        navigate(newUser?.role === 'admin' ? '/admin' : '/');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className={`auth-main-container ${isSignUp ? 'is-signup' : ''}`}>

        {/* ── 1. SIGN-UP FORM (Rendered on Left, shifts to Right when active) ── */}
        <div className="form-panel-container sign-up-container">
          <div className="auth-form-header">
            <span className="auth-brand-label">DriveX Membership</span>
            <h1 className="auth-form-title">Create account</h1>
            <p className="auth-form-subtitle">
              Join India's premium keyless vehicle rental network.
            </p>
          </div>

          <form onSubmit={handleRegSubmit} className="auth-custom-form" noValidate>
            {error && isSignUp && <div className="auth-error-banner">{error}</div>}
            {success && <div className="auth-error-banner auth-success-banner">{success}</div>}

            <div className="auth-fields-row">
              <div className="auth-floating-group">
                <input
                  id="reg-firstname"
                  type="text"
                  name="firstName"
                  className="auth-floating-input"
                  placeholder=" "
                  value={reg.firstName}
                  onChange={handleRegChange}
                  autoComplete="given-name"
                  required
                />
                <label htmlFor="reg-firstname" className="auth-floating-label">First Name</label>
                <User size={16} className="auth-field-icon" aria-hidden="true" />
              </div>

              <div className="auth-floating-group">
                <input
                  id="reg-lastname"
                  type="text"
                  name="lastName"
                  className="auth-floating-input"
                  placeholder=" "
                  value={reg.lastName}
                  onChange={handleRegChange}
                  autoComplete="family-name"
                  required
                />
                <label htmlFor="reg-lastname" className="auth-floating-label">Last Name</label>
                <User size={16} className="auth-field-icon" aria-hidden="true" />
              </div>
            </div>

            <div className="auth-fields-row">
              <div className="auth-floating-group">
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  className="auth-floating-input"
                  placeholder=" "
                  value={reg.email}
                  onChange={handleRegChange}
                  autoComplete="email"
                  required
                />
                <label htmlFor="reg-email" className="auth-floating-label">Email Address</label>
                <Mail size={16} className="auth-field-icon" aria-hidden="true" />
              </div>

              <div className="auth-floating-group">
                <input
                  id="reg-phone"
                  type="tel"
                  name="phone"
                  className="auth-floating-input"
                  placeholder=" "
                  value={reg.phone}
                  onChange={handleRegChange}
                  autoComplete="tel"
                  required
                />
                <label htmlFor="reg-phone" className="auth-floating-label">Mobile Number</label>
                <Phone size={16} className="auth-field-icon" aria-hidden="true" />
              </div>
            </div>

            {/* Client ID Documents: Driving License & Passport */}
            <div className="auth-fields-row">
              <div className="auth-floating-group">
                <input
                  id="reg-license"
                  type="text"
                  name="drivingLicenseNumber"
                  className="auth-floating-input"
                  placeholder=" "
                  value={reg.drivingLicenseNumber}
                  onChange={handleRegChange}
                />
                <label htmlFor="reg-license" className="auth-floating-label">Driving License No.</label>
                <ShieldCheck size={16} className="auth-field-icon" aria-hidden="true" />
              </div>

              <div className="auth-floating-group">
                <input
                  id="reg-passport"
                  type="text"
                  name="passportNumber"
                  className="auth-floating-input"
                  placeholder=" "
                  value={reg.passportNumber}
                  onChange={handleRegChange}
                />
                <label htmlFor="reg-passport" className="auth-floating-label">Passport No. (Optional)</label>
                <FileText size={16} className="auth-field-icon" aria-hidden="true" />
              </div>
            </div>

            <div className="auth-fields-row">
              <div className="auth-floating-group">
                <input
                  id="reg-password"
                  type={showRegPass ? 'text' : 'password'}
                  name="password"
                  className="auth-floating-input"
                  placeholder=" "
                  value={reg.password}
                  onChange={handleRegChange}
                  autoComplete="new-password"
                  required
                />
                <label htmlFor="reg-password" className="auth-floating-label">Password</label>
                <button
                  type="button"
                  className="auth-field-icon auth-eye-btn"
                  onClick={() => setShowRegPass(v => !v)}
                  aria-label={showRegPass ? 'Hide password' : 'Show password'}
                >
                  {showRegPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="auth-floating-group">
                <input
                  id="reg-confirm"
                  type={showRegConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  className="auth-floating-input"
                  placeholder=" "
                  value={reg.confirmPassword}
                  onChange={handleRegChange}
                  autoComplete="new-password"
                  required
                />
                <label htmlFor="reg-confirm" className="auth-floating-label">Confirm Password</label>
                <button
                  type="button"
                  className="auth-field-icon auth-eye-btn"
                  onClick={() => setShowRegConfirm(v => !v)}
                  aria-label={showRegConfirm ? 'Hide password' : 'Show password'}
                >
                  {showRegConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-capsule-button" disabled={isLoading}>
              <UserPlus size={18} aria-hidden="true" />
              <span>{isLoading ? 'Creating account...' : 'Create Account'}</span>
            </button>
          </form>

          <p className="auth-switch-prompt">
            Already have an account?{' '}
            <button type="button" onClick={() => toggleMode(false)} className="auth-inline-switch">
              Sign in
            </button>
          </p>
        </div>

        {/* ── 2. SIGN-IN FORM (Rendered on Left, visible by default) ── */}
        <div className="form-panel-container sign-in-container">
          <div className="auth-form-header">
            <span className="auth-brand-label">DriveX India</span>
            <h1 className="auth-form-title">Sign in</h1>
            <p className="auth-form-subtitle">
              Access your digital keys, rental schedules, and fleet.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="auth-custom-form" noValidate>
            {error && !isSignUp && <div className="auth-error-banner">{error}</div>}

            <div className="auth-floating-group">
              <input
                id="login-email"
                type="email"
                className="auth-floating-input"
                placeholder=" "
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <label htmlFor="login-email" className="auth-floating-label">Email Address</label>
              <Mail size={16} className="auth-field-icon" aria-hidden="true" />
            </div>

            <div className="auth-floating-group">
              <input
                id="login-password"
                type={showLoginPass ? 'text' : 'password'}
                className="auth-floating-input"
                placeholder=" "
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <label htmlFor="login-password" className="auth-floating-label">Password</label>
              <button
                type="button"
                className="auth-field-icon auth-eye-btn"
                onClick={() => setShowLoginPass(v => !v)}
                aria-label={showLoginPass ? 'Hide password' : 'Show password'}
              >
                {showLoginPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="auth-extras-bar">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  className="auth-checkbox-input"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Keep me signed in</span>
              </label>
              <button type="button" className="auth-forgot-btn">Forgot password?</button>
            </div>

            <button type="submit" className="auth-capsule-button" disabled={isLoading}>
              <LogIn size={18} aria-hidden="true" />
              <span>{isLoading ? 'Verifying credentials...' : 'Sign In'}</span>
            </button>
          </form>

          <p className="auth-switch-prompt">
            New to DriveX?{' '}
            <button type="button" onClick={() => toggleMode(true)} className="auth-inline-switch">
              Create an account
            </button>
          </p>
        </div>

        {/* ── 3. SLIDING OVERLAY CONTAINER ── */}
        <div className="overlay-container">
          <div className="overlay">

            {/* Left Panel (Visible when Sign Up is active -> Prompts user to Sign In) */}
            <div className="overlay-panel overlay-left">
              <div className="auth-blade-brand">
                <Car size={18} />
                DriveX
              </div>
              <h2 className="auth-blade-heading">
                <span>Welcome</span>
                <span className="gold-text">back.</span>
              </h2>
              <p className="auth-blade-body">
                Your active bookings, digital keys, and Platinum rewards are waiting.
              </p>
              <button type="button" className="auth-ghost-button" onClick={() => toggleMode(false)}>
                Sign In
              </button>
            </div>

            {/* Right Panel (Visible when Sign In is active -> Prompts user to Sign Up) */}
            <div className="overlay-panel overlay-right">
              <div className="auth-blade-brand">
                <Car size={18} />
                DriveX
              </div>
              <h2 className="auth-blade-heading">
                <span>Start the</span>
                <span className="gold-text">journey.</span>
              </h2>
              <p className="auth-blade-body">
                One verified account for luxury cars, superbikes, and EV fleets across India.
              </p>
              <button type="button" className="auth-ghost-button" onClick={() => toggleMode(true)}>
                Create Account
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
export default Login;
