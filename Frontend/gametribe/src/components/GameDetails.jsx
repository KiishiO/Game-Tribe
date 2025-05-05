// GameDetails.jsx - Game details modal component
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { RecentlyViewedContext } from '../context/RecentlyViewedContext';
import '../assets/styles/GameDetails.css';

const GameDetails = ({ game, show, onClose }) => {
  const { addToCart } = useContext(CartContext);
  const { addToRecentlyViewed } = useContext(RecentlyViewedContext);
  
  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(game);
    onClose(); // Close modal after adding to cart
  };
  
  // Add to recently viewed when opened
  if (show && addToRecentlyViewed) {
    addToRecentlyViewed(game);
  }
  
  // If modal is not shown, don't render
  if (!show) return null;
  
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
    <div className="game-details-modal">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{game.name}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          <div className="game-details-grid">
            <div className="game-image-container">
              <img 
                src={`/assets/images/${game.image}`} 
                alt={game.name} 
                className="game-detail-image" 
              />
            </div>
            
            <div className="game-info-container">
              <div className="game-genres">
                {game.genres && game.genres.map(genre => (
                  <span 
                    key={genre} 
                    className={`genre-badge genre-${getGenreStyle(genre)}`}
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <div className="game-price">
                <span className="price-label">Price:</span>
                <span className="price-value">${game.price.toFixed(2)}</span>
              </div>
              
              <div className="game-description">
                <h3>Description</h3>
                <p>{game.description}</p>
              </div>
              
              <div className="game-actions">
                <button 
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button 
                  className="close-btn"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;