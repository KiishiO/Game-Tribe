// Example of using these services in a React component
import React, { useState, useEffect } from 'react';
import { gameService } from '../services/gameService';

const GameListPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    genre: 'all',
    sort: 'releaseDate',
    page: 1,
    limit: 12
  });

  // Load games on component mount and when filters change
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const result = await gameService.getGames(filters);
        setGames(result.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch games. Please try again later.');
        setLoading(false);
      }
    };

    fetchGames();
  }, [filters]);

  // Handle genre filter change
  const handleGenreChange = (genre) => {
    setFilters({
      ...filters,
      genre,
      page: 1 // Reset to first page when changing filters
    });
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    setFilters({
      ...filters,
      sort
    });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage
    });
  };

  if (loading) return <div>Loading games...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Games</h1>
      
      {/* Filter controls */}
      <div className="filters">
        <button 
          className={filters.genre === 'all' ? 'active' : ''} 
          onClick={() => handleGenreChange('all')}
        >
          All
        </button>
        <button 
          className={filters.genre === 'Action' ? 'active' : ''} 
          onClick={() => handleGenreChange('Action')}
        >
          Action
        </button>
        {/* More genre buttons */}
      </div>
      
      {/* Game grid */}
      <div className="games-grid">
        {games.map(game => (
          <GameCard key={game._id} game={game} />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="pagination">
        <button 
          disabled={filters.page === 1} 
          onClick={() => handlePageChange(filters.page - 1)}
        >
          Previous
        </button>
        <span>Page {filters.page}</span>
        <button onClick={() => handlePageChange(filters.page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default GameListPage;