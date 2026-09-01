import type { NextRequest } from "next/server";
import { json, jsonError } from "@/lib/api/http";
import { authorizeCronRequest } from "@/lib/backup/auth";
import { logBackupRefresh, refreshBackupFromPrimary } from "@/lib/backup/refresh";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

async function runBackup(request: NextRequest): Promise<Response> {
  const denied = authorizeCronRequest(request);
  if (denied) return denied;

  const result = await refreshBackupFromPrimary();
  logBackupRefresh(result);

  if (!result.ok) {
    const status = result.missingEnv.length > 0 ? 503 : 500;
    return jsonError(status, result.error ?? "Backup refresh failed.", {
      missingEnv: result.missingEnv,
      missingTables: result.missingTables,
      primaryRef: result.primaryRef,
      backupRef: result.backupRef,
      durationMs: result.durationMs,
      tables: result.tables,
    });
  }

  return json({
    ok: true,
    primaryRef: result.primaryRef,
    backupRef: result.backupRef,
    durationMs: result.durationMs,
    tables: result.tables,
    storage: result.storage,
  });
}

export async function GET(request: NextRequest) {
  return runBackup(request);
}

export async function POST(request: NextRequest) {
  return runBackup(request);
}
