import { createContext, useState, useContext } from 'react';
import paymongoService from '../utils/paymongoService';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Calculate total amount from cart items
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);
    };

    // Process payment with card
    const processCardPayment = async (cardDetails) => {
        setPaymentLoading(true);
        setPaymentError(null);
        
        try {
            // Convert amount to smallest currency unit (centavos)
            const amount = Math.round(calculateTotal() * 100);
            
            // 1. Create payment intent
            const paymentIntentResponse = await paymongoService.createPaymentIntent(amount);
            const paymentIntentId = paymentIntentResponse.data.id;
            
            // 2. Create payment method with card details
            const paymentMethodResponse = await paymongoService.createPaymentMethod({
                type: 'card',
                details: {
                    card_number: cardDetails.cardNumber.replace(/\s/g, ''),
                    exp_month: parseInt(cardDetails.expMonth),
                    exp_year: parseInt(cardDetails.expYear),
                    cvc: cardDetails.cvc
                },
                billing: {
                    name: cardDetails.name,
                    email: cardDetails.email,
                    phone: cardDetails.phone
                }
            });
            
            const paymentMethodId = paymentMethodResponse.data.id;
            
            // 3. Attach payment method to payment intent
            const attachResponse = await paymongoService.attachPaymentMethod(
                paymentIntentId,
                paymentMethodId
            );
            
            // 4. Handle 3DS authentication if needed
            const paymentIntent = attachResponse.data;
            
            if (paymentIntent.attributes.status === 'awaiting_next_action') {
                // Redirect to 3DS authentication URL
                window.location.href = paymentIntent.attributes.next_action.redirect.url;
                return;
            }
            
            // Payment successful
            setPaymentSuccess(true);
            return paymentIntent;
            
        } catch (error) {
            setPaymentError(error.message || 'Payment processing failed');
            throw error;
        } finally {
            setPaymentLoading(false);
        }
    };

    // Process payment with e-wallet (GCash, GrabPay, etc.)
    const processEWalletPayment = async (type) => {
        setPaymentLoading(true);
        setPaymentError(null);
        
        try {
            // Convert amount to smallest currency unit (centavos)
            const amount = Math.round(calculateTotal() * 100);
            
            // Create source for e-wallet payment
            const sourceResponse = await paymongoService.createSource(
                amount,
                type // 'gcash', 'grab_pay', etc.
            );
            
            // Redirect to checkout URL
            const checkoutUrl = sourceResponse.data.attributes.redirect.checkout_url;
            window.location.href = checkoutUrl;
            
            return sourceResponse.data;
            
        } catch (error) {
            setPaymentError(error.message || 'Payment processing failed');
            throw error;
        } finally {
            setPaymentLoading(false);
        }
    };

    // Check payment status
    const checkPaymentStatus = async (paymentIntentId) => {
        try {
            const response = await paymongoService.getPaymentIntent(paymentIntentId);
            const status = response.data.attributes.status;
            
            if (status === 'succeeded') {
                setPaymentSuccess(true);
            }
            
            return status;
        } catch (error) {
            console.error('Error checking payment status:', error);
            throw error;
        }
    };

    return (
        <ClientContext.Provider value={{ 
            cartItems, 
            setCartItems,
            paymentLoading,
            paymentError,
            paymentSuccess,
            setPaymentSuccess,
            calculateTotal,
            processCardPayment,
            processEWalletPayment,
            checkPaymentStatus
        }}>
            {children}
        </ClientContext.Provider>
    );
};

export const useClientContext = () => {
    const context = useContext(ClientContext);
    if (!context) throw new Error('useClient must be used within a ClientProvider');
    return context;
};