// CartPage.jsx - Shopping cart page
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { RecentlyViewedContext } from '../context/RecentlyViewedContext';
import CheckoutModal from '../components/CheckoutModal';
import OrderConfirmationModal from '../components/OrderConfirmationModal';
 import '../assets/styles/CartPage.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeItem, clearCart, getCartTotals } = useContext(CartContext);
  const { recentlyViewed, addToCart } = useContext(RecentlyViewedContext);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  const { subtotal, tax, total } = getCartTotals();

  const handlePlaceOrder = () => {
    setShowCheckoutModal(false);
    
    // Simulate a small delay before showing confirmation
    setTimeout(() => {
      setShowConfirmationModal(true);
      clearCart(); // Clear the cart after successful order
    }, 500);
  };

  return (
    <>
      <div className="main-heading">
        <h1 className="bungee-shade-regular">Cart</h1>
      </div>

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
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={`/assets/images/${item.image}`} 
                              alt={item.name} 
                              className="me-3" 
                              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} 
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
                              className="btn btn-outline-secondary" 
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              -
                            </button>
                            <input 
                              type="text" 
                              className="form-control text-center" 
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value);
                                if (!isNaN(newQuantity) && newQuantity > 0) {
                                  updateQuantity(item.id, newQuantity, true);
                                }
                              }}
                            />
                            <button 
                              className="btn btn-outline-secondary" 
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => removeItem(item.id)}
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
                        onClick={() => setShowCheckoutModal(true)}
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
                    style={{ width: '100%', height: '225px' }} 
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

      {/* Checkout Modal */}
      <CheckoutModal
        show={showCheckoutModal}
        onHide={() => setShowCheckoutModal(false)}
        onPlaceOrder={handlePlaceOrder}
        cartItems={cartItems}
        totals={getCartTotals()}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
      />
    </>
  );
};

export default CartPage;