const { createClient } = require('@supabase/supabase-js');

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Present' : 'Missing');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'Present' : 'Missing');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create client with anon key for user operations (token verification)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create admin client with service key for admin operations (database access)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
module.exports.supabaseAdmin = supabaseAdmin;