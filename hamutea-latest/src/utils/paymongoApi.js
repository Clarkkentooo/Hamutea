/**
 * PayMongo API client
 */

class PayMongo {
  constructor() {
    this.baseUrl = 'https://api.paymongo.com/v1';
    this.secretKey = null;
  }

  auth(secretKey) {
    this.secretKey = secretKey;
    return this;
  }

  async request(endpoint, method = 'GET', data = null) {
    if (!this.secretKey) {
      throw new Error('PayMongo API key is required. Use auth() method first.');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`${this.secretKey}:`)}`
    };

    const config = {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) })
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.errors?.[0]?.detail || 'PayMongo API request failed');
      }
      
      return result;
    } catch (error) {
      console.error('PayMongo API Error:', error);
      throw error;
    }
  }

  async createALink(options = {}) {
    const defaultOptions = {
      amount: 10000, // ₱100.00 (in centavos)
      description: 'Payment for Hamutea order',
      remarks: 'Hamutea online order',
    };

    const data = {
      data: {
        attributes: {
          amount: options.amount || defaultOptions.amount,
          description: options.description || defaultOptions.description,
          remarks: options.remarks || defaultOptions.remarks,
        }
      }
    };

    return this.request('/links', 'POST', data);
  }
}

export default new PayMongo();