import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const looksConfigured =
  !!url && !!anonKey && !url.includes('YOUR-PROJECT-REF') && !anonKey.startsWith('YOUR-')

/**
 * Browser Supabase client. Uses the public anon/publishable key only.
 * Returns null when the environment variables are missing so the site still renders
 * (with fallback content) and forms explain what is wrong instead of crashing.
 *
 * Visitors never sign in. The session is only used by the private /admin page.
 * Access control lives in Row Level Security policies, see supabase/migrations.
 */
export const supabase: SupabaseClient | null = looksConfigured
  ? createClient(url!, anonKey!, { auth: { persistSession: true, autoRefreshToken: true } })
  : null

export const isSupabaseConfigured = supabase !== null
