// CartContext.jsx - Updated with API service integration
import { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../services/cartService';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
    itemCount: 0
  });
  
  const { user, isAuthenticated } = useContext(AuthContext);
  
  // Load cart data from API if user is authenticated, otherwise from localStorage
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      
      try {
        if (isAuthenticated) {
          // Fetch cart from API
          const response = await cartService.getCart();
          setCartItems(response.data.cart.items);
          setCartTotals({
            subtotal: response.data.subtotal,
            tax: response.data.tax,
            total: response.data.total,
            itemCount: response.data.itemCount
          });
        } else {
          // Load from localStorage
          const storedCart = localStorage.getItem('cart');
          if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            setCartItems(parsedCart);
            calculateTotals(parsedCart);
          }
        }
      } catch (err) {
        console.error('Error loading cart:', err);
        setError('Failed to load cart data.');
        
        // Fall back to localStorage if API fails
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCartItems(parsedCart);
          calculateTotals(parsedCart);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
  }, [isAuthenticated, user]);
  
  // Save cart to localStorage when it changes (if not authenticated)
  useEffect(() => {
    if (!isAuthenticated && cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);
  
  // Calculate totals for local cart
  const calculateTotals = (items) => {
    let subtotal = 0;
    let itemCount = 0;
    
    if (items.length > 0) {
      subtotal = items.reduce((total, item) => {
        itemCount += item.quantity;
        return total + (item.price * item.quantity);
      }, 0);
    }
    
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + tax;
    
    setCartTotals({
      subtotal,
      tax,
      total,
      itemCount
    });
  };
  
  // Add item to cart
  const addToCart = async (game) => {
    try {
      if (isAuthenticated) {
        // Add to cart via API
        const response = await cartService.addToCart(game._id || game.id);
        setCartItems(response.data.cart.items);
        setCartTotals({
          subtotal: response.data.subtotal,
          tax: response.data.tax,
          total: response.data.total,
          itemCount: response.data.itemCount
        });
      } else {
        // Add to local cart
        setCartItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === game.id);
          
          if (existingItem) {
            const updatedItems = prevItems.map(item => 
              item.id === game.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            );
            calculateTotals(updatedItems);
            return updatedItems;
          } else {
            const newItem = {
              id: game._id || game.id,
              name: game.name,
              price: game.price,
              image: game.image,
              quantity: 1
            };
            const updatedItems = [...prevItems, newItem];
            calculateTotals(updatedItems);
            return updatedItems;
          }
        });
      }
      
      // Show feedback toast (could be enhanced with a Toast component)
      alert(`${game.name} has been added to your cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart.');
    }
  };
  
  // Update item quantity
  const updateQuantity = async (id, change, setExact = false) => {
    try {
      if (isAuthenticated) {
        // Update via API
        const newQuantity = setExact ? change : null;
        const response = await cartService.updateCartItem(id, newQuantity || change);
        setCartItems(response.data.cart.items);
        setCartTotals({
          subtotal: response.data.subtotal,
          tax: response.data.tax,
          total: response.data.total,
          itemCount: response.data.itemCount
        });
      } else {
        // Update local cart
        setCartItems(prevItems => {
          const updatedItems = prevItems.map(item => {
            if (item.id === id) {
              const newQuantity = setExact 
                ? change 
                : item.quantity + change;
              
              return { ...item, quantity: Math.max(newQuantity, 0) };
            }
            return item;
          }).filter(item => item.quantity > 0);
          
          calculateTotals(updatedItems);
          return updatedItems;
        });
      }
    } catch (err) {
      console.error('Error updating cart:', err);
      setError('Failed to update cart.');
    }
  };
  
  // Remove item from cart
  const removeItem = async (id) => {
    try {
      if (isAuthenticated) {
        // Remove via API
        const response = await cartService.removeCartItem(id);
        setCartItems(response.data.cart.items);
        setCartTotals({
          subtotal: response.data.subtotal,
          tax: response.data.tax,
          total: response.data.total,
          itemCount: response.data.itemCount
        });
      } else {
        // Remove from local cart
        setCartItems(prevItems => {
          const updatedItems = prevItems.filter(item => item.id !== id);
          calculateTotals(updatedItems);
          return updatedItems;
        });
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError('Failed to remove item from cart.');
    }
  };
  
  // Clear cart
  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        // Clear via API
        await cartService.clearCart();
      }
      
      // Clear local state
      setCartItems([]);
      setCartTotals({
        subtotal: 0,
        tax: 0,
        total: 0,
        itemCount: 0
      });
      
      // Clear localStorage
      localStorage.removeItem('cart');
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart.');
    }
  };
  
  // Create cart for order checkout
  const createOrderFromCart = () => {
    const orderItems = cartItems.map(item => ({
      game: item.id,
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price
    }));
    
    return {
      orderItems,
      subtotal: cartTotals.subtotal,
      taxPrice: cartTotals.tax,
      totalPrice: cartTotals.total
    };
  };
  
  return (
    <CartContext.Provider value={{
      cartItems,
      cartTotals,
      loading,
      error,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      createOrderFromCart
    }}>
      {children}
    </CartContext.Provider>
  );
};