import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// URGENT: Configure Supabase with production site URL for auth redirects
// The 'siteUrl' option is critical for magic link generation
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // CRITICAL: Set the site URL for all auth operations
    // This overrides any Supabase dashboard configuration
    siteUrl: 'https://kaamsaathi.pages.dev'
  }
})