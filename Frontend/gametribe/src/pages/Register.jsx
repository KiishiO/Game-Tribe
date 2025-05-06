import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('/assets/myotherimages/player_01.jpg');
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password || !confirmPassword || !displayName) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Register new user
      await register(email, password, displayName, selectedAvatar);
      
      // Redirect to profile page on success
      navigate('/profile');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src="/assets/myotherimages/GameTribe_Logo.png" alt="Game Tribe Logo" className="auth-logo" />
          <h1 className="auth-title">Join Game Tribe</h1>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Choose a display name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Choose Profile Image</label>
            <div className="avatar-selection">
              {profileImages.map((img, index) => (
                <img 
                  key={index}
                  src={img}
                  alt={`Avatar option ${index + 1}`}
                  className={`avatar-option ${selectedAvatar === img ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(img)}
                />
              ))}
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;