import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { readBackupEnv } from "@/lib/backup/env";
import { noStoreFetch } from "@/lib/supabase-fetch";

export type BackupAdminClient = SupabaseClient<Database>;

function createServiceClient(
  url: string,
  serviceRoleKey: string,
): BackupAdminClient {
  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: noStoreFetch,
    },
  });
}

export function createPrimaryAdminClient(): BackupAdminClient | null {
  const { primaryUrl, primaryServiceRoleKey } = readBackupEnv();
  if (!primaryUrl || !primaryServiceRoleKey) return null;
  return createServiceClient(primaryUrl, primaryServiceRoleKey);
}

export function createBackupAdminClient(): BackupAdminClient | null {
  const { backupUrl, backupServiceRoleKey } = readBackupEnv();
  if (!backupUrl || !backupServiceRoleKey) return null;
  return createServiceClient(backupUrl, backupServiceRoleKey);
}
