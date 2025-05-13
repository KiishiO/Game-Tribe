import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Add this import
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { getCartCount } = useCart();
  const { isAuthenticated, currentUser } = useAuth(); // Add this line
  const cartCount = getCartCount();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link to="/">
          <img 
            src="/assets/myotherimages/GameTribe_Logo.png" 
            alt="GameTribe Logo"
          />
        </Link>
      </div>
      
      <nav className="sidebar-nav">
        <div className="sidebar-nav-item">
          <Link to="/" title="Home">
            <i className="fas fa-home"></i>
          </Link>
        </div>
        
        <div className="sidebar-nav-item">
          <Link to="/profile" title="Profile">
            <i className="fas fa-user"></i>
          </Link>
        </div>
        
        <div className="sidebar-nav-item">
          <Link to="/search" title="Search">
            <i className="fas fa-search"></i>
          </Link>
        </div>
        
        <div className="sidebar-nav-item">
          <Link to="/cart" title="Cart">
            <div className="cart-icon-container">
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </div>
          </Link>
        </div>
        
        <div className="sidebar-nav-item">
          <Link to="/team" title="Team">
            <i className="fas fa-info-circle"></i>
          </Link>
        </div>
        
        <div className="sidebar-nav-item">
          <Link to="/future" title="Future Updates">
            <i className="fas fa-rocket"></i>
          </Link>
        </div>
        
        {/* Add Admin link for admin users */}
        {isAuthenticated && currentUser?.isAdmin && (
          <div className="sidebar-nav-item">
            <Link to="/admin/dashboard" title="Admin Panel">
              <i className="fas fa-cog"></i>
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;