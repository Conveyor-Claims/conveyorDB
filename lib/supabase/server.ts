import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { readAppEnv } from "@/lib/env";

export function createAnonServerClient(): SupabaseClient<Database> | null {
  const { supabaseUrl, anonKey } = readAppEnv();
  if (!supabaseUrl || !anonKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
