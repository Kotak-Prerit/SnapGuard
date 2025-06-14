const { createClient } = require('@supabase/supabase-js');

let supabaseInstance = null;

function initializeSupabase() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  console.log('Initializing Supabase client...');
  console.log('Supabase Configuration:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseKey ? 'Set' : 'Missing',
    urlLength: supabaseUrl?.length,
    keyLength: supabaseKey?.length,
    urlStartsWith: supabaseUrl?.substring(0, 8),
    keyStartsWith: supabaseKey?.substring(0, 8)
  });

  if (!supabaseUrl || !supabaseKey) {
    const error = new Error('Supabase credentials missing. Check your .env file.');
    console.error('❌ Supabase initialization failed:', error.message);
    throw error;
  }

  // Validate URL format
  if (!supabaseUrl.startsWith('https://')) {
    console.error('❌ Invalid Supabase URL format. Should start with https://');
    throw new Error('Invalid Supabase URL format');
  }

  // Validate key format
  if (!supabaseKey.startsWith('eyJ')) {
    console.error('❌ Invalid Supabase key format. Should start with eyJ');
    throw new Error('Invalid Supabase key format');
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: false
      }
    });

    // Test the connection with a simple query
    supabaseInstance.from('users').select('count').limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.error('❌ Supabase connection test failed:', error.message);
          // Reset the instance if connection fails
          supabaseInstance = null;
        } else {
          console.log('✅ Supabase client initialized and connected successfully');
        }
      })
      .catch(error => {
        console.error('❌ Supabase connection test failed:', error.message);
        // Reset the instance if connection fails
        supabaseInstance = null;
      });

    return supabaseInstance;
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}

module.exports = {
  getSupabase: () => {
    if (!supabaseInstance) {
      return initializeSupabase();
    }
    return supabaseInstance;
  }
}; 