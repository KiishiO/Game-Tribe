import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import pages
import Home from '../pages/Home';
import Search from '../pages/Search';
import Cart from '../pages/Cart';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Import layouts
import MainLayout from './MainLayout';
import AuthLayout from './AuthLayout';

// Placeholder components for other pages
const Team = () => <div className="placeholder-page">Team Page</div>;
const Future = () => <div className="placeholder-page">Future Page</div>;

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Auth routes without sidebar */}
      <Route path="/login" element={
        <AuthLayout>
          {isAuthenticated ? <Navigate to="/profile" /> : <Login />}
        </AuthLayout>
      } />
      <Route path="/register" element={
        <AuthLayout>
          {isAuthenticated ? <Navigate to="/profile" /> : <Register />}
        </AuthLayout>
      } />
      
      {/* Main routes with sidebar */}
      <Route path="/" element={
        <MainLayout>
          <Home />
        </MainLayout>
      } />
      <Route path="/search" element={
        <MainLayout>
          <Search />
        </MainLayout>
      } />
      <Route path="/cart" element={
        <MainLayout>
          <Cart />
        </MainLayout>
      } />
      <Route path="/profile" element={
        <MainLayout>
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        </MainLayout>
      } />
      <Route path="/team" element={
        <MainLayout>
          <Team />
        </MainLayout>
      } />
      <Route path="/future" element={
        <MainLayout>
          <Future />
        </MainLayout>
      } />
      
      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;