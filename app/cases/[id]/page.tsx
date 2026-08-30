import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CASE_PAGE_SECTIONS,
  caseSectionAnchor,
} from "@/lib/case-page";
import { getCaseById, isCaseId } from "@/lib/cases";
import { listCommentsForCase } from "@/lib/comments";
import { listContactsForCase } from "@/lib/contacts";
import { getSession, isAdmin } from "@/lib/session";
import { StaffChrome } from "../../staff-chrome";
import { CaseComments } from "./case-comments";
import { CaseField } from "./case-field";
import { CaseForm } from "./case-form";
import { CaseHeaderStrip } from "./case-header-strip";
import { CasePeople } from "./case-people";
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
    description: "Editable stored fields on public.cases.",
  };
}

export default async function CasePage({ params }: PageProps) {
  const { id } = await params;
  if (!isCaseId(id)) {
    notFound();
  }

  const [{ row, error, missingEnv, usingServiceRole }, session] =
    await Promise.all([getCaseById(id), getSession()]);

  if (!row && !error && usingServiceRole) {
    notFound();
  }

  const [comments, contacts] = row
    ? await Promise.all([
        listCommentsForCase(row.id),
        listContactsForCase(row.id),
      ])
    : [
        { rows: [], error: null },
        { rows: [], error: null },
      ];
  const canPost = isAdmin(session);

  const title = row?.case_number?.trim() ?? "";
  const overviewName = CASE_PAGE_SECTIONS[0]?.name ?? "";

  return (
    <StaffChrome
      title={title}
      header={
        row ? (
          <CaseHeaderStrip
            row={{
              date_of_loss: row.date_of_loss,
              insurance_company: row.insurance_company,
              claim_number: row.claim_number,
            }}
          />
        ) : null
      }
      rail={
        row ? (
          <CaseComments
            caseId={row.id}
            comments={comments.rows}
            error={comments.error}
            canPost={canPost}
          />
        ) : null
      }
    >
      <p className="max-w-2xl text-sm leading-6 text-muted">
        Stored dest fields on <span className="font-mono">public.cases</span>{" "}
        can be edited and saved. File slots are not stored on this table. Case
        Number stays locked. Blank fields stay blank. People on this case are{" "}
        <span className="font-mono">public.contacts</span> rows whose{" "}
        <span className="font-mono">associated_cases</span> is this case uuid. People on this case are{" "}
        <span className="font-mono">public.contacts</span> rows whose{" "}
        <span className="font-mono">associated_cases</span> is this case uuid.
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
        <CasePeople
          caseId={row.id}
          contacts={contacts.rows}
          error={contacts.error}
          canAdd={canPost}
        />
      ) : null}

      {row ? (
        <CaseForm caseId={row.id}>
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
                    caseId={row.id}
                  />
                ))}
              </dl>
            ))}
          </CaseSections>
        </CaseForm>
      ) : null}
    </StaffChrome>
  );
}
