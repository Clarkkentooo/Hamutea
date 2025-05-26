import { useState } from 'react';
import paymongo from '../../utils/paymongoApi';
import Icon from './Icon';

const PaymentLinkButton = ({ amount, description, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreatePaymentLink = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert amount to centavos (smallest currency unit)
      const amountInCentavos = Math.round(amount * 100);
      
      // Create payment link
      paymongo.auth('sk_test_HrCH7fUoHkA2cz16yBBngFVU');
      const response = await paymongo.createALink({
        amount: amountInCentavos,
        description: description || 'Payment for Hamutea order'
      });
      
      // Get checkout URL from response
      const checkoutUrl = response.data.attributes.checkout_url;
      
      // Open checkout URL in new tab
      window.open(checkoutUrl, '_blank');
      
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      console.error('Payment link error:', err);
      setError(err.message || 'Failed to create payment link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCreatePaymentLink}
        disabled={loading}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-hamutea-red text-white rounded-md hover:bg-red-700 disabled:opacity-70"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Icon name="CreditCard" className="w-5 h-5" />
            <span>Pay with PayMongo</span>
          </>
        )}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default PaymentLinkButton;