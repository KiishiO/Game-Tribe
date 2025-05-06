import React, { createContext, useState, useEffect, useContext } from 'react';

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
  
  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedAuth = localStorage.getItem('isAuthenticated');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    if (storedAuth) {
      setIsAuthenticated(JSON.parse(storedAuth));
    }
    
    setLoading(false);
  }, []);
  
  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);
  
  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);
  
  // Register a new user
  const register = (email, password, displayName, profileImage = '/assets/myotherimages/player_01.jpg') => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user object
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In a real app, this would be hashed
      displayName,
      profileImage,
      memberSince: new Date().toISOString(),
      personalNote: 'Click to enter text',
      gamesOwned: 0,
      favoriteGames: []
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set current user and authenticate
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    
    return newUser;
  };
  
  // Login an existing user
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    setCurrentUser(user);
    setIsAuthenticated(true);
    
    return user;
  };
  
  // Logout the current user
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };
  
  // Update user profile
  const updateProfile = (updates) => {
    if (!currentUser) {
      throw new Error('No user is logged in');
    }
    
    // Update user in state
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    
    // Update user in storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => 
      u.id === currentUser.id ? updatedUser : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    return updatedUser;
  };
  
  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    updateProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;