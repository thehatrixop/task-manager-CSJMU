/**
 * lib/supabaseClient.js
 * Supabase Client Initialization for CampusFlow
 * Supports both Browser and Node.js environments
 */

let supabaseInstance = null;

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;

  // Read environment variables (supports Vite, Next.js, and Node.js environments)
  const supabaseUrl = 
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
    (typeof window !== 'undefined' && window.__CAMPUSFLOW_CONFIG__?.SUPABASE_URL) ||
    'https://[YOUR-PROJECT-REF].supabase.co';

  const supabaseAnonKey = 
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    (typeof window !== 'undefined' && window.__CAMPUSFLOW_CONFIG__?.SUPABASE_ANON_KEY) ||
    'YOUR-SUPABASE-ANON-KEY';

  if (typeof window !== 'undefined' && window.supabase) {
    // If loaded via CDN script tag: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    supabaseInstance = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
  } else {
    try {
      const { createClient } = require('@supabase/supabase-js');
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.warn('Supabase JS SDK not installed yet. Run "npm install @supabase/supabase-js" or include the CDN script.');
    }
  }

  return supabaseInstance;
}

export default getSupabaseClient;
