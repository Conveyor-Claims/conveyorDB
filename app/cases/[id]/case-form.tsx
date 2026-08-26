"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useActionState } from "react";
import type { UpdateCaseState } from "@/lib/case-save";
import { updateCaseAction } from "./actions";

type DirtyContextValue = {
  setFieldDirty: (key: string, dirty: boolean) => void;
};

const DirtyContext = createContext<DirtyContextValue | null>(null);

export function useFieldDirty() {
  const ctx = useContext(DirtyContext);
  if (!ctx) {
    throw new Error("useFieldDirty must be used inside CaseForm");
  }
  return ctx;
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
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
      <button
        type="submit"
        disabled={pending}
        className="rounded-[12px] bg-accent px-4 py-2 text-sm font-medium text-accent-on hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
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
  children,
}: {
  caseId: string;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(updateCaseAction, null);
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(() => new Set());

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

  const value = useMemo(() => ({ setFieldDirty }), [setFieldDirty]);
  const unsaved = dirtyKeys.size > 0;

  return (
    <DirtyContext.Provider value={value}>
      <form action={formAction} className="space-y-8">
        <input type="hidden" name="caseRowId" value={caseId} />
        <SaveBar state={state} pending={pending} unsaved={unsaved} />
        {children}
        <SaveBar state={state} pending={pending} unsaved={unsaved} />
      </form>
    </DirtyContext.Provider>
  );
}
