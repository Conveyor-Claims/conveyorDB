"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useActionState } from "react";
import {
  LOADED_LAST_MODIFIED_FIELD,
  OVERWRITE_FIELD,
} from "@/lib/case-concurrency";
import type { UpdateCaseState } from "@/lib/case-save";
import { updateCaseAction } from "./actions";

type DirtyContextValue = {
  setFieldDirty: (key: string, dirty: boolean) => void;
  loadedLastModified: string;
  setLoadedLastModified: (value: string) => void;
};

const DirtyContext = createContext<DirtyContextValue | null>(null);

export function useFieldDirty() {
  const ctx = useContext(DirtyContext);
  if (!ctx) {
    throw new Error("useFieldDirty must be used inside CaseForm");
  }
  return ctx;
}

export function ConflictActions({
  onOverwrite,
}: {
  onOverwrite?: () => void;
}) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => {
          window.location.reload();
        }}
        className="rounded-[12px] border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-wash"
      >
        Reload
      </button>
      {onOverwrite ? (
        <button
          type="button"
          onClick={onOverwrite}
          className="rounded-[12px] bg-accent px-3 py-1.5 text-sm font-medium text-accent-on hover:bg-accent-hover"
        >
          Overwrite
        </button>
      ) : (
        <button
          type="submit"
          name={OVERWRITE_FIELD}
          value="true"
          className="rounded-[12px] bg-accent px-3 py-1.5 text-sm font-medium text-accent-on hover:bg-accent-hover"
        >
          Overwrite
        </button>
      )}
    </span>
  );
}

function SaveBar({
  state,
  pending,
  unsaved,
}: {
  state: UpdateCaseState | null;
  pending: boolean;
  unsaved: boolean;
}) {
  const conflict = Boolean(state && !state.ok && state.conflict);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
      <button
        type="submit"
        disabled={pending}
        className="rounded-[12px] bg-accent px-4 py-2 text-sm font-medium text-accent-on hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      {conflict ? <ConflictActions /> : null}
      <p
        role="status"
        aria-live="polite"
        className={`text-sm ${
          state?.ok
            ? "text-emerald-700"
            : state
              ? "text-red-800"
              : unsaved
                ? "text-amber-800"
                : "text-muted"
        }`}
      >
        {pending
          ? "Saving stored fields…"
          : (state?.message ??
            (unsaved ? "Unsaved changes — Save to keep them." : ""))}
      </p>
    </div>
  );
}

export function CaseForm({
  caseId,
  lastModified,
  children,
}: {
  caseId: string;
  lastModified: string | null;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(updateCaseAction, null);
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(() => new Set());
  const [loadedLastModified, setLoadedLastModified] = useState(
    () => lastModified ?? "",
  );

  useEffect(() => {
    setLoadedLastModified(lastModified ?? "");
  }, [lastModified]);

  useEffect(() => {
    if (state?.ok && state.lastModified !== undefined) {
      setLoadedLastModified(state.lastModified ?? "");
    }
  }, [state]);

  const setFieldDirty = useCallback((key: string, dirty: boolean) => {
    setDirtyKeys((current) => {
      const has = current.has(key);
      if (dirty === has) return current;
      const next = new Set(current);
      if (dirty) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ setFieldDirty, loadedLastModified, setLoadedLastModified }),
    [setFieldDirty, loadedLastModified],
  );
  const unsaved = dirtyKeys.size > 0;

  return (
    <DirtyContext.Provider value={value}>
      <form action={formAction} className="space-y-8">
        <input type="hidden" name="caseRowId" value={caseId} />
        <input
          type="hidden"
          name={LOADED_LAST_MODIFIED_FIELD}
          value={loadedLastModified}
        />
        <SaveBar state={state} pending={pending} unsaved={unsaved} />
        {children}
        <SaveBar state={state} pending={pending} unsaved={unsaved} />
      </form>
    </DirtyContext.Provider>
  );
}
