import { AllCasesTable } from "./all-cases-table";
import { StaffChrome } from "../staff-chrome";
import type { AllCasesList } from "@/lib/cases";
import type { CasePipeline } from "@/lib/pipelines";

export function CasesListScreen({
  title,
  list,
  pipeline,
}: {
  title: string;
  list: AllCasesList;
  pipeline?: CasePipeline;
}) {
  const { rows, error, missingEnv } = list;

  return (
    <StaffChrome title={title} wide>
      {pipeline ? (
        <p className="max-w-2xl text-sm leading-6 text-muted">
          Same list as All Cases, filtered to stored{" "}
          <span className="font-mono">case_status</span>{" "}
          <span className="font-medium text-foreground">
            {pipeline.caseStatus}
          </span>
          . Grouped by Referred Firm. Filters: firm, next step, assigned.
          Blank fields stay blank.
        </p>
      ) : (
        <p className="max-w-2xl text-sm leading-6 text-muted">
          Read-only list from <span className="font-mono">public.cases</span>.
          Stored values only. Grouped by Referred Firm. Filters: firm, status,
          next step, assigned. Blank fields stay blank.
        </p>
      )}

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
      />
    </StaffChrome>
  );
}
