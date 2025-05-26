import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingBear from '/src/assets/menu_assets/loading_bear.svg';

const Processing = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Get order data from location state or localStorage
    const orderData = location.state || JSON.parse(localStorage.getItem('hamutea_order') || '{}');
    
    useEffect(() => {
        // Simulate processing time
        const timer = setTimeout(() => {
            try {
                if (!orderData || !orderData.items || orderData.items.length === 0) {
                    throw new Error('No order data found');
                }
                
                // For cash payments, go directly to success page
                if (orderData.paymentMethod === 'Cash on Pickup') {
                    navigate('/payment-success', { 
                        state: {
                            orderDetails: orderData
                        }
                    });
                } else {
                    // For e-wallet payments, go to payment page
                    navigate('/payment', { 
                        state: {
                            ...orderData,
                            autoProcess: true
                        }
                    });
                }
            } catch (err) {
                console.error('Processing error:', err);
                setError(err.message || 'An error occurred while processing your order');
                setIsLoading(false);
            }
        }, 2000);
        
        return () => clearTimeout(timer);
    }, [orderData, navigate]);
    
    return (
        <div className="relative w-full min-h-screen bg-[#FDF8F8] font-[SF Pro Rounded] overflow-x-hidden flex flex-col px-4 pt-[120px]">
            <div className="flex-grow flex flex-col items-center justify-center">
                {/* Loading Bear SVG */}
                <img
                    src={LoadingBear}
                    alt="Loading Bear"
                    className="w-[160px] sm:w-[192.8px] h-auto mb-10 animate-bounce"
                />

                {/* Processing Message */}
                <h1 className="text-[32px] sm:text-[40px] font-semibold text-[#462525] text-center">
                    {isLoading ? "Processing Order..." : error ? "Order Error" : "Order Complete"}
                </h1>

                <p className="mt-2 text-[13px] sm:text-[14px] font-medium text-[#462525]/85 font-[Inter] text-center">
                    {isLoading 
                        ? "Please wait while we process your order" 
                        : error ? error : "Your order has been processed successfully"}
                </p>

                {/* Error handling */}
                {error && (
                    <div className="mt-8 flex flex-col items-center">
                        <button 
                            onClick={() => navigate('/menu')}
                            className="mt-4 bg-[#D91517] text-white px-8 py-3 rounded-full hover:bg-[#a31113] transition-colors duration-200"
                        >
                            Back to Menu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Processing;