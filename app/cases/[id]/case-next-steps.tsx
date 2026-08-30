"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import {
  LOADED_UPDATED_AT_FIELD,
  type NextStepRow,
  type NextStepState,
} from "@/lib/next-step-concurrency";
import { addNextStepAction, claimNextStepAction } from "./actions";
import { ConflictActions } from "./case-form";

function ClaimRow({
  caseId,
  row,
}: {
  caseId: string;
  row: NextStepRow;
}) {
  const [state, formAction, pending] = useActionState(
    claimNextStepAction,
    null as NextStepState | null,
  );
  const [name, setName] = useState(row.name ?? "");
  const [loadedUpdatedAt, setLoadedUpdatedAt] = useState(row.updated_at);

  useEffect(() => {
    setName(row.name ?? "");
    setLoadedUpdatedAt(row.updated_at);
  }, [row.name, row.updated_at]);

  useEffect(() => {
    if (state?.ok && state.updatedAt) {
      setLoadedUpdatedAt(state.updatedAt);
    }
  }, [state]);

  const conflict = Boolean(state && !state.ok && state.conflict);

  return (
    <form action={formAction} className="space-y-2 border-t border-border py-3 first:border-t-0">
      <input type="hidden" name="caseRowId" value={caseId} />
      <input type="hidden" name="nextStepId" value={row.id} />
      <input
        type="hidden"
        name={LOADED_UPDATED_AT_FIELD}
        value={loadedUpdatedAt}
      />
      <label className="block space-y-1">
        <span className="text-xs text-muted">Name</span>
        <input
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-[12px] border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[12px] bg-accent px-3 py-1.5 text-sm font-medium text-accent-on hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {conflict ? <ConflictActions /> : null}
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${
            state?.ok ? "text-emerald-700" : state ? "text-red-800" : "text-muted"
          }`}
        >
          {pending ? "Saving…" : (state?.message ?? "")}
        </p>
      </div>
    </form>
  );
}

function AddForm({
  caseId,
  storedNames,
}: {
  caseId: string;
  storedNames: string[];
}) {
  const [state, formAction, pending] = useActionState(
    addNextStepAction,
    null as NextStepState | null,
  );
  const formKey = state?.id ?? "add-next-step";

  return (
    <form
      key={formKey}
      action={formAction}
      className="space-y-3 border-t border-border pt-4"
    >
      <input type="hidden" name="caseRowId" value={caseId} />
      <h3 className="text-sm font-medium text-foreground">Add / claim</h3>
      <p className="text-xs text-muted">
        Type a name, or pick a name already stored on this case. A second row
        with the same name is not inserted.
      </p>
      {storedNames.length > 0 ? (
        <label className="block space-y-1 text-sm">
          <span className="text-muted">Stored name on this case</span>
          <select
            name="storedName"
            defaultValue=""
            className="w-full rounded-[12px] border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value=""></option>
            {storedNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="block space-y-1 text-sm">
        <span className="text-muted">Name</span>
        <input
          name="name"
          type="text"
          className="w-full rounded-[12px] border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[12px] bg-accent px-4 py-2 text-sm font-medium text-accent-on hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Saving…" : "Add"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${
            state?.ok ? "text-emerald-700" : state ? "text-red-800" : "text-muted"
          }`}
        >
          {pending ? "Saving…" : (state?.message ?? "")}
        </p>
      </div>
    </form>
  );
}

export function CaseNextSteps({
  caseId,
  rows,
  storedNames,
  error,
  canEdit,
}: {
  caseId: string;
  rows: NextStepRow[];
  storedNames: string[];
  error: string | null;
  canEdit: boolean;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-border bg-background px-4 py-4">
      <header>
        <h2 className="text-sm font-medium text-foreground">Next Steps</h2>
        <p className="text-xs text-muted">
          <span className="font-mono">public.next_steps</span> for this case.
          Claim/update uses the loaded <span className="font-mono">updated_at</span>
          . A stale save is a conflict — reload or overwrite.
        </p>
      </header>

      {error ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {rows.length === 0 && !error ? (
        <p className="text-sm text-muted">No next steps on this case.</p>
      ) : null}

      {canEdit ? (
        <div>
          {rows.map((row) => (
            <ClaimRow key={row.id} caseId={caseId} row={row} />
          ))}
          <AddForm caseId={caseId} storedNames={storedNames} />
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <p key={row.id} className="text-sm text-foreground">
              {row.name?.trim() ?? ""}
            </p>
          ))}
          <p className="text-xs text-muted">
            <Link href="/login" className="text-accent hover:text-accent-hover">
              Temporary login
            </Link>{" "}
            to add or claim a next step.
          </p>
        </div>
      )}
    </section>
  );
}
