import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  User, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  Car, 
  AlertCircle,
  Tag,
  Check,
  Download,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { cars } from '../data/cars';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/Loader/Loader';
import './Booking.css';

const ADDONS = [
  { id: 'zero_dep', name: 'Zero-Depreciation Damage Waiver', price: 1499, desc: 'Complete financial protection with ₹0 out-of-pocket repair liability.' },
  { id: 'unlimited_km', name: 'Unlimited Kilometers Plan', price: 999, desc: 'Drive freely without any daily mileage limits or excess per-km fees.' },
  { id: 'extra_driver', name: 'Additional Certified Driver', price: 499, desc: 'Add a secondary authorized driver to share highway driving duties.' },
  { id: 'child_seat', name: 'Child Safety Isofix Seat', price: 349, desc: 'Premium cushioned safety seat for infants and young children.' }
];

const getTodayDate = () => new Date().toISOString().split('T')[0];
const getFutureDate = (daysAhead = 3) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

export function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { searchParams, createBooking } = useBooking();
  const { user } = useAuth();

  const todayDate = getTodayDate();
  const defaultDropoff = getFutureDate(3);

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // 1: Details & Addons, 2: Driver Info, 3: Payment, 4: Success

  // Form State initialized with dynamic current date and authenticated user details
  const [rentalData, setRentalData] = useState({
    pickupLocation: searchParams?.location || 'Bhilai',
    dropoffLocation: searchParams?.location || 'Bhilai',
    pickupDate: (searchParams?.pickupDate && searchParams.pickupDate >= todayDate) ? searchParams.pickupDate : todayDate,
    pickupTime: searchParams?.pickupTime || '10:00',
    dropoffDate: (searchParams?.dropoffDate && searchParams.dropoffDate >= todayDate) ? searchParams.dropoffDate : defaultDropoff,
    dropoffTime: searchParams?.dropoffTime || '10:00',
    selectedAddons: ['zero_dep'],
    driverName: user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '') || 'Vikram Malhotra',
    driverEmail: user?.email || 'vikram.drivex@example.com',
    driverPhone: user?.phone || '+91 98765 12340',
    drivingLicense: user?.drivingLicense || user?.drivingLicenseNumber || 'DL-042019008921',
    passportNumber: user?.passportNumber || '',
    deliveryAddress: 'Doorstep Delivery / Hotel Drop',
    paymentMethod: 'upi',
    upiId: user?.email ? `${user.email.split('@')[0]}@okaxis` : 'vikram@okaxis',
    couponCode: '',
    discountPercent: 0
  });

  useEffect(() => {
    if (user) {
      setRentalData(prev => ({
        ...prev,
        driverName: user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '') || prev.driverName,
        driverEmail: user.email || prev.driverEmail,
        driverPhone: user.phone || prev.driverPhone,
        drivingLicense: user.drivingLicense || user.drivingLicenseNumber || prev.drivingLicense,
        passportNumber: user.passportNumber || prev.passportNumber
      }));
    }
  }, [user]);


  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCar = async () => {
      setLoading(true);
      try {
        const found = await api.getCarById(id);
        setCar(found);
        document.title = `DriveX | Reserve ${found.name}`;
      } catch (err) {
        const localFound = cars.find((c) => c.id === id);
        if (localFound) {
          setCar(localFound);
          document.title = `DriveX | Reserve ${localFound.name}`;
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  if (loading || !car) {
    return (
      <div className="booking-page-loading">
        <Loader text="Preparing reservation desk..." />
      </div>
    );
  }

  // Calculate day difference
  const days = Math.max(
    1,
    Math.ceil((new Date(rentalData.dropoffDate) - new Date(rentalData.pickupDate)) / (1000 * 60 * 60 * 24)) || 1
  );

  const baseRental = car.pricePerDay * days;
  const addonsTotal = rentalData.selectedAddons.reduce((acc, addonId) => {
    const addon = ADDONS.find((a) => a.id === addonId);
    return acc + (addon ? addon.price : 0);
  }, 0);

  const rawSubtotal = baseRental + addonsTotal;
  const discountAmount = couponApplied ? Math.round(rawSubtotal * (rentalData.discountPercent / 100)) : 0;
  const subtotalAfterDiscount = rawSubtotal - discountAmount;
  const taxes = Math.round(subtotalAfterDiscount * 0.18); // 18% GST
  const securityDeposit = car.securityDeposit || 5000;
  const grandTotal = subtotalAfterDiscount + taxes;

  const toggleAddon = (addonId) => {
    setRentalData((prev) => {
      const exists = prev.selectedAddons.includes(addonId);
      return {
        ...prev,
        selectedAddons: exists
          ? prev.selectedAddons.filter((id) => id !== addonId)
          : [...prev.selectedAddons, addonId]
      };
    });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (rentalData.couponCode.trim().toUpperCase() === 'DRIVEX20') {
      setCouponApplied(true);
      setRentalData((prev) => ({ ...prev, discountPercent: 20 }));
    } else if (rentalData.couponCode.trim().toUpperCase() === 'FIRST500') {
      setCouponApplied(true);
      setRentalData((prev) => ({ ...prev, discountPercent: 10 }));
    } else {
      setCouponError('Invalid coupon code. Try DRIVEX20 for 20% off!');
    }
  };

  const handleCompleteBooking = async () => {
    setIsProcessingPayment(true);
    // Simulate payment gateway processing
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const newBooking = createBooking({
      carId: car.id,
      carName: car.name,
      brand: car.brand,
      category: car.category,
      image: car.image,
      pickupLocation: `${rentalData.pickupLocation} City Hub`,
      dropoffLocation: `${rentalData.dropoffLocation} City Hub`,
      pickupDate: rentalData.pickupDate,
      pickupTime: rentalData.pickupTime,
      dropoffDate: rentalData.dropoffDate,
      dropoffTime: rentalData.dropoffTime,
      days,
      pricePerDay: car.pricePerDay,
      subtotal: rawSubtotal,
      discount: discountAmount,
      taxes,
      deposit: securityDeposit,
      totalAmount: grandTotal,
      paymentMethod: rentalData.paymentMethod === 'upi' ? `UPI (${rentalData.upiId})` : 'Credit Card (Visa/Mastercard)',
      driverName: rentalData.driverName,
      driverPhone: rentalData.driverPhone,
      driverEmail: rentalData.driverEmail
    });

    setConfirmedBooking(newBooking);
    setIsProcessingPayment(false);
    setCurrentStep(4);

    // Launch Confetti Celebration
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="booking-page-wrapper">
      <div className="container">
        {/* Step Indicator Header */}
        <div className="booking-stepper-header">
          <button onClick={() => navigate(-1)} className="stepper-back-btn">
            <ArrowLeft size={16} /> Back
          </button>

          <div className="stepper-track">
            <div className={`step-node ${currentStep >= 1 ? 'step-active' : ''} ${currentStep > 1 ? 'step-done' : ''}`}>
              <span className="step-num">{currentStep > 1 ? <Check size={14} /> : '1'}</span>
              <span className="step-text">Trip & Add-ons</span>
            </div>
            <div className={`step-line ${currentStep >= 2 ? 'line-active' : ''}`} />
            <div className={`step-node ${currentStep >= 2 ? 'step-active' : ''} ${currentStep > 2 ? 'step-done' : ''}`}>
              <span className="step-num">{currentStep > 2 ? <Check size={14} /> : '2'}</span>
              <span className="step-text">Driver Info</span>
            </div>
            <div className={`step-line ${currentStep >= 3 ? 'line-active' : ''}`} />
            <div className={`step-node ${currentStep >= 3 ? 'step-active' : ''} ${currentStep > 3 ? 'step-done' : ''}`}>
              <span className="step-num">{currentStep > 3 ? <Check size={14} /> : '3'}</span>
              <span className="step-text">Payment</span>
            </div>
          </div>
        </div>

        {/* Step 4: SUCCESS / WAITING FOR ADMIN APPROVAL SCREEN */}
        {currentStep === 4 && confirmedBooking ? (
          <div className="booking-success-container glass-card animate-fade-in">
            <div className="success-icon-badge" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#ca8a04', border: '1px solid rgba(234, 179, 8, 0.4)' }}>
              <Clock size={48} />
            </div>

            <h1 className="success-title">Reservation Submitted!</h1>
            <p className="success-subtitle">
              Your car reservation request has been submitted and is currently <strong style={{ color: '#ca8a04' }}>Waiting for Admin Confirmation</strong>.
            </p>

            <div style={{
              background: 'rgba(234, 179, 8, 0.1)',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <AlertCircle size={24} style={{ color: '#ca8a04', flexShrink: 0 }} />
              <span style={{ fontSize: '0.92rem', color: 'var(--color-text)', lineHeight: 1.4 }}>
                <strong>Current Status: Waiting for Admin Approval</strong>. Once the admin team reviews and confirms your reservation, the status in your account will update to <strong>Confirmed</strong>. You can track this or cancel anytime in <strong>My Bookings</strong>.
              </span>
            </div>

            <div className="booking-receipt-card">
              <div className="receipt-header">
                <div>
                  <span className="receipt-booking-id">Booking Reference</span>
                  <h3 className="receipt-code">{confirmedBooking.id}</h3>
                </div>
                <span className="badge badge-warning" style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#ca8a04', border: '1px solid rgba(234, 179, 8, 0.4)', fontWeight: 700 }}>
                  ⏳ Pending Admin Confirmation
                </span>
              </div>

              <div className="receipt-car-row">
                <img src={car.image} alt={car.name} className="receipt-car-img" />
                <div>
                  <h4 className="receipt-car-title">{car.brand} {car.name}</h4>
                  <p className="receipt-car-sub">{car.category} • {car.transmission} • {car.fuelType}</p>
                </div>
              </div>

              <div className="receipt-meta-grid">
                <div>
                  <span className="meta-label">Pick-up</span>
                  <p className="meta-value">{confirmedBooking.pickupDate} ({confirmedBooking.pickupTime})</p>
                  <p className="meta-sub">{confirmedBooking.pickupLocation}</p>
                </div>
                <div>
                  <span className="meta-label">Drop-off</span>
                  <p className="meta-value">{confirmedBooking.dropoffDate} ({confirmedBooking.dropoffTime})</p>
                  <p className="meta-sub">{confirmedBooking.dropoffLocation}</p>
                </div>
                <div>
                  <span className="meta-label">Total Amount</span>
                  <p className="meta-value text-accent">₹{confirmedBooking.totalAmount.toLocaleString('en-IN')}</p>
                  <p className="meta-sub">Deposit: ₹{confirmedBooking.deposit.toLocaleString('en-IN')} (Refundable)</p>
                </div>
                <div>
                  <span className="meta-label">Primary Driver</span>
                  <p className="meta-value">{confirmedBooking.driverName}</p>
                  <p className="meta-sub">{confirmedBooking.driverPhone}</p>
                </div>
              </div>
            </div>

            <div className="success-actions">
              <Link to="/my-bookings" className="btn btn-primary btn-lg">
                <span>View in My Bookings</span>
              </Link>
              <button onClick={() => window.print()} className="btn btn-secondary btn-lg">
                <Download size={18} />
                <span>Print Booking Slip</span>
              </button>
            </div>
          </div>
        ) : (
          /* Steps 1, 2, 3 Grid Layout */
          <div className="booking-layout-grid">
            {/* Left Column: Interactive Step Form */}
            <div className="booking-form-column">
              {/* STEP 1: RENTAL CRITERIA & ADDONS */}
              {currentStep === 1 && (
                <div className="step-pane glass-card animate-fade-in">
                  <h2 className="step-pane-title">1. Trip Dates & Protection Add-ons</h2>

                  {/* Rental Schedule Card */}
                  <div className="booking-schedule-box">
                    <div className="schedule-input-row">
                      <div className="booking-input-group">
                        <label className="booking-label">
                          <MapPin size={14} className="text-accent" /> Pick-up & Drop Location
                        </label>
                        <select
                          value={rentalData.pickupLocation}
                          onChange={(e) => setRentalData({ ...rentalData, pickupLocation: e.target.value, dropoffLocation: e.target.value })}
                          className="booking-select"
                        >
                          {car.availableLocations.map((loc) => (
                            <option key={loc} value={loc}>{loc} City Hub</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="schedule-dates-grid">
                      <div className="booking-input-group">
                        <label className="booking-label">Pick-up Date</label>
                        <input
                          type="date"
                          min={todayDate}
                          value={rentalData.pickupDate}
                          onChange={(e) => {
                            const newPickup = e.target.value;
                            setRentalData(prev => ({
                              ...prev,
                              pickupDate: newPickup,
                              dropoffDate: prev.dropoffDate < newPickup ? newPickup : prev.dropoffDate
                            }));
                          }}
                          className="booking-input"
                        />
                      </div>

                      <div className="booking-input-group">
                        <label className="booking-label">Drop-off Date</label>
                        <input
                          type="date"
                          min={rentalData.pickupDate || todayDate}
                          value={rentalData.dropoffDate}
                          onChange={(e) => setRentalData({ ...rentalData, dropoffDate: e.target.value })}
                          className="booking-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Add-ons Selection */}
                  <div className="addons-section">
                    <h3 className="addons-title">Recommended Protection & Add-ons</h3>
                    <div className="addons-list">
                      {ADDONS.map((addon) => {
                        const selected = rentalData.selectedAddons.includes(addon.id);
                        return (
                          <div
                            key={addon.id}
                            className={`addon-card ${selected ? 'addon-selected' : ''}`}
                            onClick={() => toggleAddon(addon.id)}
                          >
                            <div className="addon-checkbox">
                              {selected && <Check size={14} />}
                            </div>
                            <div className="addon-info">
                              <h4 className="addon-name">{addon.name}</h4>
                              <p className="addon-desc">{addon.desc}</p>
                            </div>
                            <span className="addon-price">+₹{addon.price.toLocaleString('en-IN')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="step-actions">
                    <button onClick={() => setCurrentStep(2)} className="btn btn-primary btn-lg">
                      <span>Continue to Driver Details</span>
                      <Check size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DRIVER DETAILS */}
              {currentStep === 2 && (
                <div className="step-pane glass-card animate-fade-in">
                  <h2 className="step-pane-title">2. Primary Driver Information</h2>
                  <p className="step-pane-desc">
                    Please provide government-approved details for verification and roadside insurance coverage.
                  </p>

                  <div className="driver-form-grid">
                    <div className="booking-input-group">
                      <label className="booking-label">Full Name (as per Driver's License)</label>
                      <input
                        type="text"
                        value={rentalData.driverName}
                        onChange={(e) => setRentalData({ ...rentalData, driverName: e.target.value })}
                        className="booking-input"
                        required
                      />
                    </div>

                    <div className="booking-input-group">
                      <label className="booking-label">Mobile Number</label>
                      <input
                        type="tel"
                        value={rentalData.driverPhone}
                        onChange={(e) => setRentalData({ ...rentalData, driverPhone: e.target.value })}
                        className="booking-input"
                        required
                      />
                    </div>

                    <div className="booking-input-group">
                      <label className="booking-label">Email Address</label>
                      <input
                        type="email"
                        value={rentalData.driverEmail}
                        onChange={(e) => setRentalData({ ...rentalData, driverEmail: e.target.value })}
                        className="booking-input"
                        required
                      />
                    </div>

                    <div className="booking-input-group">
                      <label className="booking-label">Driving License Number</label>
                      <input
                        type="text"
                        value={rentalData.drivingLicense}
                        onChange={(e) => setRentalData({ ...rentalData, drivingLicense: e.target.value })}
                        className="booking-input"
                        placeholder="e.g. DL-042019008921"
                        required
                      />
                    </div>
                  </div>

                  <div className="step-actions">
                    <button onClick={() => setCurrentStep(1)} className="btn btn-secondary">
                      Back
                    </button>
                    <button onClick={() => setCurrentStep(3)} className="btn btn-primary btn-lg">
                      <span>Proceed to Payment</span>
                      <Check size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT GATEWAY */}
              {currentStep === 3 && (
                <div className="step-pane glass-card animate-fade-in">
                  <h2 className="step-pane-title">3. Secure Payment Gateway</h2>
                  <p className="step-pane-desc">
                    All transactions are protected with 256-bit bank-grade encryption.
                  </p>

                  {/* Payment Method Selector */}
                  <div className="payment-methods-tabs">
                    <button
                      className={`payment-method-pill ${rentalData.paymentMethod === 'upi' ? 'active-payment' : ''}`}
                      onClick={() => setRentalData({ ...rentalData, paymentMethod: 'upi' })}
                    >
                      <span>UPI (GPay / PhonePe / Paytm)</span>
                    </button>
                    <button
                      className={`payment-method-pill ${rentalData.paymentMethod === 'card' ? 'active-payment' : ''}`}
                      onClick={() => setRentalData({ ...rentalData, paymentMethod: 'card' })}
                    >
                      <CreditCard size={16} />
                      <span>Credit / Debit Card</span>
                    </button>
                  </div>

                  {rentalData.paymentMethod === 'upi' ? (
                    <div className="payment-body-box">
                      <label className="booking-label">Enter your UPI ID / VPA</label>
                      <input
                        type="text"
                        value={rentalData.upiId}
                        onChange={(e) => setRentalData({ ...rentalData, upiId: e.target.value })}
                        placeholder="e.g. yourname@oksbi"
                        className="booking-input"
                      />
                      <p className="upi-hint">A payment request will be sent to your UPI app for authorization.</p>
                    </div>
                  ) : (
                    <div className="payment-body-box">
                      <div className="booking-input-group">
                        <label className="booking-label">Card Number</label>
                        <input type="text" placeholder="4111 2222 3333 4444" className="booking-input" defaultValue="4242 •••• •••• 4242" />
                      </div>
                      <div className="card-row">
                        <div className="booking-input-group">
                          <label className="booking-label">Expiry (MM/YY)</label>
                          <input type="text" placeholder="12/28" className="booking-input" defaultValue="08/28" />
                        </div>
                        <div className="booking-input-group">
                          <label className="booking-label">CVV</label>
                          <input type="password" placeholder="•••" className="booking-input" defaultValue="123" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="step-actions">
                    <button onClick={() => setCurrentStep(2)} className="btn btn-secondary">
                      Back
                    </button>
                    <button 
                      onClick={handleCompleteBooking} 
                      className="btn btn-primary btn-lg pay-now-btn"
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <span>Processing ₹{grandTotal.toLocaleString('en-IN')}...</span>
                      ) : (
                        <>
                          <span>Authorize & Pay ₹{grandTotal.toLocaleString('en-IN')}</span>
                          <ShieldCheck size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary & Coupon Card */}
            <aside className="booking-summary-sidebar">
              <div className="order-summary-card glass-card">
                <h3 className="summary-title">Rental Summary</h3>

                {/* Car Preview Block */}
                <div className="summary-car-card">
                  <img src={car.image} alt={car.name} className="summary-car-thumb" />
                  <div className="summary-car-info">
                    <span className="summary-brand">{car.brand}</span>
                    <h4 className="summary-model">{car.name}</h4>
                    <span className="summary-tag">{car.category} • {car.transmission}</span>
                  </div>
                </div>

                <hr className="summary-divider" />

                {/* Itinerary */}
                <div className="summary-itinerary">
                  <div className="itinerary-row">
                    <span className="itinerary-label">Duration</span>
                    <span className="itinerary-val">{days} {days === 1 ? 'Day' : 'Days'}</span>
                  </div>
                  <div className="itinerary-row">
                    <span className="itinerary-label">Pick-up Location</span>
                    <span className="itinerary-val">{rentalData.pickupLocation} Hub</span>
                  </div>
                  <div className="itinerary-row">
                    <span className="itinerary-label">Dates</span>
                    <span className="itinerary-val">{rentalData.pickupDate} → {rentalData.dropoffDate}</span>
                  </div>
                </div>

                <hr className="summary-divider" />

                {/* Promo Coupon Form */}
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <div className="coupon-input-wrapper">
                    <Tag size={15} className="coupon-icon" />
                    <input
                      type="text"
                      placeholder="Promo Code (DRIVEX20)"
                      value={rentalData.couponCode}
                      onChange={(e) => setRentalData({ ...rentalData, couponCode: e.target.value })}
                      className="coupon-input"
                    />
                    <button type="submit" className="coupon-apply-btn">Apply</button>
                  </div>
                  {couponApplied && (
                    <span className="coupon-success-msg">✓ 20% discount coupon applied!</span>
                  )}
                  {couponError && (
                    <span className="coupon-error-msg">{couponError}</span>
                  )}
                </form>

                {/* Price Ledger */}
                <div className="ledger-breakdown">
                  <div className="ledger-row">
                    <span>Base Vehicle Rental</span>
                    <span>₹{baseRental.toLocaleString('en-IN')}</span>
                  </div>
                  {addonsTotal > 0 && (
                    <div className="ledger-row">
                      <span>Add-ons & Upgrades</span>
                      <span>+₹{addonsTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {couponApplied && (
                    <div className="ledger-row discount-row">
                      <span>Promo Discount (20%)</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="ledger-row">
                    <span>GST (18%)</span>
                    <span>₹{taxes.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="ledger-row deposit-row">
                    <span>Refundable Deposit</span>
                    <span>₹{securityDeposit.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="ledger-total-row">
                    <div>
                      <span className="final-total-label">Total Payable</span>
                      <p className="final-sub">All taxes included</p>
                    </div>
                    <span className="final-total-amount">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
