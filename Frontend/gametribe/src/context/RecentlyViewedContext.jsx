// src/context/RecentlyViewedContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { CartContext } from './CartContext';

export const RecentlyViewedContext = createContext();

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { addToCart } = useContext(CartContext);
  
  // Load recently viewed from localStorage on mount
  useEffect(() => {
    const storedRecentlyViewed = localStorage.getItem('recentlyViewed');
    if (storedRecentlyViewed) {
      try {
        setRecentlyViewed(JSON.parse(storedRecentlyViewed));
      } catch (error) {
        console.error('Error parsing recently viewed data:', error);
        setRecentlyViewed([]);
      }
    }
  }, []);

  // Save recently viewed to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Add game to recently viewed
  const addToRecentlyViewed = (game) => {
    setRecentlyViewed(prevItems => {
      // Remove the game if it already exists in the list
      const filteredItems = prevItems.filter(item => item.id !== game.id);
      
      // Add the game to the beginning of the list
      const updatedItems = [game, ...filteredItems];
      
      // Limit to 4 most recent games
      return updatedItems.slice(0, 4);
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{
      recentlyViewed,
      addToRecentlyViewed,
      addToCart // Pass through the addToCart function for convenience
    }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};