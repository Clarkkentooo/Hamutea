# Hamutea Admin Backend

## Setup Instructions for Developers

### Database Setup

1. Install MySQL on your local machine
2. Create a new database:
   ```sql
   CREATE DATABASE hamutea_db;
   ```
3. Create a user with appropriate permissions:
   ```sql
   CREATE USER 'hamutea_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON hamutea_db.* TO 'hamutea_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Environment Setup

1. Copy the example environment file:
   ```
   cp .env.example .env
   ```
2. Update the `.env` file with your local database credentials:
   ```
   DB_HOST=localhost
   DB_USER=hamutea_user
   DB_PASSWORD=your_password
   DB_PORT=3306
   DB_NAME=hamutea_db
   ```

### Running the Application

1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```

The server should now be running at http://localhost:5000