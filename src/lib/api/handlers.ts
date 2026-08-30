import type { SupabaseClient } from "@supabase/supabase-js";
import { authorizeApiRequest } from "@/lib/api/auth";
import { isUuid, resolveCabinet } from "@/lib/api/cabinets";
import { json, jsonError, supabaseError } from "@/lib/api/http";
import {
  formRecord,
  parseWriteBody,
  takeCasesConcurrency,
  type WritePatch,
} from "@/lib/api/parse";
import type { ApiTable } from "@/lib/api/update-columns";
import {
  CASE_CONFLICT_MESSAGE,
  updateCaseWithConcurrency,
} from "@/lib/case-concurrency";
import { createAdminClient } from "@/lib/clients/admin";
import type { Database } from "@/lib/database.types";
import { readAppEnv } from "@/lib/env";

type AdminClient = SupabaseClient<Database>;

async function withApi(
  request: Request,
  cabinetSlug: string,
  fn: (ctx: { table: ApiTable; admin: AdminClient }) => Promise<Response>,
): Promise<Response> {
  const denied = authorizeApiRequest(request);
  if (denied) return denied;

  const table = resolveCabinet(cabinetSlug);
  if (!table) return jsonError(404, "Not found");

  const admin = createAdminClient();
  if (!admin) return jsonError(503, "Supabase admin client is not configured.");

  return fn({ table, admin });
}

async function readJsonBody(request: Request): Promise<
  { ok: true; body: unknown } | { ok: false; response: Response }
> {
  const text = await request.text();
  if (text.trim() === "") return { ok: true, body: {} };
  try {
    return { ok: true, body: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, response: jsonError(400, "Body must be JSON.") };
  }
}

function asInsert<T extends ApiTable>(
  _table: T,
  patch: WritePatch,
): Database["public"]["Tables"][T]["Insert"] {
  return patch as Database["public"]["Tables"][T]["Insert"];
}

function asUpdate<T extends ApiTable>(
  _table: T,
  patch: WritePatch,
): Database["public"]["Tables"][T]["Update"] {
  return patch as Database["public"]["Tables"][T]["Update"];
}

function insertQuery(admin: AdminClient, table: ApiTable, patch: WritePatch) {
  switch (table) {
    case "cases":
      return admin.from("cases").insert(asInsert("cases", patch)).select("*").single();
    case "contacts":
      return admin.from("contacts").insert(asInsert("contacts", patch)).select("*").single();
    case "partners":
      return admin.from("partners").insert(asInsert("partners", patch)).select("*").single();
    case "next_steps":
      return admin.from("next_steps").insert(asInsert("next_steps", patch)).select("*").single();
    case "files":
      return admin.from("files").insert(asInsert("files", patch)).select("*").single();
  }
}

function updateQuery(admin: AdminClient, table: ApiTable, id: string, patch: WritePatch) {
  switch (table) {
    case "cases":
      return admin.from("cases").update(asUpdate("cases", patch)).eq("id", id).select("*").maybeSingle();
    case "contacts":
      return admin
        .from("contacts")
        .update(asUpdate("contacts", patch))
        .eq("id", id)
        .select("*")
        .maybeSingle();
    case "partners":
      return admin
        .from("partners")
        .update(asUpdate("partners", patch))
        .eq("id", id)
        .select("*")
        .maybeSingle();
    case "next_steps":
      return admin
        .from("next_steps")
        .update(asUpdate("next_steps", patch))
        .eq("id", id)
        .select("*")
        .maybeSingle();
    case "files":
      return admin.from("files").update(asUpdate("files", patch)).eq("id", id).select("*").maybeSingle();
  }
}

function listQuery(admin: AdminClient, table: ApiTable, caseId: string | null) {
  switch (table) {
    case "cases":
      return admin.from("cases").select("*").order("case_number", { ascending: true });
    case "contacts":
      return admin.from("contacts").select("*").order("created_at", { ascending: true });
    case "partners":
      return admin.from("partners").select("*").order("created_at", { ascending: true });
    case "next_steps": {
      const query = admin.from("next_steps").select("*");
      return (caseId ? query.eq("case_id", caseId) : query).order("created_at", {
        ascending: true,
      });
    }
    case "files": {
      const query = admin.from("files").select("*");
      return (caseId ? query.eq("case_id", caseId) : query).order("created_at", {
        ascending: true,
      });
    }
  }
}

function filterCaseId(
  table: ApiTable,
  request: Request,
): { ok: true; caseId: string | null } | { ok: false; response: Response } {
  if (table !== "next_steps" && table !== "files") {
    return { ok: true, caseId: null };
  }
  const caseId = new URL(request.url).searchParams.get("case_id");
  if (caseId === null) return { ok: true, caseId: null };
  if (!isUuid(caseId)) {
    return { ok: false, response: jsonError(400, "Invalid case_id") };
  }
  return { ok: true, caseId };
}

export async function listCabinet(request: Request, cabinetSlug: string): Promise<Response> {
  return withApi(request, cabinetSlug, async ({ table, admin }) => {
    const filter = filterCaseId(table, request);
    if (!filter.ok) return filter.response;

    const { data, error } = await listQuery(admin, table, filter.caseId);
    if (error) return supabaseError(error);
    return json(data ?? []);
  });
}

export async function getCabinetRow(
  request: Request,
  cabinetSlug: string,
  id: string,
): Promise<Response> {
  return withApi(request, cabinetSlug, async ({ table, admin }) => {
    if (!isUuid(id)) return jsonError(400, "Invalid id");

    const { data, error } = await admin.from(table).select("*").eq("id", id).maybeSingle();
    if (error) return supabaseError(error);
    if (!data) return jsonError(404, "Not found");
    return json(data);
  });
}

function isMultipart(request: Request): boolean {
  const contentType = request.headers.get("content-type") ?? "";
  return contentType.toLowerCase().includes("multipart/form-data");
}

function safeFileName(name: string): string {
  const base = name.replace(/^.*[/\\]/, "").trim();
  const cleaned = base.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || "file";
}

async function insertFileMultipart(request: Request, admin: AdminClient): Promise<Response> {
  const formData = await request.formData();
  const named = formData.getAll("file").filter((value): value is File => value instanceof File);
  const uploadedFiles =
    named.length > 0
      ? named
      : [...formData.values()].filter((value): value is File => value instanceof File);
  const uploaded = uploadedFiles[0];

  if (!uploaded || uploadedFiles.length !== 1) {
    return jsonError(400, "POST /api/files multipart requires one file.");
  }

  const body = formRecord(formData);
  const parsed = parseWriteBody("files", body, "insert");
  if (!parsed.ok) return jsonError(parsed.status, parsed.error);

  const caseId = parsed.patch.case_id;
  const slotName = parsed.patch.slot_name;
  if (typeof caseId !== "string" || !isUuid(caseId)) {
    return jsonError(400, "case_id is required.");
  }
  if (typeof slotName !== "string" || slotName.length === 0) {
    return jsonError(400, "slot_name is required.");
  }

  const contentType =
    typeof parsed.patch.content_type === "string"
      ? parsed.patch.content_type
      : uploaded.type.trim() === ""
        ? null
        : uploaded.type;
  const insertRow = asInsert("files", {
    ...parsed.patch,
    content_type: contentType,
  });

  const inserted = await admin.from("files").insert(insertRow).select("*").single();
  if (inserted.error || !inserted.data) {
    return inserted.error ? supabaseError(inserted.error) : jsonError(500, "Insert failed.");
  }

  const row = inserted.data;
  const storagePath = `${caseId}/${row.id}/${safeFileName(uploaded.name)}`;
  const { storageBucket } = readAppEnv();
  const bytes = new Uint8Array(await uploaded.arrayBuffer());
  const uploadedFile = await admin.storage.from(storageBucket).upload(storagePath, bytes, {
    contentType: contentType ?? undefined,
    upsert: false,
  });

  if (uploadedFile.error) {
    await admin.from("files").delete().eq("id", row.id);
    return jsonError(500, uploadedFile.error.message);
  }

  const updated = await admin
    .from("files")
    .update({ storage_path: storagePath, content_type: contentType })
    .eq("id", row.id)
    .select("*")
    .single();

  if (updated.error || !updated.data) {
    return updated.error ? supabaseError(updated.error) : jsonError(500, "Update failed.");
  }
  return json(updated.data, 201);
}

export async function insertCabinet(request: Request, cabinetSlug: string): Promise<Response> {
  return withApi(request, cabinetSlug, async ({ table, admin }) => {
    if (table === "files" && isMultipart(request)) {
      return insertFileMultipart(request, admin);
    }

    const read = await readJsonBody(request);
    if (!read.ok) return read.response;

    const parsed = parseWriteBody(table, read.body, "insert");
    if (!parsed.ok) return jsonError(parsed.status, parsed.error);

    if (table === "files") {
      const slotName = parsed.patch.slot_name;
      if (typeof slotName !== "string" || slotName.length === 0) {
        return jsonError(400, "slot_name is required.");
      }
    }

    const { data, error } = await insertQuery(admin, table, parsed.patch);

    if (error) return supabaseError(error);
    return json(data, 201);
  });
}

export async function patchCabinetRow(
  request: Request,
  cabinetSlug: string,
  id: string,
): Promise<Response> {
  return withApi(request, cabinetSlug, async ({ table, admin }) => {
    if (!isUuid(id)) return jsonError(400, "Invalid id");

    const read = await readJsonBody(request);
    if (!read.ok) return read.response;

    if (table === "cases") {
      const meta = takeCasesConcurrency(read.body, request.headers);
      const parsed = parseWriteBody(table, meta.body, "update");
      if (!parsed.ok) return jsonError(parsed.status, parsed.error);

      const result = await updateCaseWithConcurrency(
        admin,
        id,
        asUpdate("cases", parsed.patch),
        {
          loadedLastModified: meta.loadedLastModified,
          overwrite: meta.overwrite,
        },
      );

      if (!result.ok) {
        if (result.kind === "empty") {
          const existing = await admin
            .from("cases")
            .select("id")
            .eq("id", id)
            .maybeSingle();
          if (existing.data) {
            return jsonError(409, CASE_CONFLICT_MESSAGE, { conflict: true });
          }
          return jsonError(404, "Not found");
        }
        return jsonError(500, result.message);
      }

      return json(result.row);
    }

    const parsed = parseWriteBody(table, read.body, "update");
    if (!parsed.ok) return jsonError(parsed.status, parsed.error);

    const { data, error } = await updateQuery(admin, table, id, parsed.patch);

    if (error) return supabaseError(error);
    if (!data) return jsonError(404, "Not found");
    return json(data);
  });
}
