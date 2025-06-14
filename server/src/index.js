const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');
const { getSupabase } = require('./lib/supabase');
const path = require('path');
const chatRoutes = require('./routes/chat');

// Load environment variables
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Log environment configuration (safely)
console.log('Environment Configuration:', {
  nodeEnv: process.env.NODE_ENV,
  supabaseUrl: process.env.SUPABASE_URL ? 'Set' : 'Missing',
  supabaseKey: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing',
  jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Missing'
});

// Initialize Express app
const app = express();

// Initialize Supabase
let supabase = null;
try {
  supabase = getSupabase();
} catch (error) {
  console.error('Failed to initialize Supabase:', error.message);
  process.exit(1);
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    supabase: supabase ? 'connected' : 'not connected',
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
app.use('/api/chat', chatRoutes);

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
🔐 Auth: ${supabase ? 'Supabase' : 'Not connected'}
🔑 JWT Secret: ${process.env.JWT_SECRET ? '✓ Set' : '✗ Missing'}
📡 Supabase URL: ${process.env.SUPABASE_URL ? '✓ Set' : '✗ Missing'}
🔑 Supabase Key: ${process.env.SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}
${divider}
  `);
}); 