import { choiceSwatch } from "@/lib/choice-colors";
import type { AllCasesPillKey } from "@/lib/cases";

/**
 * Airtable-like choice pill.
 * Mapped options use live Aug 26 gap-doc tokens → official palette hex.
 * Unlisted stored values use one neutral pill.
 */
export function ChoicePill({
  field,
  value,
}: {
  field: AllCasesPillKey;
  value: string;
}) {
  if (!value) return null;

  const swatch = choiceSwatch(field, value);
  if (!swatch) {
    return (
      <span className="inline-flex max-w-full items-center truncate rounded-full border border-border bg-wash px-2 py-0.5 text-xs text-foreground">
        {value}
      </span>
    );
  }

  return (
    <span
      className="inline-flex max-w-full items-center truncate rounded-full px-2 py-0.5 text-xs"
      style={{ backgroundColor: swatch.background, color: swatch.color }}
    >
      {value}
    </span>
  );
}
