import { createContext, useState, useContext } from 'react';


const ClientContext = createContext();


export const ClientProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    return (
        <ClientContext.Provider value={{ cartItems, setCartItems }}>
            {children}
        </ClientContext.Provider>
    );
};


export const useClientContext = () => {
    const context = useContext(ClientContext);
    if (!context) throw new Error('useClient must be used within a ClientProvider');
    return context;
};
