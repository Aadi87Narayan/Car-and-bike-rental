import React, { createContext, useContext, useState, useEffect } from 'react';

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

export function BookingProvider({ children }) {
  // Search parameters
  const [searchParams, setSearchParams] = useState(() => {
    try {
      const stored = localStorage.getItem('drivex_search');
      return stored ? JSON.parse(stored) : DEFAULT_SEARCH;
    } catch (e) {
      return DEFAULT_SEARCH;
    }
  });

  // Bookings list
  const [bookings, setBookings] = useState(() => {
    try {
      const stored = localStorage.getItem('drivex_bookings');
      return stored ? JSON.parse(stored) : INITIAL_BOOKINGS;
    } catch (e) {
      return INITIAL_BOOKINGS;
    }
  });

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('drivex_favorites');
      return stored ? JSON.parse(stored) : ['car-001', 'car-005'];
    } catch (e) {
      return ['car-001', 'car-005'];
    }
  });

  useEffect(() => {
    localStorage.setItem('drivex_search', JSON.stringify(searchParams));
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem('drivex_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('drivex_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const updateSearchParams = (newParams) => {
    setSearchParams((prev) => ({
      ...prev,
      ...newParams
    }));
  };

  // User creates reservation -> Starts in "Pending" status for Admin review
  const createBooking = (bookingDetails) => {
    const bookingId = `DRV-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = {
      ...bookingDetails,
      id: bookingId,
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

  const toggleFavorite = (carId) => {
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
  };

  const isFavorite = (carId) => favorites.includes(carId);

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        updateSearchParams,
        bookings,
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
