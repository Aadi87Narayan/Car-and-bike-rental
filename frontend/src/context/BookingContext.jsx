import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';

const BookingContext = createContext(null);

const getTodayDate = () => new Date().toISOString().split('T')[0];
const getFutureDate = (daysAhead = 3) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

const DEFAULT_SEARCH = {
  location: "Bhilai",
  pickupDate: getTodayDate(),
  pickupTime: "10:00",
  dropoffDate: getFutureDate(3),
  dropoffTime: "10:00"
};

const INITIAL_BOOKINGS = [
  {
    id: "DRV-90142",
    userId: "usr-8891",
    userEmail: "vikram.drivex@example.com",
    carId: "car-001",
    carName: "BMW X5 xDrive40i",
    brand: "BMW",
    category: "SUV",
    image: "https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1000&q=80",
    pickupLocation: "Bhilai (Supela Hub)",
    dropoffLocation: "Bhilai (Supela Hub)",
    pickupDate: getTodayDate(),
    pickupTime: "10:00 AM",
    dropoffDate: getFutureDate(3),
    dropoffTime: "10:00 AM",
    days: 3,
    pricePerDay: 6500,
    subtotal: 19500,
    insuranceAmount: 1499,
    taxes: 3779,
    deposit: 10000,
    totalAmount: 24778,
    status: "Pending", // Pending admin confirmation
    paymentMethod: "UPI (Google Pay)",
    driverName: "Vikram Malhotra",
    driverEmail: "vikram.drivex@example.com",
    driverPhone: "+91 98765 12340",
    drivingLicense: "DL-042019008921",
    passportNumber: "Z3498210",
    bookingDate: getTodayDate()
  },
  {
    id: "DRV-84920",
    userId: "usr-8893",
    userEmail: "rahul.sharma@example.com",
    carId: "car-002",
    carName: "Mercedes-Benz C-Class 300",
    brand: "Mercedes-Benz",
    category: "Sedan",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80",
    pickupLocation: "Raipur Airport (RPR)",
    dropoffLocation: "Raipur Airport (RPR)",
    pickupDate: getTodayDate(),
    pickupTime: "02:00 PM",
    dropoffDate: getFutureDate(2),
    dropoffTime: "02:00 PM",
    days: 2,
    pricePerDay: 5200,
    subtotal: 10400,
    insuranceAmount: 999,
    taxes: 2051,
    deposit: 8000,
    totalAmount: 13450,
    status: "Confirmed",
    paymentMethod: "Credit Card (HDFC)",
    driverName: "Rahul Sharma",
    driverEmail: "rahul.sharma@example.com",
    driverPhone: "+91 97234 56789",
    drivingLicense: "DL-012018009843",
    passportNumber: "V7612984",
    bookingDate: getTodayDate()
  }
];

// Helper to get favorites storage key for current user
const getFavoritesStorageKey = (user) => {
  if (!user) return 'drivex_favorites_guest';
  return `drivex_favorites_${user.id || user._id || user.email || 'guest'}`;
};

// Helper to load user favorites
const loadUserFavorites = (user) => {
  try {
    const key = getFavoritesStorageKey(user);
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      return JSON.parse(stored);
    }
    // Seed account default favorites for Vikram
    if (user?.email === 'vikram.drivex@example.com' || user?.id === 'usr-8891') {
      return ['car-001', 'car-005'];
    }
    // Default for new users is empty wishlist
    return [];
  } catch (e) {
    return [];
  }
};

export function BookingProvider({ children }) {
  const { user } = useAuth();

  // Search parameters
  const [searchParams, setSearchParams] = useState(() => {
    try {
      const stored = localStorage.getItem('drivex_search');
      return stored ? JSON.parse(stored) : DEFAULT_SEARCH;
    } catch (e) {
      return DEFAULT_SEARCH;
    }
  });

  // Global Bookings pool
  const [bookings, setBookings] = useState(() => {
    try {
      const stored = localStorage.getItem('drivex_bookings');
      return stored ? JSON.parse(stored) : INITIAL_BOOKINGS;
    } catch (e) {
      return INITIAL_BOOKINGS;
    }
  });

  // Isolated User-specific Favorites
  const [favorites, setFavorites] = useState(() => loadUserFavorites(user));

  // Switch favorites state dynamically whenever authenticated user changes (Login/Logout/Switch)
  useEffect(() => {
    setFavorites(loadUserFavorites(user));
  }, [user?.id, user?.email]);

  // Persist search params
  useEffect(() => {
    localStorage.setItem('drivex_search', JSON.stringify(searchParams));
  }, [searchParams]);

  // Persist bookings
  useEffect(() => {
    localStorage.setItem('drivex_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Persist user-isolated favorites
  useEffect(() => {
    const key = getFavoritesStorageKey(user);
    localStorage.setItem(key, JSON.stringify(favorites));
  }, [favorites, user?.id, user?.email]);

  const updateSearchParams = (newParams) => {
    setSearchParams((prev) => ({
      ...prev,
      ...newParams
    }));
  };

  // User creates reservation -> Associated with active user ID and starts in "Pending" status
  const createBooking = (bookingDetails) => {
    const bookingId = `DRV-${Math.floor(10000 + Math.random() * 90000)}`;
    const currentUserId = user?.id || user?._id || 'guest';
    const currentUserEmail = user?.email || bookingDetails.driverEmail || '';

    const newBooking = {
      ...bookingDetails,
      id: bookingId,
      userId: currentUserId,
      userEmail: currentUserEmail,
      status: "Pending", // Initially waiting for admin confirmation
      bookingDate: getTodayDate()
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  // User or Admin cancels reservation -> completely removes it from the active bookings list
  const cancelBooking = (bookingId) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  // Admin confirms reservation
  const confirmBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: "Confirmed" } : b
      )
    );
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: newStatus } : b
      )
    );
  };

  // Toggle favorite for the active user
  const toggleFavorite = useCallback((carId) => {
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
  }, []);

  const isFavorite = useCallback((carId) => favorites.includes(carId), [favorites]);

  // User-scoped personal bookings (Admins get all bookings, regular users only get their own)
  const userBookings = useMemo(() => {
    if (!user) return [];
    if (user.role === 'admin') return bookings;
    return bookings.filter(
      (b) =>
        b.userId === user.id ||
        b.userId === user._id ||
        (user.email && b.driverEmail?.toLowerCase() === user.email.toLowerCase()) ||
        (user.email && b.userEmail?.toLowerCase() === user.email.toLowerCase())
    );
  }, [bookings, user]);

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        updateSearchParams,
        bookings, // All bookings for Admin
        userBookings, // User-isolated personal bookings
        createBooking,
        cancelBooking,
        confirmBooking,
        updateBookingStatus,
        favorites,
        toggleFavorite,
        isFavorite
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
