import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import { adminService } from '../../services/api';
import '../../styles/Admin.css';

const AdminOrders = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate('/');
      return;
    }

    fetchOrders();
  }, [currentUser, navigate]);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      const data = await adminService.getAllOrders();
      console.log('Orders data received:', data);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const updatedOrder = await adminService.updateOrderStatus(orderId, status);
      setOrders(orders.map(order => 
        order._id === orderId ? updatedOrder : order
      ));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="admin-container">
      <AdminSidebar activeTab="orders" />
      
      <main className="admin-content">
        <h1 className="admin-title">Order Management</h1>
        
        <div className="admin-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="admin-filter"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.user?.displayName || 'Unknown User'}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`status-select status-${order.status.toLowerCase()}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-view-details"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Order Details</h2>
              <div className="order-details">
                <h3>Order #{selectedOrder.orderNumber}</h3>
                <p><strong>User:</strong> {selectedOrder.user?.displayName || 'Unknown User'}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                
                <h4>Items:</h4>
                {selectedOrder.items.length > 0 ? (
                  <ul>
                    {selectedOrder.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - Qty: {item.quantity} - ${item.price}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No items in this order</p>
                )}
                
                <h4>Shipping Address:</h4>
                <p>
                  {selectedOrder.shippingInfo.fullName}<br />
                  {selectedOrder.shippingInfo.address}<br />
                  {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state} {selectedOrder.shippingInfo.zip}
                </p>
                
                <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
              </div>
              <button 
                className="btn-close"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrders;