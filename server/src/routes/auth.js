const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const { OAuth2Client } = require('google-auth-library');

// Initialize Supabase client
let supabase = null;
try {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials missing. Running in fallback mode.');
  } else {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (error) {
  console.warn('Failed to initialize Supabase client:', error.message);
}

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.CLIENT_ID);

// In-memory fallback storage
const inMemoryUsers = {};

/**
 * Register new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Try to create user in Supabase
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: hashedPassword,
      });

      if (error) {
        // Use in-memory storage as fallback
        if (inMemoryUsers[email]) {
          return res.status(400).json({ error: 'User already exists' });
        }

        // Create user in memory
        const userId = Object.keys(inMemoryUsers).length + 1;
        inMemoryUsers[email] = {
          id: userId,
          email,
          password: hashedPassword,
          name,
          created_at: new Date().toISOString(),
        };

        // Generate JWT
        const token = jwt.sign(
          { userId, email },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        return res.json({
          token,
          user: {
            id: userId,
            email,
            name,
          },
        });
      }

      // Generate JWT for Supabase user
      const token = jwt.sign(
        { userId: data.user.id, email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: data.user.id,
          email,
          name,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: 'Registration failed' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Try to get user from Supabase
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Check in-memory storage
        const memoryUser = inMemoryUsers[email];
        if (!memoryUser) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, memoryUser.password);
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
          { userId: memoryUser.id, email },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        return res.json({
          token,
          user: {
            id: memoryUser.id,
            email: memoryUser.email,
            name: memoryUser.name,
          },
        });
      }

      // Generate JWT for Supabase user
      const token = jwt.sign(
        { userId: user.id, email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: 'Login failed' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Google OAuth login
 */
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    // Try to get or create user in Supabase
    try {
      const { data: { user }, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_token: token,
          },
        },
      });

      if (error) {
        // Use in-memory storage as fallback
        let memoryUser = inMemoryUsers[email];

        if (!memoryUser) {
          // Create new user in memory
          const userId = Object.keys(inMemoryUsers).length + 1;
          memoryUser = inMemoryUsers[email] = {
            id: userId,
            email,
            name,
            created_at: new Date().toISOString(),
          };
        }

        // Generate JWT
        const token = jwt.sign(
          { userId: memoryUser.id, email },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        return res.json({
          token,
          user: {
            id: memoryUser.id,
            email: memoryUser.email,
            name: memoryUser.name,
          },
        });
      }

      // Generate JWT for Supabase user
      const token = jwt.sign(
        { userId: user.id, email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || name,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: 'Google login failed' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 