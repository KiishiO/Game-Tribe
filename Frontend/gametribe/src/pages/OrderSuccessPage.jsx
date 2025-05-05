// OrderSuccess.jsx - Order success page (shown after checkout)
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/styles/OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order details from location state (passed from checkout)
  const order = location.state?.order;
  
  // If no order in state, redirect to home
  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);
  
  if (!order) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="main-heading">
      <div className="content-wrapper">
        <div className="order-success-container">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          
          <h1>Thank You for Your Order!</h1>
          <p className="order-number">Order #{order.orderNumber}</p>
          
          <div className="success-message">
            <p>Your order has been received and is being processed.</p>
            <p>A confirmation email has been sent to {order.shippingAddress.email}.</p>
          </div>
          
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {order.orderItems.map(item => (
                <div key={item._id} className="summary-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax:</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="total-row final">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="success-actions">
            <Link to={`/orders/${order._id}`} className="btn btn-outline-primary">
              View Order Details
            </Link>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
