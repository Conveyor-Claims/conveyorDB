import type { BackupAdminClient } from "@/lib/backup/clients";
import {
  createBackupAdminClient,
  createPrimaryAdminClient,
} from "@/lib/backup/clients";
import {
  backupPointsAtPrimary,
  missingBackupEnvNames,
  projectRefFromUrl,
  readBackupEnv,
} from "@/lib/backup/env";
import {
  BACKUP_DELETE_ORDER,
  BACKUP_INSERT_ORDER,
  type BackupTableSpec,
} from "@/lib/backup/tables";

const PAGE_SIZE = 1000;
const UPSERT_BATCH = 100;

export type BackupTableResult = {
  name: BackupTableSpec["name"];
  primaryRows: number;
  upserted: number;
  deletedExtras: number;
};

export type BackupRefreshResult = {
  ok: boolean;
  error: string | null;
  missingEnv: string[];
  missingTables: string[];
  primaryRef: string | null;
  backupRef: string | null;
  tables: BackupTableResult[];
  durationMs: number;
  storage: {
    copied: false;
    note: string;
  };
};

export type BackupRefreshDeps = {
  primary: BackupAdminClient;
  backup: BackupAdminClient;
  now?: () => number;
};

type GenericRow = Record<string, unknown>;

function isMissingRelation(message: string, code: string | undefined): boolean {
  if (code === "PGRST205" || code === "42P01") return true;
  return /could not find the table|relation .* does not exist/i.test(message);
}

function fail(
  startedAt: number,
  now: () => number,
  partial: Omit<BackupRefreshResult, "ok" | "durationMs" | "storage">,
): BackupRefreshResult {
  return {
    ...partial,
    ok: false,
    durationMs: now() - startedAt,
    storage: {
      copied: false,
      note: "case-files Storage objects are a follow-up; public.files rows are copied.",
    },
  };
}

function succeed(
  startedAt: number,
  now: () => number,
  partial: Omit<BackupRefreshResult, "ok" | "error" | "durationMs" | "storage">,
): BackupRefreshResult {
  return {
    ...partial,
    ok: true,
    error: null,
    durationMs: now() - startedAt,
    storage: {
      copied: false,
      note: "case-files Storage objects are a follow-up; public.files rows are copied.",
    },
  };
}

async function probeTable(
  client: BackupAdminClient,
  spec: BackupTableSpec,
): Promise<{ exists: boolean; error: string | null }> {
  const { error } = await client
    .from(spec.name)
    .select("*", { count: "exact", head: true });

  if (!error) return { exists: true, error: null };
  return {
    exists: !isMissingRelation(error.message, error.code),
    error: error.message,
  };
}

async function selectAllRows(
  client: BackupAdminClient,
  spec: BackupTableSpec,
): Promise<{ rows: GenericRow[]; error: string | null }> {
  const rows: GenericRow[] = [];
  let offset = 0;

  for (;;) {
    const { data, error } = await client
      .from(spec.name)
      .select("*")
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      return { rows: [], error: error.message };
    }

    const page = (data ?? []) as GenericRow[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return { rows, error: null };
}

async function selectPrimaryKeys(
  client: BackupAdminClient,
  spec: BackupTableSpec,
): Promise<{ keys: string[]; error: string | null }> {
  const keys: string[] = [];
  let offset = 0;

  for (;;) {
    const { data, error } = await client
      .from(spec.name)
      .select("*")
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      return { keys: [], error: error.message };
    }

    const page = (data ?? []) as GenericRow[];
    for (const row of page) {
      const value = row[spec.primaryKey];
      if (value !== null && value !== undefined) {
        keys.push(String(value));
      }
    }
    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return { keys, error: null };
}

async function upsertRows(
  client: BackupAdminClient,
  spec: BackupTableSpec,
  rows: GenericRow[],
): Promise<{ upserted: number; error: string | null }> {
  if (rows.length === 0) return { upserted: 0, error: null };

  let upserted = 0;
  for (let i = 0; i < rows.length; i += UPSERT_BATCH) {
    const batch = rows.slice(i, i + UPSERT_BATCH);
    const { error } = await client.from(spec.name).upsert(batch as never, {
      onConflict: spec.primaryKey,
    });
    if (error) return { upserted, error: error.message };
    upserted += batch.length;
  }

  return { upserted, error: null };
}

async function deleteExtras(
  client: BackupAdminClient,
  spec: BackupTableSpec,
  keepKeys: Set<string>,
): Promise<{ deleted: number; error: string | null }> {
  const listed = await selectPrimaryKeys(client, spec);
  if (listed.error) return { deleted: 0, error: listed.error };

  const extras = listed.keys.filter((key) => !keepKeys.has(key));
  if (extras.length === 0) return { deleted: 0, error: null };

  let deleted = 0;
  for (let i = 0; i < extras.length; i += UPSERT_BATCH) {
    const batch = extras.slice(i, i + UPSERT_BATCH);
    const { error } = await client
      .from(spec.name)
      .delete()
      .in(spec.primaryKey, batch);
    if (error) return { deleted, error: error.message };
    deleted += batch.length;
  }

  return { deleted, error: null };
}

export async function refreshBackupFromPrimary(
  deps?: BackupRefreshDeps,
): Promise<BackupRefreshResult> {
  const now = deps?.now ?? Date.now;
  const startedAt = now();
  const env = readBackupEnv();
  const missingEnv = missingBackupEnvNames(env);
  const empty = {
    missingEnv,
    missingTables: [] as string[],
    primaryRef: projectRefFromUrl(env.primaryUrl),
    backupRef: projectRefFromUrl(env.backupUrl),
    tables: [] as BackupTableResult[],
  };

  if (missingEnv.length > 0) {
    return fail(startedAt, now, {
      ...empty,
      error: `Missing env: ${missingEnv.join(", ")}`,
    });
  }

  if (backupPointsAtPrimary(env)) {
    return fail(startedAt, now, {
      ...empty,
      error: "BACKUP_SUPABASE_URL must not point at the primary project.",
    });
  }

  const primary = deps?.primary ?? createPrimaryAdminClient();
  const backup = deps?.backup ?? createBackupAdminClient();
  if (!primary || !backup) {
    return fail(startedAt, now, {
      ...empty,
      error: "Supabase admin clients are not configured.",
    });
  }

  const missingTables: string[] = [];
  for (const spec of BACKUP_INSERT_ORDER) {
    const primaryProbe = await probeTable(primary, spec);
    if (!primaryProbe.exists) {
      missingTables.push(`primary.${spec.name}`);
    } else if (primaryProbe.error) {
      return fail(startedAt, now, {
        ...empty,
        missingTables,
        error: `Primary ${spec.name}: ${primaryProbe.error}`,
      });
    }

    const backupProbe = await probeTable(backup, spec);
    if (!backupProbe.exists) {
      missingTables.push(`backup.${spec.name}`);
    } else if (backupProbe.error) {
      return fail(startedAt, now, {
        ...empty,
        missingTables,
        error: `Backup ${spec.name}: ${backupProbe.error}`,
      });
    }
  }

  if (missingTables.length > 0) {
    return fail(startedAt, now, {
      ...empty,
      missingTables,
      error: `Backup schema is missing tables: ${missingTables.join(", ")}. Schema is applied separately; this job does not create tables.`,
    });
  }

  const primaryRows = new Map<BackupTableSpec["name"], GenericRow[]>();
  for (const spec of BACKUP_INSERT_ORDER) {
    const fetched = await selectAllRows(primary, spec);
    if (fetched.error) {
      return fail(startedAt, now, {
        ...empty,
        error: `Primary ${spec.name}: ${fetched.error}`,
      });
    }
    primaryRows.set(spec.name, fetched.rows);
  }

  const tables: BackupTableResult[] = [];

  for (const spec of BACKUP_INSERT_ORDER) {
    const rows = primaryRows.get(spec.name) ?? [];
    const written = await upsertRows(backup, spec, rows);
    if (written.error) {
      return fail(startedAt, now, {
        ...empty,
        tables,
        error: `Backup upsert ${spec.name}: ${written.error}`,
      });
    }
    tables.push({
      name: spec.name,
      primaryRows: rows.length,
      upserted: written.upserted,
      deletedExtras: 0,
    });
  }

  const byName = new Map(tables.map((table) => [table.name, table]));

  for (const spec of BACKUP_DELETE_ORDER) {
    const rows = primaryRows.get(spec.name) ?? [];
    const keep = new Set(
      rows
        .map((row) => row[spec.primaryKey])
        .filter((value) => value !== null && value !== undefined)
        .map((value) => String(value)),
    );
    const removed = await deleteExtras(backup, spec, keep);
    if (removed.error) {
      return fail(startedAt, now, {
        ...empty,
        tables,
        error: `Backup delete ${spec.name}: ${removed.error}`,
      });
    }
    const current = byName.get(spec.name);
    if (current) current.deletedExtras = removed.deleted;
  }

  return succeed(startedAt, now, {
    missingEnv,
    missingTables,
    primaryRef: projectRefFromUrl(env.primaryUrl),
    backupRef: projectRefFromUrl(env.backupUrl),
    tables,
  });
}

export function logBackupRefresh(result: BackupRefreshResult): void {
  const summary = {
    ok: result.ok,
    error: result.error,
    missingEnv: result.missingEnv,
    missingTables: result.missingTables,
    primaryRef: result.primaryRef,
    backupRef: result.backupRef,
    durationMs: result.durationMs,
    tables: result.tables.map((table) => ({
      name: table.name,
      rows: table.primaryRows,
      upserted: table.upserted,
      deletedExtras: table.deletedExtras,
    })),
    storage: result.storage,
  };

  if (result.ok) {
    console.log("backup.refresh", summary);
  } else {
    console.error("backup.refresh", summary);
  }
}
