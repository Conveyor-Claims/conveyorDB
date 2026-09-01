import { timingSafeEqual } from "node:crypto";
import { jsonError } from "@/lib/api/http";
import { readBackupEnv } from "@/lib/backup/env";

function bearerToken(header: string | null): string | null {
  if (!header) return null;
  const match = /^Bearer\s+(\S+)\s*$/i.exec(header);
  return match?.[1] ?? null;
}

function secretsEqual(left: string, right: string): boolean {
  const leftBuf = Buffer.from(left);
  const rightBuf = Buffer.from(right);
  if (leftBuf.length !== rightBuf.length) {
    timingSafeEqual(leftBuf, leftBuf);
    return false;
  }
  return timingSafeEqual(leftBuf, rightBuf);
}

function hasVercelCronHeader(request: Request): boolean {
  const flag = request.headers.get("x-vercel-cron");
  return flag === "1" || flag === "true";
}

/** 401 unless Bearer CRON_SECRET matches or Vercel sent the cron header. */
export function authorizeCronRequest(request: Request): Response | null {
  const expected = readBackupEnv().cronSecret;
  const token = bearerToken(request.headers.get("authorization"));
  const bearerOk = Boolean(expected && token && secretsEqual(token, expected));
  if (bearerOk || hasVercelCronHeader(request)) {
    return null;
  }
  return jsonError(401, "Unauthorized");
}
