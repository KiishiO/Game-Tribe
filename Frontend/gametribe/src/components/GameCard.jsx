// GameCard.jsx - Reusable game card component
import { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { RecentlyViewedContext } from '../context/RecentlyViewedContext';
import GameDetails from './GameDetails';
import '../assets/styles/GameCard.css';

const GameCard = ({ game }) => {
  const { addToCart } = useContext(CartContext);
  const { addToRecentlyViewed } = useContext(RecentlyViewedContext);
  const [showDetails, setShowDetails] = useState(false);

  // Handle view details click
  const handleViewDetails = () => {
    if (addToRecentlyViewed) {
      addToRecentlyViewed(game);
    }
    setShowDetails(true);
  };

  // Handle add to cart click
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent opening details modal when clicking this button
    addToCart(game);
  };

  // Helper function to get badge style based on genre
  const getGenreStyle = (genre) => {
    const genreMap = {
      'Horror': 'primary',
      'Action': 'secondary',
      'Adventure': 'success',
      'Role-Playing': 'danger',
      'Puzzle': 'warning',
      'Simulation': 'info',
      'Strategy': 'light',
      'Multi-Player': 'dark'
    };
    return genreMap[genre] || 'primary';
  };

  return (
    <>
      <div className="game-card" onClick={handleViewDetails}>
        <div className="card-image-container">
          <img 
            src={`/assets/images/${game.image}`} 
            alt={game.name} 
            className="card-image" 
          />
          <div className="card-hover-overlay">
            <span className="view-details-btn">View Details</span>
          </div>
        </div>
        
        <div className="card-content">
          <h3 className="card-title">{game.name}</h3>
          
          <div className="card-genres">
            {game.genres && game.genres.slice(0, 2).map(genre => (
              <span 
                key={genre} 
                className={`genre-badge genre-${getGenreStyle(genre)}`}
              >
                {genre}
              </span>
            ))}
            {game.genres && game.genres.length > 2 && (
              <span className="genre-badge genre-more">+{game.genres.length - 2}</span>
            )}
          </div>
          
          <div className="card-price">${game.price.toFixed(2)}</div>
        </div>
        
        <button 
          className="card-add-to-cart" 
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>

      {/* Game Details Modal */}
      <GameDetails 
        game={game} 
        show={showDetails} 
        onClose={() => setShowDetails(false)} 
      />
    </>
  );
};

export default GameCard;