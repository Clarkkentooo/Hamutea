import LoadingBear from '/src/assets/menu_assets/loading_bear.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createSource } from '../../utils/paymongoService';
import { useClientContext } from '../../context/ClientContext';

const ProcessingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems } = useClientContext();
    const estimatedTime = location.state?.customTime || '1:10';
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // If there are cart items, process the payment
        if (cartItems.length > 0) {
            const processPayment = async () => {
                try {
                    // Calculate total amount in centavos (smallest currency unit)
                    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0) * 100;
                    
                    // Create a payment source for GCash (you can change this to other payment methods)
                    const sourceResponse = await createSource(
                        totalAmount,
                        'gcash',
                        'PHP',
                        `${window.location.origin}/payment-success`,
                        `${window.location.origin}/payment-failed`
                    );
                    
                    // Redirect to the checkout URL
                    if (sourceResponse?.data?.attributes?.redirect?.checkout_url) {
                        window.location.href = sourceResponse.data.attributes.redirect.checkout_url;
                    } else {
                        setError('Failed to create payment source');
                        setIsProcessing(false);
                    }
                } catch (error) {
                    console.error('Payment processing error:', error);
                    setError('An error occurred while processing your payment');
                    setIsProcessing(false);
                }
            };
            
            // Uncomment this to enable actual payment processing
            // processPayment();
            
            // For now, just simulate processing
            const timer = setTimeout(() => {
                setIsProcessing(false);
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [cartItems]);

    return (
        <>
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
                        {isProcessing ? "Processing Order..." : "Order Confirmed!"}
                    </h1>

                    <p className="mt-2 text-[13px] sm:text-[14px] font-medium text-[#462525]/85 font-[Inter] text-center">
                        {isProcessing 
                            ? "We are still preparing your order" 
                            : "Your order has been received and is being prepared"}
                    </p>

                    {error && (
                        <p className="mt-4 text-red-500 text-center">
                            {error}
                        </p>
                    )}

                    {/* Progress bar (3 dots + lines) */}
                    <div className="relative mt-12 w-[90%] max-w-[607px] h-[58px] flex items-center justify-between">
                        <div className="w-[58px] h-[58px] bg-[#D91517] border-4 border-[#D91517] rounded-full animate-pulse" />
                        <div className="flex-1 h-1 border-t-4 border-[#D91517] mx-2 animate-pulse" />
                        <div className={`w-[58px] h-[58px] border-4 border-[#D91517] ${!isProcessing ? "bg-[#D91517]" : "opacity-25"} rounded-full animate-pulse`} />
                        <div className="flex-1 h-1 border-t-4 border-[#D91517] opacity-25 mx-2 animate-pulse" />
                        <div className="w-[58px] h-[58px] border-4 border-[#D91517] opacity-25 rounded-full animate-pulse" />
                    </div>

                    <p className="mt-14 text-[18px] sm:text-[20px] text-[#462525]/45 font-medium font-[Inter] text-center">
                        Estimated time of Pick-up: {estimatedTime}
                    </p>

                    {!isProcessing && (
                        <button 
                            onClick={() => navigate('/menu')}
                            className="mt-8 bg-[#D91517] text-white px-8 py-3 rounded-full hover:bg-[#a31113] transition-colors duration-200"
                        >
                            Back to Menu
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProcessingPage;