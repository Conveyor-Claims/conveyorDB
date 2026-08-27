import { displayCaseValue } from "@/lib/cases";
import type { CasePageField } from "@/lib/case-page";
import type { Database } from "@/lib/database.types";

type CasesRow = Database["public"]["Tables"]["cases"]["Row"];

export function FieldValue({
  field,
  value,
}: {
  field: CasePageField;
  value: CasesRow[keyof CasesRow];
}) {
  if (field.fieldType === "checkbox") {
    if (typeof value !== "boolean") return null;
    return (
      <input
        type="checkbox"
        checked={value}
        disabled
        readOnly
        aria-label={field.label}
        className="mt-1"
      />
    );
  }

  const text = displayCaseValue(value);
  if (!text) return null;

  if (field.fieldType === "url") {
    return (
      <a
        href={text}
        className="break-all text-accent underline-offset-2 hover:text-accent-hover hover:underline"
      >
        {text}
      </a>
    );
  }

  if (field.fieldType === "email") {
    return (
      <a
        href={`mailto:${text}`}
        className="break-all text-accent underline-offset-2 hover:text-accent-hover hover:underline"
      >
        {text}
      </a>
    );
  }

  const multiline =
    field.fieldType === "long text" || field.fieldType === "rich text";

  return (
    <span className={multiline ? "whitespace-pre-wrap break-words" : "break-words"}>
      {text}
    </span>
  );
}

export function CaseField({
  field,
  value,
}: {
  field: CasePageField;
  value: CasesRow[keyof CasesRow];
}) {
  return (
    <div className="grid gap-1 border-t border-border py-3 first:border-t-0 sm:grid-cols-[minmax(12rem,14rem)_1fr] sm:gap-6">
      <dt className="text-sm text-muted">{field.label}</dt>
      <dd className="min-w-0 text-sm text-foreground">
        <FieldValue field={field} value={value} />
      </dd>
    </div>
  );
}
