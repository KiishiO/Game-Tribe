// SearchPage.jsx - Game catalog and search page
import { useState, useEffect } from 'react';
import { gameService } from '../services/gameService';
import '../assets/styles/SearchPage.css';

const SearchPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeGenre, setActiveGenre] = useState('all');

  // Available genres for filtering
  const genres = [
    'all',
    'Horror',
    'Action',
    'Adventure',
    'Role-Playing',
    'Puzzle',
    'Simulation',
    'Strategy',
    'Multi-Player'
  ];

  // Fetch games on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await gameService.getGames();
        setGames(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load games. Please try again later.');
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle genre filter click
  const handleGenreFilter = (genre) => {
    setActiveGenre(genre);
  };

  // Filter games based on search term and active genre
  const filteredGames = games.filter(game => {
    // Search term filter
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Genre filter
    const matchesGenre = activeGenre === 'all' || game.genres.includes(activeGenre);
    
    return matchesSearch && matchesGenre;
  });

  // Split games into two sections: "New Releases" and "Popular Games"
  const halfwayPoint = Math.ceil(filteredGames.length / 2);
  const newReleases = filteredGames.slice(0, halfwayPoint);
  const popularGames = filteredGames.slice(halfwayPoint);

  // Handle game details view
  const openGameDetails = (game) => {
    setSelectedGame(game);
  };

  const closeGameDetails = () => {
    setSelectedGame(null);
  };

  return (
    <div className="container">
      <header>
        <h1 className="bungee-shade-regular">Game Search</h1>
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search games..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </header>

      <div className="filter-container">
        {genres.map(genre => (
          <button
            key={genre}
            className={`filter-btn ${activeGenre === genre ? 'active' : ''}`}
            onClick={() => handleGenreFilter(genre)}
          >
            {genre === 'all' ? 'All' : genre}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading games...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <h2 className="section-title">New Releases</h2>
          <div className="games-grid" id="newReleases">
            {newReleases.length > 0 ? (
              newReleases.map(game => (
                <div className="game-card" key={game._id} data-name={game.name}>
                  <img
                    src={`/assets/images/${game.image}`}
                    alt={game.name}
                    className="game-image"
                  />
                  <div className="game-info">
                    <h3 className="game-title">{game.name}</h3>
                    <div className="game-genres">
                      {game.genres.map(genre => (
                        <span key={genre} className="genre-tag">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="game-details-btn"
                    onClick={() => openGameDetails(game)}
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="no-results">No games found matching your criteria.</div>
            )}
          </div>

          <h2 className="section-title">Popular Games</h2>
          <div className="games-grid" id="popularGames">
            {popularGames.length > 0 ? (
              popularGames.map(game => (
                <div className="game-card" key={game._id} data-name={game.name}>
                  <img
                    src={`/assets/images/${game.image}`}
                    alt={game.name}
                    className="game-image"
                  />
                  <div className="game-info">
                    <h3 className="game-title">{game.name}</h3>
                    <div className="game-genres">
                      {game.genres.map(genre => (
                        <span key={genre} className="genre-tag">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="game-details-btn"
                    onClick={() => openGameDetails(game)}
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="no-results">No games found matching your criteria.</div>
            )}
          </div>
        </>
      )}

      {/* Game Details Modal */}
      {selectedGame && (
        <div className="modal" id="gameModal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeGameDetails}>&times;</span>
            <div className="modal-grid">
              <div>
                <img
                  src={`/assets/images/${selectedGame.image}`}
                  alt={selectedGame.name}
                  className="modal-image"
                />
              </div>
              <div>
                <h2 className="modal-game-title">{selectedGame.name}</h2>
                <div className="modal-game-genres">
                  {selectedGame.genres.map(genre => (
                    <span key={genre} className="modal-genre">
                      {genre}
                    </span>
                  ))}
                </div>
                <p className="modal-description">{selectedGame.description}</p>
                <p className="modal-price">Price: ${selectedGame.price.toFixed(2)}</p>
                <button
                  className="btn btn-primary add-to-cart-btn"
                  onClick={() => {
                    // Add to cart functionality would be implemented here
                    closeGameDetails();
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;