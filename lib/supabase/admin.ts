import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { readAppEnv } from "@/lib/env";

export function createAdminClient(): SupabaseClient<Database> | null {
  const { supabaseUrl, serviceRoleKey } = readAppEnv();
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
