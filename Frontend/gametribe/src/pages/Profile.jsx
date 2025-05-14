import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
  const { currentUser, isAuthenticated, updateProfile, logout, getUserOrders } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('about');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPersonalNote, setShowPersonalNote] = useState(true);
  const [personalNoteText, setPersonalNoteText] = useState('');
  const [editableDisplayName, setEditableDisplayName] = useState('');
  const [selectedProfileImage, setSelectedProfileImage] = useState('');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteGames, setFavoriteGames] = useState([]);
  
  // Array of profile images to choose from
  const profileImages = [
    '/assets/myotherimages/player_01.jpg',
    '/assets/myotherimages/player_02.jpg',
    '/assets/myotherimages/player_03.jpg',
    '/assets/myotherimages/player_04.jpg',
    '/assets/myotherimages/player_05.jpg',
    '/assets/myotherimages/player_06.jpg',
    '/assets/myotherimages/player_07.jpg',
    '/assets/myotherimages/player_08.jpg',
  ];
  
  // Map of accent colors for different profile images
  const accentColors = {
    'player_01.jpg': '#BCABA1',
    'player_02.jpg': '#E5DDDC',
    'player_03.jpg': '#DBDBDB',
    'player_04.jpg': '#F7EFED',
    'player_05.jpg': '#D5D9EC',
    'player_06.jpg': '#E3E1DB',
    'player_07.jpg': '#FCF5F5',
    'player_08.jpg': '#DAD9C5'
  };
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Initialize form values and load orders when user data is loaded
  useEffect(() => {
    if (currentUser) {
      setPersonalNoteText(currentUser.personalNote || 'Click to enter text');
      setEditableDisplayName(currentUser.displayName || '');
      setSelectedProfileImage(currentUser.profileImage || profileImages[0]);
      
      // Load user orders
      const loadOrders = async () => {
        setIsLoading(true);
        try {
          const userOrders = await getUserOrders();
          // Ensure orders is always an array
          setOrders(Array.isArray(userOrders) ? userOrders : []);
        } catch (error) {
          console.error('Error loading orders:', error);
          setOrders([]);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadOrders();

      const loadFavorites = async () => {
        try {
          const favorites = await userService.getFavorites();
          setFavoriteGames(favorites);
        } catch (error) {
          console.error('Error loading favorites:', error);
          setFavoriteGames([]);
        }
      };
      
      loadFavorites();
    }
  }, [currentUser, getUserOrders]);

  const removeFavorite = async (gameId) => {
    try {
      await userService.removeFromFavorites(gameId);
      // Reload favorites from server
      const favorites = await userService.getFavorites();
      setFavoriteGames(favorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };
  
  // Get current accent color based on profile image
  const getCurrentAccentColor = () => {
    if (!currentUser || !currentUser.profileImage) return accentColors['player_01.jpg'];
    
    const imageName = currentUser.profileImage.split('/').pop();
    return accentColors[imageName] || accentColors['player_01.jpg'];
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  // Open edit profile modal
  const handleOpenEditModal = () => {
    setEditableDisplayName(currentUser.displayName || '');
    setSelectedProfileImage(currentUser.profileImage || profileImages[0]);
    setShowEditModal(true);
  };
  
  // Cancel edit profile
  const handleCancelEdit = () => {
    setShowEditModal(false);
  };
  
  // Save profile changes
  const handleSaveProfile = () => {
    updateProfile({
      displayName: editableDisplayName,
      profileImage: selectedProfileImage
    });
    
    setShowEditModal(false);
  };
  
  // Toggle personal note input
  const handlePersonalNoteClick = () => {
    setShowPersonalNote(false);
  };
  
  // Save personal note
  const handlePersonalNoteChange = (e) => {
    if (e.key === 'Enter') {
      const newNote = e.target.value.trim() || 'Click to enter text';
      setPersonalNoteText(newNote);
      setShowPersonalNote(true);
      
      // Save to user profile
      updateProfile({ personalNote: newNote });
    }
  };
  
  // Handle viewing order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // If not authenticated or no user data, show loading
  if (!isAuthenticated || !currentUser) {
    return <div className="loading">Loading profile...</div>;
  }
  
  // Render the orders tab content
  const renderOrdersTab = () => {
    if (isLoading) {
      return <div className="loading">Loading your orders...</div>;
    }
    
    // Check if orders is an array and has items
    if (!Array.isArray(orders) || orders.length === 0) {
      return (
        <div className="coming-soon">
          <p>You haven't placed any orders yet.</p>
          <Link to="/search" className="btn btn-primary mt-3">
            Browse Games
          </Link>
        </div>
      );
    }
    
    return (
      <div className="orders-list">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id || order.id} className="order-row">
                  <td>{order.orderNumber}</td>
                  <td>{formatDate(order.date || order.createdAt)}</td>
                  <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <span className="status-badge">{order.status}</span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleViewOrder(order)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  return (
    <div className="app-container">
      <div className="main-content">
        <div className="profile-container">
          <div 
            className="profile-header"
            style={{ backgroundColor: getCurrentAccentColor() }}
          >
            <img 
              src={currentUser.profileImage} 
              alt="Profile Avatar" 
              className="profile-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/myotherimages/player_01.jpg';
              }}
            />
          </div>

          <div className="profile-info">
            <div className="profile-actions">
              <button className="edit-profile-btn" onClick={handleOpenEditModal}>
                <i className="fas fa-edit"></i> Edit Profile
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>

            <div className="profile-name">{currentUser.displayName}</div>
          </div>

          <div className="tabs">
            <div 
              className={`tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => handleTabClick('about')}
            >
              About Me
            </div>
            <div 
              className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => handleTabClick('activity')}
            >
              Favorite Games
            </div>
            <div 
              className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => handleTabClick('orders')}
            >
              Order History
            </div>
          </div>

          <div className="profile-details">
            {/* About Tab */}
            <div className={`tab-content ${activeTab === 'about' ? 'active' : ''}`} id="aboutTab">
              <div className="detail-section">
                <h3>Member Since</h3>
                <p>{formatDate(currentUser.memberSince)}</p>
              </div>

              <div className="detail-section">
                <h3>Personal Note</h3>
                {showPersonalNote ? (
                  <div 
                    id="displayArea" 
                    onClick={handlePersonalNoteClick}
                  >
                    {personalNoteText}
                  </div>
                ) : (
                  <input 
                    type="text" 
                    id="myTextbox" 
                    placeholder="Enter some text here"
                    defaultValue={personalNoteText}
                    onKeyDown={handlePersonalNoteChange}
                    autoFocus
                    style={{ display: 'block' }}
                  />
                )}
              </div>
              
              <div className="detail-section">
                <h3>Email</h3>
                <p>{currentUser.email}</p>
              </div>
            </div>

            {/* Favorites Tab */}
            <div className={`tab-content ${activeTab === 'activity' ? 'active' : ''}`} id="activityTab">
              {favoriteGames && favoriteGames.length > 0 ? (
                <div className="catalog-container">
                  {favoriteGames.map(game => (
                    <div key={game._id || game.id} className="card">
                      <div className="card-image-container">
                        <img 
                          src={`/assets/images/${game.image}`} 
                          alt={game.name}
                          className="card-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/myotherimages/GameTribe_Logo.png';
                          }}
                        />
                      </div>
                      <div className="card-content">
                        <h4 className="card-title">{game.name}</h4>
                        <div className="card-price">${(game.price || 0).toFixed(2)}</div>
                        <button 
                          className="btn btn-primary mt-3"
                          onClick={() => removeFavorite(game.id || game._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="coming-soon">
                  <p>You haven't added any favorite games yet.</p>
                  <Link to="/home" className="btn btn-primary mt-3">
                    Browse Games
                  </Link>
                </div>
              )}
            </div>

            {/* Orders Tab */}
            <div className={`tab-content ${activeTab === 'orders' ? 'active' : ''}`} id="ordersTab">
              {renderOrdersTab()}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="edit-profile-popup">
          <div className="edit-profile-modal">
            <h2>Edit Profile</h2>
            
            <div className="profile-image-selection">
              {profileImages.map((img, index) => (
                <img 
                  key={index}
                  src={img}
                  alt={`Profile option ${index + 1}`}
                  className={`profile-image-option ${selectedProfileImage === img ? 'selected' : ''}`}
                  onClick={() => setSelectedProfileImage(img)}
                />
              ))}
            </div>

            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input 
                type="text" 
                id="displayName" 
                value={editableDisplayName}
                onChange={(e) => setEditableDisplayName(e.target.value)}
              />
            </div>

            <div className="popup-actions">
              <button className="btn-cancel" onClick={handleCancelEdit}>Cancel</button>
              <button className="btn-save" onClick={handleSaveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="edit-profile-popup order-details-popup">
          <div className="edit-profile-modal order-details-modal">
            <h2>Order Details</h2>
            <span className="close-btn" onClick={() => setShowOrderModal(false)}>&times;</span>
            
            <div className="order-header">
              <div className="row">
                <div className="col-md-6">
                  <h5>Order Information</h5>
                  <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                  <p><strong>Order Date:</strong> {formatDate(selectedOrder.date || selectedOrder.createdAt)}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod === 'creditCard' ? 'Credit Card' : 'PayPal'}</p>
                </div>
                <div className="col-md-6">
                  <h5>Shipping Information</h5>
                  <p><strong>Name:</strong> {selectedOrder.shippingInfo.fullName}</p>
                  <p><strong>Email:</strong> {selectedOrder.shippingInfo.email}</p>
                  <p><strong>Address:</strong> {selectedOrder.shippingInfo.address}, {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state} {selectedOrder.shippingInfo.zip}</p>
                </div>
              </div>
            </div>
            
            <h5 className="mt-4">Items</h5>
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
                  {selectedOrder.items.map((item, index) => (
                    <tr key={item.id || item._id || index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={`/assets/images/${item.image}`} 
                            alt={item.name} 
                            className="me-3" 
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
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
                    <td>${selectedOrder.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Tax:</strong></td>
                    <td>${selectedOrder.tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                    <td className="fw-bold">${selectedOrder.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="popup-actions mt-4">
              <button className="btn-download">
                <i className="fas fa-download me-2"></i> Download Receipt
              </button>
              <button className="btn-close-order" onClick={() => setShowOrderModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;