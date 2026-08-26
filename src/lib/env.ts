import { DEFAULT_STORAGE_BUCKET } from "@/lib/schema/tables";

export type AppEnv = {
  supabaseUrl: string | undefined;
  anonKey: string | undefined;
  serviceRoleKey: string | undefined;
  storageBucket: string;
};

export function readAppEnv(): AppEnv {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    storageBucket:
      process.env.SUPABASE_STORAGE_BUCKET?.trim() || DEFAULT_STORAGE_BUCKET,
  };
}

export function missingEnvNames(env: AppEnv): string[] {
  const missing: string[] = [];
  if (!env.supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!env.anonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!env.serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  return missing;
}
