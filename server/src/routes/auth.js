const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getSupabase } = require('../lib/supabase');
const { OAuth2Client } = require('google-auth-library');

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.CLIENT_ID);

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Register new user
 */
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', { ...req.body, password: '[REDACTED]' });
    
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      console.log('Validation failed: Invalid email format');
      return res.status(400).json({ error: 'Invalid email format. Please use a valid email address.' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
      const supabase = getSupabase();
      console.log('Attempting to create user in Supabase...');
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: password,
        options: {
          data: { name },
          emailRedirectTo: `${process.env.CLIENT_URL || 'http://localhost:8080'}/auth/callback`
        },
      });

      console.log('Supabase signup response:', { 
        success: !!authData,
        error: authError ? { message: authError.message, code: authError.code } : null 
      });

      if (authError) {
        console.error('Supabase signup error:', authError);
        
        // Handle specific error cases
        switch (authError.code) {
          case 'email_address_invalid':
            return res.status(400).json({ 
              error: 'Please use a valid email address',
              code: authError.code
            });
          case 'user_already_registered':
            return res.status(400).json({ 
              error: 'An account with this email already exists',
              code: authError.code
            });
          case 'password_too_weak':
            return res.status(400).json({ 
              error: 'Password is too weak. Please use a stronger password',
              code: authError.code
            });
          default:
            return res.status(400).json({ 
              error: authError.message || 'Failed to create account',
              code: authError.code
            });
        }
      }

      if (!authData.user) {
        console.error('No user data returned from Supabase');
        return res.status(500).json({ 
          error: 'Failed to create account: No user data returned'
        });
      }

      // Insert user data into the users table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: email,
            name: name,
            is_google_user: false
          }
        ]);

      if (profileError) {
        console.error('Failed to create user profile:', profileError);
        return res.status(500).json({ 
          error: 'Failed to create user profile',
          details: profileError.message
        });
      }

      // Generate JWT for Supabase user
      const token = jwt.sign(
        { userId: authData.user.id, email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('User created successfully in Supabase');
      return res.json({
        token,
        user: {
          id: authData.user.id,
          email,
          name,
        },
        message: 'Please check your email for verification instructions'
      });
    } catch (error) {
      console.error('Detailed registration error:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      return res.status(500).json({ 
        error: 'Registration failed: ' + error.message,
        details: error.code
      });
    }
  } catch (error) {
    console.error('Outer registration error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return res.status(500).json({ 
      error: 'Internal server error: ' + error.message,
      details: error.code
    });
  }
});

/**
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Validate input
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const supabase = getSupabase();
      
      // Log Supabase URL (redacting sensitive parts)
      const supabaseUrl = process.env.SUPABASE_URL;
      console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
      console.log('Supabase Key:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing');

      console.log('Attempting to sign in user with Supabase...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Supabase auth response:', {
        hasData: !!data,
        hasUser: !!data?.user,
        error: error ? {
          message: error.message,
          status: error.status,
          code: error.code
        } : null
      });

      if (error) {
        console.error('Supabase login error:', {
          message: error.message,
          status: error.status,
          code: error.code
        });

        // Handle specific error cases
        if (error.code === 'email_not_confirmed') {
          return res.status(401).json({ 
            error: 'Please verify your email address before logging in',
            details: 'Check your email inbox for a verification link',
            code: error.code
          });
        }

        return res.status(401).json({ 
          error: 'Invalid credentials',
          details: error.message,
          code: error.code
        });
      }

      if (!data?.user) {
        console.error('No user data returned from Supabase');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Get user profile data
      console.log('Fetching user profile from users table...');
      const { data: userData, error: profileError } = await supabase
        .from('users')
        .select('name')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', {
          message: profileError.message,
          code: profileError.code
        });
      } else {
        console.log('User profile fetched successfully');
      }

      // Generate JWT for Supabase user
      const token = jwt.sign(
        { 
          userId: data.user.id, 
          email: data.user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('Login successful for user:', data.user.email);
      
      return res.json({
        token,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: userData?.name || data.user.user_metadata?.name,
        },
      });
    } catch (error) {
      console.error('Login error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return res.status(500).json({ error: 'Login failed: ' + error.message });
    }
  } catch (error) {
    console.error('Internal login error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
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

    try {
      const supabase = getSupabase();
      const { data: { user }, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_token: token,
          },
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
        return res.status(400).json({ 
          error: error.message || 'Failed to authenticate with Google',
          code: error.code
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
      console.error('Google login error:', error);
      return res.status(500).json({ error: 'Google login failed: ' + error.message });
    }
  } catch (error) {
    console.error('Internal Google login error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

module.exports = router; 