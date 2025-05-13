import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // Set default auth header for all axios requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [token]);
  
  // Load user data when token changes
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/auth/user`);
        
        if (res.data) {
          setCurrentUser(res.data);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Error loading user:', err.response?.data?.message || err.message);
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
        setIsAuthenticated(false);
        setError(err.response?.data?.message || 'Authentication error. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [token]);
  
  // Register a new user
  const register = async (email, password, displayName, profileImage = '/assets/myotherimages/player_01.jpg') => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        displayName,
        profileImage
      });
      
      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      
      // Set current user and authenticate
      setCurrentUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data.user;
    } catch (err) {
      console.error('Registration error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw new Error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Login an existing user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      
      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      
      // Set current user and authenticate
      setCurrentUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data.user;
    } catch (err) {
      console.error('Login error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      throw new Error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  // Logout the current user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    setToken(null);
    
    // Clear user state
    setCurrentUser(null);
    setIsAuthenticated(false);
  };
  
  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put(`${API_URL}/api/users/profile`, updates);
      
      // Update user in state
      setCurrentUser(res.data);
      
      return res.data;
    } catch (err) {
      console.error('Profile update error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      throw new Error(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Get user's orders - only if authenticated
  const getUserOrders = async () => {
    if (!isAuthenticated || !token) {
      return [];
    }
    
    try {
      const res = await axios.get(`${API_URL}/api/orders`);
      return res.data;
    } catch (err) {
      console.error('Error fetching orders:', err.response?.data?.message || err.message);
      // Return empty array instead of throwing error
      return [];
    }
  };
  
  // Add a new order
  const addOrder = async (orderData) => {
    try {
      setError(null);
      
      const res = await axios.post(`${API_URL}/api/orders`, orderData);
      
      return res.data;
    } catch (err) {
      console.error('Order creation error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      throw new Error(err.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };
  
  // Add a game to favorites
  const addToFavorites = async (gameId) => {
    try {
      setError(null);
      
      const res = await axios.post(`${API_URL}/api/users/favorite/${gameId}`);
      
      // Update user in state to reflect new favorites
      const updatedUser = await axios.get(`${API_URL}/api/auth/user`);
      setCurrentUser(updatedUser.data);
      
      return res.data;
    } catch (err) {
      console.error('Error adding to favorites:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to add game to favorites. Please try again.');
      throw new Error(err.response?.data?.message || 'Failed to add game to favorites. Please try again.');
    }
  };
  
  // Remove a game from favorites
  const removeFromFavorites = async (gameId) => {
    try {
      setError(null);
      
      const res = await axios.delete(`${API_URL}/api/users/favorite/${gameId}`);
      
      // Update user in state to reflect updated favorites
      const updatedUser = await axios.get(`${API_URL}/api/auth/user`);
      setCurrentUser(updatedUser.data);
      
      return res.data;
    } catch (err) {
      console.error('Error removing from favorites:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to remove game from favorites. Please try again.');
      throw new Error(err.response?.data?.message || 'Failed to remove game from favorites. Please try again.');
    }
  };
  
  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      
      const res = await axios.put(`${API_URL}/api/users/password`, {
        currentPassword,
        newPassword
      });
      
      return res.data;
    } catch (err) {
      console.error('Password change error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
      throw new Error(err.response?.data?.message || 'Failed to change password. Please try again.');
    }
  };
  
  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    getUserOrders,
    addOrder,
    addToFavorites,
    removeFromFavorites,
    changePassword
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;