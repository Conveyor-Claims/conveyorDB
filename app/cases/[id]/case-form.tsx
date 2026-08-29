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
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-wrap items-center gap-3 rounded-md border bg-card px-4 py-3">
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
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
                : "text-muted-foreground"
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
      <form action={formAction} className="flex flex-col gap-8">
        <input type="hidden" name="caseRowId" value={caseId} />
        <SaveBar state={state} pending={pending} unsaved={unsaved} />
        {children}
        <SaveBar state={state} pending={pending} unsaved={unsaved} />
      </form>
    </DirtyContext.Provider>
  );
}
