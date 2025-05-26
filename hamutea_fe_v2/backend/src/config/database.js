// Mock database for testing verification features
console.log('Using mock database for verification testing');

const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000 // Increase timeout to 60 seconds
});

// In-memory storage for testing
const users = [
  {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    role: 'user',
    birth_date: '1990-01-01'
  }
];

// Mock database methods
const mockDb = {
  query: async (sql, params) => {
    console.log('SQL Query:', sql);
    console.log('Params:', params);
    
    // Handle different query types
    if (sql.includes('SELECT')) {
      return [users];
    } else if (sql.includes('UPDATE')) {
      // Update user data
      if (params.length >= 2) {
        const userId = params[params.length - 1];
        const user = users.find(u => u.id === userId);
        
        if (user) {
          // Update fields based on query
          if (sql.includes('phone =')) {
            user.phone = params[0];
          } else if (sql.includes('email =')) {
            user.email = params[0];
          } else if (sql.includes('name =')) {
            user.name = params[0];
            if (params.length > 2) {
              user.birth_date = params[1];
            }
          }
        }
      }
      return [{ affectedRows: 1 }];
    }
    
    return [[]];
  },
  
  getConnection: async () => {
    return {
      release: () => {}
    };
  }
};

module.exports = mockDb;