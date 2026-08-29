import type { NextRequest } from "next/server";
import { insertCabinet, listCabinet } from "@/lib/api/handlers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ cabinet: string }> },
) {
  const { cabinet } = await context.params;
  return listCabinet(request, cabinet);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ cabinet: string }> },
) {
  const { cabinet } = await context.params;
  return insertCabinet(request, cabinet);
}
