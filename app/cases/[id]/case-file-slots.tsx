"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { CaseFile, UploadFileState } from "@/lib/file-slots";
import { fileNameFromPath, hasStoragePath } from "@/lib/file-slot-display";
import { uploadFileAction } from "./actions";

function FileSlotRow({
  caseId,
  slotName,
  files,
  canUpload,
}: {
  caseId: string;
  slotName: string;
  files: CaseFile[];
  canUpload: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadFileState | null>(null);
  const [pending, setPending] = useState(false);
  const filled = files.some((row) => hasStoragePath(row.storage_path));
  const inputId = `file-slot-${slotName.replace(/[^A-Za-z0-9_-]+/g, "-")}`;

  async function upload() {
    const file = inputRef.current?.files?.[0];
    const formData = new FormData();
    formData.set("caseRowId", caseId);
    formData.set("slot_name", slotName);
    if (file) formData.set("file", file);
    setPending(true);
    const result = await uploadFileAction(null, formData);
    setPending(false);
    setState(result);
  }

  return (
    <div className="grid gap-1 border-t border-border py-3 first:border-t-0 sm:grid-cols-[minmax(12rem,14rem)_1fr] sm:gap-6">
      <dt className="text-sm text-muted">{slotName}</dt>
      <dd className="min-w-0 space-y-2 text-sm text-foreground">
        {files.length === 0 ? null : (
          <ul className="space-y-1">
            {files.map((row) => {
              const name = fileNameFromPath(row.storage_path);
              return (
                <li key={row.id} className="break-all">
                  {row.signedUrl && name ? (
                    <a
                      href={row.signedUrl}
                      className="text-accent underline-offset-2 hover:text-accent-hover hover:underline"
                    >
                      {name}
                    </a>
                  ) : (
                    <span className="font-mono text-xs text-muted">
                      {name || row.id}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {filled ? (
          <p className="text-xs text-muted">
            This slot is filled. A second upload is refused so the first object
            stays in <span className="font-mono">case-files</span>.
          </p>
        ) : canUpload ? (
          <div className="space-y-2">
            <label className="sr-only" htmlFor={inputId}>
              Upload {slotName}
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              className="block w-full text-sm text-foreground"
            />
            <button
              type="button"
              disabled={pending}
              onClick={() => void upload()}
              className="rounded-[12px] bg-accent px-3 py-1.5 text-sm font-medium text-accent-on hover:bg-accent-hover disabled:opacity-60"
            >
              {pending ? "Uploading…" : "Upload"}
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted">
            <Link href="/login" className="text-accent hover:text-accent-hover">
              Temporary login
            </Link>{" "}
            to upload.
          </p>
        )}

        <p
          role="status"
          aria-live="polite"
          className={`text-xs ${
            state?.ok ? "text-emerald-700" : state ? "text-red-800" : "text-muted"
          }`}
        >
          {pending ? "Uploading…" : (state?.message ?? "")}
        </p>
      </dd>
    </div>
  );
}

export function CaseFileSlots({
  caseId,
  slotNames,
  files,
  canUpload,
}: {
  caseId: string;
  slotNames: readonly string[];
  files: CaseFile[];
  canUpload: boolean;
}) {
  if (slotNames.length === 0) return null;

  return (
    <>
      {slotNames.map((slotName) => (
        <FileSlotRow
          key={slotName}
          caseId={caseId}
          slotName={slotName}
          files={files.filter((row) => row.slot_name === slotName)}
          canUpload={canUpload}
        />
      ))}
    </>
  );
}
