import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { Loader } from './components/Loader/Loader';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Pages
import { Home } from './pages/Home';
import { Cars } from './pages/Cars';
import { CarDetails } from './pages/CarDetails';
import { Booking } from './pages/Booking';
import { Login } from './pages/Login';
import { MyBookings } from './pages/MyBookings';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFound } from './pages/NotFound';

// Auto scroll to top on page navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Protected Route Guard: Requires valid login session
function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader text="Verifying session..." fullScreen={true} />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function MainLayout() {
  const location = useLocation();
  const hideHeaderFooter = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!hideHeaderFooter && <Navbar />}
      <div className="main-content-area">
        <Suspense fallback={<Loader text="Loading DriveX Experience..." fullScreen={true} />}>
          <Routes>
            {/* Auth Page (Both /login and /register load the sliding card) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />

            {/* Protected Routes (Require login before accessing Home, Cars, etc.) */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/cars" element={
              <ProtectedRoute>
                <Cars />
              </ProtectedRoute>
            } />
            <Route path="/cars/:id" element={
              <ProtectedRoute>
                <CarDetails />
              </ProtectedRoute>
            } />
            <Route path="/booking/:id" element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <MainLayout />
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
