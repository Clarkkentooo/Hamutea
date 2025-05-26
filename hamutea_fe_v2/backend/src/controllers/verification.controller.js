const jwt = require('jsonwebtoken');
const { auth } = require('../firebase');
const { 
  sendEmailVerification, 
  sendSignInLinkToEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber
} = require('firebase/auth');

// Store verification codes in memory
const verificationCodes = new Map();
const emailTokens = new Map();

exports.sendPhoneVerificationCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Generate a random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store code in memory with expiration (10 minutes)
    verificationCodes.set(userId, {
      code: verificationCode,
      phone: phone,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });
    
    // In production, we would use Firebase Phone Auth
    // For now, log the code for testing
    console.log(`Phone verification code for ${phone}: ${verificationCode}`);
    
    res.status(200).json({
      success: true,
      message: 'Verification code sent to your phone',
      phoneNumber: phone
    });
  } catch (error) {
    console.error('Send phone verification code error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.verifyPhoneCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is required'
      });
    }

    // Check if code is valid and not expired
    const verification = verificationCodes.get(userId);
    
    if (!verification || verification.code !== code || verification.expires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Update user with verified phone
    // In a real app, this would update the database
    console.log(`Phone verified for user ${userId}: ${verification.phone}`);

    // Clear verification data
    verificationCodes.delete(userId);

    res.status(200).json({
      success: true,
      message: 'Phone number verified successfully',
      data: {
        id: userId,
        phoneVerified: true
      }
    });
  } catch (error) {
    console.error('Verify phone code error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.sendEmailVerification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Generate email verification token
    const emailVerificationToken = jwt.sign(
      { email, userId },
      process.env.JWT_SECRET || 'hamutea_jwt_secret_key_for_testing',
      { expiresIn: '24h' }
    );
    
    // Store token in memory
    emailTokens.set(emailVerificationToken, {
      userId,
      email,
      expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Create verification link
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${emailVerificationToken}`;
    
    // In a real app, we would send an email with this link
    // For now, log the link for testing
    console.log('Email verification link:', verificationLink);
    
    // For demo purposes, automatically mark the email as verified
    console.log(`Auto-verifying email for user ${userId}: ${email}`);
    
    res.status(200).json({
      success: true,
      message: 'Verification email sent. For demo purposes, your email is automatically verified.',
      email: email
    });
  } catch (error) {
    console.error('Send email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification email. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Verify email tokens
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Verify token from memory
    const verification = emailTokens.get(token);
    
    if (!verification || verification.expires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update user with verified email
    console.log(`Email verified for user ${verification.userId}: ${verification.email}`);

    // Clear verification data
    emailTokens.delete(token);

    // Redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/sign-in?verified=true`);
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};