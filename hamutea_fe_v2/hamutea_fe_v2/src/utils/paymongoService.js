// PayMongo API service
const PAYMONGO_API_URL = 'https://api.paymongo.com/v1';
const PAYMONGO_SECRET_KEY = import.meta.env.VITE_PAYMONGO_SECRET_KEY || 'sk_test_yourPaymongoSecretKey';
const PAYMONGO_PUBLIC_KEY = import.meta.env.VITE_PAYMONGO_PUBLIC_KEY || 'pk_test_yourPaymongoPublicKey';

// Check if API keys are properly configured
if (PAYMONGO_SECRET_KEY === 'sk_test_yourPaymongoSecretKey') {
  console.warn('PayMongo Secret Key not configured. Please set VITE_PAYMONGO_SECRET_KEY in your environment variables.');
}

// Helper function to encode API key for authorization
const getAuthHeader = (usePublicKey = false) => {
  const key = usePublicKey ? PAYMONGO_PUBLIC_KEY : PAYMONGO_SECRET_KEY;
  return `Basic ${btoa(`${key}:`)}`;
};

// Helper function to handle API errors
const handleApiError = (error, operation) => {
  console.error(`Error ${operation}:`, error);
  
  // Check if it's a network error
  if (error.message && error.message.includes('Network')) {
    throw new Error('Network error. Please check your internet connection.');
  }
  
  // Check if it's a PayMongo API error with details
  if (error.errors && Array.isArray(error.errors)) {
    const errorMessage = error.errors.map(err => err.detail || err.message).join(', ');
    throw new Error(`Payment error: ${errorMessage}`);
  }
  
  // Default error message
  throw error;
};

// Create a payment intent
export const createPaymentIntent = async (amount, description = 'Hamutea Order') => {
  try {
    const response = await fetch(`${PAYMONGO_API_URL}/payment_intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: Math.round(amount * 100), // Convert to centavos
            payment_method_allowed: ['card', 'paymaya', 'gcash', 'grab_pay'],
            payment_method_options: {
              card: { request_three_d_secure: 'any' }
            },
            currency: 'PHP',
            description
          }
        }
      })
    });
    
    const result = await response.json();
    
    // Check for API errors in the response
    if (!response.ok) {
      return handleApiError(result, 'creating payment intent');
    }
    
    return result;
  } catch (error) {
    return handleApiError(error, 'creating payment intent');
  }
};

// Create a payment method (for cards)
export const createPaymentMethod = async (cardDetails) => {
  try {
    const response = await fetch(`${PAYMONGO_API_URL}/payment_methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      },
      body: JSON.stringify({
        data: {
          attributes: {
            details: cardDetails,
            type: 'card'
          }
        }
      })
    });
    
    const result = await response.json();
    
    // Check for API errors in the response
    if (!response.ok) {
      return handleApiError(result, 'creating payment method');
    }
    
    return result;
  } catch (error) {
    return handleApiError(error, 'creating payment method');
  }
};

// Attach payment method to payment intent
export const attachPaymentMethod = async (paymentIntentId, paymentMethodId) => {
  try {
    const response = await fetch(`${PAYMONGO_API_URL}/payment_intents/${paymentIntentId}/attach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      },
      body: JSON.stringify({
        data: {
          attributes: {
            payment_method: paymentMethodId,
            return_url: `${window.location.origin}/payment-success`
          }
        }
      })
    });
    
    const result = await response.json();
    
    // Check for API errors in the response
    if (!response.ok) {
      return handleApiError(result, 'attaching payment method');
    }
    
    return result;
  } catch (error) {
    return handleApiError(error, 'attaching payment method');
  }
};

// Create a payment link
export const createPaymentLink = async (amount, description, remarks, customerInfo = {}) => {
  try {
    console.log('Creating PayMongo payment link for amount:', amount);
    
    // Prepare checkout options with billing info if available
    const checkoutOptions = {
      success_url: `${window.location.origin}/payment-success?return_to_system=true`,
      failure_url: `${window.location.origin}/menu`
    };
    
    // Add billing information if available
    if (customerInfo.name || customerInfo.email || customerInfo.phone) {
      checkoutOptions.billing_information = {
        name: customerInfo.name || 'Hamutea Customer',
        email: customerInfo.email || 'customer@example.com',
        phone: customerInfo.phone || '09123456789'
      };
    }
    
    const response = await fetch(`${PAYMONGO_API_URL}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: Math.round(amount * 100), // Convert to centavos
            description,
            remarks,
            currency: 'PHP',
            checkout: checkoutOptions
          }
        }
      })
    });
    
    const result = await response.json();
    
    // Log the response for debugging
    console.log('PayMongo payment link response:', result);
    
    // Check for API errors in the response
    if (!response.ok) {
      return handleApiError(result, 'creating payment link');
    }
    
    return result;
  } catch (error) {
    return handleApiError(error, 'creating payment link');
  }
};

// Create a source (for e-wallets like GCash)
export const createSource = async (amount, type, successUrl, failureUrl) => {
  try {
    const response = await fetch(`${PAYMONGO_API_URL}/sources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: Math.round(amount * 100), // Convert to centavos
            redirect: {
              success: successUrl || `${window.location.origin}/payment-success`,
              failed: failureUrl || `${window.location.origin}/menu`
            },
            type,
            currency: 'PHP',
            billing: {
              name: 'Hamutea Customer',
              email: 'customer@example.com',
              phone: '09123456789'
            }
          }
        }
      })
    });
    
    const result = await response.json();
    
    // Check for API errors in the response
    if (!response.ok) {
      return handleApiError(result, 'creating payment source');
    }
    
    return result;
  } catch (error) {
    return handleApiError(error, 'creating payment source');
  }
};

// Get payment status
export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await fetch(`${PAYMONGO_API_URL}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      }
    });
    
    const result = await response.json();
    
    // Check for API errors in the response
    if (!response.ok) {
      return handleApiError(result, 'getting payment status');
    }
    
    return result;
  } catch (error) {
    return handleApiError(error, 'getting payment status');
  }
};

// Get payment intent status
export const getPaymentIntentStatus = async (paymentIntentId) => {
  try {
    const response = await fetch(`${PAYMONGO_API_URL}/payment_intents/${paymentIntentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      }
    });
    
    const result = await response.json();
    
    // Check for API errors in the response
    if (!response.ok) {
      return handleApiError(result, 'getting payment intent status');
    }
    
    return result;
  } catch (error) {
    return handleApiError(error, 'getting payment intent status');
  }
};

export default {
  createPaymentIntent,
  createPaymentMethod,
  attachPaymentMethod,
  createPaymentLink,
  createSource,
  getPaymentStatus,
  getPaymentIntentStatus
};