const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { authenticate } = require('../middleware/auth');

// Initialize Supabase client
let supabase = null;
try {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (error) {
  console.warn('Failed to initialize Supabase client in users route:', error.message);
}

// In-memory fallback storage
const inMemoryUsers = {};

/**
 * Get user profile
 * Requires authentication
 */
router.get('/profile', authenticate, async (req, res) => {
  try {
    // Try to get user from Supabase
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, created_at')
        .eq('id', req.user.userId)
        .single();
      
      if (error) {
        // Check in-memory storage as fallback
        if (inMemoryUsers[req.user.userId]) {
          return res.json(inMemoryUsers[req.user.userId]);
        }
        
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.json(data);
    } catch (dbError) {
      // Check in-memory storage as fallback
      if (inMemoryUsers[req.user.userId]) {
        return res.json(inMemoryUsers[req.user.userId]);
      }
      
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update user profile
 * Requires authentication
 */
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // Try to update user in Supabase
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ name })
        .eq('id', req.user.userId)
        .select()
        .single();
      
      if (error) {
        // Update in-memory storage as fallback
        if (inMemoryUsers[req.user.userId]) {
          inMemoryUsers[req.user.userId].name = name;
          return res.json(inMemoryUsers[req.user.userId]);
        }
        
        return res.status(500).json({ error: 'Failed to update profile' });
      }
      
      return res.json(data);
    } catch (dbError) {
      // Update in-memory storage as fallback
      if (inMemoryUsers[req.user.userId]) {
        inMemoryUsers[req.user.userId].name = name;
        return res.json(inMemoryUsers[req.user.userId]);
      }
      
      return res.status(500).json({ error: 'Failed to update profile' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Delete user account
 * Requires authentication
 */
router.delete('/account', authenticate, async (req, res) => {
  try {
    // Try to delete user from Supabase
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', req.user.userId);
      
      if (error) {
        return res.status(500).json({ error: 'Failed to delete account' });
      }
      
      // Also remove from in-memory storage if exists
      if (inMemoryUsers[req.user.userId]) {
        delete inMemoryUsers[req.user.userId];
      }
      
      return res.json({ message: 'Account deleted successfully' });
    } catch (dbError) {
      return res.status(500).json({ error: 'Failed to delete account' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 