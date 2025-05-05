// OrderDetailsPage.jsx - Single order details page
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import '../assets/styles/OrderDetails.css';

const OrderDetailsPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(id);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="main-heading">
      <h1 className="bungee-shade-regular">Order Details</h1>
      
      <div className="content-wrapper">
        {loading ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading order details...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <Link to="/orders" className="btn btn-outline-primary mt-3">Back to Orders</Link>
          </div>
        ) : !order ? (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>Order not found.</p>
            <Link to="/orders" className="btn btn-outline-primary mt-3">Back to Orders</Link>
          </div>
        ) : (
          <div className="order-details-container">
            <div className="order-details-header">
              <div className="order-title">
                <h2>Order #{order.orderNumber}</h2>
                <p>Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="order-status">
                {order.isPaid ? (
                  <div className="status-badge paid">
                    <i className="fas fa-check-circle"></i> Paid on {formatDate(order.paidAt)}
                  </div>
                ) : (
                  <div className="status-badge pending">
                    <i className="fas fa-clock"></i> Payment Pending
                  </div>
                )}
                {order.isDelivered ? (
                  <div className="status-badge delivered">
                    <i className="fas fa-check-circle"></i> Delivered on {formatDate(order.deliveredAt)}
                  </div>
                ) : (
                  <div className="status-badge processing">
                    <i className="fas fa-cog"></i> Processing
                  </div>
                )}
              </div>
            </div>
            
            <div className="order-details-content">
              <div className="order-details-section">
                <h3>Items</h3>
                <div className="order-items-list">
                  {order.orderItems.map(item => (
                    <div key={item._id} className="order-detail-item">
                      <img 
                        src={`/assets/images/${item.image}`} 
                        alt={item.name} 
                        className="item-image" 
                      />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p className="item-price">${item.price.toFixed(2)} x {item.quantity}</p>
                      </div>
                      <div className="item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="order-details-section">
                <h3>Order Summary</h3>
                <div className="order-summary-details">
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
                  <div className="summary-row">
                    <span>Payment Method:</span>
                    <span>{order.paymentMethod === 'creditCard' ? 'Credit Card' : 'PayPal'}</span>
                  </div>
                </div>
              </div>
              
              <div className="order-details-section">
                <h3>Shipping Information</h3>
                <div className="shipping-details">
                  <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
                  <p><strong>Email:</strong> {order.shippingAddress.email}</p>
                  <p><strong>Address:</strong> {order.shippingAddress.address}</p>
                  <p>
                    <strong>City, State, ZIP:</strong> {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="order-details-actions">
              <Link to="/orders" className="btn btn-outline-primary">
                Back to Orders
              </Link>
              {!order.isPaid && (
                <button className="btn btn-primary">
                  Complete Payment
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;