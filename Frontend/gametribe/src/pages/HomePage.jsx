// HomePage.jsx - Home page with carousel and game listings
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import Carousel from '../components/Carousel';
import { fetchGames } from '../services/gameService';
import '../assets/styles/HomePage.css';

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const gamesData = await fetchGames();
        setGames(gamesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading games:', error);
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  return (
    <>
      <Carousel />
      
      <div className="main-heading">
        <h1 className="bungee-shade-regular">Game Tribe</h1>
      </div>

      <div className="content-wrapper">
        <div className="catalog-container">
          {loading ? (
            <p>Loading games...</p>
          ) : (
            games.map(game => (
              <GameCard 
                key={game._id} 
                game={game} 
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;