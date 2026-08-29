import { timingSafeEqual } from "node:crypto";
import { readAppEnv } from "@/lib/env";

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

/** 401 if the Bearer token is missing or is not SUPABASE_SERVICE_ROLE_KEY. */
export function authorizeApiRequest(request: Request): Response | null {
  const expected = readAppEnv().serviceRoleKey;
  const token = bearerToken(request.headers.get("authorization"));
  if (!expected || !token || !secretsEqual(token, expected)) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }
  return null;
}
