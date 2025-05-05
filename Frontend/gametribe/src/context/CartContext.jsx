// src/context/CartContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading cart:', err);
        setError('Failed to load cart data.');
        setLoading(false);
      }
    };
    
    loadCart();
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cartItems]);
  
  // Add item to cart
  const addToCart = (game) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === game.id);
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        };
        return newItems;
      } else {
        // Add new item
        return [...prevItems, {
          id: game.id,
          name: game.name,
          price: game.price,
          image: game.image,
          quantity: 1
        }];
      }
    });
    
    // Show feedback
    alert(`${game.name} has been added to your cart!`);
  };
  
  // Update item quantity
  const updateQuantity = (id, change, setExact = false) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = setExact 
            ? change 
            : item.quantity + change;
          
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      });
    });
  };
  
  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };
  
  // Calculate cart totals
  const getCartTotals = () => {
    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Calculate tax (e.g., 8%)
    const tax = subtotal * 0.08;
    
    // Calculate total
    const total = subtotal + tax;
    
    // Count items
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    
    return {
      subtotal,
      tax,
      total,
      itemCount
    };
  };
  
  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      error,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      getCartTotals
    }}>
      {children}
    </CartContext.Provider>
  );
};