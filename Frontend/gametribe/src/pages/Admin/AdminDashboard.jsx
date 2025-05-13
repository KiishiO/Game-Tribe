import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import { adminService } from '../../services/api'; // Import admin service
import '../../styles/Admin.css';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalGames: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate('/');
      return;
    }

    fetchDashboardStats();
  }, [currentUser, navigate]);

  const fetchDashboardStats = async () => {
    try {
      console.log('Fetching dashboard stats...');
      const data = await adminService.getDashboardStats();
      console.log('Dashboard data received:', data);
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Handle both date formats (ISO string or MongoDB timestamp)
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-container">
      <AdminSidebar activeTab="dashboard" />
      
      <main className="admin-content">
        <h1 className="admin-title">Admin Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Total Games</h3>
            <p className="stat-number">{stats.totalGames}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <section className="recent-orders">
          <h2>Recent Orders</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>User</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.user?.displayName}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;