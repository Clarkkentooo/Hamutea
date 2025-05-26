import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingBear from '/src/assets/menu_assets/loading_bear.svg';
import { createPaymentLink, createPaymentIntent } from '../../utils/paymongoService';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([
        { id: 'link', name: 'All Payment Methods', selected: true },
        { id: 'gcash', name: 'GCash', selected: false },
        { id: 'paymaya', name: 'Maya', selected: false },
        { id: 'grab_pay', name: 'GrabPay', selected: false },
        { id: 'card', name: 'Credit/Debit Card', selected: false }
    ]);
    
    // Get order data from location state or localStorage
    const orderData = location.state || JSON.parse(localStorage.getItem('hamutea_order') || '{}');
    
    // Handle payment method selection
    const selectPaymentMethod = (id) => {
        setPaymentMethods(prev => prev.map(method => ({
            ...method,
            selected: method.id === id
        })));
    };
    
    // Get selected payment method
    const getSelectedPaymentMethod = () => {
        return paymentMethods.find(method => method.selected);
    };
    
    useEffect(() => {
        // If no order data, redirect to menu
        if (!orderData || !orderData.total) {
            setError('No order data found');
            setIsLoading(false);
            return;
        }
        
        // Auto-process payment if coming directly to this page
        if (location.state?.autoProcess) {
            processPayment();
        } else {
            setIsLoading(false);
        }
    }, [orderData]);
    
    const processPayment = async () => {
        setIsLoading(true);
        
        try {
            const selectedMethod = getSelectedPaymentMethod();
            console.log('Processing payment with method:', selectedMethod.name);
            console.log('Order data:', orderData);
            
            // Always use payment link for all payment methods
            const result = await createPaymentLink(
                orderData.total,
                'Hamutea Order Payment',
                `Order for pickup at ${orderData.customTime || 'After Order'}`,
                {
                    name: orderData.customerName || 'Hamutea Customer',
                    email: orderData.customerEmail || 'customer@example.com',
                    phone: orderData.customerPhone || '09123456789'
                }
            );
            
            console.log('Payment link result:', result);
            
            if (result.data?.attributes?.checkout_url) {
                console.log('Redirecting to checkout URL:', result.data.attributes.checkout_url);
                
                // Save order data to localStorage before redirecting
                localStorage.setItem('hamutea_order', JSON.stringify({
                    ...orderData,
                    paymentMethod: selectedMethod.name || 'Online Payment',
                    paymentId: result.data.id
                }));
                
                // Redirect to PayMongo checkout page
                window.location.href = result.data.attributes.checkout_url;
            } else {
                console.error('No checkout URL in response:', result);
                throw new Error('Failed to create payment link');
            }
        } catch (err) {
            console.error('Payment error:', err);
            // Display a more user-friendly error message
            const errorMessage = err.message && err.message.includes('Payment error:') 
                ? err.message 
                : 'An error occurred while processing your payment. Please try again later.';
            
            setError(errorMessage);
            setIsLoading(false);
        }
    };
    
    return (
        <div className="relative w-full min-h-screen bg-[#FDF8F8] font-[SF Pro Rounded] overflow-x-hidden flex flex-col px-4 pt-[120px] pb-20">
            <div className="max-w-md mx-auto w-full">
                <div className="flex items-center mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F8F8F8] mr-4"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#462525" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="font-semibold text-xl sm:text-2xl text-[#462525]">Payment</h2>
                </div>
                
                {isLoading ? (
                    <div className="flex-grow flex flex-col items-center justify-center py-12">
                        <img
                            src={LoadingBear}
                            alt="Loading Bear"
                            className="w-[160px] sm:w-[192.8px] h-auto mb-10 animate-bounce"
                        />
                        <h1 className="text-[32px] sm:text-[40px] font-semibold text-[#462525] text-center">
                            Processing Payment...
                        </h1>
                        <p className="mt-2 text-[13px] sm:text-[14px] font-medium text-[#462525]/85 font-[Inter] text-center">
                            Please wait while we redirect you to our payment partner
                        </p>
                    </div>
                ) : error ? (
                    <div className="flex-grow flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-[24px] sm:text-[32px] font-semibold text-[#462525] text-center">
                            Payment Error
                        </h1>
                        <p className="mt-2 text-[13px] sm:text-[14px] font-medium text-[#462525]/85 font-[Inter] text-center">
                            {error}
                        </p>
                        <button 
                            onClick={() => navigate('/menu')}
                            className="mt-8 bg-[#D91517] text-white px-8 py-3 rounded-full hover:bg-[#a31113] transition-colors duration-200"
                        >
                            Back to Menu
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-[30px] shadow-lg p-6 mb-6">
                            <h3 className="font-semibold text-lg text-[#462525] mb-4">Order Summary</h3>
                            
                            <div className="space-y-4 mb-6">
                                {orderData.items?.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="mr-3">
                                                <span className="text-[#D91517] font-medium">{item.qty}x</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[#462525]">{item.name}</h4>
                                                <p className="text-xs text-gray-500">
                                                    {item.size} • {item.sugar} Sugar • {item.ice}
                                                    {item.addOns && item.addOns.length > 0 && (
                                                        <span> • {item.addOns.join(', ')}</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-[#D91517] font-medium">
                                            ₱{(item.price * item.qty).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₱{orderData.total?.toFixed(2) || '0.00'}</span>
                                </div>
                                
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-[#D91517]">₱{orderData.total?.toFixed(2) || '0.00'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-[30px] shadow-lg p-6 mb-6">
                            <h3 className="font-semibold text-lg text-[#462525] mb-4">Payment Method</h3>
                            <p className="text-sm text-gray-500 mb-4">You'll be redirected to PayMongo to complete your payment securely</p>
                            
                            <div className="space-y-3">
                                {paymentMethods.map(method => (
                                    <div 
                                        key={method.id}
                                        onClick={() => selectPaymentMethod(method.id)}
                                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                                            method.selected 
                                                ? 'border-[#D91517] bg-[#FEF2F2]' 
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                                method.selected ? 'border-[#D91517]' : 'border-gray-300'
                                            }`}>
                                                {method.selected && (
                                                    <div className="w-3 h-3 rounded-full bg-[#D91517]"></div>
                                                )}
                                            </div>
                                            <span className="font-medium">{method.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <button 
                            onClick={processPayment}
                            className="w-full bg-[#D91517] text-white py-4 rounded-full font-medium hover:bg-[#a31113] transition-colors duration-200"
                        >
                            Pay ₱{orderData.total?.toFixed(2) || '0.00'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Payment;