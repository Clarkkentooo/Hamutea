import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@utils/constants';

const ClientContext = createContext();

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};

// Helper function to safely parse JSON from localStorage
const getStoredData = (key, defaultValue = []) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const ClientProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => getStoredData(STORAGE_KEYS.CART));
  const [favoriteItems, setFavoriteItems] = useState(() => getStoredData(STORAGE_KEYS.FAVORITES));
  
  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Save favorite items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteItems));
  }, [favoriteItems]);
  
  // Toggle favorite status
  const toggleFavorite = (item) => {
    setFavoriteItems(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.imageKey === item.imageKey);
      return isAlreadyFavorite 
        ? prev.filter(fav => fav.imageKey !== item.imageKey)
        : [...prev, item];
    });
  };
  
  // Check if item is favorite
  const isFavorite = (item) => {
    return favoriteItems.some(fav => fav.imageKey === item.imageKey);
  };
  
  // Add item to cart
  const addToCart = (item) => {
    setCartItems(prev => [...prev, { ...item, id: Date.now() }]);
  };
  
  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };
  
  const value = {
    cartItems,
    setCartItems,
    favoriteItems,
    setFavoriteItems,
    toggleFavorite,
    isFavorite,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
  };
  
  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};

export default ClientContext;