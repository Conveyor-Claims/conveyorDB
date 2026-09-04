import type { SupabaseClient } from "@supabase/supabase-js";
import { isUuid } from "@/lib/api/cabinets";
import type { Database } from "@/lib/database.types";
import { readAppEnv } from "@/lib/env";
import {
  hasStoragePath,
  safeFileName,
  slotFilledMessage,
} from "@/lib/file-slot-display";

export {
  fileNameFromPath,
  hasStoragePath,
  safeFileName,
  slotFilledMessage,
} from "@/lib/file-slot-display";

type AdminClient = SupabaseClient<Database>;
type FilesInsert = Database["public"]["Tables"]["files"]["Insert"];
export type FileRow = Database["public"]["Tables"]["files"]["Row"];

export type CaseFile = FileRow & {
  signedUrl: string | null;
};

export type UploadFileState = {
  ok: boolean;
  message: string;
  filled?: boolean;
  id?: string;
};

export async function listFilledFilesForSlot(
  client: AdminClient,
  caseId: string,
  slotName: string,
): Promise<{ rows: FileRow[]; error: string | null }> {
  const { data, error } = await client
    .from("files")
    .select("*")
    .eq("case_id", caseId)
    .eq("slot_name", slotName);

  if (error) {
    return { rows: [], error: error.message };
  }

  return {
    rows: (data ?? []).filter((row) => hasStoragePath(row.storage_path)),
    error: null,
  };
}

export type UploadFileInput = {
  caseId: string;
  slotName: string;
  file: File;
  contentType?: string | null;
  extra?: Omit<FilesInsert, "case_id" | "slot_name" | "storage_path">;
  allowAnother?: boolean;
};

export type UploadFileResult =
  | { ok: true; row: FileRow }
  | { ok: false; status: number; message: string; filled?: boolean };

export async function uploadFileToSlot(
  admin: AdminClient,
  input: UploadFileInput,
): Promise<UploadFileResult> {
  const { caseId, slotName, file } = input;
  if (!isUuid(caseId)) {
    return { ok: false, status: 400, message: "case_id is required." };
  }
  if (slotName.trim() === "") {
    return { ok: false, status: 400, message: "slot_name is required." };
  }

  // Filled slot = same case_id + slot_name with a storage_path. 409 and keep
  // the first case-files object. No unique on (case_id, slot_name) — do not add one.
  const filled = await listFilledFilesForSlot(admin, caseId, slotName);
  if (filled.error) {
    return { ok: false, status: 500, message: filled.error };
  }
  if (filled.rows.length > 0 && !input.allowAnother) {
    return {
      ok: false,
      status: 409,
      message: slotFilledMessage(slotName),
      filled: true,
    };
  }

  const contentType =
    input.contentType !== undefined
      ? input.contentType
      : file.type.trim() === ""
        ? null
        : file.type;

  const insertRow: FilesInsert = {
    ...input.extra,
    case_id: caseId,
    slot_name: slotName,
    content_type: contentType,
    storage_path: null,
  };

  const inserted = await admin.from("files").insert(insertRow).select("*").single();
  if (inserted.error || !inserted.data) {
    return {
      ok: false,
      status: 500,
      message: inserted.error?.message ?? "Insert failed.",
    };
  }

  const row = inserted.data;
  const storagePath = `${caseId}/${row.id}/${safeFileName(file.name)}`;
  const { storageBucket } = readAppEnv();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const uploaded = await admin.storage.from(storageBucket).upload(storagePath, bytes, {
    contentType: contentType ?? undefined,
    upsert: false,
  });

  if (uploaded.error) {
    await admin.from("files").delete().eq("id", row.id);
    return { ok: false, status: 500, message: uploaded.error.message };
  }

  const updated = await admin
    .from("files")
    .update({ storage_path: storagePath, content_type: contentType })
    .eq("id", row.id)
    .is("storage_path", null)
    .select("*")
    .single();

  if (updated.error || !updated.data) {
    return {
      ok: false,
      status: 500,
      message: updated.error?.message ?? "Update failed.",
    };
  }

  return { ok: true, row: updated.data };
}
