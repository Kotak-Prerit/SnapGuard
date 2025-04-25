const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

// Load environment variables
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

// Initialize Express app
const app = express();

// Initialize Supabase client
let supabase = null;
try {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ WARNING: Supabase credentials missing. Check your .env file.');
    console.warn('Required environment variables:');
    console.warn('- SUPABASE_URL');
    console.warn('- SUPABASE_ANON_KEY');
    console.warn('- JWT_SECRET');
    console.warn('Running in fallback mode with in-memory storage.');
  } else {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized successfully');
  }
} catch (error) {
  console.warn('⚠️ Failed to initialize Supabase client:', error.message);
}

// Configure morgan logging format
morgan.token('body', (req) => JSON.stringify(req.body));
const morganFormat = process.env.NODE_ENV === 'production'
  ? ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  : '🔍 [:date[iso]] :method :url :status :response-time ms - :res[content-length]';

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan(morganFormat, {
  skip: (req) => req.url === '/health' // Skip logging health checks
}));

// Attach Supabase client to request object
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    supabase: supabase ? 'connected' : 'fallback',
    envVars: {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET,
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  const divider = '='.repeat(40);
  console.log(`
${divider}
🚀 SnapGuard Server
${divider}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔌 Port: ${PORT}
🔐 Auth: ${supabase ? 'Supabase' : 'In-memory fallback'}
🔑 JWT Secret: ${process.env.JWT_SECRET ? '✓ Set' : '✗ Missing'}
📡 Supabase URL: ${process.env.SUPABASE_URL ? '✓ Set' : '✗ Missing'}
🔑 Supabase Key: ${process.env.SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}
${divider}
  `);
}); 