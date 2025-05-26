const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Login route
router.post('/login', authController.login);

// Registration route
router.post('/register', authController.register);

// Update profile (protected)
router.put('/profile', authenticateToken, authController.updateProfile);

// Get user profile (protected route)
router.get('/profile', authenticateToken, authController.getProfile);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/sign-in?error=google_auth_failed' 
  }),
  authController.googleCallback
);

module.exports = router;