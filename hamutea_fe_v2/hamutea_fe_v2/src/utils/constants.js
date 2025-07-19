// Storage Keys
export const STORAGE_KEYS = {
  CART: 'hamutea_cart',
  FAVORITES: 'hamutea_favorites',
  TOKEN: 'hamutea_token',
  USER: 'hamutea_user'
};

// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  AUTH: '/api/auth',
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
  USERS: '/api/users',
  PAYMENTS: '/api/payments'
};

// Navigation Items
export const NAV_ITEMS = [
  { name: "Menu", href: "/menu" },
  { name: "Order History", href: "/order-history" },
  { name: "Rewards", href: "/rewards" },
  { name: "Contact Us", href: "/contact-us" }
];

// Social Media Links
export const SOCIAL_LINKS = [
  { href: "https://www.facebook.com/hamutea", icon: "facebook", alt: "Facebook" },
  { href: "https://www.messenger.com", icon: "messenger", alt: "Messenger" },
  { href: "https://www.instagram.com", icon: "instagram", alt: "Instagram" },
  { href: "https://www.tiktok.com", icon: "tiktok", alt: "TikTok" },
  { href: "tel:+639123456789", icon: "phone", alt: "Phone" }
];

// Footer Links
export const FOOTER_LINKS = ["Terms of Service", "Cookies", "Privacy Policy"];

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  CASHIER: 'cashier'
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};