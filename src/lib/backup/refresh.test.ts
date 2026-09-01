import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { authorizeCronRequest } from "./auth";
import { backupPointsAtPrimary, missingBackupEnvNames } from "./env";
import { refreshBackupFromPrimary } from "./refresh";
import { BACKUP_DELETE_ORDER, BACKUP_INSERT_ORDER } from "./tables";

const PREV_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  BACKUP_SUPABASE_URL: process.env.BACKUP_SUPABASE_URL,
  BACKUP_SUPABASE_SERVICE_ROLE_KEY: process.env.BACKUP_SUPABASE_SERVICE_ROLE_KEY,
  CRON_SECRET: process.env.CRON_SECRET,
};

afterEach(() => {
  for (const [key, value] of Object.entries(PREV_ENV)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function setBackupEnv(overrides: Record<string, string> = {}) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://eskwbmtqtzqssbhyzjmv.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "primary-service-role";
  process.env.BACKUP_SUPABASE_URL = "https://tjndmefytlesqlbfqbvk.supabase.co";
  process.env.BACKUP_SUPABASE_SERVICE_ROLE_KEY = "backup-service-role";
  process.env.CRON_SECRET = "cron-test-secret";
  Object.assign(process.env, overrides);
}

test("insert order lists parents before FK children", () => {
  const names = BACKUP_INSERT_ORDER.map((table) => table.name);
  assert.ok(names.indexOf("cases") < names.indexOf("next_steps"));
  assert.ok(names.indexOf("cases") < names.indexOf("files"));
  assert.ok(names.indexOf("cases") < names.indexOf("case_view_grants"));
  assert.ok(names.indexOf("role_permissions") < names.indexOf("case_view_grants"));
  assert.equal(BACKUP_DELETE_ORDER[0]?.name, "case_view_grants");
  assert.ok(BACKUP_INSERT_ORDER.some((table) => table.name === "referred_cases"));
});

test("missing backup env names are listed without values", () => {
  const missing = missingBackupEnvNames({
    primaryUrl: undefined,
    primaryServiceRoleKey: "x",
    backupUrl: undefined,
    backupServiceRoleKey: undefined,
    cronSecret: undefined,
  });
  assert.deepEqual(missing, [
    "NEXT_PUBLIC_SUPABASE_URL",
    "BACKUP_SUPABASE_URL",
    "BACKUP_SUPABASE_SERVICE_ROLE_KEY",
  ]);
});

test("refuses backup URL that matches primary", () => {
  assert.equal(
    backupPointsAtPrimary({
      primaryUrl: "https://eskwbmtqtzqssbhyzjmv.supabase.co",
      primaryServiceRoleKey: "a",
      backupUrl: "https://eskwbmtqtzqssbhyzjmv.supabase.co",
      backupServiceRoleKey: "b",
      cronSecret: "c",
    }),
    true,
  );
  assert.equal(
    backupPointsAtPrimary({
      primaryUrl: "https://eskwbmtqtzqssbhyzjmv.supabase.co",
      primaryServiceRoleKey: "a",
      backupUrl: "https://tjndmefytlesqlbfqbvk.supabase.co",
      backupServiceRoleKey: "b",
      cronSecret: "c",
    }),
    false,
  );
});

test("cron route rejects missing or wrong bearer", () => {
  setBackupEnv();
  const denied = authorizeCronRequest(new Request("https://example.com/api/cron/backup"));
  assert.equal(denied?.status, 401);

  const wrong = authorizeCronRequest(
    new Request("https://example.com/api/cron/backup", {
      headers: { authorization: "Bearer other-secret" },
    }),
  );
  assert.equal(wrong?.status, 401);
});

test("cron route accepts CRON_SECRET bearer or Vercel cron header", () => {
  setBackupEnv();
  const bearer = authorizeCronRequest(
    new Request("https://example.com/api/cron/backup", {
      headers: { authorization: "Bearer cron-test-secret" },
    }),
  );
  assert.equal(bearer, null);

  const cron = authorizeCronRequest(
    new Request("https://example.com/api/cron/backup", {
      headers: { "x-vercel-cron": "1" },
    }),
  );
  assert.equal(cron, null);
});

type Call = {
  table: string;
  op: string;
  payload?: unknown;
};

function createMockClient(options: {
  missing?: Set<string>;
  rows?: Record<string, Record<string, unknown>[]>;
  listed?: Record<string, Record<string, unknown>[]>;
  calls: Call[];
}) {
  const rows = options.rows ?? {};
  const listed = options.listed ?? rows;

  const from = (table: string) => {
    const chain = {
      select() {
        return chain;
      },
      range() {
        if (options.missing?.has(table)) {
          return Promise.resolve({
            data: null,
            error: { message: "relation does not exist", code: "42P01" },
          });
        }
        return Promise.resolve({ data: listed[table] ?? rows[table] ?? [], error: null });
      },
      upsert(payload: unknown) {
        options.calls.push({ table, op: "upsert", payload });
        return Promise.resolve({ error: null });
      },
      delete() {
        return chain;
      },
      in(_column: string, keys: string[]) {
        options.calls.push({ table, op: "delete", payload: keys });
        return Promise.resolve({ error: null });
      },
    };

    const selectFn = chain.select;
    chain.select = (...args: unknown[]) => {
      const opts = args[1] as { count?: string; head?: boolean } | undefined;
      if (opts?.head) {
        if (options.missing?.has(table)) {
          return Promise.resolve({
            data: null,
            error: { message: "relation does not exist", code: "42P01" },
          }) as never;
        }
        return Promise.resolve({ data: null, error: null, count: 0 }) as never;
      }
      return selectFn();
    };

    return chain;
  };

  return { from } as never;
}

test("refresh fails clearly when a backup table is missing", async () => {
  setBackupEnv();
  const calls: Call[] = [];
  const primary = createMockClient({ calls, rows: { cases: [] } });
  const backup = createMockClient({
    calls,
    missing: new Set(["cases"]),
  });

  const result = await refreshBackupFromPrimary({
    primary,
    backup,
    now: () => 1000,
  });

  assert.equal(result.ok, false);
  assert.ok(result.missingTables.includes("backup.cases"));
  assert.match(result.error ?? "", /missing tables/i);
  assert.equal(
    calls.some((call) => call.op === "upsert"),
    false,
  );
});

test("refresh upserts then deletes extras without duplicating", async () => {
  setBackupEnv();
  const calls: Call[] = [];
  const caseRow = { id: "11111111-1111-1111-1111-111111111111", client_name: "Ada" };
  const primary = createMockClient({
    calls,
    rows: {
      cases: [caseRow],
    },
  });
  const backup = createMockClient({
    calls,
    rows: {
      cases: [caseRow],
    },
    listed: {
      cases: [caseRow, { id: "22222222-2222-2222-2222-222222222222" }],
    },
  });

  const first = await refreshBackupFromPrimary({
    primary,
    backup,
    now: () => 1,
  });
  assert.equal(first.ok, true);
  const caseResult = first.tables.find((table) => table.name === "cases");
  assert.equal(caseResult?.primaryRows, 1);
  assert.equal(caseResult?.upserted, 1);
  assert.equal(caseResult?.deletedExtras, 1);

  const upserts = calls.filter((call) => call.op === "upsert" && call.table === "cases");
  const deletes = calls.filter((call) => call.op === "delete" && call.table === "cases");
  assert.equal(upserts.length, 1);
  assert.deepEqual(deletes[0]?.payload, ["22222222-2222-2222-2222-222222222222"]);

  const second = await refreshBackupFromPrimary({
    primary,
    backup,
    now: () => 2,
  });
  assert.equal(second.ok, true);
  assert.equal(second.tables.find((table) => table.name === "cases")?.upserted, 1);
});
