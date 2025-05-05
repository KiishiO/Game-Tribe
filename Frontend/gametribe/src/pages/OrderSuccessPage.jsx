// OrderSuccess.jsx - Enhanced order success page with confetti
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/styles/OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState([]);
  
  // Get order details from location state (passed from checkout)
  const order = location.state?.order;
  
  // If no order in state, redirect to home
  useEffect(() => {
    if (!order) {
      navigate('/');
    } else {
      // Create confetti effect
      createConfetti();
    }
  }, [order, navigate]);
  
  // Create confetti animation elements
  const createConfetti = () => {
    const confettiColors = [
      '#5e548e', // Primary color
      '#9f86c0', // Accent color
      '#8387c3', // Accent alt color
      '#e1e1e1', // Text primary
      '#4caf50'  // Success color
    ];
    
    const newConfetti = [];
    
    // Create 50 confetti elements
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 10 + 5}px`,
        height: `${Math.random() * 10 + 5}px`,
        backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 3 + 2}s`
      });
    }
    
    setConfetti(newConfetti);
  };
  
  if (!order) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="main-heading">
      <div className="content-wrapper">
        {/* Confetti animation */}
        {confetti.map((conf) => (
          <div
            key={conf.id}
            className="confetti"
            style={{
              left: conf.left,
              width: conf.width,
              height: conf.height,
              backgroundColor: conf.backgroundColor,
              animationDelay: conf.delay,
              animationDuration: conf.duration
            }}
          />
        ))}
        
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
              {order.orderItems.map((item, index) => (
                <div key={index} className="summary-item">
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