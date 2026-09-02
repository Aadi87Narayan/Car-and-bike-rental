import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Calendar, 
  DollarSign, 
  Plus, 
  Trash2, 
  TrendingUp, 
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  UserPlus,
  KeyRound,
  X,
  Save
} from 'lucide-react';
import { cars as initialCars } from '../data/cars';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './AdminDashboard.css';

export function AdminDashboard() {
  const { bookings, updateBookingStatus, confirmBooking, cancelBooking } = useBooking();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'fleet', 'bookings', 'clients', 'analytics'
  const [clientsList, setClientsList] = useState([]);
  const [clientFilter, setClientFilter] = useState('All'); // 'All', 'Admins', 'Clients'
  
  const [fleetList, setFleetList] = useState(() => {
    try {
      const stored = localStorage.getItem('drivex_fleet');
      return stored ? JSON.parse(stored) : initialCars;
    } catch (e) {
      return initialCars;
    }
  });

  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');
  const [adminErrorMsg, setAdminErrorMsg] = useState('');

  const [newAdminData, setNewAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    drivingLicense: 'DL-ADMIN-AUTH'
  });

  const [newCarData, setNewCarData] = useState({
    name: '',
    brand: '',
    category: 'SUV',
    pricePerDay: 4500,
    securityDeposit: 6000,
    location: 'Bhilai',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    rating: 4.9,
    reviewsCount: 1,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    description: 'New premium addition to DriveX commercial fleet.',
    features: ['Automatic Transmission', 'Touchscreen Infotainment', 'High Ground Clearance']
  });

  const fetchClients = async () => {
    try {
      const clients = await api.getClients();
      setClientsList(clients || []);
    } catch (e) {}
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    document.title = "DriveX | Operations & Admin Command Center";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    localStorage.setItem('drivex_fleet', JSON.stringify(fleetList));
  }, [fleetList]);

  // Analytics Metrics calculations
  const totalRevenue = bookings.reduce((sum, b) => (b.status !== 'Cancelled' ? sum + b.totalAmount : sum), 425000);
  const pendingBookings = bookings.filter((b) => b.status === 'Pending');
  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Active');

  const handleAddCar = (e) => {
    e.preventDefault();
    const createdCar = {
      ...newCarData,
      id: `car-${Math.floor(100 + Math.random() * 900)}`,
      available: true,
      availableLocations: [newCarData.location, 'Raipur', 'Delhi'],
      specs: {
        power: '220 HP',
        acceleration: '0-100 in 7.5s',
        topSpeed: '220 km/h',
        mileage: '15 km/l',
        luggage: '480 Litres',
        drivetrain: 'Front-Wheel Drive'
      },
      colorOptions: [
        { name: 'Obsidian Black', hex: '#0e1114' },
        { name: 'Pearl White', hex: '#f0f3f6' },
        { name: 'Apex Red', hex: '#d11a2a' }
      ]
    };

    setFleetList([createdCar, ...fleetList]);
    setIsAddCarModalOpen(false);
    setNewCarData({
      name: '',
      brand: '',
      category: 'SUV',
      pricePerDay: 4500,
      securityDeposit: 6000,
      location: 'Bhilai',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      rating: 4.9,
      reviewsCount: 1,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      description: 'New premium addition to DriveX commercial fleet.',
      features: ['Automatic Transmission', 'Touchscreen Infotainment', 'High Ground Clearance']
    });
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAdminErrorMsg('');
    try {
      await api.createAdmin(newAdminData);
      await fetchClients();
      setIsAddAdminModalOpen(false);
      setAdminSuccessMsg(`Administrator account for ${newAdminData.email} created successfully!`);
      setNewAdminData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        drivingLicense: 'DL-ADMIN-AUTH'
      });
      setTimeout(() => setAdminSuccessMsg(''), 4000);
    } catch (err) {
      setAdminErrorMsg(err.message || 'Failed to create administrator account.');
    }
  };

  const handleDeleteCar = (carId) => {
    if (window.confirm('Remove this vehicle from the active rental catalog?')) {
      setFleetList(fleetList.filter((c) => c.id !== carId));
    }
  };

  const toggleAvailability = (carId) => {
    setFleetList(
      fleetList.map((c) => (c.id === carId ? { ...c, available: !c.available } : c))
    );
  };

  const filteredClients = clientsList.filter(c => {
    if (clientFilter === 'All') return true;
    if (clientFilter === 'Admins') return c.role === 'admin' || c.membershipTier?.includes('Admin');
    if (clientFilter === 'Clients') return c.role !== 'admin' && !c.membershipTier?.includes('Admin');
    return true;
  });

  return (
    <div className="admin-page-wrapper">
      <div className="container">
        {/* Admin Header */}
        <div className="admin-header-row">
          <div>
            <div className="admin-badge">
              <ShieldAlert size={14} />
              <span>DriveX Enterprise Console • {user?.email || 'admin123@gmail.com'}</span>
            </div>
            <h1 className="admin-title">Operations & Fleet Command</h1>
          </div>

          <div className="admin-header-actions" style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsAddAdminModalOpen(true)} className="btn btn-secondary btn-sm">
              <UserPlus size={16} />
              <span>Add New Admin</span>
            </button>
            <button onClick={() => setIsAddCarModalOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {adminSuccessMsg && (
          <div className="alert-success animate-fade-in" style={{
            background: 'rgba(22, 163, 74, 0.15)',
            border: '1px solid rgba(22, 163, 74, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#16A34A',
            fontWeight: 600
          }}>
            <CheckCircle2 size={18} />
            <span>{adminSuccessMsg}</span>
          </div>
        )}

        {/* Dashboard Tab Navigation */}
        <div className="admin-tabs-nav">
          <button 
            className={`admin-tab-item ${activeTab === 'overview' ? 'active-admin-tab' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={16} />
            <span>Overview & Stats</span>
          </button>
          <button 
            className={`admin-tab-item ${activeTab === 'fleet' ? 'active-admin-tab' : ''}`}
            onClick={() => setActiveTab('fleet')}
          >
            <Car size={16} />
            <span>Fleet Inventory ({fleetList.length})</span>
          </button>
          <button 
            className={`admin-tab-item ${activeTab === 'bookings' ? 'active-admin-tab' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={16} />
            <span>
              Reservations ({bookings.length})
              {pendingBookings.length > 0 && (
                <span style={{ 
                  background: '#eab308', 
                  color: '#000', 
                  padding: '2px 7px', 
                  borderRadius: '10px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  marginLeft: '6px' 
                }}>
                  {pendingBookings.length} Pending
                </span>
              )}
            </span>
          </button>
          <button 
            className={`admin-tab-item ${activeTab === 'clients' ? 'active-admin-tab' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            <Users size={16} />
            <span>Clients & Admins ({clientsList.length})</span>
          </button>
          <button 
            className={`admin-tab-item ${activeTab === 'analytics' ? 'active-admin-tab' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp size={16} />
            <span>Revenue Analytics</span>
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="admin-content-flow animate-fade-in">
            {/* Top 4 KPI Metrics */}
            <div className="kpi-grid">
              <div className="kpi-card glass-card" style={pendingBookings.length > 0 ? { border: '1px solid rgba(234, 179, 8, 0.5)' } : {}}>
                <div className="kpi-icon-box" style={{ color: '#ca8a04' }}>
                  <Clock size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Pending Confirmation</span>
                  <h2 className="kpi-value" style={{ color: '#ca8a04' }}>{pendingBookings.length}</h2>
                  <span className="kpi-trend text-accent">
                    Action required to confirm reservations
                  </span>
                </div>
              </div>

              <div className="kpi-card glass-card">
                <div className="kpi-icon-box text-accent">
                  <Car size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Commercial Fleet</span>
                  <h2 className="kpi-value">{fleetList.length}</h2>
                  <span className="kpi-trend text-success">
                    <ArrowUpRight size={14} /> {fleetList.filter((c) => c.available).length} Available
                  </span>
                </div>
              </div>

              <div className="kpi-card glass-card">
                <div className="kpi-icon-box text-success">
                  <CheckCircle2 size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Confirmed & Active</span>
                  <h2 className="kpi-value">{confirmedBookings.length}</h2>
                  <span className="kpi-trend text-success">Approved Bookings</span>
                </div>
              </div>

              <div className="kpi-card glass-card">
                <div className="kpi-icon-box text-accent">
                  <DollarSign size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Gross Proceeds</span>
                  <h2 className="kpi-value">₹{totalRevenue.toLocaleString('en-IN')}</h2>
                  <span className="kpi-trend text-success">+18.4% this month</span>
                </div>
              </div>
            </div>

            {/* Pending Approvals Quick Panel (if any) */}
            {pendingBookings.length > 0 && (
              <div className="admin-section-card glass-card" style={{ border: '1px solid rgba(234, 179, 8, 0.4)' }}>
                <div className="card-header-row">
                  <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ca8a04' }}>
                      <Clock size={18} />
                      Pending Customer Reservations Awaiting Admin Confirmation
                    </h3>
                    <p className="card-subtitle">Confirm these bookings so customers can see "Reservation Confirmed" in their portal.</p>
                  </div>
                  <span className="badge badge-warning">{pendingBookings.length} Waiting</span>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Vehicle Requested</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Rental Schedule</th>
                        <th>Total Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingBookings.map((b) => (
                        <tr key={b.id}>
                          <td><span className="table-ref">{b.id}</span></td>
                          <td><strong>{b.carName}</strong></td>
                          <td>{b.driverName}</td>
                          <td>{b.driverPhone}</td>
                          <td>{b.pickupDate} → {b.dropoffDate}</td>
                          <td className="table-price">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button 
                                onClick={() => updateBookingStatus(b.id, 'Confirmed')} 
                                className="btn btn-primary btn-sm"
                                style={{ background: '#16A34A', borderColor: '#16A34A', padding: '5px 12px' }}
                              >
                                <CheckCircle2 size={14} />
                                <span>Confirm</span>
                              </button>
                              <button 
                                onClick={() => updateBookingStatus(b.id, 'Cancelled')} 
                                className="btn btn-outline-danger btn-sm"
                                style={{ padding: '5px 10px' }}
                              >
                                <XCircle size={14} />
                                <span>Decline</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: FLEET INVENTORY ================= */}
        {activeTab === 'fleet' && (
          <div className="admin-content-flow animate-fade-in">
            <div className="admin-section-card glass-card">
              <div className="card-header-row">
                <div>
                  <h3>Catalog Fleet Vehicles</h3>
                  <p className="card-subtitle">Manage availability, rental tiers, and vehicle specifications.</p>
                </div>
                <button onClick={() => setIsAddCarModalOpen(true)} className="btn btn-primary btn-sm">
                  <Plus size={15} /> Add Vehicle
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Category</th>
                      <th>Location Hub</th>
                      <th>Rate / Day</th>
                      <th>Deposit</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fleetList.map((car) => (
                      <tr key={car.id}>
                        <td>
                          <div className="table-car-cell">
                            <img src={car.image} alt={car.name} className="table-car-thumb" />
                            <div>
                              <strong>{car.name}</strong>
                              <span className="table-sub-brand">{car.brand}</span>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge badge-info">{car.category}</span></td>
                        <td>{car.location}</td>
                        <td className="table-price">₹{car.pricePerDay.toLocaleString('en-IN')}</td>
                        <td>₹{car.securityDeposit.toLocaleString('en-IN')}</td>
                        <td>
                          <button
                            onClick={() => toggleAvailability(car.id)}
                            className={`badge ${car.available ? 'badge-success' : 'badge-danger'} badge-toggle-btn`}
                          >
                            {car.available ? 'Available' : 'Unavailable'}
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteCar(car.id)}
                            className="btn-icon-action text-danger"
                            title="Remove from fleet"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: RESERVATIONS OPERATIONS ================= */}
        {activeTab === 'bookings' && (
          <div className="admin-content-flow animate-fade-in">
            <div className="admin-section-card glass-card">
              <div className="card-header-row">
                <div>
                  <h3>Reservation & Dispatch Management</h3>
                  <p className="card-subtitle">Confirm client reservations, track trip progression, or cancel bookings.</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Vehicle</th>
                      <th>Customer Details</th>
                      <th>Schedule</th>
                      <th>Total Amount</th>
                      <th>Current Status</th>
                      <th>Confirm / Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td><span className="table-ref">{b.id}</span></td>
                        <td><strong>{b.carName}</strong></td>
                        <td>
                          <div>
                            <strong>{b.driverName}</strong>
                            <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{b.driverPhone}</span>
                          </div>
                        </td>
                        <td>{b.pickupDate} to {b.dropoffDate}</td>
                        <td className="table-price">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                        <td>
                          {b.status === 'Pending' ? (
                            <span className="badge badge-warning" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#ca8a04', border: '1px solid rgba(234, 179, 8, 0.4)' }}>
                              <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                              Waiting Approval
                            </span>
                          ) : (
                            <span className={`badge ${b.status === 'Confirmed' ? 'badge-success' : b.status === 'Active' ? 'badge-accent' : b.status === 'Completed' ? 'badge-info' : 'badge-danger'}`}>
                              {b.status}
                            </span>
                          )}
                        </td>
                        <td>
                          {b.status === 'Pending' ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button 
                                onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                                className="btn btn-primary btn-sm"
                                style={{ background: '#16A34A', borderColor: '#16A34A', padding: '4px 10px', fontSize: '0.8rem' }}
                              >
                                <CheckCircle2 size={13} /> Confirm
                              </button>
                              <button 
                                onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                                className="btn btn-outline-danger btn-sm"
                                style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                              >
                                <XCircle size={13} /> Decline
                              </button>
                            </div>
                          ) : (
                            <select
                              value={b.status}
                              onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                              className="status-dropdown-select"
                            >
                              <option value="Pending">Pending Approval</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Active">Active / On Road</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: CLIENTS & ADMIN DIRECTORY ================= */}
        {activeTab === 'clients' && (
          <div className="admin-content-flow animate-fade-in">
            <div className="admin-section-card glass-card">
              <div className="card-header-row">
                <div>
                  <h3>Clients & Administrator Directory</h3>
                  <p className="card-subtitle">Verified client directory including Contact, Driving License, Passport, and Admin Privileges.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button onClick={() => setIsAddAdminModalOpen(true)} className="btn btn-primary btn-sm">
                    <UserPlus size={15} /> Add New Admin
                  </button>
                </div>
              </div>

              {/* Filter Sub-Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                {['All', 'Admins', 'Clients'].map((subTab) => (
                  <button
                    key={subTab}
                    onClick={() => setClientFilter(subTab)}
                    className={`btn btn-sm ${clientFilter === subTab ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.82rem', padding: '4px 12px' }}
                  >
                    {subTab} ({
                      subTab === 'All' ? clientsList.length :
                      subTab === 'Admins' ? clientsList.filter(c => c.role === 'admin' || c.membershipTier?.includes('Admin')).length :
                      clientsList.filter(c => c.role !== 'admin' && !c.membershipTier?.includes('Admin')).length
                    })
                  </button>
                ))}
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Account / Name</th>
                      <th>Email Address</th>
                      <th>Phone Number</th>
                      <th>Driving License</th>
                      <th>Passport Number</th>
                      <th>Role & Tier</th>
                      <th>Trips / Km</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => {
                      const isAdmin = client.role === 'admin' || client.membershipTier?.includes('Admin');
                      return (
                        <tr key={client.id} style={isAdmin ? { background: 'rgba(157, 124, 73, 0.05)' } : {}}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img 
                                src={client.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(client.email)}`} 
                                alt={client.name} 
                                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: isAdmin ? '2px solid #9D7C49' : '1px solid rgba(157, 124, 73, 0.3)' }} 
                              />
                              <div>
                                <strong>{client.name || `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'User'}</strong>
                                <span style={{ display: 'block', fontSize: '0.75rem', color: isAdmin ? '#9D7C49' : 'var(--color-text-muted)', fontWeight: 600 }}>
                                  {client.membershipTier || (isAdmin ? 'Executive Admin' : 'Member')}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Mail size={13} style={{ color: 'var(--color-text-muted)' }} />
                              <span>{client.email}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Phone size={13} style={{ color: 'var(--color-text-muted)' }} />
                              <span>{client.phone || 'N/A'}</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ 
                              fontFamily: 'monospace', 
                              fontSize: '0.85rem', 
                              background: 'rgba(8, 46, 37, 0.08)', 
                              padding: '4px 8px', 
                              borderRadius: '6px',
                              fontWeight: 600,
                              color: 'var(--color-accent, #9D7C49)',
                              border: '1px solid rgba(157, 124, 73, 0.2)'
                            }}>
                              {client.drivingLicenseNumber || client.drivingLicense || 'DL-PENDING'}
                            </span>
                          </td>
                          <td>
                            {client.passportNumber ? (
                              <span style={{ 
                                fontFamily: 'monospace', 
                                fontSize: '0.85rem', 
                                background: 'rgba(22, 163, 74, 0.1)', 
                                padding: '4px 8px', 
                                borderRadius: '6px',
                                fontWeight: 600,
                                color: '#16A34A',
                                border: '1px solid rgba(22, 163, 74, 0.2)'
                              }}>
                                <FileText size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                                {client.passportNumber}
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                Not Linked
                              </span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${isAdmin ? 'badge-accent' : 'badge-success'}`}>
                              {isAdmin ? '🛡️ Administrator' : 'Client'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                              {client.totalTrips || 0} trips ({client.kilometersDriven || 0} km)
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: REVENUE ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="admin-content-flow animate-fade-in">
            <div className="analytics-grid">
              {/* Category Breakdown Bar */}
              <div className="admin-section-card glass-card">
                <h3>Revenue by Fleet Category</h3>
                <p className="card-subtitle">Monthly percentage distribution of booking proceeds.</p>

                <div className="category-bars-list">
                  <div className="cat-bar-item">
                    <div className="cat-bar-labels">
                      <span>Luxury & Sports (4x4, Convertibles)</span>
                      <strong>₹2,45,000 (45%)</strong>
                    </div>
                    <div className="cat-bar-track">
                      <div className="cat-bar-fill" style={{ width: '45%', background: '#ff6b00' }} />
                    </div>
                  </div>

                  <div className="cat-bar-item">
                    <div className="cat-bar-labels">
                      <span>Executive SUVs (Fortuner, X5)</span>
                      <strong>₹1,60,000 (30%)</strong>
                    </div>
                    <div className="cat-bar-track">
                      <div className="cat-bar-fill" style={{ width: '30%', background: '#00d084' }} />
                    </div>
                  </div>

                  <div className="cat-bar-item">
                    <div className="cat-bar-labels">
                      <span>Premium Sedans (C-Class, A6, Verna)</span>
                      <strong>₹95,000 (18%)</strong>
                    </div>
                    <div className="cat-bar-track">
                      <div className="cat-bar-fill" style={{ width: '18%', background: '#2ed573' }} />
                    </div>
                  </div>

                  <div className="cat-bar-item">
                    <div className="cat-bar-labels">
                      <span>Economy Commuters (Swift, City Hybrid)</span>
                      <strong>₹38,000 (7%)</strong>
                    </div>
                    <div className="cat-bar-track">
                      <div className="cat-bar-fill" style={{ width: '7%', background: '#3742fa' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Operations Health */}
              <div className="admin-section-card glass-card">
                <h3>Fleet Health & Utilization</h3>
                <p className="card-subtitle">Telemetry status across all hub depots.</p>

                <div className="health-stats-list">
                  <div className="health-stat-row">
                    <span>Fleet Utilization Rate</span>
                    <strong className="text-success">84.2% Peak</strong>
                  </div>
                  <div className="health-stat-row">
                    <span>Average Rental Duration</span>
                    <strong>3.4 Days</strong>
                  </div>
                  <div className="health-stat-row">
                    <span>Damage / Incident Rate</span>
                    <strong className="text-success">&lt; 0.2%</strong>
                  </div>
                  <div className="health-stat-row">
                    <span>Active Roadside Dispatches</span>
                    <strong>0 Active Alerts</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= ADD NEW ADMIN MODAL ================= */}
      {isAddAdminModalOpen && (
        <div className="booking-modal-backdrop" onClick={() => setIsAddAdminModalOpen(false)}>
          <div className="admin-add-modal glass-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={22} className="text-accent" />
                <h3>Add New Administrator</h3>
              </div>
              <button onClick={() => setIsAddAdminModalOpen(false)} className="close-modal-btn">
                <X size={20} />
              </button>
            </div>

            {adminErrorMsg && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '1rem',
                color: '#ef4444',
                fontSize: '0.88rem'
              }}>
                {adminErrorMsg}
              </div>
            )}

            <form onSubmit={handleAddAdmin} className="modal-body">
              <div className="edit-form-grid">
                <div className="booking-input-group">
                  <label className="booking-label">First Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Arjun"
                    value={newAdminData.firstName}
                    onChange={(e) => setNewAdminData({ ...newAdminData, firstName: e.target.value })}
                    className="booking-input"
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label className="booking-label">Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Verma"
                    value={newAdminData.lastName}
                    onChange={(e) => setNewAdminData({ ...newAdminData, lastName: e.target.value })}
                    className="booking-input"
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label className="booking-label">Admin Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. admin.arjun@gmail.com"
                    value={newAdminData.email}
                    onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                    className="booking-input"
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label className="booking-label">Admin Password</label>
                  <input
                    type="password"
                    placeholder="Enter secure admin password"
                    value={newAdminData.password}
                    onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                    className="booking-input"
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label className="booking-label">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={newAdminData.phone}
                    onChange={(e) => setNewAdminData({ ...newAdminData, phone: e.target.value })}
                    className="booking-input"
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label className="booking-label">Assigned Role</label>
                  <input
                    type="text"
                    value="Executive Administrator"
                    disabled
                    className="booking-input"
                    style={{ opacity: 0.8, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsAddAdminModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <ShieldCheck size={16} /> Create Administrator Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD CAR MODAL ================= */}
      {isAddCarModalOpen && (
        <div className="booking-modal-backdrop" onClick={() => setIsAddCarModalOpen(false)}>
          <div className="admin-add-modal glass-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Vehicle to Fleet</h3>
              <button onClick={() => setIsAddCarModalOpen(false)} className="close-modal-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCar} className="modal-body">
              <div className="edit-form-grid">
                <div className="booking-input-group">
                  <label className="booking-label">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. BMW, Audi, Mercedes"
                    value={newCarData.brand}
                    onChange={(e) => setNewCarData({ ...newCarData, brand: e.target.value })}
                    className="booking-input"
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label className="booking-label">Model Name</label>
                  <input
                    type="text"
                    placeholder="e.g. M3 Competition"
                    value={newCarData.name}
                    onChange={(e) => setNewCarData({ ...newCarData, name: e.target.value })}
                    className="booking-input"
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label className="booking-label">Category</label>
                  <select
                    value={newCarData.category}
                    onChange={(e) => setNewCarData({ ...newCarData, category: e.target.value })}
                    className="booking-select"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Economy">Economy</option>
                  </select>
                </div>

                <div className="booking-input-group">
                  <label className="booking-label">Daily Price (₹ INR)</label>
                  <input
                    type="number"
                    value={newCarData.pricePerDay}
                    onChange={(e) => setNewCarData({ ...newCarData, pricePerDay: Number(e.target.value) })}
                    className="booking-input"
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label className="booking-label">Transmission</label>
                  <select
                    value={newCarData.transmission}
                    onChange={(e) => setNewCarData({ ...newCarData, transmission: e.target.value })}
                    className="booking-select"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div className="booking-input-group">
                  <label className="booking-label">Fuel Type</label>
                  <select
                    value={newCarData.fuelType}
                    onChange={(e) => setNewCarData({ ...newCarData, fuelType: e.target.value })}
                    className="booking-select"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="booking-input-group">
                  <label className="booking-label">Base Location Hub</label>
                  <input
                    type="text"
                    value={newCarData.location}
                    onChange={(e) => setNewCarData({ ...newCarData, location: e.target.value })}
                    className="booking-input"
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label className="booking-label">Vehicle Image URL</label>
                  <input
                    type="url"
                    value={newCarData.image}
                    onChange={(e) => setNewCarData({ ...newCarData, image: e.target.value })}
                    className="booking-input"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsAddCarModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Add to Live Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminDashboard;
