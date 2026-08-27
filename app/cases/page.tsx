import { listAllCases } from "@/lib/cases";
import { StaffChrome } from "../staff-chrome";
import { AllCasesTable } from "./all-cases-table";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Cases · ConveyorDB",
  description: "Read-only list of public.cases.",
};

export default async function AllCasesPage() {
  const { rows, error, missingEnv } = await listAllCases();

  return (
    <StaffChrome title="All Cases" wide>
      <p className="max-w-2xl text-sm leading-6 text-muted">
        Read-only list from <span className="font-mono">public.cases</span>.
        Stored values only. Blank fields stay blank.
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

      <AllCasesTable rows={rows} />
    </StaffChrome>
  );
}
