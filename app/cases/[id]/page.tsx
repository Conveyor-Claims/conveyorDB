import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CASE_PAGE_SECTIONS,
  caseSectionAnchor,
  type CasePageField,
} from "@/lib/case-page";
import { displayCaseValue, getCaseById, isCaseId } from "@/lib/cases";
import type { Database } from "@/lib/database.types";
import { StaffChrome } from "../../staff-chrome";

type CasesRow = Database["public"]["Tables"]["cases"]["Row"];

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { row } = await getCaseById(id);
  const title = row?.case_number?.trim();
  return {
    title: title ? `${title} · ConveyorDB` : "Case · ConveyorDB",
    description: "Read-only case page from public.cases.",
  };
}

function FieldValue({
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

function CaseField({
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

export default async function CasePage({ params }: PageProps) {
  const { id } = await params;
  if (!isCaseId(id)) {
    notFound();
  }

  const { row, error, missingEnv, usingServiceRole } = await getCaseById(id);

  if (!row && !error && usingServiceRole) {
    notFound();
  }

  const title = row?.case_number?.trim() ?? "";

  return (
    <StaffChrome title={title}>
      <p className="max-w-2xl text-sm leading-6 text-muted">
        Read-only view of stored fields on{" "}
        <span className="font-mono">public.cases</span>. File slots are not
        stored on this table. Blank fields stay blank.
      </p>

      <p>
        <Link
          href="/cases"
          className="font-mono text-sm text-accent hover:text-accent-hover"
        >
          All Cases
        </Link>
      </p>

      {missingEnv.length > 0 ? (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          Missing env: {missingEnv.join(", ")}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100">
          {error}
        </p>
      ) : null}

      {row ? (
        <>
          <nav aria-label="Case sections">
            <ol className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {CASE_PAGE_SECTIONS.map((section) => (
                <li key={section.name}>
                  <a
                    href={`#${caseSectionAnchor(section.name)}`}
                    className="text-accent hover:text-accent-hover"
                  >
                    {section.name}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-10">
            {CASE_PAGE_SECTIONS.map((section) => (
              <section
                key={section.name}
                id={caseSectionAnchor(section.name)}
                className="scroll-mt-6 space-y-3"
              >
                <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
                  {section.name}
                </h2>
                {section.fields.length > 0 ? (
                  <dl className="rounded-xl border border-border bg-background px-4">
                    {section.fields.map((field) => (
                      <CaseField
                        key={field.key}
                        field={field}
                        value={row[field.key]}
                      />
                    ))}
                  </dl>
                ) : null}
              </section>
            ))}
          </div>
        </>
      ) : null}
    </StaffChrome>
  );
}
