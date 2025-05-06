import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const storedRecentlyViewed = localStorage.getItem('recentlyViewed');
    
    if (storedCart) setCartItems(JSON.parse(storedCart));
    if (storedRecentlyViewed) setRecentlyViewed(JSON.parse(storedRecentlyViewed));
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Save recently viewed to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);
  
  // Add item to cart
  const addToCart = async (game) => {
    try {
      // Check if the game data is complete
      if (!game.id && game._id) {
        // If using MongoDB _id, convert to id for consistency
        game.id = game._id;
      }
      
      // Check if item already in cart
      const existingItemIndex = cartItems.findIndex(item => item.id === game.id);
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        setCartItems(updatedItems);
      } else {
        // Add new item with quantity 1
        setCartItems([...cartItems, { ...game, quantity: 1 }]);
      }
      
      // Show notification
      showNotification(`${game.name} has been added to your cart!`);
      
      return true;
    } catch (err) {
      console.error('Error adding to cart:', err);
      return false;
    }
  };
  
  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Update item quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  // Add to recently viewed
  const addToRecentlyViewed = async (game) => {
    try {
      // Check if the game data is complete
      if (!game.id && game._id) {
        // If using MongoDB _id, convert to id for consistency
        game.id = game._id;
      }
      
      setRecentlyViewed(prevItems => {
        // Remove if already in list
        const filteredItems = prevItems.filter(item => item.id !== game.id);
        
        // Add to beginning of array and keep only most recent 4
        return [game, ...filteredItems].slice(0, 4);
      });
      
      return true;
    } catch (err) {
      console.error('Error adding to recently viewed:', err);
      return false;
    }
  };
  
  // Show notification
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.classList.add('toast', 'show', 'position-fixed', 'bottom-0', 'end-0', 'm-3');
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    notification.setAttribute('aria-atomic', 'true');
    notification.innerHTML = `
      <div class="toast-header bg-success text-white">
        <strong class="me-auto">Cart Updated</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };
  
  // Calculate cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  // Get cart item count
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  
  // Fetch games from API
  const fetchGames = async () => {
    try {
      const response = await axios.get(`${API_URL}/games`);
      return response.data;
    } catch (err) {
      console.error('Error fetching games:', err);
      return [];
    }
  };
  
  // Fetch game by ID from API
  const fetchGameById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/games/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching game with ID ${id}:`, err);
      return null;
    }
  };
  
  // Fetch new releases from API
  const fetchNewReleases = async () => {
    try {
      const response = await axios.get(`${API_URL}/games/new-releases`);
      return response.data;
    } catch (err) {
      console.error('Error fetching new releases:', err);
      return [];
    }
  };
  
  // Fetch popular games from API
  const fetchPopularGames = async () => {
    try {
      const response = await axios.get(`${API_URL}/games/popular`);
      return response.data;
    } catch (err) {
      console.error('Error fetching popular games:', err);
      return [];
    }
  };
  
  // Context value
  const value = {
    cartItems,
    recentlyViewed,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToRecentlyViewed,
    getCartTotal,
    getCartCount,
    fetchGames,
    fetchGameById,
    fetchNewReleases,
    fetchPopularGames
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;