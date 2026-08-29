import { StaffChrome } from "../staff-chrome";

export default function AllCasesLoading() {
  return (
    <StaffChrome title="All Cases" wide>
      <p className="font-mono text-sm text-muted-foreground">Loading cases…</p>
    </StaffChrome>
  );
}
