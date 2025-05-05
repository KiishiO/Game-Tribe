import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (game) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === game.id);
      
      if (existingItem) {
        // Increase quantity if item already exists
        return prevItems.map(item => 
          item.id === game.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...game, quantity: 1 }];
      }
    });

    // Show feedback toast (could be enhanced with a Toast component)
    alert(`${game.name} has been added to your cart!`);
  };

  // Update item quantity
  const updateQuantity = (id, change, setExact = false) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = setExact 
            ? change 
            : item.quantity + change;
          
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      // Remove item if quantity is zero or less
      return updatedItems.filter(item => item.quantity > 0);
    });
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate cart totals
  const getCartTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    return {
      subtotal,
      tax,
      total,
      itemCount: cartItems.reduce((count, item) => count + item.quantity, 0)
    };
  };

  return (
    <CartContext.Provider value={{
      cartItems,
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