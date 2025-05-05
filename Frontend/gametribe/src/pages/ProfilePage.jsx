// ProfilePage.jsx - User profile page
import { useState, useEffect } from 'react';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: 'GameMaster123',
    avatar: '../assets/myotherimages/player_02.jpg',
    memberSince: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    personalNote: 'Click to enter text',
    gamesOwned: 0
  });
  
  const [activeTab, setActiveTab] = useState('about');
  const [showEditor, setShowEditor] = useState(false);
  const [personalNoteEditing, setPersonalNoteEditing] = useState(false);
  const [personalNoteText, setPersonalNoteText] = useState(profile.personalNote);

  // Initialize profile data from localStorage if available
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error parsing profile data:', error);
      }
    }

    const savedText = localStorage.getItem('savedText');
    if (savedText) {
      setPersonalNoteText(savedText);
      setProfile(prev => ({ ...prev, personalNote: savedText }));
    }
  }, []);

  // Save profile to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
    setShowEditor(false);
  };

  const handleNoteClick = () => {
    setPersonalNoteEditing(true);
  };

  const handleNoteChange = (e) => {
    setPersonalNoteText(e.target.value);
  };

  const handleNoteSubmit = () => {
    // If no text is entered, set a default message
    const finalText = personalNoteText || 'Click to enter text';
    
    // Save the text to localStorage and update profile
    localStorage.setItem('savedText', finalText);
    setProfile(prev => ({ ...prev, personalNote: finalText }));
    
    // Hide the text input
    setPersonalNoteEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNoteSubmit();
    }
  };

  return (
    <div className="profile-container">
      <div 
        className="profile-header"
        style={{ backgroundColor: getAccentColor(profile.avatar) }}
      >
        <img src={profile.avatar} alt="Profile Avatar" className="profile-avatar" />
      </div>

      <div className="profile-info">
        <div className="profile-actions">
          <button 
            className="edit-profile-btn"
            onClick={() => setShowEditor(true)}
          >
            <i className="fas fa-edit"></i> Edit Profile
          </button>
        </div>

        <div className="profile-name">{profile.name}</div>
      </div>

      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'about' ? 'active' : ''}`} 
          onClick={() => setActiveTab('about')}
        >
          About Me
        </div>
        <div 
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Favorite Games
        </div>
      </div>

      <div className="profile-details">
        <div className={`tab-content ${activeTab === 'about' ? 'active' : ''}`} id="aboutTab">
          <div className="detail-section">
            <h3>Member Since</h3>
            <p id="memberSinceDate">{profile.memberSince}</p>
          </div>

          <div className="detail-section">
            <h3>Personal Note</h3>
            {personalNoteEditing ? (
              <input 
                type="text"
                id="myTextbox"
                value={personalNoteText}
                onChange={handleNoteChange}
                onBlur={handleNoteSubmit}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            ) : (
              <div 
                id="displayArea" 
                onClick={handleNoteClick}
              >
                {profile.personalNote}
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3>Games Owned</h3>
            <p>{profile.gamesOwned || '--'} games</p>
          </div>
        </div>

        <div className={`tab-content ${activeTab === 'activity' ? 'active' : ''}`} id="activityTab">
          <div className="coming-soon">
            <p>Favorited games will be placed here</p>
          </div>
        </div>
      </div>

      {showEditor && (
        <ProfileEditor 
          profile={profile}
          onSave={handleProfileUpdate}
          onCancel={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

// Helper function to get accent color based on avatar image
const getAccentColor = (imageSrc) => {
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

  // Extract image file name from the src
  const imageName = imageSrc.split('/').pop();

  // Find the corresponding accent color
  return accentColors[imageName] || '#9f86c0'; // Default to accent color if not found
};

export const ProfileEditor = ({ profile, onSave, onCancel }) => {
    const [displayName, setDisplayName] = useState(profile.name);
    const [selectedImage, setSelectedImage] = useState(profile.avatar);
    
    // Curated profile images
    const profileImages = [
      '../assets/myotherimages/player_01.jpg',
      '../assets/myotherimages/player_02.jpg',
      '../assets/myotherimages/player_03.jpg',
      '../assets/myotherimages/player_04.jpg',
      '../assets/myotherimages/player_05.jpg',
      '../assets/myotherimages/player_06.jpg',
      '../assets/myotherimages/player_07.jpg',
      '../assets/myotherimages/player_08.jpg',
    ];
  
    const handleSave = () => {
      onSave({
        name: displayName,
        avatar: selectedImage
      });
    };
  
    return (
      <div className="edit-profile-popup">
        <div className="edit-profile-modal">
          <h2>Edit Profile</h2>
          
          <div className="profile-image-selection">
            {profileImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Profile Option ${index + 1}`}
                className={`profile-image-option ${selectedImage === image ? 'selected' : ''}`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
  
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input 
              type="text" 
              id="displayName" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
  
          <div className="popup-actions">
            <button className="btn-cancel" onClick={onCancel}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    );
};

export default ProfilePage;