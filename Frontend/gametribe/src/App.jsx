<<<<<<< HEAD
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import RequireAuth from './components/RequireAuth';
=======
// src/App.jsx - Complete App component with all routes
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { useContext } from 'react';

// Layout and common components
>>>>>>> order-confirmation-history
import Layout from './components/Layout';

// Page components
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import TeamPage from './pages/TeamPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
<<<<<<< HEAD
import NotFoundPage from './pages/NotFoundPage';
=======
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location }} />;
  }
  
  // Render children if authenticated
  return children;
};
>>>>>>> order-confirmation-history

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RecentlyViewedProvider>
          <Router>
            <Routes>
<<<<<<< HEAD
              {/* Auth routes outside of main layout */}
=======
              {/* Public routes */}
>>>>>>> order-confirmation-history
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Main layout with sidebar */}
              <Route path="/" element={<Layout />}>
                {/* Public pages */}
                <Route index element={<HomePage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="cart" element={<CartPage />} />
<<<<<<< HEAD
                
                {/* Protected route for profile */}
                <Route 
                  path="profile" 
                  element={
                    <RequireAuth>
                      <ProfilePage />
                    </RequireAuth>
                  } 
                />
                
                <Route path="team" element={<TeamPage />} />
                
                {/* 404 page for unmatched routes */}
                <Route path="*" element={<NotFoundPage />} />
=======
                <Route path="team" element={<TeamPage />} />
                <Route path="future" element={<FuturePage />} />
                
                {/* Protected pages */}
                <Route path="profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="orders" element={
                  <ProtectedRoute>
                    <OrderHistoryPage />
                  </ProtectedRoute>
                } />
                <Route path="orders/:id" element={
                  <ProtectedRoute>
                    <OrderDetailsPage />
                  </ProtectedRoute>
                } />
                <Route path="order-success" element={
                  <ProtectedRoute>
                    <OrderSuccessPage />
                  </ProtectedRoute>
                } />
>>>>>>> order-confirmation-history
              </Route>
              
              {/* 404 page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </RecentlyViewedProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;