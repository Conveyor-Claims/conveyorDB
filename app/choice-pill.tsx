import { optionStyle } from "@/lib/select-options";

/**
 * Airtable-like choice pill.
 * Colors are official Airtable tokens copied from the Aug 26 inventory doc
 * for dest columns already on the page. Unknown stored values stay neutral.
 */
export function ChoicePill({
  value,
  fieldKey,
}: {
  value: string;
  fieldKey?: string;
}) {
  if (!value) return null;

  const style = fieldKey ? optionStyle(fieldKey, value) : null;

  return (
    <span
      className="inline-flex max-w-full items-center truncate rounded-full border border-border bg-wash px-2 py-0.5 text-xs text-foreground"
      style={
        style
          ? {
              backgroundColor: style.background,
              color: style.color,
              borderColor: "transparent",
            }
          : undefined
      }
    >
      {value}
    </span>
  );
}
