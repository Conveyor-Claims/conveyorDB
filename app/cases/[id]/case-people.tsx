"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  ADD_PERSON_OPTIONAL_FIELDS,
  CONTACT_LIST_LABELS,
  displayContactName,
  type AddPersonState,
  type CaseContact,
} from "@/lib/contacts";
import { addPersonAction } from "./actions";

function ContactCard({ row }: { row: CaseContact }) {
  const name = displayContactName(row);
  const relationship = row.relationship_to_insured?.trim() ?? "";
  const phone = row.primary_phone?.trim() ?? "";
  const email = row.email?.trim() ?? "";

  return (
    <article className="grid gap-2 border-t border-border py-3 first:border-t-0 sm:grid-cols-4 sm:gap-4">
      <div className="min-w-0">
        <p className="text-xs text-muted">{CONTACT_LIST_LABELS.name}</p>
        <p className="text-sm text-foreground">{name}</p>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted">{CONTACT_LIST_LABELS.relationship}</p>
        <p className="text-sm text-foreground">{relationship}</p>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted">{CONTACT_LIST_LABELS.phone}</p>
        <p className="text-sm text-foreground">{phone}</p>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted">{CONTACT_LIST_LABELS.email}</p>
        <p className="text-sm text-foreground">{email}</p>
      </div>
    </article>
  );
}

function AddPersonForm({ caseId }: { caseId: string }) {
  const [state, formAction, pending] = useActionState(
    addPersonAction,
    null as AddPersonState | null,
  );
  const formKey = state?.id ?? "add-person";

  return (
    <form
      key={formKey}
      action={formAction}
      className="space-y-4 border-t border-border px-4 py-4"
    >
      <input type="hidden" name="caseRowId" value={caseId} />
      <h3 className="text-sm font-medium text-foreground">Add person</h3>
      <p className="text-xs text-muted">
        Enter Full Name, or First Name and Last Name. Blank optional fields stay
        blank.{" "}
        <span className="font-mono">associated_cases</span> is this case uuid.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="text-muted">First Name</span>
          <input
            name="first_name"
            type="text"
            autoComplete="given-name"
            className="w-full rounded-[12px] border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted">Last Name</span>
          <input
            name="last_name"
            type="text"
            autoComplete="family-name"
            className="w-full rounded-[12px] border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted">Full Name</span>
          <input
            name="full_name"
            type="text"
            autoComplete="name"
            className="w-full rounded-[12px] border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {ADD_PERSON_OPTIONAL_FIELDS.map((field) => (
          <label key={field.key} className="space-y-1 text-sm">
            <span className="text-muted">{field.label}</span>
            <input
              name={field.key}
              type={field.inputType}
              className="w-full rounded-[12px] border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[12px] bg-accent px-4 py-2 text-sm font-medium text-accent-on hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add person"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${
            state?.ok
              ? "text-emerald-700"
              : state
                ? "text-red-800"
                : "text-muted"
          }`}
        >
          {pending ? "Adding…" : (state?.message ?? "")}
        </p>
      </div>
    </form>
  );
}

export function CasePeople({
  caseId,
  contacts,
  error,
  canAdd,
}: {
  caseId: string;
  contacts: CaseContact[];
  error: string | null;
  canAdd: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background">
      <header className="border-b border-border bg-wash px-4 py-2.5">
        <h2 className="text-sm font-medium text-foreground">People</h2>
        <p className="text-xs text-muted">
          <span className="font-mono">public.contacts</span> linked by{" "}
          <span className="font-mono">associated_cases</span>
        </p>
      </header>

      <div className="px-4 py-3">
        {error ? (
          <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        ) : null}
        {contacts.length === 0 && !error ? (
          <p className="text-sm text-muted">No people linked to this case.</p>
        ) : null}
        {contacts.length > 0 ? (
          <div>
            {contacts.map((row) => (
              <ContactCard key={row.id} row={row} />
            ))}
          </div>
        ) : null}
      </div>

      {canAdd ? (
        <AddPersonForm caseId={caseId} />
      ) : (
        <p className="border-t border-border px-4 py-3 text-sm text-muted">
          <Link href="/login" className="text-accent hover:text-accent-hover">
            Temporary login
          </Link>{" "}
          to add a person.
        </p>
      )}
    </section>
  );
}
