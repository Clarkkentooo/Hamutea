const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

// Debug environment variables
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);

// Configure Passport Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL || 'http://localhost:8080'}/api/auth/google/callback`,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google profile:', profile);
      
      // For demo purposes, create a mock user
      const user = {
        id: 1,
        name: profile.displayName,
        email: profile.emails[0].value,
        role: 'user',
        googleId: profile.id,
        phoneVerified: true,
        emailVerified: true
      };
      
      return done(null, user);
    } catch (error) {
      console.error('Google authentication error:', error);
      return done(error);
    }
  }));
} else {
  console.log('Google OAuth credentials not found, skipping configuration');
}

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    // For demo purposes, return a mock user
    const user = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      phoneVerified: true,
      emailVerified: true
    };
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;