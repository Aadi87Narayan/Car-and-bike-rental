import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Car, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Download, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  X
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import './MyBookings.css';

export function MyBookings() {
  const { userBookings, cancelBooking } = useBooking();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelToast, setCancelToast] = useState('');

  const filteredBookings = userBookings.filter((b) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return b.status === 'Pending';
    if (activeTab === 'Confirmed') return b.status === 'Confirmed';
    if (activeTab === 'Active') return b.status === 'Active';
    if (activeTab === 'Completed') return b.status === 'Completed';
    return false;
  });

  const handleConfirmCancel = () => {
    if (cancelModalBooking) {
      const carName = cancelModalBooking.carName;
      cancelBooking(cancelModalBooking.id);
      setCancelModalBooking(null);
      setCancelToast(`Reservation for ${carName} cancelled and removed from your bookings.`);
      setTimeout(() => setCancelToast(''), 4500);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="badge badge-warning" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#ca8a04', border: '1px solid rgba(234, 179, 8, 0.4)', fontWeight: 600 }}>
            <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Waiting for Admin Confirmation
          </span>
        );
      case 'Confirmed':
        return (
          <span className="badge badge-success">
            <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Reservation Confirmed
          </span>
        );
      case 'Active':
        return (
          <span className="badge badge-accent">
            <Car size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Active / On Trip
          </span>
        );
      case 'Completed':
        return (
          <span className="badge badge-success">
            Completed
          </span>
        );
      default:
        return <span className="badge badge-warning">{status}</span>;
    }
  };

  return (
    <div className="my-bookings-page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="bookings-header-row">
          <div>
            <h1 className="bookings-title">My Car Reservations & Trips</h1>
            <p className="bookings-subtitle">
              Track your reservation confirmation status in real-time, view invoice receipts, or cancel your booking anytime.
            </p>
          </div>

          <Link to="/cars" className="btn btn-primary btn-sm">
            <Car size={16} />
            <span>Book New Car</span>
          </Link>
        </div>

        {cancelToast && (
          <div className="alert-success animate-fade-in" style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#ef4444',
            fontWeight: 600
          }}>
            <XCircle size={18} />
            <span>{cancelToast}</span>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="bookings-tabs-bar">
          {['All', 'Pending', 'Confirmed', 'Active', 'Completed'].map((tab) => {
            const count = userBookings.filter(b => {
              if (tab === 'All') return true;
              if (tab === 'Pending') return b.status === 'Pending';
              if (tab === 'Confirmed') return b.status === 'Confirmed';
              if (tab === 'Active') return b.status === 'Active';
              if (tab === 'Completed') return b.status === 'Completed';
              return false;
            }).length;

            const tabLabels = {
              All: 'All',
              Pending: 'Waiting Approval',
              Confirmed: 'Confirmed',
              Active: 'On Trip',
              Completed: 'Completed',
            };

            return (
              <button
                key={tab}
                className={`booking-tab-btn ${activeTab === tab ? 'active-booking-tab' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tabLabels[tab]} <span className="tab-count-badge">{count}</span>
              </button>
            );
          })}
        </div>


        {/* Bookings List / Empty State */}
        {filteredBookings.length > 0 ? (
          <div className="bookings-cards-list">
            {filteredBookings.map((b) => (
              <div key={b.id} className="booking-item-card glass-card">
                {/* Left: Car Media */}
                <div className="booking-card-media">
                  <img src={b.image} alt={b.carName} className="booking-card-img" />
                  <div className="booking-status-wrapper" style={{ marginTop: '8px' }}>
                    {getStatusBadge(b.status)}
                  </div>
                </div>

                {/* Center: Trip Details */}
                <div className="booking-card-details">
                  <div className="booking-card-top">
                    <span className="booking-id-tag">ID: {b.id}</span>
                    <span className="booking-date-tag">Booked on {b.bookingDate}</span>
                  </div>

                  <h3 className="booking-car-name">{b.carName}</h3>

                  {b.status === 'Pending' && (
                    <div style={{
                      background: 'rgba(234, 179, 8, 0.1)',
                      border: '1px solid rgba(234, 179, 8, 0.3)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      marginBottom: '12px',
                      fontSize: '0.82rem',
                      color: 'var(--color-text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Clock size={15} style={{ color: '#ca8a04', flexShrink: 0 }} />
                      <span><strong>Waiting for Admin Approval:</strong> The admin team is currently verifying vehicle availability and dispatch. You will see "Confirmed" once approved.</span>
                    </div>
                  )}

                  {b.status === 'Confirmed' && (
                    <div style={{
                      background: 'rgba(22, 163, 74, 0.1)',
                      border: '1px solid rgba(22, 163, 74, 0.3)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      marginBottom: '12px',
                      fontSize: '0.82rem',
                      color: 'var(--color-text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <ShieldCheck size={15} style={{ color: '#16A34A', flexShrink: 0 }} />
                      <span><strong>Reservation Confirmed:</strong> Your booking is approved by Admin and ready for vehicle pickup/delivery.</span>
                    </div>
                  )}

                  <div className="booking-route-grid">
                    <div className="route-node">
                      <span className="route-label">Pick-up Location & Date</span>
                      <p className="route-location"><MapPin size={13} className="text-accent" /> {b.pickupLocation}</p>
                      <p className="route-time"><Calendar size={13} /> {b.pickupDate} ({b.pickupTime})</p>
                    </div>

                    <div className="route-divider" />

                    <div className="route-node">
                      <span className="route-label">Drop-off Location & Date</span>
                      <p className="route-location"><MapPin size={13} className="text-accent" /> {b.dropoffLocation}</p>
                      <p className="route-time"><Calendar size={13} /> {b.dropoffDate} ({b.dropoffTime})</p>
                    </div>
                  </div>
                </div>

                {/* Right: Pricing & Actions */}
                <div className="booking-card-actions-col">
                  <div className="booking-price-box">
                    <span className="price-box-label">Total Amount</span>
                    <h4 className="price-box-val">₹{b.totalAmount.toLocaleString('en-IN')}</h4>
                    <span className="deposit-sub-text">Deposit: ₹{b.deposit.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="card-buttons-group">
                    <button 
                      onClick={() => setSelectedBooking(b)} 
                      className="btn btn-secondary btn-sm w-100"
                    >
                      <FileText size={15} />
                      <span>View Details</span>
                    </button>

                    {(b.status === 'Pending' || b.status === 'Confirmed') && (
                      <button 
                        onClick={() => setCancelModalBooking(b)} 
                        className="btn btn-outline-danger btn-sm w-100 cancel-trigger-btn"
                      >
                        <XCircle size={15} />
                        <span>Cancel Reservation</span>
                      </button>
                    )}

                    {b.status === 'Completed' && (
                      <button 
                        onClick={() => window.print()} 
                        className="btn btn-secondary btn-sm w-100"
                      >
                        <Download size={15} />
                        <span>Receipt</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bookings-empty-state glass-card">
            <Car size={48} className="text-accent" />
            <h3>No {activeTab !== 'All' ? activeTab : ''} Reservations Found</h3>
            <p>You have no bookings under this status right now.</p>
            <Link to="/cars" className="btn btn-primary">
              <span>Browse Fleet & Reserve</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* ================= DETAILS MODAL ================= */}
      {selectedBooking && (
        <div className="booking-modal-backdrop" onClick={() => setSelectedBooking(null)}>
          <div className="booking-modal-card glass-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="receipt-booking-id">Reservation Details</span>
                <h3 className="modal-title">{selectedBooking.carName}</h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="close-modal-btn">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-car-preview">
                <img src={selectedBooking.image} alt={selectedBooking.carName} className="modal-car-img" />
                <div>
                  <div style={{ marginBottom: '6px' }}>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                  <h4 className="modal-ref-id">Reference: {selectedBooking.id}</h4>
                  <p className="modal-pay-mode">Payment: {selectedBooking.paymentMethod}</p>
                </div>
              </div>

              <hr className="modal-divider" />

              <div className="modal-info-grid">
                <div>
                  <span className="info-label">Pick-up Date & Time</span>
                  <p className="info-val">{selectedBooking.pickupDate} at {selectedBooking.pickupTime}</p>
                  <p className="info-sub">{selectedBooking.pickupLocation}</p>
                </div>
                <div>
                  <span className="info-label">Drop-off Date & Time</span>
                  <p className="info-val">{selectedBooking.dropoffDate} at {selectedBooking.dropoffTime}</p>
                  <p className="info-sub">{selectedBooking.dropoffLocation}</p>
                </div>
                <div>
                  <span className="info-label">Primary Driver</span>
                  <p className="info-val">{selectedBooking.driverName}</p>
                  <p className="info-sub">{selectedBooking.driverPhone}</p>
                </div>
                <div>
                  <span className="info-label">Driver License</span>
                  <p className="info-val">{selectedBooking.drivingLicense || 'DL-VERIFIED'}</p>
                </div>
              </div>

              <hr className="modal-divider" />

              {/* Cost Summary */}
              <div className="modal-cost-breakdown">
                <div className="modal-cost-row">
                  <span>Vehicle Daily Subtotal</span>
                  <span>₹{selectedBooking.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="modal-cost-row">
                  <span>GST Taxes</span>
                  <span>₹{selectedBooking.taxes.toLocaleString('en-IN')}</span>
                </div>
                <div className="modal-cost-row text-accent">
                  <strong>Total Payable</strong>
                  <strong>₹{selectedBooking.totalAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="modal-cost-row text-info">
                  <span>Security Deposit (Refundable upon return)</span>
                  <span>₹{selectedBooking.deposit.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => window.print()} className="btn btn-secondary">
                <Download size={16} /> Print Receipt
              </button>
              {(selectedBooking.status === 'Pending' || selectedBooking.status === 'Confirmed') && (
                <button 
                  onClick={() => {
                    const b = selectedBooking;
                    setSelectedBooking(null);
                    setCancelModalBooking(b);
                  }} 
                  className="btn btn-outline-danger"
                >
                  <XCircle size={16} /> Cancel Reservation
                </button>
              )}
              <button onClick={() => setSelectedBooking(null)} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CANCELLATION CONFIRMATION MODAL ================= */}
      {cancelModalBooking && (
        <div className="booking-modal-backdrop" onClick={() => setCancelModalBooking(null)}>
          <div className="cancel-confirm-modal glass-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="cancel-warn-icon">
              <AlertTriangle size={36} />
            </div>
            <h3>Cancel Reservation?</h3>
            <p>
              Are you sure you want to cancel booking <strong>{cancelModalBooking.id}</strong> ({cancelModalBooking.carName})?
            </p>
            <p className="refund-notice-text">
              100% full refund of <strong>₹{cancelModalBooking.totalAmount.toLocaleString('en-IN')}</strong> will be credited back to your original payment method within 24-48 hours.
            </p>

            <div className="cancel-modal-actions">
              <button onClick={() => setCancelModalBooking(null)} className="btn btn-secondary">
                Keep Booking
              </button>
              <button onClick={handleConfirmCancel} className="btn btn-danger">
                Yes, Cancel Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default MyBookings;
