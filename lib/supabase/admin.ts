import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const isSupabaseAdminConfigured = (): boolean => {
  return !!(
    supabaseUrl &&
    !supabaseUrl.includes("your-project-id") &&
    serviceRoleKey &&
    serviceRoleKey !== "your-service-role-key"
  );
};

// Administrative Supabase client bypassing RLS policies
export const supabaseAdmin = isSupabaseAdminConfigured()
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
