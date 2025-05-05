// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import TeamPage from './pages/TeamPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RecentlyViewedProvider>
          <Router>
            <Routes>
              {/* Auth routes outside of main layout */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Main layout with sidebar */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="cart" element={<CartPage />} />
                
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
              </Route>
            </Routes>
          </Router>
        </RecentlyViewedProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
