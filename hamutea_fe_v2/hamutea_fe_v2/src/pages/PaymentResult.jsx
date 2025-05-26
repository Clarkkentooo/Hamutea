import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useClientContext } from '@context/ClientContext';
import Icon from '@components/common/Icon';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkPaymentStatus, setCartItems } = useClientContext();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  
  // Get payment intent ID from URL
  const paymentIntentId = searchParams.get('payment_intent_id');
  const source = searchParams.get('source_id');
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (paymentIntentId) {
          // Check payment intent status
          const paymentStatus = await checkPaymentStatus(paymentIntentId);
          
          if (paymentStatus === 'succeeded') {
            setStatus('success');
            // Clear cart on successful payment
            setCartItems([]);
          } else if (paymentStatus === 'awaiting_payment_method' || paymentStatus === 'awaiting_next_action') {
            setStatus('pending');
          } else {
            setStatus('failed');
            setError('Payment was not completed successfully.');
          }
        } else if (source) {
          // For e-wallet payments, we assume success if redirected back with source_id
          // In a real app, you would verify with your backend
          setStatus('success');
          setCartItems([]);
        } else {
          setStatus('failed');
          setError('No payment information found.');
        }
      } catch (err) {
        setStatus('failed');
        setError(err.message || 'An error occurred while processing your payment.');
      }
    };
    
    verifyPayment();
  }, [paymentIntentId, source, checkPaymentStatus, setCartItems]);
  
  // Redirect to home after 5 seconds on success
  useEffect(() => {
    let timer;
    if (status === 'success') {
      timer = setTimeout(() => {
        navigate('/');
      }, 5000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="w-16 h-16 mx-auto border-4 border-hamutea-red border-t-transparent rounded-full animate-spin"></div>
            <h2 className="mt-6 text-2xl font-bold text-gray-800">Processing Payment</h2>
            <p className="mt-2 text-gray-600">Please wait while we verify your payment...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="Check" className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-800">Payment Successful!</h2>
            <p className="mt-2 text-gray-600">
              Thank you for your order. Your payment has been processed successfully.
            </p>
            <p className="mt-6 text-sm text-gray-500">
              You will be redirected to the homepage in a few seconds...
            </p>
          </>
        )}
        
        {status === 'pending' && (
          <>
            <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
              <Icon name="Clock" className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-800">Payment Pending</h2>
            <p className="mt-2 text-gray-600">
              Your payment is being processed. We'll update you once it's complete.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-4 py-2 bg-hamutea-red text-white rounded-md hover:bg-red-700"
            >
              Return to Home
            </button>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="X" className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-800">Payment Failed</h2>
            <p className="mt-2 text-gray-600">
              {error || 'There was an issue processing your payment. Please try again.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-4 py-2 bg-hamutea-red text-white rounded-md hover:bg-red-700"
            >
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;