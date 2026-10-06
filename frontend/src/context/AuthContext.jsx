import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on initial load
  useEffect(() => {
    const savedToken = localStorage.getItem('jobhub_token');
    const savedUser = localStorage.getItem('jobhub_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user credentials', err);
        localStorage.removeItem('jobhub_token');
        localStorage.removeItem('jobhub_user');
      }
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: receivedToken, ...userData } = response.data.data;

    localStorage.setItem('jobhub_token', receivedToken);
    localStorage.setItem('jobhub_user', JSON.stringify(userData));

    setToken(receivedToken);
    setUser(userData);
    return response.data;
  };

  // Register handler
  const register = async (formData) => {
    const response = await api.post('/auth/register', formData);
    const { token: receivedToken, ...userData } = response.data.data;

    localStorage.setItem('jobhub_token', receivedToken);
    localStorage.setItem('jobhub_user', JSON.stringify(userData));

    setToken(receivedToken);
    setUser(userData);
    return response.data;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('jobhub_token');
    localStorage.removeItem('jobhub_user');
    setToken(null);
    setUser(null);
  };

  // Update current user state (e.g. after profile edit)
  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    localStorage.setItem('jobhub_user', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const isRecruiter = user?.role === 'recruiter';
  const isJobSeeker = user?.role === 'jobseeker';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isRecruiter,
        isJobSeeker,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
