// GameCard.jsx - Reusable game card component
import { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { RecentlyViewedContext } from '../context/RecentlyViewedContext.jsx';
import GameDetails from './GameDetails';
import '../assets/styles/GameCard.css';

const GameCard = ({ game }) => {
  const { addToCart } = useContext(CartContext);
  const { addToRecentlyViewed } = useContext(RecentlyViewedContext);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = () => {
    addToRecentlyViewed(game);
    setShowDetails(true);
  };

  const handleAddToCart = () => {
    addToCart(game);
  };

  return (
    <>
      <div className="card">
        <img src={`/assets/images/${game.image}`} alt={game.name} className="card-image" />
        <div className="card-content">
          <h3 className="card-title">{game.name}</h3>
          <div className="card-details">
            <span>Genre: {game.genres.map(genre => (
              <span key={genre} className={`badge bg-${getGenreStyle(genre)}-subtle border border-${getGenreStyle(genre)}-subtle text-${getGenreStyle(genre)}-emphasis rounded-pill`}>
                {genre}
              </span>
            ))}</span>
          </div>
        </div>
        <div className="card-actions">
          <button onClick={handleViewDetails} className="btn btn-primary">Details</button>
          <button onClick={handleAddToCart} className="btn btn-secondary">Add to Cart</button>
        </div>
      </div>

      {showDetails && (
        <GameDetails 
          game={game} 
          show={showDetails} 
          onClose={() => setShowDetails(false)} 
        />
      )}
    </>
  );
};

// Helper function to assign style classes based on genre
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

export default GameCard;