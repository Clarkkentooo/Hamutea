# Hamutea

A modern tea ordering application built with React and Node.js.

## Project Structure

```
Hamutea/
├── hamutea_fe_v2/
│   ├── hamutea_fe_v2/          # Frontend React application
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── pages/         # Page components
│   │   │   ├── context/       # React context providers
│   │   │   ├── utils/         # Utility functions
│   │   │   └── assets/        # Static assets
│   │   └── package.json
│   └── backend/               # Backend Node.js server
│       ├── src/
│       │   ├── controllers/   # Route controllers
│       │   ├── middleware/    # Express middleware
│       │   ├── routes/        # API routes
│       │   └── config/        # Configuration files
│       └── package.json
└── README.md
```

## Environment Setup

1. Copy environment files:
   ```bash
   # Frontend
   cp hamutea_fe_v2/hamutea_fe_v2/.env.example hamutea_fe_v2/hamutea_fe_v2/.env
   
   # Backend
   cp hamutea_fe_v2/backend/.env.example hamutea_fe_v2/backend/.env
   ```

2. Configure your environment variables in the `.env` files
3. Never commit `.env` files to the repository

## Development

1. Install dependencies:
   ```bash
   # Frontend
   cd hamutea_fe_v2/hamutea_fe_v2
   npm install
   
   # Backend
   cd hamutea_fe_v2/backend
   npm install
   ```

2. Start development servers:
   ```bash
   # Frontend (in one terminal)
   cd hamutea_fe_v2/hamutea_fe_v2
   npm run dev
   
   # Backend (in another terminal)
   cd hamutea_fe_v2/backend
   npm run dev
   ```

## Features

- Modern React frontend with Vite
- Responsive design with Tailwind CSS
- Firebase authentication
- Shopping cart functionality
- Order management
- Admin dashboard
- Payment integration

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Framer Motion
- Lucide React Icons
- Firebase
- Axios

### Backend
- Node.js
- Express.js
- Firebase Admin SDK
- MySQL/PostgreSQL
- Multer (file uploads)