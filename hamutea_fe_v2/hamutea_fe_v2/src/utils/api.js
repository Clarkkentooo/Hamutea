import { API_ENDPOINTS, STORAGE_KEYS } from './constants';

// Helper function for making API requests
export const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_ENDPOINTS.BASE_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Add authorization token if available
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const data = contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();
    
    // Handle error responses
    if (!response.ok) {
      const errorMessage = typeof data === 'object' ? data.message : data;
      throw new Error(errorMessage || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

// API service class for better organization
class ApiService {
  // Auth endpoints
  auth = {
    login: (credentials) => fetchApi(`${API_ENDPOINTS.AUTH}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    
    register: (userData) => fetchApi(`${API_ENDPOINTS.AUTH}/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    
    getProfile: () => fetchApi(`${API_ENDPOINTS.AUTH}/profile`),
    
    updateProfile: (userData) => fetchApi(`${API_ENDPOINTS.AUTH}/profile`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),
    
    logout: () => fetchApi(`${API_ENDPOINTS.AUTH}/logout`, { method: 'POST' })
  };
  
  // Products endpoints
  products = {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return fetchApi(`${API_ENDPOINTS.PRODUCTS}${queryString ? `?${queryString}` : ''}`);
    },
    
    getById: (id) => fetchApi(`${API_ENDPOINTS.PRODUCTS}/${id}`),
    
    create: (productData) => fetchApi(API_ENDPOINTS.PRODUCTS, {
      method: 'POST',
      body: JSON.stringify(productData)
    }),
    
    update: (id, productData) => fetchApi(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    }),
    
    delete: (id) => fetchApi(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'DELETE'
    })
  };
  
  // Orders endpoints
  orders = {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return fetchApi(`${API_ENDPOINTS.ORDERS}${queryString ? `?${queryString}` : ''}`);
    },
    
    getById: (id) => fetchApi(`${API_ENDPOINTS.ORDERS}/${id}`),
    
    create: (orderData) => fetchApi(API_ENDPOINTS.ORDERS, {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),
    
    updateStatus: (id, status) => fetchApi(`${API_ENDPOINTS.ORDERS}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  };
  
  // Users endpoints
  users = {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return fetchApi(`${API_ENDPOINTS.USERS}${queryString ? `?${queryString}` : ''}`);
    },
    
    getById: (id) => fetchApi(`${API_ENDPOINTS.USERS}/${id}`),
    
    update: (id, userData) => fetchApi(`${API_ENDPOINTS.USERS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  };
  
  // Payments endpoints
  payments = {
    create: (paymentData) => fetchApi(API_ENDPOINTS.PAYMENTS, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    }),
    
    getStatus: (id) => fetchApi(`${API_ENDPOINTS.PAYMENTS}/${id}/status`)
  };
  
  // Generic HTTP methods
  get = (endpoint, options = {}) => fetchApi(endpoint, { method: 'GET', ...options });
  post = (endpoint, data, options = {}) => fetchApi(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  });
  put = (endpoint, data, options = {}) => fetchApi(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  });
  patch = (endpoint, data, options = {}) => fetchApi(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options
  });
  delete = (endpoint, options = {}) => fetchApi(endpoint, {
    method: 'DELETE',
    ...options
  });
}

// Export singleton instance
export const api = new ApiService();

export default api;