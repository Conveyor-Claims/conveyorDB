import { cache } from "react";
import { casesClient, isCaseId } from "@/lib/cases";
import { createAdminClient } from "@/lib/clients/admin";
import { readAppEnv } from "@/lib/env";
import {
  type CaseFile,
  type FileRow,
  type UploadFileState,
  uploadFileToSlot,
} from "@/lib/file-slots";
import { getSession, isAdmin } from "@/lib/session";

export type { CaseFile, FileRow, UploadFileState } from "@/lib/file-slots";
export {
  fileNameFromPath,
  hasStoragePath,
  slotFilledMessage,
} from "@/lib/file-slots";

export type FilesForCase = {
  rows: CaseFile[];
  error: string | null;
};

async function signPath(
  client: NonNullable<ReturnType<typeof casesClient>["client"]>,
  storagePath: string | null,
): Promise<string | null> {
  if (!storagePath || storagePath.trim() === "") return null;
  const { storageBucket } = readAppEnv();
  const { data, error } = await client.storage
    .from(storageBucket)
    .createSignedUrl(storagePath, 3600);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export const listFilesForCase = cache(
  async (caseId: string): Promise<FilesForCase> => {
    const { client } = casesClient();
    if (!client) {
      return { rows: [], error: "Supabase client is not configured." };
    }
    if (!isCaseId(caseId)) {
      return { rows: [], error: null };
    }

    const { data, error } = await client
      .from("files")
      .select("*")
      .eq("case_id", caseId)
      .order("created_at", { ascending: true });

    if (error) {
      return { rows: [], error: error.message };
    }

    const rows: CaseFile[] = await Promise.all(
      (data ?? []).map(async (row: FileRow) => ({
        ...row,
        signedUrl: await signPath(client, row.storage_path),
      })),
    );

    return { rows, error: null };
  },
);

export async function uploadFileFromForm(
  formData: FormData,
): Promise<UploadFileState> {
  const session = await getSession();
  if (!isAdmin(session)) {
    return { ok: false, message: "Temporary login required to upload a file." };
  }

  const caseRaw = formData.get("caseRowId");
  const caseId = typeof caseRaw === "string" ? caseRaw : "";
  if (!isCaseId(caseId)) {
    return { ok: false, message: "Could not upload: invalid case id." };
  }

  const slotRaw = formData.get("slot_name");
  const slotName = typeof slotRaw === "string" ? slotRaw.trim() : "";
  if (slotName === "") {
    return { ok: false, message: "slot_name is required." };
  }

  const uploaded = formData.get("file");
  if (!(uploaded instanceof File) || uploaded.size === 0) {
    return { ok: false, message: "Choose one file to upload." };
  }

  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const result = await uploadFileToSlot(admin, {
    caseId,
    slotName,
    file: uploaded,
  });

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
      filled: result.filled,
    };
  }

  return { ok: true, message: "Uploaded.", id: result.row.id };
}
