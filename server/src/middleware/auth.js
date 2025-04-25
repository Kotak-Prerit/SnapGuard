const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate users via JWT
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from authorization header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      // Add user data to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email
      };
      
      next();
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Public route middleware - makes authentication optional
 * Populates req.user if token is valid, but doesn't require it
 */
const optionalAuth = (req, res, next) => {
  try {
    // Get token from authorization header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      // No token, continue as unauthenticated
      return next();
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      // Add user data to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email
      };
    } catch (tokenError) {
      // Invalid token, but continue as unauthenticated
      console.error('Optional auth token invalid:', tokenError);
    }
    
    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next();
  }
};

module.exports = { authenticate, optionalAuth }; 