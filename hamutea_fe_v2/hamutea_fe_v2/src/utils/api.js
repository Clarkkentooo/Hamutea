// API base URL
const API_BASE_URL = 'http://localhost:6005/api';

// Helper function for making API requests
export const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Add authorization token if available
  const token = localStorage.getItem('adminToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Make the request
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  // Parse the response
  const data = await response.json();
  
  // Handle error responses
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    
    register: (userData) => fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    
    getProfile: () => fetchApi('/auth/profile'),
    
    updateProfile: (userData) => fetchApi('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  },
  
  // Verification endpoints
  verification: {
    sendPhoneCode: (phone) => fetchApi('/verification/send-phone-code', {
      method: 'POST',
      body: JSON.stringify({ phone })
    }),
    
    verifyPhoneCode: (code) => fetchApi('/verification/verify-phone-code', {
      method: 'POST',
      body: JSON.stringify({ code })
    }),
    
    sendEmailVerification: (email) => fetchApi('/verification/send-email-verification', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },
  
  // Direct API methods for backward compatibility
  post: (endpoint, data, options = {}) => fetchApi(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  }),
  
  put: (endpoint, data, options = {}) => fetchApi(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  }),
  
  get: (endpoint, options = {}) => fetchApi(endpoint, {
    method: 'GET',
    ...options
  }),
  
  delete: (endpoint, options = {}) => fetchApi(endpoint, {
    method: 'DELETE',
    ...options
  })
};

export default api;