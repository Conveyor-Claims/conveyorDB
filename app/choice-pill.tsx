import { choicePillColors } from "@/lib/airtable-choice-colors";
import { isAllCasesPillKey } from "@/lib/cases";
import { optionStyle } from "@/lib/select-options";

const pillClass =
  "inline-flex max-w-full items-center truncate rounded-full border px-2 py-0.5 text-xs";

/**
 * Airtable-like choice pill. Hex comes from CASE_SELECT_OPTIONS /
 * ALL_CASES_CHOICE_COLORS via the official palette. Unknown stored values
 * keep the neutral wash pill. Blank stays blank.
 */
export function ChoicePill({
  value,
  field,
}: {
  value: string;
  field: string;
}) {
  if (!value) return null;

  const colors = optionStyle(field, value);
  const fallback =
    !colors && isAllCasesPillKey(field)
      ? choicePillColors(field, value)
      : null;
  const style = colors ?? fallback;

  if (!style) {
    return (
      <span className={`${pillClass} border-border bg-wash text-foreground`}>
        {value}
      </span>
    );
  }

  return (
    <span className={pillClass} style={style}>
      {value}
    </span>
  );
}

/** Small Case Status color mark for nav / view identity. */
export function StatusDot({ status }: { status: string }) {
  const colors = optionStyle("case_status", status);
  return (
    <span
      aria-hidden
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-border bg-wash"
      style={
        colors
          ? {
              backgroundColor: colors.backgroundColor,
              borderColor: colors.borderColor,
            }
          : undefined
      }
    />
  );
}
