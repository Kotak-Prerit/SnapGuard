const { createClient } = require('@supabase/supabase-js');

let supabaseInstance = null;

function initializeSupabase() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  console.log('Initializing Supabase client...');
  console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('Supabase Key:', supabaseKey ? 'Set' : 'Missing');

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials missing. Check your .env file.');
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    });

    // Test the connection
    supabaseInstance.auth.getSession()
      .then(() => console.log('✅ Supabase client initialized and connected successfully'))
      .catch(error => console.error('❌ Supabase connection test failed:', error.message));

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