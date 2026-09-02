import Link from "next/link";
import { AllCasesTable } from "./all-cases-table";
import { ChoicePill } from "../choice-pill";
import { EmptyCasesLine } from "../empty-cases-line";
import { StaffChrome } from "../staff-chrome";
import type { AllCasesList } from "@/lib/cases";
import type { DueDateBoard } from "@/lib/due-date-boards";
import { pipelineStatuses, type CasePipeline } from "@/lib/pipelines";
import { getSession, isAdmin } from "@/lib/session";

function caseCountLabel(count: number) {
  return `${count} ${count === 1 ? "case" : "cases"}`;
}

export async function CasesListScreen({
  title,
  list,
  pipeline,
  board,
}: {
  title: string;
  list: AllCasesList;
  pipeline?: CasePipeline;
  board?: DueDateBoard;
}) {
  const { rows, error, missingEnv } = list;
  const canCreate = isAdmin(await getSession());
  const subtitle = board
    ? `${board.title} · ${caseCountLabel(rows.length)}`
    : `${title} · ${caseCountLabel(rows.length)}`;

  return (
    <StaffChrome
      title={title}
      wide
      titleAccessory={
        pipeline ? (
          <span className="inline-flex flex-wrap items-center gap-1.5">
            {pipelineStatuses(pipeline).map((status) => (
              <ChoicePill key={status} value={status} field="case_status" />
            ))}
          </span>
        ) : null
      }
      header={
        <p className="text-sm leading-6 text-muted">{subtitle}</p>
      }
    >
      {canCreate ? (
        <p>
          <Link
            href="/cases/new"
            className="inline-flex rounded-[12px] bg-accent px-4 py-2 text-sm font-medium text-accent-on hover:bg-accent-hover"
          >
            Create case
          </Link>
        </p>
      ) : null}

      {missingEnv.length > 0 ? (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          Missing env: {missingEnv.join(", ")}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100">
          {error}
        </p>
      ) : rows.length === 0 ? (
        <EmptyCasesLine showViewAll={Boolean(pipeline || board)} />
      ) : (
        <AllCasesTable
          rows={rows}
          hideCaseStatusFilter={Boolean(pipeline)}
          extraColumns={board?.extraColumns}
        />
      )}
    </StaffChrome>
  );
}
