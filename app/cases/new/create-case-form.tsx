"use client";

import { useActionState } from "react";
import type { CreateCaseState } from "@/lib/case-create";
import { createCaseAction } from "./actions";

export function CreateCaseForm() {
  const [state, formAction, pending] = useActionState(
    createCaseAction,
    null as CreateCaseState | null,
  );

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <label className="block space-y-1 text-sm">
        <span className="text-muted">Client Name</span>
        <input
          name="client_name"
          type="text"
          autoComplete="name"
          required
          className="w-full rounded-[12px] border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[12px] bg-accent px-4 py-2 text-sm font-medium text-accent-on hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create case"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${
            state && !state.ok ? "text-red-800" : "text-muted"
          }`}
        >
          {pending ? "Creating…" : (state?.message ?? "")}
        </p>
      </div>
    </form>
  );
}
