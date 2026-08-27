import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CASE_PAGE_SECTIONS,
  caseSectionAnchor,
} from "@/lib/case-page";
import { getCaseById, isCaseId } from "@/lib/cases";
import { StaffChrome } from "../../staff-chrome";
import { CaseField } from "./field-value";
import { CaseSections } from "./case-sections";

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
  const overviewName = CASE_PAGE_SECTIONS[0]?.name ?? "";

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
        <CaseSections
          sections={CASE_PAGE_SECTIONS.map((section) => ({
            name: section.name,
            anchor: caseSectionAnchor(section.name),
            defaultOpen: section.name === overviewName,
          }))}
        >
          {CASE_PAGE_SECTIONS.map((section) => (
            <dl key={section.name} className="bg-background px-4">
              {section.fields.map((field) => (
                <CaseField
                  key={field.key}
                  field={field}
                  value={row[field.key]}
                />
              ))}
            </dl>
          ))}
        </CaseSections>
      ) : null}
    </StaffChrome>
  );
}
