import type { SupabaseClient } from "@supabase/supabase-js";
import { authorizeApiRequest } from "@/lib/api/auth";
import { isUuid, resolveCabinet } from "@/lib/api/cabinets";
import { json, jsonError, supabaseError } from "@/lib/api/http";
import {
  formRecord,
  parseWriteBody,
  takeCasesConcurrency,
  takeNextStepsConcurrency,
  type WritePatch,
} from "@/lib/api/parse";
import type { ApiTable } from "@/lib/api/update-columns";
import {
  CASE_CONFLICT_MESSAGE,
  updateCaseWithConcurrency,
} from "@/lib/case-concurrency";
import { withComputedCaseNumber } from "@/lib/case-number";
import { createAdminClient } from "@/lib/clients/admin";
import type { Database } from "@/lib/database.types";
import {
  hasStoragePath,
  listFilledFilesForSlot,
  slotFilledMessage,
  uploadFileToSlot,
} from "@/lib/file-slots";
import {
  findNextStepByName,
  NEXT_STEP_CONFLICT_MESSAGE,
  updateNextStepWithConcurrency,
} from "@/lib/next-step-concurrency";
import { revalidateCaseLists } from "@/lib/revalidate-cases";

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

async function refuseIfSlotFilled(
  admin: AdminClient,
  caseId: string,
  slotName: string,
): Promise<Response | null> {
  const filled = await listFilledFilesForSlot(admin, caseId, slotName);
  if (filled.error) return jsonError(500, filled.error);
  if (filled.rows.length > 0) {
    return jsonError(409, slotFilledMessage(slotName), { filled: true });
  }
  return null;
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
      : undefined;
  const extra = { ...parsed.patch };
  delete extra.case_id;
  delete extra.slot_name;
  delete extra.storage_path;
  delete extra.content_type;
  delete extra.id;

  const result = await uploadFileToSlot(admin, {
    caseId,
    slotName,
    file: uploaded,
    contentType,
    extra,
  });

  if (!result.ok) {
    return jsonError(result.status, result.message, result.filled ? { filled: true } : undefined);
  }
  return json(result.row, 201);
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
      const caseId = parsed.patch.case_id;
      if (typeof slotName !== "string" || slotName.length === 0) {
        return jsonError(400, "slot_name is required.");
      }
      if (typeof caseId === "string" && isUuid(caseId)) {
        const refused = await refuseIfSlotFilled(admin, caseId, slotName);
        if (refused) return refused;
      }
    }

    if (table === "next_steps") {
      const name =
        typeof parsed.patch.name === "string" ? parsed.patch.name : null;
      const caseId = parsed.patch.case_id;
      if (name && typeof caseId === "string" && isUuid(caseId)) {
        const existing = await findNextStepByName(admin, caseId, name);
        if (existing.error) return jsonError(500, existing.error);
        if (existing.row) {
          return jsonError(
            409,
            `A next step named "${name}" already exists for this case.`,
          );
        }
      }
    }

    if (table === "cases") {
      const assigned = await withComputedCaseNumber(
        admin,
        asInsert("cases", parsed.patch),
      );
      if (!assigned.ok) return jsonError(500, assigned.message);
      const { data, error } = await insertQuery(
        admin,
        table,
        assigned.patch as WritePatch,
      );
      if (error) return supabaseError(error);
      const insertedId =
        data && typeof data === "object" && "id" in data && data.id
          ? String(data.id)
          : undefined;
      revalidateCaseLists(insertedId);
      return json(data, 201);
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

    if (table === "next_steps") {
      const meta = takeNextStepsConcurrency(read.body, request.headers);
      const parsed = parseWriteBody(table, meta.body, "update");
      if (!parsed.ok) return jsonError(parsed.status, parsed.error);

      const current = await admin
        .from("next_steps")
        .select("id, case_id, name")
        .eq("id", id)
        .maybeSingle();
      if (current.error) return supabaseError(current.error);
      if (!current.data) return jsonError(404, "Not found");

      const nextName =
        typeof parsed.patch.name === "string" ? parsed.patch.name : null;
      const caseId = current.data.case_id;
      if (nextName && caseId) {
        const duplicate = await findNextStepByName(admin, caseId, nextName, id);
        if (duplicate.error) return jsonError(500, duplicate.error);
        if (duplicate.row) {
          return jsonError(
            409,
            `A next step named "${nextName}" already exists for this case.`,
          );
        }
      }

      const result = await updateNextStepWithConcurrency(
        admin,
        id,
        asUpdate("next_steps", parsed.patch),
        {
          loadedUpdatedAt: meta.loadedUpdatedAt,
          overwrite: meta.overwrite,
        },
      );

      if (!result.ok) {
        if (result.kind === "empty") {
          return jsonError(409, NEXT_STEP_CONFLICT_MESSAGE, { conflict: true });
        }
        return jsonError(500, result.message);
      }

      return json(result.row);
    }

    const parsed = parseWriteBody(table, read.body, "update");
    if (!parsed.ok) return jsonError(parsed.status, parsed.error);

    if (table === "files" && "storage_path" in parsed.patch) {
      const current = await admin
        .from("files")
        .select("id, storage_path")
        .eq("id", id)
        .maybeSingle();
      if (current.error) return supabaseError(current.error);
      if (!current.data) return jsonError(404, "Not found");
      const nextPath =
        typeof parsed.patch.storage_path === "string"
          ? parsed.patch.storage_path
          : null;
      if (
        hasStoragePath(current.data.storage_path) &&
        current.data.storage_path !== nextPath
      ) {
        return jsonError(
          409,
          "This file row is already filled. The existing storage object was not replaced.",
        );
      }
    }

    const { data, error } = await updateQuery(admin, table, id, parsed.patch);

    if (error) return supabaseError(error);
    if (!data) return jsonError(404, "Not found");
    return json(data);
  });
}
