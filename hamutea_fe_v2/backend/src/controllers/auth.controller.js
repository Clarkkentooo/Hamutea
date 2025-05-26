const jwt = require('jsonwebtoken');
const { auth } = require('../firebase');
const { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} = require('firebase/auth');

// Mock user for testing
const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'user',
  phone: '1234567890',
  phoneVerified: false,
  emailVerified: false,
  birthDate: '1990-01-01'
};

/**
 * User login
 * @route POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // For demo purposes, accept any login with test@example.com/password123
    if (email === 'test@example.com' && password === 'password123') {
      // Generate JWT token
      const token = jwt.sign(
        { id: mockUser.id, email: mockUser.email, role: mockUser.role },
        process.env.JWT_SECRET || 'hamutea_jwt_secret_key_for_testing',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      // Return user info and token
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: mockUser,
        token
      });
    }

    // For demo purposes, accept any login
    const userData = {
      id: Math.floor(Math.random() * 1000) + 10,
      name: email.split('@')[0],
      email: email,
      role: 'user',
      phoneVerified: false,
      emailVerified: false,
      birthDate: ''
    };
    
    // Generate JWT token
    const token = jwt.sign(
      { id: userData.id, email: userData.email, role: userData.role },
      process.env.JWT_SECRET || 'hamutea_jwt_secret_key_for_testing',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user info and token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: userData,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * User registration
 * @route POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate request
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Create a mock user
    const newUser = {
      id: Math.floor(Math.random() * 1000) + 10,
      name,
      email,
      role: 'user',
      phoneVerified: false,
      emailVerified: false
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'hamutea_jwt_secret_key_for_testing',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user info and token
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: newUser,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Google OAuth callback
 * @route GET /api/auth/google/callback
 */
exports.googleCallback = (req, res) => {
  try {
    // User is already authenticated by Passport
    const user = req.user;
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'hamutea_jwt_secret_key_for_testing',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/sign-in?error=auth_failed`);
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/profile
 */
exports.getProfile = async (req, res) => {
  try {
    // For demo purposes, return the mock user
    res.status(200).json({
      success: true,
      data: mockUser
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, email, birthDate } = req.body;
    
    // Check if email or phone is changed
    const isEmailChanged = email && email !== mockUser.email;
    const isPhoneChanged = phone && phone !== mockUser.phone;
    
    // If email or phone is changed, we'll need verification
    let verificationNeeded = {};
    
    if (isEmailChanged) {
      verificationNeeded.email = true;
    }
    
    if (isPhoneChanged) {
      verificationNeeded.phone = true;
    }

    res.status(200).json({
      success: true,
      message: Object.keys(verificationNeeded).length > 0 
        ? 'Profile updated. Verification required for changed contact information.'
        : 'Profile updated successfully',
      data: {
        id: mockUser.id,
        name: name || mockUser.name,
        email: email || mockUser.email,
        role: mockUser.role,
        phone: phone || mockUser.phone,
        phoneVerified: !isPhoneChanged && mockUser.phoneVerified,
        emailVerified: !isEmailChanged && mockUser.emailVerified,
        birthDate: birthDate || mockUser.birthDate
      },
      verificationNeeded
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};