import { StaffChrome } from "../staff-chrome";

export default function SettledPaidLoading() {
  return (
    <StaffChrome title="Settled - Paid" wide>
      <p className="font-mono text-sm text-muted">Loading cases…</p>
    </StaffChrome>
  );
}
