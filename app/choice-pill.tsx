import { choicePillColors } from "@/lib/airtable-choice-colors";
import type { AllCasesPillKey } from "@/lib/cases";

const pillClass =
  "inline-flex max-w-full items-center truncate rounded-full border px-2 py-0.5 text-xs";

/**
 * Airtable-like choice pill for All Cases dropdown columns.
 * Known options use live Airtable tokens mapped to the standard palette hex.
 * Unknown stored values keep the existing neutral wash pill.
 */
export function ChoicePill({
  value,
  field,
}: {
  value: string;
  field: AllCasesPillKey;
}) {
  if (!value) return null;

  const colors = choicePillColors(field, value);
  if (!colors) {
    return (
      <span className={`${pillClass} border-border bg-wash text-foreground`}>
        {value}
      </span>
    );
  }

  return (
    <span className={pillClass} style={colors}>
      {value}
    </span>
  );
}
