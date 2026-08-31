import Link from "next/link";
import { AllCasesTable } from "./all-cases-table";
import { ChoicePill } from "../choice-pill";
import { StaffChrome } from "../staff-chrome";
import type { AllCasesList } from "@/lib/cases";
import type { DueDateBoard } from "@/lib/due-date-boards";
import {
  pipelineStatusLabel,
  pipelineStatuses,
  type CasePipeline,
} from "@/lib/pipelines";
import { getSession, isAdmin } from "@/lib/session";

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
    >
      {pipeline ? (
        <p className="max-w-2xl text-sm leading-6 text-muted">
          Same list as All Cases, filtered to stored{" "}
          <span className="font-mono">case_status</span>{" "}
          <span className="font-medium text-foreground">
            {pipelineStatusLabel(pipeline)}
          </span>
          . Grouped by Referred Firm. Filters: firm, next step, assigned.
          Blank fields stay blank.
        </p>
      ) : board ? (
        <p className="max-w-2xl text-sm leading-6 text-muted">
          Same list as All Cases, filtered to stored{" "}
          <span className="font-mono">{board.dateColumn}</span>{" "}
          <span className="font-medium text-foreground">
            {board.dateLabel}
          </span>{" "}
          (non-null), sorted ascending (blanks last). Grouped by Referred Firm.
          Filters: firm, status, next step, assigned. Blank fields stay blank.
        </p>
      ) : (
        <p className="max-w-2xl text-sm leading-6 text-muted">
          Read-only list from <span className="font-mono">public.cases</span>.
          Stored values only. Grouped by Referred Firm. Filters: firm, status,
          next step, assigned. Blank fields stay blank.
        </p>
      )}

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
      ) : null}

      <AllCasesTable
        rows={rows}
        hideCaseStatusFilter={Boolean(pipeline)}
        extraColumns={board?.extraColumns}
      />
    </StaffChrome>
  );
}
