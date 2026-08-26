import { createAdminClient } from "@/lib/supabase/admin";
import { createAnonServerClient } from "@/lib/supabase/server";
import {
  ALL_PUBLIC_TABLES,
  type PublicTableName,
  type SchemaTable,
} from "@/lib/schema/tables";
import { missingEnvNames, readAppEnv } from "@/lib/env";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export type TableProbe = {
  name: PublicTableName;
  columnCount: number;
  exists: boolean;
  rowCount: number | null;
  error: string | null;
};

export type StorageProbe = {
  bucket: string;
  exists: boolean;
  public: boolean | null;
  error: string | null;
};

export type SchemaHealth = {
  ok: boolean;
  checkedAt: string;
  projectRef: string | null;
  usingServiceRole: boolean;
  missingEnv: string[];
  tables: TableProbe[];
  storage: StorageProbe;
};

function projectRefFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    return host.split(".")[0] || null;
  } catch {
    return null;
  }
}

function isMissingRelation(message: string, code: string | undefined): boolean {
  if (code === "PGRST205" || code === "42P01") return true;
  return /could not find the table|relation .* does not exist/i.test(message);
}

async function probeTable(
  client: SupabaseClient<Database>,
  table: SchemaTable,
): Promise<TableProbe> {
  const { error, count } = await client
    .from(table.name)
    .select("*", { count: "exact", head: true });

  if (error) {
    return {
      name: table.name,
      columnCount: table.columnCount,
      exists: !isMissingRelation(error.message, error.code),
      rowCount: null,
      error: error.message,
    };
  }

  return {
    name: table.name,
    columnCount: table.columnCount,
    exists: true,
    rowCount: count ?? 0,
    error: null,
  };
}

async function probeStorage(
  client: SupabaseClient<Database>,
  bucket: string,
): Promise<StorageProbe> {
  const { data, error } = await client.storage.getBucket(bucket);
  if (!error && data) {
    return {
      bucket: data.name,
      exists: true,
      public: data.public,
      error: null,
    };
  }

  const listed = await client.storage.from(bucket).list("", { limit: 1 });
  if (!listed.error) {
    return {
      bucket,
      exists: true,
      public: null,
      error: null,
    };
  }

  return {
    bucket,
    exists: false,
    public: null,
    error: error?.message ?? listed.error.message,
  };
}

export async function checkSchemaHealth(): Promise<SchemaHealth> {
  const env = readAppEnv();
  const missingEnv = missingEnvNames(env);
  const admin = createAdminClient();
  const anon = createAnonServerClient();
  const client = admin ?? anon;

  if (!client) {
    return {
      ok: false,
      checkedAt: new Date().toISOString(),
      projectRef: projectRefFromUrl(env.supabaseUrl),
      usingServiceRole: false,
      missingEnv,
      tables: ALL_PUBLIC_TABLES.map((table) => ({
        name: table.name,
        columnCount: table.columnCount,
        exists: false,
        rowCount: null,
        error: "Supabase client is not configured.",
      })),
      storage: {
        bucket: env.storageBucket,
        exists: false,
        public: null,
        error: "Supabase client is not configured.",
      },
    };
  }

  const tables = await Promise.all(
    ALL_PUBLIC_TABLES.map((table) => probeTable(client, table)),
  );
  const storage = await probeStorage(client, env.storageBucket);
  const ok =
    tables.every((table) => table.exists && table.error === null) &&
    storage.exists;

  return {
    ok,
    checkedAt: new Date().toISOString(),
    projectRef: projectRefFromUrl(env.supabaseUrl),
    usingServiceRole: Boolean(admin),
    missingEnv,
    tables,
    storage,
  };
}
