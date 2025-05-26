import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPaymentStatus, getPaymentIntentStatus } from '../../utils/paymongoService';
import { useClientContext } from "@context/ClientContext";
import LoadingBear from '/src/assets/menu_assets/loading_bear.svg';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);
  const { setCartItems } = useClientContext ? useClientContext() : { setCartItems: () => {} };
  
  // Function to clear cart and save order to history
  const clearOrderData = () => {
    // Clear cart items from context
    if (setCartItems) {
      setCartItems([]);
    }
    
    // Get order details and save to history
    const orderData = location.state?.orderDetails;
    if (orderData) {
      // Generate a unique ID and order number
      const orderId = `order_${Date.now()}`;
      const orderNumber = Math.floor(100000 + Math.random() * 900000);
      
      // Create history entry
      const historyEntry = {
        id: orderId,
        orderNumber: orderNumber.toString(),
        date: new Date().toISOString(),
        status: 'processing',
        items: orderData.items,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
        pickupTime: orderData.customTime || 'After Order'
      };
      
      // Save to localStorage
      const existingHistory = localStorage.getItem('hamutea_order_history');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.unshift(historyEntry);
      localStorage.setItem('hamutea_order_history', JSON.stringify(history));
    }
    
    // Clear current order data
    localStorage.removeItem('cart_items');
    localStorage.removeItem('hamutea_order');
  };

  useEffect(() => {
    // Check if we should auto-redirect to main system
    const urlParams = new URLSearchParams(window.location.search);
    const returnToSystem = urlParams.get('return_to_system');
    
    if (returnToSystem === 'true') {
      // Redirect to main system after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
    
    const fetchOrderDetails = async () => {
      try {
        // Get order details from location state or localStorage
        let details = location.state?.orderDetails;
        
        if (!details) {
          const storedDetails = localStorage.getItem('hamutea_order');
          if (storedDetails) {
            details = JSON.parse(storedDetails);
          }
        }
        
        if (!details) {
          throw new Error('No order details found');
        }
        
        // Clear cart after successful payment
        clearOrderData();
        
        setOrderDetails(details);
        
        // Get payment ID from URL params or location state
        const urlParams = new URLSearchParams(window.location.search);
        const paymentId = urlParams.get('payment_id');
        const paymentIntentId = location.state?.paymentIntentId || details.paymentIntentId || urlParams.get('payment_intent_id');
        
        if (paymentId) {
          try {
            // Verify payment status with PayMongo
            const paymentStatus = await getPaymentStatus(paymentId);
            if (paymentStatus.data) {
              setPaymentDetails(paymentStatus.data);
            } else {
              console.warn('Payment verification returned no data');
            }
          } catch (paymentError) {
            console.error('Payment verification error:', paymentError);
            // Continue showing success page even if verification fails
          }
        } else if (paymentIntentId) {
          try {
            // Verify payment intent status
            const intentStatus = await getPaymentIntentStatus(paymentIntentId);
            if (intentStatus.data) {
              setPaymentDetails(intentStatus.data);
            } else {
              console.warn('Payment intent verification returned no data');
            }
          } catch (intentError) {
            console.error('Payment intent verification error:', intentError);
            // Continue showing success page even if verification fails
          }
        } else {
          // No payment ID found, but we'll still show the success page
          console.warn('No payment ID found for verification');
        }
        
        // Save order to backend (you would implement this)
        // await saveOrderToBackend(details, paymentDetails);
        
        setLoading(false);
      } catch (error) {
        console.error('Error processing payment:', error);
        // Display a more user-friendly error message
        const errorMessage = error.message && error.message.includes('Payment error:') 
          ? error.message 
          : 'We couldn\'t process your payment information. Please contact support if your payment was completed.';
        
        setError(errorMessage);
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [location, navigate]);
  
  // Generate random order number
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  
  return (
    <div className="relative w-full min-h-screen bg-[#FDF8F8] font-[SF Pro Rounded] overflow-x-hidden flex flex-col px-4 pt-[120px] pb-20">
      <div className="max-w-md mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src={LoadingBear}
              alt="Loading Bear"
              className="w-[160px] sm:w-[192.8px] h-auto mb-10 animate-bounce"
            />
            <h1 className="text-[32px] sm:text-[40px] font-semibold text-[#462525] text-center">
              Processing Order...
            </h1>
            <p className="mt-2 text-[13px] sm:text-[14px] font-medium text-[#462525]/85 font-[Inter] text-center">
              Please wait while we confirm your payment
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
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
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-[28px] sm:text-[36px] font-semibold text-[#462525] text-center">
                Order Confirmed!
              </h1>
              <p className="mt-2 text-[14px] sm:text-[16px] text-[#462525]/85 text-center">
                Your payment was successful and your order has been placed
              </p>
              {new URLSearchParams(window.location.search).get('return_to_system') === 'true' && (
                <p className="mt-4 text-[14px] font-medium text-blue-600 animate-pulse">
                  Returning to main system...
                </p>
              )}
            </div>
            
            <div className="bg-white rounded-[30px] shadow-lg p-6 sm:p-8 mb-6">
              <h3 className="font-semibold text-lg text-[#462525] mb-4">Order Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{orderNumber}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup Time:</span>
                  <span className="font-medium">{orderDetails?.customTime || 'After Order'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{orderDetails?.paymentMethod || 'Online Payment'}</span>
                </div>
                
                {paymentDetails && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium text-xs">
                      {(paymentDetails.id || '').substring(0, 12)}...
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
                  <span className="text-gray-600 font-medium">Total Amount:</span>
                  <span className="font-semibold text-[#D91517]">
                    ₱{orderDetails?.total?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
            
            {orderDetails?.items && orderDetails.items.length > 0 && (
              <div className="bg-white rounded-[30px] shadow-lg p-6 sm:p-8 mb-6">
                <h3 className="font-semibold text-lg text-[#462525] mb-4">Order Summary</h3>
                
                <div className="space-y-4">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex items-start justify-between">
                      <div className="flex items-start">
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
                          {item.note && (
                            <p className="text-xs text-gray-500 italic mt-1">
                              Note: {item.note}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-[#D91517] font-medium">
                        ₱{(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                Your order has been received and is being prepared. Please show this confirmation when picking up your order.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => navigate('/menu')}
                className="w-full bg-[#D91517] text-white py-4 rounded-full font-medium hover:bg-[#a31113] transition-colors duration-200 shadow-md"
              >
                Done
              </button>
              <button 
                onClick={() => navigate('/order-history')}
                className="w-full bg-white border border-[#D91517] text-[#D91517] py-4 rounded-full font-medium hover:bg-[#FEF2F2] transition-colors duration-200"
              >
                View Order History
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;