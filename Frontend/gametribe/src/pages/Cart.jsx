import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Cart.css';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal,
    recentlyViewed,
    addToCart
  } = useCart();
  
  const { isAuthenticated, currentUser, addOrder } = useAuth();
  const navigate = useNavigate();
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'creditCard',
    cardNumber: '',
    expDate: '',
    cvv: ''
  });
  
  // Calculate tax and total
  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  // Generate a random order number when confirmation modal shows
  useEffect(() => {
    if (showConfirmationModal) {
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const orderNum = `GT-${new Date().getFullYear()}-${randomNum}`;
      setOrderNumber(orderNum);
    }
  }, [showConfirmationModal]);
  
  // Handle checkout button click
  const handleCheckoutClick = () => {
    if (isAuthenticated) {
      // Pre-fill form with user data if available
      if (currentUser) {
        setShippingInfo(prev => ({
          ...prev,
          fullName: currentUser.displayName || prev.fullName,
          email: currentUser.email || prev.email
        }));
      }
      setShowCheckoutModal(true);
    } else {
      setShowLoginPrompt(true);
    }
  };
  
  // Handle redirect to login
  const handleRedirectToLogin = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };
  
  // // Handle place order
  // const handlePlaceOrder = () => {
  //   // Basic form validation
  //   if (!validateForm()) {
  //     return;
  //   }
    
  //   // Create new order object
  //   const order = {
  //     orderNumber: `GT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
  //     items: [...cartItems],
  //     subtotal,
  //     tax,
  //     total,
  //     shippingInfo: { ...shippingInfo },
  //     paymentMethod: paymentInfo.method,
  //     date: new Date().toISOString()
  //   };
    
  //   // Save order to context
  //   addOrder(order);
    
  //   // Set order details for confirmation
  //   setOrderDetails(order);
  //   setOrderNumber(order.orderNumber);
    
  //   // Close checkout modal and show confirmation
  //   setShowCheckoutModal(false);
  //   setTimeout(() => {
  //     setShowConfirmationModal(true);
  //     clearCart();
  //   }, 500);
  // };

  // Handle place order
  const handlePlaceOrder = async () => {
    // Basic form validation
    if (!validateForm()) {
      return;
    }
    
    try {
      // Create order data matching the backend schema
      const orderData = {
        orderNumber: `GT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        items: cartItems.map(item => ({
          // Include gameId for numeric IDs
          gameId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        shippingInfo: { ...shippingInfo },
        paymentMethod: paymentInfo.method
      };
      
      // Save order using the auth context's addOrder
      const savedOrder = await addOrder(orderData);
      
      // Set order details for confirmation
      setOrderDetails(savedOrder);
      setOrderNumber(savedOrder.orderNumber);
      
      // Close checkout modal and show confirmation
      setShowCheckoutModal(false);
      setTimeout(() => {
        setShowConfirmationModal(true);
        clearCart();
      }, 500);
    } catch (error) {
      console.error('Order placement error:', error);
      alert(error.message || 'Failed to place order. Please try again.');
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    // Check shipping info
    for (const field in shippingInfo) {
      if (!shippingInfo[field]) {
        alert(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Check payment info if credit card
    if (paymentInfo.method === 'creditCard') {
      if (!paymentInfo.cardNumber || !paymentInfo.expDate || !paymentInfo.cvv) {
        alert('Please complete all payment information');
        return false;
      }
      
      // Basic format validation
      if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
        alert('Please enter a valid card number');
        return false;
      }
      
      if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expDate)) {
        alert('Please enter expiration date in MM/YY format');
        return false;
      }
      
      if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
        alert('Please enter a valid CVV');
        return false;
      }
    }
    
    return true;
  };
  
  // Handle shipping info change
  const handleShippingChange = (e) => {
    const { id, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    const method = e.target.id;
    setPaymentInfo(prev => ({
      ...prev,
      method
    }));
  };
  
  // Handle payment info change
  const handlePaymentInfoChange = (e) => {
    const { id, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Handle quantity change
  const handleQuantityChange = (id, change, setExact = false) => {
    if (setExact) {
      updateQuantity(id, change);
    } else {
      const currentItem = cartItems.find(item => item.id === id);
      if (currentItem) {
        const newQuantity = currentItem.quantity + change;
        if (newQuantity <= 0) {
          removeFromCart(id);
        } else {
          updateQuantity(id, newQuantity);
        }
      }
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="app-container">
      <main className="main-content">
        {/* Main Heading */}
        <div className="main-heading">
          <br />
          <br />
          <h1 className="bungee-shade-regular">Cart</h1>
          <br />
        </div>

        {/* Content Wrapper */}
        <div className="content-wrapper">
          <div className="cart-container">
            {/* Empty Cart Message */}
            {cartItems.length === 0 && (
              <div id="empty-cart" className="text-center p-5">
                <i className="fas fa-shopping-cart fa-5x mb-4 text-muted"></i>
                <h3 className="text-muted">Your cart is empty</h3>
                <p className="text-muted">Add some awesome games to your cart!</p>
                <Link to="/" className="btn btn-primary mt-3">Browse Games</Link>
              </div>
            )}

            {/* Cart Items */}
            {cartItems.length > 0 && (
              <div id="cart-items">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Game</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Total</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody id="cart-table-body">
                      {cartItems.map(item => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={`/assets/images/${item.image}`} 
                                alt={item.name} 
                                className="me-3" 
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/assets/myotherimages/GameTribe_Logo.png';
                                }}
                              />
                              <div>
                                <h6 className="mb-0">{item.name}</h6>
                              </div>
                            </div>
                          </td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>
                            <div className="input-group input-group-sm" style={{ width: '100px' }}>
                              <button 
                                className="btn btn-outline-secondary decrease-qty" 
                                onClick={() => handleQuantityChange(item.id, -1)}
                              >
                                -
                              </button>
                              <input 
                                type="text" 
                                className="form-control text-center item-qty" 
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQuantity = parseInt(e.target.value);
                                  if (!isNaN(newQuantity) && newQuantity > 0) {
                                    handleQuantityChange(item.id, newQuantity, true);
                                  }
                                }}
                              />
                              <button 
                                className="btn btn-outline-secondary increase-qty" 
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>${(item.price * item.quantity).toFixed(2)}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-danger remove-item" 
                              onClick={() => removeFromCart(item.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="row mt-4">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Have a promo code?</h5>
                        <div className="input-group mb-3">
                          <input type="text" className="form-control" placeholder="Enter code" />
                          <button className="btn btn-outline-secondary" type="button">Apply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Order Summary</h5>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Subtotal</span>
                          <span id="cart-subtotal">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Tax</span>
                          <span id="cart-tax">${tax.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between fw-bold">
                          <span>Total</span>
                          <span id="cart-total">${total.toFixed(2)}</span>
                        </div>
                        <button 
                          className="btn btn-primary w-100 mt-3" 
                          onClick={handleCheckoutClick}
                        >
                          Proceed to Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recently Viewed Section */}
        <div className="content-wrapper mt-4">
          <h3 style={{ color: 'white' }}>Recently Viewed</h3>
          <div className="row mt-3">
            {recentlyViewed.length === 0 ? (
              <div className="col-12 text-center text-white">
                <p>No recently viewed games. Start browsing to see your history!</p>
              </div>
            ) : (
              recentlyViewed.map(game => (
                <div className="col-md-3 col-6 mb-4" key={game.id}>
                  <div className="card h-100">
                    <img 
                      src={`/assets/images/${game.image}`} 
                      className="card-img-top" 
                      alt={game.name}
                      style={{ width: '100%', height: '225px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/myotherimages/GameTribe_Logo.png';
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{game.name}</h5>
                      <p className="card-text">${game.price.toFixed(2)}</p>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => addToCart(game)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Required</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowLoginPrompt(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>You need to be logged in to complete your purchase.</p>
                <p>Please log in or create an account to continue.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowLoginPrompt(false)}
                >
                  Continue Shopping
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleRedirectToLogin}
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Checkout</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCheckoutModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h5>Shipping Information</h5>
                    <form>
                      <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">Full Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="fullName" 
                          value={shippingInfo.fullName}
                          onChange={handleShippingChange}
                          required 
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          id="email" 
                          value={shippingInfo.email}
                          onChange={handleShippingChange}
                          required 
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="address" 
                          value={shippingInfo.address}
                          onChange={handleShippingChange}
                          required 
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="city" className="form-label">City</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="city" 
                            value={shippingInfo.city}
                            onChange={handleShippingChange}
                            required 
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label htmlFor="state" className="form-label">State</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="state" 
                            value={shippingInfo.state}
                            onChange={handleShippingChange}
                            required 
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label htmlFor="zip" className="form-label">ZIP</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="zip" 
                            value={shippingInfo.zip}
                            onChange={handleShippingChange}
                            required 
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-6">
                    <h5>Payment Method</h5>
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="form-check mb-2">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="paymentMethod" 
                            id="creditCard" 
                            checked={paymentInfo.method === 'creditCard'}
                            onChange={handlePaymentMethodChange}
                          />
                          <label className="form-check-label" htmlFor="creditCard">
                            Credit Card
                          </label>
                        </div>
                        {paymentInfo.method === 'creditCard' && (
                          <div id="creditCardForm">
                            <div className="mb-3">
                              <label htmlFor="cardNumber" className="form-label">Card Number</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                id="cardNumber" 
                                placeholder="XXXX XXXX XXXX XXXX" 
                                value={paymentInfo.cardNumber}
                                onChange={handlePaymentInfoChange}
                                required 
                              />
                            </div>
                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label htmlFor="expDate" className="form-label">Expiration Date</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  id="expDate" 
                                  placeholder="MM/YY" 
                                  value={paymentInfo.expDate}
                                  onChange={handlePaymentInfoChange}
                                  required 
                                />
                              </div>
                              <div className="col-md-6 mb-3">
                                <label htmlFor="cvv" className="form-label">CVV</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  id="cvv" 
                                  placeholder="XXX" 
                                  value={paymentInfo.cvv}
                                  onChange={handlePaymentInfoChange}
                                  required 
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-body">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="paymentMethod" 
                            id="paypal" 
                            checked={paymentInfo.method === 'paypal'}
                            onChange={handlePaymentMethodChange}
                          />
                          <label className="form-check-label" htmlFor="paypal">
                            PayPal
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card mt-4">
                  <div className="card-body">
                    <h5>Order Summary</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Items ({cartItems.length})</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowCheckoutModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {showConfirmationModal && orderDetails && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order Confirmation</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowConfirmationModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <i className="fas fa-check-circle fa-5x text-success mb-3"></i>
                  <h4>Thank you for your purchase!</h4>
                  <p>Your order has been received and is being processed.</p>
                </div>
                
                <div className="order-details-container">
                  <div className="order-header">
                    <div className="row">
                      <div className="col-md-6">
                        <h5>Order Information</h5>
                        <p><strong>Order Number:</strong> {orderNumber}</p>
                        <p><strong>Order Date:</strong> {formatDate(orderDetails.date)}</p>
                        <p><strong>Payment Method:</strong> {orderDetails.paymentMethod === 'creditCard' ? 'Credit Card' : 'PayPal'}</p>
                      </div>
                      <div className="col-md-6">
                        <h5>Shipping Information</h5>
                        <p><strong>Name:</strong> {orderDetails.shippingInfo.fullName}</p>
                        <p><strong>Email:</strong> {orderDetails.shippingInfo.email}</p>
                        <p><strong>Address:</strong> {orderDetails.shippingInfo.address}, {orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state} {orderDetails.shippingInfo.zip}</p>
                      </div>
                    </div>
                  </div>
                  
                  <h5 className="mt-4">Order Summary</h5>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails.items.map(item => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={`/assets/images/${item.image}`} 
                                  alt={item.name} 
                                  className="me-3" 
                                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/myotherimages/GameTribe_Logo.png';
                                  }}
                                />
                                <span>{item.name}</span>
                              </div>
                            </td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>{item.quantity}</td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                          <td>${orderDetails.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan="3" className="text-end"><strong>Tax:</strong></td>
                          <td>${orderDetails.tax.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                          <td className="fw-bold">${orderDetails.total.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <div className="text-center mt-4">
                    <p>A confirmation email has been sent to {orderDetails.shippingInfo.email}</p>
                    <p>You can view your order history in your <Link to="/profile" className="order-link">profile page</Link>.</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => {
                    setShowConfirmationModal(false);
                    navigate('/profile');
                  }}
                >
                  Go to Profile
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowConfirmationModal(false)}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;