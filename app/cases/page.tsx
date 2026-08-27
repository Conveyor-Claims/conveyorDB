import Link from "next/link";
import {
  ALL_CASES_COLUMNS,
  displayCaseValue,
  listAllCases,
} from "@/lib/cases";
import { StaffChrome } from "../staff-chrome";

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

      <section className="space-y-3">
        <p className="font-mono text-sm text-muted">
          {rows.length} {rows.length === 1 ? "case" : "cases"}
        </p>
        <div className="overflow-x-auto rounded-xl border border-border bg-background">
          <table className="min-w-full border-collapse text-left text-sm">
            <caption className="sr-only">All cases</caption>
            <thead className="bg-wash">
              <tr>
                {ALL_CASES_COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="whitespace-nowrap px-4 py-3 font-medium text-muted"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={ALL_CASES_COLUMNS.length}
                    className="px-4 py-10 text-center text-muted"
                  >
                    No cases.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    {ALL_CASES_COLUMNS.map((column) => (
                      <td
                        key={column.key}
                        className="whitespace-nowrap px-4 py-3 align-top text-foreground"
                      >
                        {column.key === "case_number" ? (
                          <Link
                            href={`/cases/${row.id}`}
                            className="text-accent underline-offset-2 hover:text-accent-hover hover:underline"
                          >
                            {displayCaseValue(row.case_number) || row.id}
                          </Link>
                        ) : (
                          displayCaseValue(row[column.key])
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </StaffChrome>
  );
}
