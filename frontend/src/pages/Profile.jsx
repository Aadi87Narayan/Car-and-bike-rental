import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Award, 
  Heart, 
  Calendar, 
  Save, 
  LogOut, 
  CheckCircle2, 
  Car,
  Settings,
  FileText,
  CreditCard,
  Trash2,
  AlertTriangle,
  X,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { cars } from '../data/cars';
import { CarCard } from '../components/CarCard/CarCard';
import './Profile.css';

export function Profile() {
  const { user, updateProfile, logout, deleteAccount } = useAuth();
  const { favorites, userBookings } = useBooking();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    drivingLicense: user?.drivingLicense || user?.drivingLicenseNumber || '',
    passportNumber: user?.passportNumber || ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Delete account modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : ''),
        email: user.email || '',
        phone: user.phone || '',
        drivingLicense: user.drivingLicense || user.drivingLicenseNumber || '',
        passportNumber: user.passportNumber || ''
      });
    }
  }, [user]);

  useEffect(() => {
    document.title = "DriveX | Driver Profile & Client Credentials";
    window.scrollTo(0, 0);
  }, []);

  const favoriteCars = cars.filter((c) => favorites.includes(c.id));

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      drivingLicenseNumber: formData.drivingLicense,
      passportNumber: formData.passportNumber
    });
    setEditMode(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteAccount(user?.id || user?._id);
      setIsDeleteModalOpen(false);
      navigate('/login', { replace: true });
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="profile-page-wrapper">
      <div className="container">
        {/* Profile Hero Header */}
        <div className="profile-header-card glass-card">
          <div className="profile-identity-row">
            <div className="avatar-wrapper">
              <img 
                src={user?.profileImage || user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.email || 'User')}`} 
                alt={user?.name} 
                className="profile-main-avatar" 
              />
              <span className="avatar-verified-dot" title="Verified Member">✓</span>
            </div>

            <div className="profile-title-col">
              <div className="tier-tag-row">
                <span className="profile-tier-badge">
                  <Award size={13} /> {user?.membershipTier || (user?.role === 'admin' ? 'Executive Admin' : 'Verified Member')}
                </span>
                <span className="verified-pill">
                  <ShieldCheck size={13} /> DL Verified
                </span>
                {user?.passportNumber && (
                  <span className="verified-pill">
                    <FileText size={13} /> Passport Verified
                  </span>
                )}
              </div>
              <h1 className="profile-user-name">{user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Verified Driver'}</h1>
              <p className="profile-joined-text">Member since {user?.joinedDate || '2025'}</p>
            </div>

            <div className="profile-quick-actions">
              <button 
                onClick={() => setEditMode(!editMode)} 
                className="btn btn-secondary btn-sm"
              >
                <Settings size={15} />
                <span>{editMode ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Client Credentials & Contact Info Card */}
          <div className="profile-credentials-bar" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.2rem',
            padding: '1.2rem 1.5rem',
            background: 'rgba(8, 46, 37, 0.05)',
            borderRadius: '16px',
            marginTop: '1.5rem',
            border: '1px solid rgba(157, 124, 73, 0.2)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>Email Address</span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--color-text)' }}>{user?.email || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>Mobile Number</span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--color-text)' }}>{user?.phone || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>Driving License</span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--color-accent, #9D7C49)' }}>{user?.drivingLicense || user?.drivingLicenseNumber || 'DL-042026-ACTIVE'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>Passport Number</span>
              <strong style={{ fontSize: '0.92rem', color: user?.passportNumber ? 'var(--color-success, #16A34A)' : 'var(--color-text-muted)' }}>
                {user?.passportNumber || 'Not Linked (Optional)'}
              </strong>
            </div>
          </div>

          {/* Stats Bar (Calculated strictly from user's isolated bookings & wishlist) */}
          <div className="profile-stats-bar" style={{ marginTop: '1.5rem' }}>
            <div className="profile-stat-box">
              <span className="stat-label">My Reservations</span>
              <h3 className="stat-val">{userBookings.length}</h3>
            </div>
            <div className="stat-divider" />
            <div className="profile-stat-box">
              <span className="stat-label">Total Distance Driven</span>
              <h3 className="stat-val">{user?.kilometersDriven || (userBookings.length * 280)} KM</h3>
            </div>
            <div className="stat-divider" />
            <div className="profile-stat-box">
              <span className="stat-label">Saved Wishlist</span>
              <h3 className="stat-val">{favorites.length}</h3>
            </div>
            <div className="stat-divider" />
            <div className="profile-stat-box">
              <span className="stat-label">Rewards Earned</span>
              <h3 className="stat-val text-accent">₹{userBookings.length > 0 ? (userBookings.length * 850) : 500}</h3>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        {editMode && (
          <div className="profile-edit-section glass-card animate-fade-in">
            <h3 className="edit-section-title">Update Client & Identity Credentials</h3>
            <form onSubmit={handleSave} className="profile-edit-form">
              <div className="edit-form-grid">
                <div className="booking-input-group">
                  <label className="booking-label">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="booking-input"
                    required
                  />
                </div>
                <div className="booking-input-group">
                  <label className="booking-label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="booking-input"
                    required
                  />
                </div>
                <div className="booking-input-group">
                  <label className="booking-label">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="booking-input"
                    required
                  />
                </div>
                <div className="booking-input-group">
                  <label className="booking-label">Driving License Number</label>
                  <input
                    type="text"
                    value={formData.drivingLicense}
                    onChange={(e) => setFormData({ ...formData, drivingLicense: e.target.value })}
                    className="booking-input"
                    required
                  />
                </div>
                <div className="booking-input-group">
                  <label className="booking-label">Passport Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.passportNumber}
                    onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                    className="booking-input"
                    placeholder="e.g. Z3498210"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-sm save-changes-btn" style={{ marginTop: '1rem' }}>
                <Save size={15} /> Save Changes
              </button>
            </form>
          </div>
        )}

        {saveSuccess && (
          <div className="profile-save-alert animate-fade-in">
            <CheckCircle2 size={16} /> Profile details saved successfully!
          </div>
        )}

        {/* Saved Cars / Wishlist Section (User-Isolated) */}
        <section id="saved" className="saved-cars-section">
          <div className="saved-header-row">
            <div>
              <h2 className="saved-section-title">
                <Heart size={20} className="text-accent" />
                <span>Saved Wishlist ({favoriteCars.length})</span>
              </h2>
              <p className="saved-section-desc">Personal vehicles saved to your account for upcoming road trips and events.</p>
            </div>
            <Link to="/cars" className="btn btn-secondary btn-sm">Browse More Cars</Link>
          </div>

          {favoriteCars.length > 0 ? (
            <div className="saved-cars-grid">
              {favoriteCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="empty-wishlist-box glass-card">
              <Car size={36} className="text-accent" />
              <h3>Your Personal Wishlist is Empty</h3>
              <p>Click the heart icon on any vehicle in the fleet catalog to save it directly to your personal account.</p>
              <Link to="/cars" className="btn btn-primary btn-sm">Explore Fleet</Link>
            </div>
          )}
        </section>

        {/* Account Danger Zone (Account Deletion) — hidden for Master Admin */}
        {user?.id !== 'usr-admin-primary' && user?.email?.toLowerCase() !== 'admin123@gmail.com' && (
          <section className="profile-danger-zone glass-card">
            <div className="danger-zone-header">
              <div className="danger-icon-badge">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="danger-zone-title">Account Security & Permanent Deletion</h3>
                <p className="danger-zone-desc">
                  Permanently remove your DriveX member profile, saved vehicles, reservation records, and authentication credentials.
                </p>
              </div>
            </div>

            <div className="danger-action-row">
              <p className="danger-warning-text">
                Once deleted, your account cannot be recovered and all personal data will be wiped immediately.
              </p>
              <button 
                onClick={() => setIsDeleteModalOpen(true)} 
                className="btn btn-outline-danger btn-sm delete-acc-btn"
              >
                <Trash2 size={15} /> Delete My Account
              </button>
            </div>
          </section>
        )}


        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="modal-backdrop-custom animate-fade-in">
            <div className="danger-modal-card glass-card animate-scale-up">
              <div className="danger-modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="danger-icon-circle">
                    <Trash2 size={20} />
                  </div>
                  <h3>Delete Account Permanently?</h3>
                </div>
                <button 
                  onClick={() => { setIsDeleteModalOpen(false); setDeleteError(''); }} 
                  className="modal-close-btn"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="danger-modal-body">
                {deleteError && (
                  <div className="auth-error-banner" style={{ marginBottom: '1rem' }}>
                    <AlertCircle size={15} /> {deleteError}
                  </div>
                )}

                <p style={{ fontSize: '0.92rem', color: 'var(--color-text)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  You are about to delete the account for <strong>{user?.email}</strong>. This will permanently remove:
                </p>

                <ul className="danger-modal-list">
                  <li>Your user login credentials and identity records</li>
                  <li>All your active and previous car bookings</li>
                  <li>Your personal saved wishlist vehicles</li>
                  <li>Associated driver profile details and driving license metadata</li>
                </ul>

                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '1rem', marginBottom: '0.5rem' }}>
                  Type <strong style={{ color: '#ef4444' }}>DELETE</strong> below to confirm:
                </p>

                <input 
                  type="text" 
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="booking-input"
                  style={{ borderColor: deleteConfirmText === 'DELETE' ? '#ef4444' : undefined }}
                />
              </div>

              <div className="danger-modal-footer">
                <button 
                  onClick={() => { setIsDeleteModalOpen(false); setDeleteError(''); }} 
                  className="btn btn-secondary btn-sm"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteAccount} 
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                  className="btn btn-danger btn-sm"
                  style={{ background: '#ef4444', borderColor: '#ef4444', color: '#fff' }}
                >
                  {isDeleting ? 'Deleting Account...' : 'Permanently Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Profile;
