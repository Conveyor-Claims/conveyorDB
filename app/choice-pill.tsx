/**
 * Airtable-like choice pill.
 * Live Airtable choice colors were not readable from this environment.
 * Stored option strings only; one neutral pill. No invented options or colors.
 */
export function ChoicePill({ value }: { value: string }) {
  if (!value) return null;

  return (
    <span className="inline-flex max-w-full items-center truncate rounded-full border border-border bg-wash px-2 py-0.5 text-xs text-foreground">
      {value}
    </span>
  );
}
