import { createContext, useContext, useState, useEffect } from 'react';

const ClientContext = createContext();

export const useClientContext = () => useContext(ClientContext);

export const ClientProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  
  // Load cart items from localStorage on initial load
  useEffect(() => {
    const storedCart = localStorage.getItem('hamutea_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
    
    // Load order history from localStorage
    const storedHistory = localStorage.getItem('hamutea_order_history');
    if (storedHistory) {
      try {
        setOrderHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error('Error parsing order history from localStorage:', error);
      }
    }
  }, []);
  
  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hamutea_cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Save order history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hamutea_order_history', JSON.stringify(orderHistory));
  }, [orderHistory]);
  
  // Add order to history
  const addToOrderHistory = (order) => {
    setOrderHistory(prev => [order, ...prev]);
  };
  
  // Update order status
  const updateOrderStatus = (orderId, status) => {
    setOrderHistory(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };
  
  return (
    <ClientContext.Provider value={{ 
      cartItems, 
      setCartItems, 
      orderHistory, 
      setOrderHistory,
      addToOrderHistory,
      updateOrderStatus
    }}>
      {children}
    </ClientContext.Provider>
  );
};

export default ClientContext;