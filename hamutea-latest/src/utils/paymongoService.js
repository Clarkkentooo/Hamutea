/**
 * PayMongo API Service
 * Documentation: https://developers.paymongo.com/reference/overview
 */

// Replace with your actual PayMongo API keys
const PAYMONGO_SECRET_KEY = import.meta.env.VITE_PAYMONGO_SECRET_KEY;
const PAYMONGO_PUBLIC_KEY = import.meta.env.VITE_PAYMONGO_PUBLIC_KEY;

const API_URL = 'https://api.paymongo.com/v1';

// Helper function for API requests
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${PAYMONGO_SECRET_KEY}:`)}`
  };

  const config = {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) })
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.errors?.[0]?.detail || 'PayMongo API request failed');
    }
    
    return result;
  } catch (error) {
    console.error('PayMongo API Error:', error);
    throw error;
  }
};

/**
 * Create a payment intent
 * @param {number} amount - Amount in smallest currency unit (e.g., cents for PHP)
 * @param {string} currency - Currency code (default: PHP)
 * @returns {Promise<Object>} Payment intent object
 */
export const createPaymentIntent = async (amount, currency = 'PHP') => {
  const data = {
    data: {
      attributes: {
        amount,
        payment_method_allowed: ['card', 'paymaya', 'gcash', 'grab_pay'],
        payment_method_options: {
          card: { request_three_d_secure: 'any' }
        },
        currency
      }
    }
  };

  return apiRequest('/payment_intents', 'POST', data);
};

/**
 * Create a payment method
 * @param {Object} paymentDetails - Payment method details
 * @returns {Promise<Object>} Payment method object
 */
export const createPaymentMethod = async (paymentDetails) => {
  const data = {
    data: {
      attributes: paymentDetails
    }
  };

  return apiRequest('/payment_methods', 'POST', data);
};

/**
 * Attach a payment method to a payment intent
 * @param {string} paymentIntentId - Payment intent ID
 * @param {string} paymentMethodId - Payment method ID
 * @returns {Promise<Object>} Updated payment intent
 */
export const attachPaymentMethod = async (paymentIntentId, paymentMethodId) => {
  const data = {
    data: {
      attributes: {
        payment_method: paymentMethodId,
        return_url: window.location.origin + '/payment-success'
      }
    }
  };

  return apiRequest(`/payment_intents/${paymentIntentId}/attach`, 'POST', data);
};

/**
 * Create a source for e-wallets (GCash, GrabPay, etc.)
 * @param {number} amount - Amount in smallest currency unit
 * @param {string} type - Source type (e.g., 'gcash', 'grab_pay')
 * @param {string} currency - Currency code
 * @param {string} successUrl - Redirect URL after successful payment
 * @param {string} failureUrl - Redirect URL after failed payment
 * @returns {Promise<Object>} Source object with checkout URL
 */
export const createSource = async (
  amount,
  type,
  currency = 'PHP',
  successUrl = window.location.origin + '/payment-success',
  failureUrl = window.location.origin + '/payment-failed'
) => {
  const data = {
    data: {
      attributes: {
        amount,
        type,
        currency,
        redirect: {
          success: successUrl,
          failed: failureUrl
        }
      }
    }
  };

  return apiRequest('/sources', 'POST', data);
};

/**
 * Retrieve payment intent status
 * @param {string} paymentIntentId - Payment intent ID
 * @returns {Promise<Object>} Payment intent object
 */
export const getPaymentIntent = async (paymentIntentId) => {
  return apiRequest(`/payment_intents/${paymentIntentId}`);
};

export default {
  createPaymentIntent,
  createPaymentMethod,
  attachPaymentMethod,
  createSource,
  getPaymentIntent
};