import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize auth state from localStorage on app load
  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };
  
  // Context value
  const value = {
    user,
    setUser,
    logout,
    isAuthenticated: !!user,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 