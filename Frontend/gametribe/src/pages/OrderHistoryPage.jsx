// OrderHistoryPage.jsx - User's order history page
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { AuthContext } from '../context/AuthContext';
import '../assets/styles/OrderHistory.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getMyOrders();
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your order history. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="main-heading">
      <h1 className="bungee-shade-regular">Order History</h1>
      
      <div className="content-wrapper">
        {loading ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <i className="fas fa-shopping-bag fa-5x mb-4 text-muted"></i>
            <h3 className="text-muted">You haven't placed any orders yet</h3>
            <p className="text-muted">Start shopping to see your order history!</p>
            <Link to="/" className="btn btn-primary mt-3">Browse Games</Link>
          </div>
        ) : (
          <div className="orders-container">
            <div className="order-list">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order.orderNumber}</h3>
                      <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="order-status">
                      {order.isPaid ? (
                        <span className="status-paid">Paid</span>
                      ) : (
                        <span className="status-pending">Payment Pending</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="order-items">
                    {order.orderItems.map(item => (
                      <div key={item._id} className="order-item">
                        <img 
                          src={`/assets/images/${item.image}`} 
                          alt={item.name} 
                          className="order-item-image" 
                        />
                        <div className="order-item-details">
                          <h4>{item.name}</h4>
                          <p className="item-price">${item.price.toFixed(2)} x {item.quantity}</p>
                        </div>
                        <div className="order-item-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax:</span>
                      <span>${order.taxPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="order-actions">
                    <Link 
                      to={`/orders/${order._id}`} 
                      className="btn btn-outline-primary"
                    >
                      View Details
                    </Link>
                    {!order.isPaid && (
                      <button className="btn btn-primary">
                        Complete Payment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;