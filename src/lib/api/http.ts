export function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function jsonError(status: number, error: string): Response {
  return json({ error }, status);
}

export function supabaseError(error: { message: string; code?: string }): Response {
  if (error.code === "23505") return jsonError(409, error.message);
  if (error.code === "23503" || error.code === "22P02" || error.code === "PGRST204") {
    return jsonError(400, error.message);
  }
  return jsonError(500, error.message);
}
