import { ChoicePill } from "../../choice-pill";
import { displayCaseValue } from "@/lib/cases";
import type { Database } from "@/lib/database.types";

type CasesRow = Database["public"]["Tables"]["cases"]["Row"];

/**
 * Airtable case-page header strip. Values are stored dest columns only.
 * Labels match the catalog header aliases (DOL, Insurance Co., Claim No.).
 * Blank stays blank.
 */
export function CaseHeaderStrip({
  row,
}: {
  row: Pick<CasesRow, "date_of_loss" | "insurance_company" | "claim_number">;
}) {
  const dateOfLoss = displayCaseValue(row.date_of_loss);
  const insuranceCompany = displayCaseValue(row.insurance_company);
  const claimNumber = displayCaseValue(row.claim_number);

  return (
    <dl className="flex flex-wrap items-start gap-x-6 gap-y-3 rounded-xl border border-border bg-wash px-4 py-3">
      <div className="min-w-[8rem] space-y-1">
        <dt className="text-xs font-medium tracking-wide text-muted uppercase">
          DOL
        </dt>
        <dd className="text-sm text-foreground">{dateOfLoss}</dd>
      </div>
      <div className="min-w-[8rem] space-y-1">
        <dt className="text-xs font-medium tracking-wide text-muted uppercase">
          Insurance Co.
        </dt>
        <dd className="text-sm text-foreground">
          {insuranceCompany ? (
            <ChoicePill value={insuranceCompany} field="insurance_company" />
          ) : null}
        </dd>
      </div>
      <div className="min-w-[8rem] space-y-1">
        <dt className="text-xs font-medium tracking-wide text-muted uppercase">
          Claim No.
        </dt>
        <dd className="text-sm text-foreground">{claimNumber}</dd>
      </div>
    </dl>
  );
}
