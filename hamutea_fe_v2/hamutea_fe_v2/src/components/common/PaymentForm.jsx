import { useState } from 'react';
import { useClientContext } from '@context/ClientContext';
import Icon from '@components/common/Icon';
import paymongo from '@utils/paymongoApi';

const PaymentForm = ({ onSuccess, onCancel }) => {
  const { processCardPayment, paymentLoading, paymentError, calculateTotal } = useClientContext();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    name: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      
      setCardDetails({ ...cardDetails, [name]: formattedValue });
      return;
    }
    
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (paymentMethod === 'card') {
        await processCardPayment(cardDetails);
      } else if (paymentMethod === 'e-payment') {
        await handlePaymongoPayment();
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const handlePaymongoPayment = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Convert amount to centavos (smallest currency unit)
      const amountInCentavos = Math.round(calculateTotal() * 100);
      
      // Create payment link
      paymongo.auth('sk_test_HrCH7fUoHkA2cz16yBBngFVU');
      const response = await paymongo.createALink({
        amount: amountInCentavos,
        description: 'Payment for Hamutea order'
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
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-hamutea-red">Checkout</h2>
        <div className="text-right">
          <p className="text-gray-500">Total Amount</p>
          <p className="text-xl font-bold">₱{calculateTotal().toFixed(2)}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Payment Method</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            className={`flex items-center justify-center gap-2 p-3 border rounded-lg ${
              paymentMethod === 'card' ? 'border-hamutea-red bg-red-50' : 'border-gray-300'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            <Icon name="CreditCard" className="w-5 h-5" />
            <span>Credit Card</span>
          </button>
          <button
            type="button"
            className={`flex items-center justify-center gap-2 p-3 border rounded-lg ${
              paymentMethod === 'e-payment' ? 'border-hamutea-red bg-red-50' : 'border-gray-300'
            }`}
            onClick={() => setPaymentMethod('e-payment')}
          >
            <Icon name="Globe" className="w-5 h-5" />
            <span>E-Payment</span>
          </button>
        </div>
      </div>
      
      {paymentMethod === 'card' ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                name="name"
                value={cardDetails.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hamutea-red"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hamutea-red"
                placeholder="4343 4343 4343 4343"
                required
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <input
                  type="text"
                  name="expMonth"
                  value={cardDetails.expMonth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hamutea-red"
                  placeholder="MM"
                  maxLength="2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="text"
                  name="expYear"
                  value={cardDetails.expYear}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hamutea-red"
                  placeholder="YY"
                  maxLength="2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                <input
                  type="text"
                  name="cvc"
                  value={cardDetails.cvc}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hamutea-red"
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={cardDetails.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hamutea-red"
                placeholder="email@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={cardDetails.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hamutea-red"
                placeholder="+639123456789"
                required
              />
            </div>
          </div>
          
          {paymentError && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
              {paymentError}
            </div>
          )}
          
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={paymentLoading}
              className="flex-1 py-2 px-4 bg-hamutea-red text-white rounded-md hover:bg-red-700 disabled:opacity-70"
            >
              {paymentLoading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            You will be redirected to PayMongo to complete your payment. PayMongo supports various payment methods including GCash, Maya, GrabPay, and more.
          </p>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePaymongoPayment}
              disabled={isProcessing}
              className="flex-1 py-2 px-4 bg-hamutea-red text-white rounded-md hover:bg-red-700 disabled:opacity-70"
            >
              {isProcessing ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;