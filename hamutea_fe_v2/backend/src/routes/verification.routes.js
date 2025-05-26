const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verification.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Send phone verification code (protected)
router.post('/send-phone-code', authenticateToken, verificationController.sendPhoneVerificationCode);
// Legacy endpoint for backward compatibility
router.post('/phone', authenticateToken, verificationController.sendPhoneVerificationCode);

// Verify phone code (protected)
router.post('/verify-phone-code', authenticateToken, verificationController.verifyPhoneCode);
// Legacy endpoint for backward compatibility
router.post('/phone/verify', authenticateToken, verificationController.verifyPhoneCode);

// Send email verification (protected)
router.post('/send-email-verification', authenticateToken, verificationController.sendEmailVerification);

// Verify email (public)
router.get('/verify-email', verificationController.verifyEmail);

module.exports = router;