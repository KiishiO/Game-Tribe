import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import '../styles/Home.css';

// Import the game data directly
import gameData from '../data.json';

const Home = () => {
  const [games, setGames] = useState([]);
  const { addToCart, addToRecentlyViewed } = useCart();
  const [favoriteGames, setFavoriteGames] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const fetchUserFavorites = async () => {
    try {
      const favorites = await userService.getFavorites();
      setFavoriteGames(new Set(favorites.map(game => game._id || game.id)));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    // Attempt to load game data
    const fetchGames = async () => {
      setLoading(true);
      try {
        // Method 1: Try API first if backend is running
        try {
          const response = await fetch('/api/games');
          if (response.ok) {
            const data = await response.json();
            setGames(data);
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.warn("API fetch failed:", apiError);
        }

        // Method 2: Try local JSON file in public folder
        try {
          const localResponse = await fetch('/data.json');
          if (localResponse.ok) {
            const data = await localResponse.json();
            setGames(data.games || data);
            setLoading(false);
            return;
          }
        } catch (localError) {
          console.warn("Local JSON fetch failed:", localError);
        }

        // Method 3: Fall back to imported data if both methods fail
        console.log("Using imported game data as fallback");
        setGames(gameData.games || gameData);
        
      } catch (err) {
        console.error("All methods to fetch game data failed:", err);
        setError("Failed to load games. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, []);
  
  // Initialize Bootstrap carousel
  useEffect(() => {
    // Check if Bootstrap is available
    if (typeof window !== 'undefined' && window.bootstrap) {
      // Initialize all carousels
      const carouselElement = document.getElementById('myCarousel');
      if (carouselElement) {
        new window.bootstrap.Carousel(carouselElement, {
          interval: 5000,
          wrap: true
        });
      }
    }
  }, []);

  // Fetch user's favorite games
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchUserFavorites();
    } else {
      setFavoriteGames(new Set());
    }
  }, [isAuthenticated, currentUser]);

  const handleToggleFavorite = async (game, e) => {
    e.stopPropagation(); // Prevent card click
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Use the numeric id from the game object, not _id
    const gameId = game.id || game._id;
    
    try {
      if (favoriteGames.has(gameId)) {
        await userService.removeFromFavorites(gameId);
        const newSet = new Set(favoriteGames);
        newSet.delete(gameId);
        setFavoriteGames(newSet);
      } else {
        await userService.addToFavorites(gameId);
        const newSet = new Set(favoriteGames);
        newSet.add(gameId);
        setFavoriteGames(newSet);
      }
      // Refresh favorites to sync with server
      await fetchUserFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Show user-friendly error
      if (error.response && error.response.status === 400) {
        await fetchUserFavorites();
      }
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < Math.round(rating || 0) ? 'filled' : ''}`}
        style={{ color: index < Math.round(rating || 0) ? '#ffd700' : '#ddd', fontSize: '0.8rem' }}
      />
    ));
  };
  
  // State for game details modal
  const [selectedGame, setSelectedGame] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Function to open game details modal
  const openGameDetails = (game) => {
    setSelectedGame(game);
    setShowModal(true);
    addToRecentlyViewed(game);
  };

  // Display loading state
  if (loading) {
    return (
      <div className="app-container">
        <main className="main-content">
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="app-container">
        <main className="main-content">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="app-container">
      <main className="main-content">
        {/* Carousel Component */}
        <div id="myCarousel" className="carousel slide mb-6" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active"
              aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1"
              aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2"
              aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/assets/images/Super Mario Land Adv_.gif" alt="Super_Mario" />
              <div className="carousel-caption text-start">
                <h1>Discover Your Gaming Community</h1>
                <p className="opacity-75">Join Game Tribe and connect with gamers worldwide.</p>
                <p><Link className="btn btn-lg btn-primary" to="/profile">Join Now</Link></p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/assets/images/Day in the Life.jpg" alt="Day in the Life" />
              <div className="carousel-caption">
                <h1>Explore New Gaming Experiences</h1>
                <p>Find your next favorite game and team up with like-minded players.</p>
                <p><Link className="btn btn-lg btn-primary" to="/search">Browse Games</Link></p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/assets/images/PowerPuff Girls.jpg" alt="PowerPuff Girls" />
              <div className="carousel-caption text-end">
                <h1>Shop Shop and More Shopping</h1>
                <p>Buy games and play offline</p>
                <p><Link className="btn btn-lg btn-primary" to="/cart">View Cart</Link></p>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        {/* Main Heading */}
        <div className="main-heading">
          <h1 className="bungee-shade-regular">Game Tribe</h1>
        </div>

        {/* Content Wrapper */}
        <div className="content-wrapper">
          {/* Game Catalog */}
          <div className="catalog-container">
            {games && games.length > 0 ? (
              games.map((game) => {
                const gameId = game._id || game.id;
                const isFavorite = favoriteGames.has(gameId);
                
                return (
                  <div className="card" key={gameId}>
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
                      <button 
                        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                        onClick={(e) => handleToggleFavorite(game, e)}
                        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <i className={`fas fa-heart ${isFavorite ? 'filled' : ''}`}></i>
                      </button>
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">{game.name}</h3>
                      <div className="card-price">${(game.price || 0).toFixed(2)}</div>
                      <div className="card-details">
                        <span>Genre: {game.genres && game.genres.map((genre, index) => (
                          <span 
                            key={index}
                            className={`badge bg-${getBadgeColor(genre)}-subtle border border-${getBadgeColor(genre)}-subtle text-${getBadgeColor(genre)}-emphasis rounded-pill me-1`}>
                            {genre}
                          </span>
                        ))}
                        </span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button onClick={() => openGameDetails(game)} className="btn btn-primary">Details</button>
                      <button onClick={() => addToCart(game)} className="btn btn-secondary">Add to Cart</button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center">
                <p>No games found. Please check your connection or try again later.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Game Details Modal */}
      {showModal && selectedGame && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedGame.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-5">
                    <img 
                      src={`/assets/images/${selectedGame.image}`} 
                      className="img-fluid rounded" 
                      alt={selectedGame.name}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = '/assets/myotherimages/GameTribe_Logo.png';
                      }} 
                    />
                  </div>
                  <div className="col-md-7">
                    <h5>Game Description</h5>
                    <p>{selectedGame.description}</p>
                    <div className="mt-3">
                      <h6>Genres:</h6>
                      {selectedGame.genres && selectedGame.genres.map((genre, index) => (
                        <span key={index} className="badge bg-secondary me-2">{genre}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to map genre to badge color
const getBadgeColor = (genre) => {
  const colorMap = {
    'Horror': 'primary',
    'Action': 'secondary', 
    'Adventure': 'success',
    'Role-Playing': 'danger',
    'Puzzle': 'warning',
    'Simulation': 'info',
    'Strategy': 'light',
    'Multi-Player': 'dark'
  };
  
  return colorMap[genre] || 'secondary';
};

export default Home;