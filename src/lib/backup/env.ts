export type BackupEnv = {
  primaryUrl: string | undefined;
  primaryServiceRoleKey: string | undefined;
  backupUrl: string | undefined;
  backupServiceRoleKey: string | undefined;
  cronSecret: string | undefined;
};

export function readBackupEnv(): BackupEnv {
  return {
    primaryUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    primaryServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    backupUrl: process.env.BACKUP_SUPABASE_URL,
    backupServiceRoleKey: process.env.BACKUP_SUPABASE_SERVICE_ROLE_KEY,
    cronSecret: process.env.CRON_SECRET,
  };
}

export function missingBackupEnvNames(env: BackupEnv): string[] {
  const missing: string[] = [];
  if (!env.primaryUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!env.primaryServiceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!env.backupUrl) missing.push("BACKUP_SUPABASE_URL");
  if (!env.backupServiceRoleKey) missing.push("BACKUP_SUPABASE_SERVICE_ROLE_KEY");
  return missing;
}

export function projectRefFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    return host.split(".")[0] || null;
  } catch {
    return null;
  }
}

export function backupPointsAtPrimary(env: BackupEnv): boolean {
  const primary = projectRefFromUrl(env.primaryUrl);
  const backup = projectRefFromUrl(env.backupUrl);
  if (!primary || !backup) return false;
  return primary === backup;
}
