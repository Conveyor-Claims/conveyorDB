import type { NextRequest } from "next/server";
import { getCabinetRow, patchCabinetRow } from "@/lib/api/handlers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
