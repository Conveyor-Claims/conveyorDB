import { StaffChrome } from "../staff-chrome";

export default function NewCasesLoading() {
  return (
    <StaffChrome title="New cases" wide>
      <p className="font-mono text-sm text-muted">Loading cases…</p>
    </StaffChrome>
  );
}
