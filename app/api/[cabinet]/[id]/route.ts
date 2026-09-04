import type { NextRequest } from "next/server";
import { getCabinetRow, patchCabinetRow } from "@/lib/api/handlers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// PATCH cases: send loaded last_modified (JSON or If-Match); 0 rows → 409.
// Optional overwrite: true skips the match. Same pattern on next-steps via updated_at.
// Cookie login is not enough — Bearer service role only (see authorizeApiRequest).

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ cabinet: string; id: string }> },
) {
  const { cabinet, id } = await context.params;
  return getCabinetRow(request, cabinet, id);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ cabinet: string; id: string }> },
) {
  const { cabinet, id } = await context.params;
  return patchCabinetRow(request, cabinet, id);
}
