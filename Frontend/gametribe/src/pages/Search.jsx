import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/Search.css';

const Search = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGenre, setActiveGenre] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [priceFilter, setPriceFilter] = useState([0, 100]);
  const [sortOption, setSortOption] = useState('name-asc');
  const { addToRecentlyViewed, addToCart } = useCart();

  useEffect(() => {
    // Fetch games data
    const fetchGames = async () => {
      setLoading(true);
      try {
        // Try to fetch from API first
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

        // Fall back to local JSON file
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

        // If all attempts fail, try the imported data
        try {
          // Import data directly
          const data = await import('../data.json');
          setGames(data.games || data.default.games);
        } catch (importError) {
          console.error("Import games data failed:", importError);
          throw new Error("All methods to fetch game data failed");
        }
      } catch (err) {
        console.error("Error fetching games data:", err);
        setError("Failed to load games. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Extract unique genres from games
  const extractGenres = () => {
    if (!games || !games.length) return [];
    
    const genresSet = new Set();
    games.forEach(game => {
      if (game.genres && Array.isArray(game.genres)) {
        game.genres.forEach(genre => genresSet.add(genre));
      }
    });
    return Array.from(genresSet).sort();
  };

  // Find min and max prices
  const getPriceRange = () => {
    if (!games || !games.length) return { min: 0, max: 100 };
    
    let min = Number.MAX_VALUE;
    let max = 0;
    
    games.forEach(game => {
      if (game.price) {
        min = Math.min(min, game.price);
        max = Math.max(max, game.price);
      }
    });
    
    return { min: Math.floor(min), max: Math.ceil(max) };
  };

  // Set initial price filter when games are loaded
  useEffect(() => {
    if (games && games.length > 0) {
      const { min, max } = getPriceRange();
      setPriceFilter([min, max]);
    }
  }, [games]);

  // Filter and sort games
  const processedGames = () => {
    if (!games || !games.length) return [];

    // First filter
    const filtered = games.filter(game => {
      const matchesGenre = activeGenre === 'all' || 
        (game.genres && game.genres.includes(activeGenre));
      
      const matchesSearch = !searchTerm || 
        game.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = 
        game.price >= priceFilter[0] && game.price <= priceFilter[1];
      
      return matchesGenre && matchesSearch && matchesPrice;
    });

    // Then sort
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  };

  // Split games for two sections (new releases and popular)
  const getGameSections = () => {
    const filtered = processedGames();
    const halfwayPoint = Math.ceil(filtered.length / 2);
    
    return {
      newReleases: filtered.slice(0, halfwayPoint),
      popularGames: filtered.slice(halfwayPoint)
    };
  };

  // Handle genre filter click
  const handleGenreClick = (genre) => {
    setActiveGenre(genre);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle price filter change
  const handlePriceChange = (e, index) => {
    const newPriceFilter = [...priceFilter];
    newPriceFilter[index] = Number(e.target.value);
    setPriceFilter(newPriceFilter);
  };

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Handle game card click to open modal
  const handleGameClick = (game) => {
    setSelectedGame(game);
    setShowModal(true);
    
    // Add to recently viewed if the context is available
    if (addToRecentlyViewed) {
      addToRecentlyViewed(game);
    }
  };

  // Handle add to cart
  const handleAddToCart = (e, game) => {
    e.stopPropagation(); // Prevent opening the modal
    if (addToCart) {
      addToCart(game);
    }
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Get game sections based on filters
  const { newReleases, popularGames } = getGameSections();
  const genres = extractGenres();
  const { min: minPrice, max: maxPrice } = getPriceRange();

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

  if (loading) {
    return (
      <div className="app-container">
        <div className="container">
          <div className="loading-container">
            <div className="loading">Loading games...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="container">
          <div className="error-container">
            <div className="error-message">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
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

        {/* Advanced Filters */}
        <div className="advanced-filters">
          <div className="filter-section">
            <h3>Genres</h3>
            <div className="filter-container">
              <button 
                className={`filter-btn ${activeGenre === 'all' ? 'active' : ''}`}
                onClick={() => handleGenreClick('all')}
              >
                All
              </button>
              
              {genres.map(genre => (
                <button 
                  key={genre}
                  className={`filter-btn ${activeGenre === genre ? 'active' : ''}`}
                  onClick={() => handleGenreClick(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-section price-filter">
              <h3>Price Range</h3>
              <div className="price-slider-container">
                <div className="price-display">
                  <span>${priceFilter[0].toFixed(2)}</span>
                  <span>${priceFilter[1].toFixed(2)}</span>
                </div>
                <div className="range-inputs">
                  <input 
                    type="range" 
                    min={minPrice} 
                    max={maxPrice} 
                    value={priceFilter[0]} 
                    onChange={(e) => handlePriceChange(e, 0)} 
                    className="price-slider min-slider"
                  />
                  <input 
                    type="range" 
                    min={minPrice} 
                    max={maxPrice} 
                    value={priceFilter[1]} 
                    onChange={(e) => handlePriceChange(e, 1)} 
                    className="price-slider max-slider"
                  />
                </div>
              </div>
            </div>
            
            <div className="filter-section sort-filter">
              <h3>Sort By</h3>
              <select 
                value={sortOption} 
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Game Count & Reset Filters */}
        <div className="results-info">
          <span className="results-count">
            {processedGames().length} games found
          </span>
          {(activeGenre !== 'all' || searchTerm || priceFilter[0] > minPrice || priceFilter[1] < maxPrice) && (
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setActiveGenre('all');
                setSearchTerm('');
                setPriceFilter([minPrice, maxPrice]);
                setSortOption('name-asc');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* New Releases Section */}
        <h2 className="section-title">New Releases</h2>
        <div className="games-grid">
          {newReleases.length > 0 ? (
            newReleases.map(game => (
              <div 
                key={game.id} 
                className="game-card" 
                onClick={() => handleGameClick(game)}
              >
                <div className="game-card-image-container">
                  <img 
                    src={`/assets/images/${game.image}`} 
                    alt={game.name} 
                    className="game-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/myotherimages/GameTribe_Logo.png';
                    }}
                  />
                  <div className="game-price">${game.price.toFixed(2)}</div>
                </div>
                <div className="game-info">
                  <h3 className="game-title">{game.name}</h3>
                  <div className="game-genres">
                  {game.genres && game.genres.map((genre, index) => (
                        <span 
                          key={index}
                          className={`badge bg-${getBadgeColor(genre)}-subtle border border-${getBadgeColor(genre)}-subtle text-${getBadgeColor(genre)}-emphasis rounded-pill me-1`}>
                          {genre}
                        </span>
                      ))}
                  </div>
                  <button 
                    className="add-to-cart-btn"
                    onClick={(e) => handleAddToCart(e, game)}
                  >
                    <i className="fas fa-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-games-message">No new releases found matching your criteria.</div>
          )}
        </div>

        {/* Popular Games Section */}
        <h2 className="section-title">Popular Games</h2>
        <div className="games-grid">
          {popularGames.length > 0 ? (
            popularGames.map(game => (
              <div 
                key={game.id} 
                className="game-card" 
                onClick={() => handleGameClick(game)}
              >
                <div className="game-card-image-container">
                  <img 
                    src={`/assets/images/${game.image}`} 
                    alt={game.name} 
                    className="game-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/myotherimages/GameTribe_Logo.png';
                    }}
                  />
                  <div className="game-price">${game.price.toFixed(2)}</div>
                </div>
                <div className="game-info">
                  <h3 className="game-title">{game.name}</h3>
                  <div className="game-genres">
                    {game.genres && game.genres.map((genre, index) => (
                        <span 
                          key={index}
                          className={`badge bg-${getBadgeColor(genre)}-subtle border border-${getBadgeColor(genre)}-subtle text-${getBadgeColor(genre)}-emphasis rounded-pill me-1`}>
                          {genre}
                        </span>
                      ))}
                  </div>
                  <button 
                    className="add-to-cart-btn"
                    onClick={(e) => handleAddToCart(e, game)}
                  >
                    <i className="fas fa-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-games-message">No popular games found matching your criteria.</div>
          )}
        </div>

        {/* Game Details Modal */}
        {showModal && selectedGame && (
          <div className="modal" onClick={handleCloseModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <span className="close-btn" onClick={handleCloseModal}>&times;</span>
              <div className="modal-grid">
                <div className="modal-image-container">
                  <img 
                    src={`/assets/images/${selectedGame.image}`} 
                    alt={selectedGame.name} 
                    className="modal-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/myotherimages/GameTribe_Logo.png';
                    }}
                  />
                  <div className="modal-price-buy">
                    <div className="modal-price">${selectedGame.price.toFixed(2)}</div>
                    <button 
                      className="modal-add-to-cart"
                      onClick={(e) => {
                        handleAddToCart(e, selectedGame);
                        handleCloseModal();
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div>
                  <h2 className="modal-game-title">{selectedGame.name}</h2>
                  <div className="modal-game-genres">
                    {selectedGame.genres && selectedGame.genres.map((genre, index) => (
                      <span key={index} className="modal-genre">{genre}</span>
                    ))}
                  </div>
                  <p className="modal-description">{selectedGame.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;