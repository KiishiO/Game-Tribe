// // HomePage.jsx - Home page with carousel and game listings
// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import GameCard from '../components/GameCard';
// import Carousel from '../components/Carousel';
// import { fetchGames } from '../services/gameService';
// import '../assets/styles/HomePage.css';

// const HomePage = () => {
//   const [games, setGames] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadGames = async () => {
//       try {
//         const gamesData = await fetchGames();
//         setGames(gamesData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error loading games:', error);
//         setLoading(false);
//       }
//     };

//     loadGames();
//   }, []);

//   return (
//     <>
//       <Carousel />
      
//       <div className="main-heading">
//         <h1 className="bungee-shade-regular">Game Tribe</h1>
//       </div>

//       <div className="content-wrapper">
//         <div className="catalog-container">
//           {loading ? (
//             <p>Loading games...</p>
//           ) : (
//             games.map(game => (
//               <GameCard 
//                 key={game._id} 
//                 game={game} 
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default HomePage;

// HomePage.jsx - Home page with carousel integration
import { useState, useEffect } from 'react';
import { gameService } from '../services/gameService';
import Carousel from '../components/Carousel';
import GameCard from '../components/GameCard';
import '../assets/styles/HomePage.css';

const HomePage = () => {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define custom carousel slides (optional)
  const carouselSlides = [
    {
      image: '../assets/images/Super Mario Land Adv_.gif',
      title: 'Discover Your Gaming Community',
      description: 'Join Game Tribe and connect with gamers worldwide.',
      buttonText: 'Join Now',
      buttonLink: '/profile',
      alignment: 'text-start'
    },
    {
      image: '../assets/images/Day in the Life.jpg',
      title: 'Explore New Gaming Experiences',
      description: 'Find your next favorite game and team up with like-minded players.',
      buttonText: 'Browse Games',
      buttonLink: '/search',
      alignment: 'text-center'
    },
    {
      image: '../assets/images/PowerPuff Girls.jpg',
      title: 'Shop Shop and More Shopping',
      description: 'Buy games and play offline',
      buttonText: 'View Cart',
      buttonLink: '/cart',
      alignment: 'text-end'
    }
  ];

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        // Fetch featured games from API
        const response = await gameService.getGames({ featured: true });
        setFeaturedGames(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading games:', error);
        setError('Failed to load featured games. Please try again later.');
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  return (
    <>
      {/* Carousel Component */}
      <Carousel slides={carouselSlides} />
      
      <div className="main-heading">
        <h1 className="bungee-shade-regular">Game Tribe</h1>
      </div>

      <div className="content-wrapper">
        <h2 className="section-title">Featured Games</h2>
        
        {loading ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading games...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
        ) : (
          <div className="catalog-container">
            {featuredGames.length > 0 ? (
              featuredGames.map(game => (
                <GameCard key={game._id} game={game} />
              ))
            ) : (
              <p className="no-games-message">No featured games available at this time.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;