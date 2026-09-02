import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: "usr-8891",
  name: "Vikram Malhotra",
  email: "vikram.drivex@example.com",
  phone: "+91 98765 12340",
  profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  drivingLicense: "DL-042019008921",
  role: "user",
  isVerified: true,
  membershipTier: "Platinum Driver",
  totalTrips: 14,
  kilometersDriven: 3420,
  joinedDate: "January 2025"
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('drivex_user');
      const isExplicitLoggedOut = localStorage.getItem('drivex_logged_out') === 'true';
      if (stored && !isExplicitLoggedOut) {
        return JSON.parse(stored);
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('drivex_user', JSON.stringify(user));
      localStorage.removeItem('drivex_logged_out');
    } else {
      localStorage.removeItem('drivex_user');
    }
  }, [user]);

  // Check active backend session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('drivex_access_token');
      if (token) {
        try {
          const remoteUser = await api.getMe();
          if (remoteUser) {
            setUser(remoteUser);
          }
        } catch (e) {
          // Token expired or invalid
          localStorage.removeItem('drivex_access_token');
        }
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      localStorage.removeItem('drivex_logged_out');
      const authenticatedUser = await api.login(email, password);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        setIsLoading(false);
        return authenticatedUser;
      }
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      localStorage.removeItem('drivex_logged_out');
      const registeredUser = await api.register(formData);
      if (registeredUser) {
        setUser(registeredUser);
        setIsLoading(false);
        return registeredUser;
      }
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    localStorage.setItem('drivex_logged_out', 'true');
    localStorage.removeItem('drivex_access_token');
    localStorage.removeItem('drivex_user');
    setUser(null);
    try {
      await api.logout();
    } catch (e) {
      // Ignore background api errors during logout
    }
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => ({
      ...prev,
      ...updatedFields
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
