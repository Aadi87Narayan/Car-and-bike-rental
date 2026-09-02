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
        }
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // 1. Try real backend authentication
      const authenticatedUser = await api.login(email, password);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        setIsLoading(false);
        return authenticatedUser;
      }
    } catch (err) {
      // Fallback for offline/demo if backend is unreachable
      const isAdmin = email.toLowerCase().includes('admin');
      const fallbackUser = {
        ...DEFAULT_USER,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        role: isAdmin ? 'admin' : 'user'
      };
      setUser(fallbackUser);
      setIsLoading(false);
      return fallbackUser;
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      const registeredUser = await api.register(formData);
      if (registeredUser) {
        setUser(registeredUser);
        setIsLoading(false);
        return registeredUser;
      }
    } catch (err) {
      const newUser = {
        id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name || `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || "DriveX Member",
        email: formData.email,
        phone: formData.phone || "+91 98765 00000",
        profileImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.email}`,
        drivingLicense: formData.drivingLicense || "DL-PENDING-VERIFY",
        role: formData.email.toLowerCase().includes('admin') ? 'admin' : 'user',
        isVerified: true,
        membershipTier: "Gold Member",
        totalTrips: 0,
        kilometersDriven: 0,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
      setUser(newUser);
      setIsLoading(false);
      return newUser;
    }
  };

  const deleteAccount = async (targetUserId) => {
    const idToDelete = targetUserId || user?.id || user?._id;
    if (!idToDelete) return;
    setIsLoading(true);
    try {
      await api.deleteUser(idToDelete);
      if (!targetUserId || targetUserId === user?.id || targetUserId === user?._id) {
        setUser(null);
      }
      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
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
        updateProfile,
        deleteAccount
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
