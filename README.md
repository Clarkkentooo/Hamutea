# Hamutea

## Environment Setup for Developers

To work on this project, you'll need to set up your environment variables:

1. Copy `.env.example` to `.env` in both the frontend and backend directories:
   ```
   cp hamutea_fe_v2/hamutea_fe_v2/.env.example hamutea_fe_v2/hamutea_fe_v2/.env
   cp hamutea_fe_v2/backend/.env.example hamutea_fe_v2/backend/.env
   ```

2. Contact the project administrator to get the actual values for:
   - Firebase API keys
   - PayMongo API keys
   - Other sensitive credentials

3. Never commit `.env` files to the repository

## Project Structure

- `hamutea_fe_v2/hamutea_fe_v2/` - Frontend React application
- `hamutea_fe_v2/backend/` - Backend server

## Development

1. Install dependencies:
   ```
   cd hamutea_fe_v2/hamutea_fe_v2
   npm install
   
   cd ../backend
   npm install
   ```

2. Start the development servers:
   ```
   # Frontend
   cd hamutea_fe_v2/hamutea_fe_v2
   npm run dev
   
   # Backend
   cd hamutea_fe_v2/backend
   npm run dev
   ```