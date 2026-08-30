import { StaffChrome } from "../staff-chrome";

export default function ClosedLoading() {
  return (
    <StaffChrome title="Closed" wide>
      <p className="font-mono text-sm text-muted">Loading cases…</p>
    </StaffChrome>
  );
}
