import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log("URL:", supabaseUrl)
console.log("KEY:", supabaseAnonKey)



// Client for public usage (client-side)
// Use a fallback or avoid calling createClient if URL is bad to prevent crash
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase env missing")
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
) // Fallback to prevent immediate crash, will fail on usage

// Client for server-side admin usage (bypass RLS)
export const supabaseAdmin = supabaseServiceKey && supabaseUrl
    ? createClient(supabaseUrl, supabaseServiceKey)
    : (null as any);
