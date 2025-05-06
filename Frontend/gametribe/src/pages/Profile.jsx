import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { currentUser, isAuthenticated, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('about');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPersonalNote, setShowPersonalNote] = useState(true);
  const [personalNoteText, setPersonalNoteText] = useState('');
  const [editableDisplayName, setEditableDisplayName] = useState('');
  const [selectedProfileImage, setSelectedProfileImage] = useState('');
  
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
  
  // Initialize form values when user data is loaded
  useEffect(() => {
    if (currentUser) {
      setPersonalNoteText(currentUser.personalNote || 'Click to enter text');
      setEditableDisplayName(currentUser.displayName || '');
      setSelectedProfileImage(currentUser.profileImage || profileImages[0]);
    }
  }, [currentUser]);
  
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
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // If not authenticated or no user data, show loading
  if (!isAuthenticated || !currentUser) {
    return <div className="loading">Loading profile...</div>;
  }
  
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
          </div>

          <div className="profile-details">
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
                <h3>Games Owned</h3>
                <p>{currentUser.gamesOwned || 0} games</p>
              </div>
              
              <div className="detail-section">
                <h3>Email</h3>
                <p>{currentUser.email}</p>
              </div>
            </div>

            <div className={`tab-content ${activeTab === 'activity' ? 'active' : ''}`} id="activityTab">
              {currentUser.favoriteGames && currentUser.favoriteGames.length > 0 ? (
                <div className="favorite-games">
                  {/* Favorite games would be listed here */}
                  <p>You have {currentUser.favoriteGames.length} favorite games</p>
                </div>
              ) : (
                <div className="coming-soon">
                  <p>You haven't added any favorite games yet</p>
                </div>
              )}
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
    </div>
  );
};

export default Profile;