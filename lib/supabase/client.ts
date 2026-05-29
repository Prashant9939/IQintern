import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

export const isSupabaseConfigured = (): boolean => {
  return !!(
    supabaseUrl &&
    !supabaseUrl.includes("your-project-id") &&
    supabaseAnonKey &&
    supabaseAnonKey !== "your-anon-public-key"
  );
};

// Create real supabase client if configured, otherwise null
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
