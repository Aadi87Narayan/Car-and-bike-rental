import { cars as initialCars } from '../data/cars';
import { categories } from '../data/categories';
import { testimonials } from '../data/testimonials';

// Base API URL configuration
const USE_REAL_BACKEND = import.meta.env.VITE_USE_REAL_BACKEND === 'true';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Token helpers
const getAccessToken = () => localStorage.getItem('drivex_access_token');
const setAccessToken = (token) => {
  if (token) localStorage.setItem('drivex_access_token', token);
  else localStorage.removeItem('drivex_access_token');
};

// Generic Fetch Wrapper with Authorization & Error handling
async function request(endpoint, options = {}) {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers,
    credentials: 'include'
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data.error?.message || data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.code = data.error?.code;
    error.details = data.error?.details;
    throw error;
  }

  return data;
}

// Helper to seed/retrieve persistent users db in LocalStorage mode
function getLocalUsersDb() {
  try {
    const raw = localStorage.getItem('drivex_users_db');
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  // Initial seed accounts with full client details (Email, Phone, DL, Passport)
  const initialUsers = [
    {
      id: "usr-admin-primary",
      firstName: "DriveX",
      lastName: "MasterAdmin",
      name: "DriveX MasterAdmin",
      email: "admin123@gmail.com",
      password: "admin@123",
      phone: "+91 98765 00123",
      role: "admin",
      isVerified: true,
      profileImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
      drivingLicense: "DL-ADMIN-001",
      drivingLicenseNumber: "DL-ADMIN-001",
      passportNumber: "A1000001",
      membershipTier: "Executive Admin",
      totalTrips: 120,
      kilometersDriven: 24000,
      joinedDate: "January 2024"
    },
    {
      id: "usr-admin",
      firstName: "DriveX",
      lastName: "SuperAdmin",
      name: "DriveX SuperAdmin",
      email: "admin@drivex.in",
      password: "admin",
      phone: "+91 98765 43210",
      role: "admin",
      isVerified: true,
      profileImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
      drivingLicense: "DL-ADMIN-002",
      drivingLicenseNumber: "DL-ADMIN-002",
      passportNumber: "A1000002",
      membershipTier: "Executive Admin",
      totalTrips: 99,
      kilometersDriven: 18500,
      joinedDate: "January 2024"
    },
    {
      id: "usr-8891",
      firstName: "Vikram",
      lastName: "Malhotra",
      name: "Vikram Malhotra",
      email: "vikram.drivex@example.com",
      password: "password",
      phone: "+91 98765 12340",
      role: "user",
      isVerified: true,
      profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      drivingLicense: "DL-042019008921",
      drivingLicenseNumber: "DL-042019008921",
      passportNumber: "Z3498210",
      membershipTier: "Platinum Driver",
      totalTrips: 14,
      kilometersDriven: 3420,
      joinedDate: "January 2025"
    },
    {
      id: "usr-8892",
      firstName: "Ananya",
      lastName: "Sen",
      name: "Ananya Sen",
      email: "ananya.sen@example.com",
      password: "password123",
      phone: "+91 98123 45678",
      role: "user",
      isVerified: true,
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      drivingLicense: "DL-072021004512",
      drivingLicenseNumber: "DL-072021004512",
      passportNumber: "P9823411",
      membershipTier: "Gold Member",
      totalTrips: 6,
      kilometersDriven: 1280,
      joinedDate: "February 2025"
    },
    {
      id: "usr-8893",
      firstName: "Rahul",
      lastName: "Sharma",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      password: "password123",
      phone: "+91 97234 56789",
      role: "user",
      isVerified: true,
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      drivingLicense: "DL-012018009843",
      drivingLicenseNumber: "DL-012018009843",
      passportNumber: "V7612984",
      membershipTier: "Diamond Member",
      totalTrips: 22,
      kilometersDriven: 6890,
      joinedDate: "March 2024"
    },
    {
      id: "usr-8894",
      firstName: "Priya",
      lastName: "Nair",
      name: "Priya Nair",
      email: "priya.nair@example.com",
      password: "password123",
      phone: "+91 99345 67890",
      role: "user",
      isVerified: true,
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      drivingLicense: "DL-092022003189",
      drivingLicenseNumber: "DL-092022003189",
      passportNumber: "T5543120",
      membershipTier: "Gold Member",
      totalTrips: 4,
      kilometersDriven: 850,
      joinedDate: "April 2025"
    },
    {
      id: "usr-8895",
      firstName: "Rohan",
      lastName: "Mehta",
      name: "Rohan Mehta",
      email: "rohan.mehta@example.com",
      password: "password123",
      phone: "+91 98456 78901",
      role: "user",
      isVerified: true,
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      drivingLicense: "DL-032020007621",
      drivingLicenseNumber: "DL-032020007621",
      passportNumber: "N8892145",
      membershipTier: "Platinum Driver",
      totalTrips: 11,
      kilometersDriven: 2900,
      joinedDate: "May 2024"
    }
  ];

  localStorage.setItem('drivex_users_db', JSON.stringify(initialUsers));
  return initialUsers;
}

export const api = {
  // ==========================================
  // 🔐 AUTHENTICATION & CLIENT DIRECTORY
  // ==========================================
  async login(email, password) {
    if (USE_REAL_BACKEND) {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.data?.accessToken) setAccessToken(res.data.accessToken);
      const user = res.data?.user;
      if (user) {
        localStorage.setItem('drivex_user', JSON.stringify(user));
        localStorage.removeItem('drivex_logged_out');
      }
      return user;
    }

    // Local Verification Mode with credential checking
    const usersDb = getLocalUsersDb();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      throw new Error('Please enter both email and password.');
    }

    const matchedUser = usersDb.find(u => u.email.toLowerCase() === cleanEmail);

    if (!matchedUser) {
      throw new Error('No account found with this email. Please check your credentials or create an account.');
    }

    if (matchedUser.password && matchedUser.password !== cleanPass) {
      throw new Error('Invalid password. Please enter the correct password.');
    }

    // Strip password from returned user object
    const { password: _, ...safeUser } = matchedUser;

    localStorage.setItem('drivex_user', JSON.stringify(safeUser));
    localStorage.removeItem('drivex_logged_out');
    return safeUser;
  },

  async register(formData) {
    if (USE_REAL_BACKEND) {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.data?.accessToken) setAccessToken(res.data.accessToken);
      const user = res.data?.user;
      if (user) {
        localStorage.setItem('drivex_user', JSON.stringify(user));
        localStorage.removeItem('drivex_logged_out');
      }
      return user;
    }

    // Local Registration Mode with credential persistence
    const usersDb = getLocalUsersDb();
    const cleanEmail = (formData.email || '').trim().toLowerCase();

    if (!cleanEmail) {
      throw new Error('Email address is required.');
    }

    if (usersDb.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const isAdmin = cleanEmail.includes('admin');
    const newUserRecord = {
      id: `usr-${Date.now().toString().slice(-5)}`,
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.name || "DriveX Member",
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone || "+91 98765 00000",
      drivingLicense: formData.drivingLicense || formData.drivingLicenseNumber || "DL-042026-ACTIVE",
      drivingLicenseNumber: formData.drivingLicense || formData.drivingLicenseNumber || "DL-042026-ACTIVE",
      passportNumber: formData.passportNumber || formData.passport || "",
      role: isAdmin ? 'admin' : 'user',
      isVerified: true,
      profileImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.email)}`,
      membershipTier: "Gold Member",
      totalTrips: 0,
      kilometersDriven: 0,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    usersDb.push(newUserRecord);
    localStorage.setItem('drivex_users_db', JSON.stringify(usersDb));

    const { password: _, ...safeUser } = newUserRecord;
    localStorage.setItem('drivex_user', JSON.stringify(safeUser));
    localStorage.removeItem('drivex_logged_out');
    return safeUser;
  },

  async createAdmin(adminData) {
    const usersDb = getLocalUsersDb();
    const cleanEmail = (adminData.email || '').trim().toLowerCase();

    if (!cleanEmail || !adminData.password) {
      throw new Error('Email and password are required for admin registration.');
    }

    if (usersDb.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const newAdminRecord = {
      id: `usr-admin-${Date.now().toString().slice(-4)}`,
      firstName: adminData.firstName || '',
      lastName: adminData.lastName || '',
      name: `${adminData.firstName || ''} ${adminData.lastName || ''}`.trim() || adminData.name || "DriveX Admin",
      email: cleanEmail,
      password: adminData.password,
      phone: adminData.phone || "+91 98765 00000",
      drivingLicense: adminData.drivingLicense || "DL-ADMIN-AUTHORIZED",
      drivingLicenseNumber: adminData.drivingLicense || "DL-ADMIN-AUTHORIZED",
      passportNumber: adminData.passportNumber || "A-ADMIN",
      role: 'admin',
      isVerified: true,
      profileImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      membershipTier: "Executive Admin",
      totalTrips: 0,
      kilometersDriven: 0,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    usersDb.push(newAdminRecord);
    localStorage.setItem('drivex_users_db', JSON.stringify(usersDb));
    const { password: _, ...safeAdmin } = newAdminRecord;
    return safeAdmin;
  },

  async getClients(options = { includePasswords: true }) {
    if (USE_REAL_BACKEND) {
      try {
        const res = await request('/admin/users');
        return res.data?.users || [];
      } catch (e) {
        // Fallback to local db
      }
    }
    const db = getLocalUsersDb();
    if (options.includePasswords) {
      return db;
    }
    return db.map(({ password: _, ...safeUser }) => safeUser);
  },

  async getAllUsersWithCredentials() {
    return getLocalUsersDb();
  },

  async deleteUser(userId) {
    if (!userId) throw new Error('User ID is required for deletion.');

    // 🛡️ Master admin is permanently protected — cannot be deleted by anyone
    const MASTER_ADMIN_IDS = ['usr-admin-primary'];
    const MASTER_ADMIN_EMAILS = ['admin123@gmail.com'];
    const usersDbCheck = getLocalUsersDb();
    const targetCheck = usersDbCheck.find(u => u.id === userId || u._id === userId);
    if (
      MASTER_ADMIN_IDS.includes(userId) ||
      (targetCheck && MASTER_ADMIN_EMAILS.includes(targetCheck.email?.toLowerCase()))
    ) {
      throw new Error('The Master Administrator account is permanently protected and cannot be deleted.');
    }

    if (USE_REAL_BACKEND) {
      try {
        await request(`/users/${userId}`, { method: 'DELETE' });
      } catch (e) {
        console.warn('[API] Real backend delete failed, proceeding with local cleanup.', e);
      }
    }

    // Clean up local database
    const usersDb = getLocalUsersDb();
    const targetUser = usersDb.find(u => u.id === userId || u._id === userId);
    const updatedUsersDb = usersDb.filter(u => u.id !== userId && u._id !== userId);
    localStorage.setItem('drivex_users_db', JSON.stringify(updatedUsersDb));

    // Remove user-specific favorites
    localStorage.removeItem(`drivex_favorites_${userId}`);
    if (targetUser?.email) {
      localStorage.removeItem(`drivex_favorites_${targetUser.email}`);
    }

    // Remove user-specific bookings from bookings list
    try {
      const rawBookings = localStorage.getItem('drivex_bookings');
      if (rawBookings) {
        const bookings = JSON.parse(rawBookings);
        const updatedBookings = bookings.filter(b => 
          b.userId !== userId && 
          (!targetUser?.email || b.driverEmail?.toLowerCase() !== targetUser.email.toLowerCase())
        );
        localStorage.setItem('drivex_bookings', JSON.stringify(updatedBookings));
      }
    } catch (e) {}

    // If currently logged in as this user, log them out
    const currentUser = JSON.parse(localStorage.getItem('drivex_user') || 'null');
    if (currentUser && (currentUser.id === userId || currentUser._id === userId)) {
      localStorage.removeItem('drivex_user');
      localStorage.removeItem('drivex_access_token');
      localStorage.setItem('drivex_logged_out', 'true');
    }

    return { success: true, message: 'User account and associated records deleted successfully.' };
  },

  async getMe() {
    if (USE_REAL_BACKEND) {
      try {
        const res = await request('/auth/me');
        return res.data?.user;
      } catch (e) {
        // Fallback
      }
    }
    const stored = localStorage.getItem('drivex_user');
    return stored ? JSON.parse(stored) : null;
  },

  async logout() {
    if (USE_REAL_BACKEND) {
      try { await request('/auth/logout', { method: 'POST' }); } catch (e) {}
    }
    localStorage.removeItem('drivex_user');
    localStorage.removeItem('drivex_access_token');
    localStorage.setItem('drivex_logged_out', 'true');
  },



  // ==========================================
  // 🚗 VEHICLES (Cars, Bikes, Scooters, EVs)
  // ==========================================
  async getCars(params = {}) {
    if (USE_REAL_BACKEND) {
      try {
        const query = new URLSearchParams(params).toString();
        const res = await request(`/vehicles${query ? `?${query}` : ''}`);
        if (res.data?.vehicles) return res.data.vehicles;
      } catch (e) {
        console.warn('[API] Real backend unavailable, using local dataset.');
      }
    }

    // Local Storage & Static Fleet
    const storedFleet = localStorage.getItem('drivex_fleet');
    const fleet = storedFleet ? JSON.parse(storedFleet) : initialCars;

    let filtered = [...fleet];

    // Filter by type ('car', 'bike', 'scooter', 'ev')
    if (params.type && params.type !== 'all') {
      filtered = filtered.filter((c) => (c.type || 'car').toLowerCase() === params.type.toLowerCase());
    }

    // Filter by category
    if (params.category && params.category !== 'all' && params.category !== 'All') {
      filtered = filtered.filter(
        (c) => c.category?.toLowerCase() === params.category.toLowerCase()
      );
    }

    // Filter by brand
    if (params.brand && params.brand !== 'All') {
      filtered = filtered.filter((c) => c.brand?.toLowerCase() === params.brand.toLowerCase());
    }

    // Filter by location
    if (params.location && params.location !== 'All') {
      filtered = filtered.filter((c) =>
        (c.availableLocations && c.availableLocations.some((loc) =>
          loc.toLowerCase().includes(params.location.toLowerCase())
        )) ||
        c.location?.toLowerCase().includes(params.location.toLowerCase()) ||
        c.cityName?.toLowerCase().includes(params.location.toLowerCase())
      );
    }

    // Filter by search query
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.brand?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q)
      );
    }

    // Filter by transmission
    if (params.transmission && params.transmission !== 'all' && params.transmission !== 'All') {
      filtered = filtered.filter(
        (c) => c.transmission?.toLowerCase() === params.transmission.toLowerCase()
      );
    }

    // Filter by fuel
    if (params.fuelType && params.fuelType !== 'all' && params.fuelType !== 'All') {
      filtered = filtered.filter(
        (c) => c.fuelType?.toLowerCase() === params.fuelType.toLowerCase()
      );
    }

    // Price Bounds
    if (params.minPrice) {
      filtered = filtered.filter((c) => (c.pricePerDay || c.rental?.pricePerDay) >= Number(params.minPrice));
    }
    if (params.maxPrice) {
      filtered = filtered.filter((c) => (c.pricePerDay || c.rental?.pricePerDay) <= Number(params.maxPrice));
    }

    // Seats
    if (params.seats && params.seats !== 'all' && params.seats !== 'All') {
      filtered = filtered.filter((c) => (c.seats || c.seatingCapacity) >= Number(params.seats));
    }

    // Sorting
    if (params.sort === 'price_asc' || params.sort === 'price-low') {
      filtered.sort((a, b) => (a.pricePerDay || a.rental?.pricePerDay) - (b.pricePerDay || b.rental?.pricePerDay));
    } else if (params.sort === 'price_desc' || params.sort === 'price-high') {
      filtered.sort((a, b) => (b.pricePerDay || b.rental?.pricePerDay) - (a.pricePerDay || a.rental?.pricePerDay));
    } else if (params.sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  },

  async getCarById(id) {
    if (USE_REAL_BACKEND) {
      try {
        const res = await request(`/vehicles/${id}`);
        if (res.data?.vehicle) return res.data.vehicle;
      } catch (e) {
        // Fallback
      }
    }

    const storedFleet = localStorage.getItem('drivex_fleet');
    const fleet = storedFleet ? JSON.parse(storedFleet) : initialCars;
    const car = fleet.find((c) => c.id === id || c._id === id);
    if (!car) throw new Error('Vehicle not found');
    return car;
  },

  // ==========================================
  // 📅 BOOKINGS (LocalStorage Persistence)
  // ==========================================
  async createBooking(bookingData) {
    if (USE_REAL_BACKEND) {
      try {
        const res = await request('/bookings', {
          method: 'POST',
          body: JSON.stringify(bookingData)
        });
        if (res.data?.booking) return res.data.booking;
      } catch (e) {
        console.warn('[API] Real booking failed, saving to localStorage:', e.message);
      }
    }

    // Fetch vehicle
    const storedFleet = localStorage.getItem('drivex_fleet');
    const fleet = storedFleet ? JSON.parse(storedFleet) : initialCars;
    const vehicle = fleet.find((c) => c.id === bookingData.vehicleId || c._id === bookingData.vehicleId) || fleet[0];

    // Compute pricing
    const days = Math.max(1, Math.ceil((new Date(bookingData.dropoff.date) - new Date(bookingData.pickup.date)) / (1000 * 60 * 60 * 24)) || 1);
    const dailyRate = vehicle.pricePerDay || vehicle.rental?.pricePerDay || 2000;
    const subtotal = dailyRate * days;
    const taxes = Math.round(subtotal * 0.18);
    const deposit = vehicle.securityDeposit || vehicle.rental?.refundableDeposit || 5000;
    const totalAmount = subtotal + taxes + deposit;

    const newBooking = {
      id: `DX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      bookingNumber: `DX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      carId: vehicle.id,
      carName: vehicle.name,
      brand: vehicle.brand,
      category: vehicle.category,
      type: vehicle.type || 'car',
      image: vehicle.image || vehicle.images?.[0]?.url,
      pickupLocation: bookingData.pickup.location,
      dropoffLocation: bookingData.dropoff.location || bookingData.pickup.location,
      pickupDate: bookingData.pickup.date,
      pickupTime: bookingData.pickup.time || '10:00 AM',
      dropoffDate: bookingData.dropoff.date,
      dropoffTime: bookingData.dropoff.time || '10:00 AM',
      days,
      pricePerDay: dailyRate,
      subtotal,
      taxes,
      deposit,
      totalAmount,
      status: "Confirmed",
      paymentMethod: bookingData.paymentMethod?.toUpperCase() || "UPI",
      driverName: bookingData.driverInfo?.fullName || "DriveX Member",
      driverPhone: bookingData.driverInfo?.phone || "+91 98765 12340",
      bookingDate: new Date().toISOString().split('T')[0]
    };

    // Save to localStorage
    const stored = localStorage.getItem('drivex_bookings');
    const bookings = stored ? JSON.parse(stored) : [];
    bookings.unshift(newBooking);
    localStorage.setItem('drivex_bookings', JSON.stringify(bookings));

    return newBooking;
  },

  async getMyBookings() {
    const stored = localStorage.getItem('drivex_bookings');
    return stored ? JSON.parse(stored) : [];
  },

  async cancelBooking(id) {
    const stored = localStorage.getItem('drivex_bookings');
    if (!stored) return null;
    const bookings = JSON.parse(stored);
    const updated = bookings.map((b) => (b.id === id || b.bookingNumber === id ? { ...b, status: 'Cancelled' } : b));
    localStorage.setItem('drivex_bookings', JSON.stringify(updated));
    return updated.find((b) => b.id === id || b.bookingNumber === id);
  },

  // ==========================================
  // 🛡️ ADMIN FLEET CRUD (LocalStorage)
  // ==========================================
  async getAdminVehicles() {
    const storedFleet = localStorage.getItem('drivex_fleet');
    return storedFleet ? JSON.parse(storedFleet) : initialCars;
  },

  async createAdminVehicle(data) {
    const storedFleet = localStorage.getItem('drivex_fleet');
    const fleet = storedFleet ? JSON.parse(storedFleet) : [...initialCars];
    const newCar = {
      id: `car-${Date.now().toString().slice(-4)}`,
      ...data,
      rating: 5.0,
      reviewsCount: 1,
      available: true
    };
    fleet.unshift(newCar);
    localStorage.setItem('drivex_fleet', JSON.stringify(fleet));
    return newCar;
  },

  async updateAdminVehicle(id, data) {
    const storedFleet = localStorage.getItem('drivex_fleet');
    const fleet = storedFleet ? JSON.parse(storedFleet) : [...initialCars];
    const index = fleet.findIndex((c) => c.id === id);
    if (index !== -1) {
      fleet[index] = { ...fleet[index], ...data };
      localStorage.setItem('drivex_fleet', JSON.stringify(fleet));
      return fleet[index];
    }
    return null;
  },

  async deleteAdminVehicle(id) {
    const storedFleet = localStorage.getItem('drivex_fleet');
    const fleet = storedFleet ? JSON.parse(storedFleet) : [...initialCars];
    const filtered = fleet.filter((c) => c.id !== id);
    localStorage.setItem('drivex_fleet', JSON.stringify(filtered));
    return true;
  },

  async getAdminDashboard() {
    const storedFleet = localStorage.getItem('drivex_fleet');
    const fleet = storedFleet ? JSON.parse(storedFleet) : initialCars;
    const storedBookings = localStorage.getItem('drivex_bookings');
    const bookings = storedBookings ? JSON.parse(storedBookings) : [];

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return {
      totalUsers: 142,
      totalVehicles: fleet.length,
      carsCount: fleet.filter((c) => (c.type || 'car') === 'car').length,
      bikesCount: fleet.filter((c) => (c.type || 'car') !== 'car').length,
      availableVehicles: fleet.filter((c) => c.available !== false).length,
      bookings: {
        total: bookings.length,
        active: bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Active').length,
        completed: bookings.filter((b) => b.status === 'Completed').length,
        cancelled: bookings.filter((b) => b.status === 'Cancelled').length
      },
      revenue: {
        totalRevenue
      }
    };
  },

  // Static items
  async getCategories() {
    return categories;
  },

  async getTestimonials() {
    return testimonials;
  }
};
