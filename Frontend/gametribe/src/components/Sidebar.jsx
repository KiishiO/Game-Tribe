import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const { isAuthenticated } = useAuth();
  
  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const cartCount = getCartCount();
  
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Link to="/">
          <img src="/assets/myotherimages/GameTribe_Logo.png" width="50" height="50" style={{borderRadius: '50%'}} alt="logo" />
        </Link>
      </div>
      <div className="sidebar-nav">
        <div className={`sidebar-nav-item ${isActive('/') ? 'active' : ''}`}>
          <Link to="/" title="Home">
            <i className="fas fa-home"></i>
          </Link>
        </div>
        
        <div className={`sidebar-nav-item ${isActive('/search') ? 'active' : ''}`}>
          <Link to="/search" title="Game Search">
            <i className="fas fa-gamepad"></i>
          </Link>
        </div>
        
        <div className={`sidebar-nav-item ${isActive('/cart') ? 'active' : ''}`}>
          <Link to="/cart" className="cart-icon-container" title="Shopping Cart">
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </div>
        
        <div className={`sidebar-nav-item ${isActive('/profile') ? 'active' : ''}`}>
          <Link to={isAuthenticated ? "/profile" : "/login"} title={isAuthenticated ? "Profile" : "Login"}>
            <i className={isAuthenticated ? "fas fa-user" : "fas fa-sign-in-alt"}></i>
          </Link>
        </div>
        
        <div className={`sidebar-nav-item ${isActive('/team') ? 'active' : ''}`}>
          <Link to="/team" title="Team">
            <i className="fas fa-info-circle"></i>
          </Link>
        </div>
        
        <div className={`sidebar-nav-item ${isActive('/future') ? 'active' : ''}`}>
          <Link to="/future" title="Future Updates">
            <i className="fas fa-rocket"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;