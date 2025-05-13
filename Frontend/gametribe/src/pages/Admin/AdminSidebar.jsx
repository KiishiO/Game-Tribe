import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Admin.css';

const AdminSidebar = ({ activeTab }) => {
  const navigate = useNavigate();

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <img src="/assets/myotherimages/GameTribe_Logo.png" alt="Game Tribe Admin" />
        <h3>Admin Panel</h3>
      </div>
      
      <nav className="admin-nav">
        <Link 
          to="/admin/dashboard" 
          className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <i className="fas fa-tachometer-alt"></i>
          Dashboard
        </Link>
        
        <Link 
          to="/admin/users" 
          className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
        >
          <i className="fas fa-users"></i>
          Users
        </Link>
        
        <Link 
          to="/admin/orders" 
          className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
        >
          <i className="fas fa-shopping-cart"></i>
          Orders
        </Link>
        
        <Link 
          to="/" 
          className="admin-nav-item"
        >
          <i className="fas fa-arrow-left"></i>
          Back to Site
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;