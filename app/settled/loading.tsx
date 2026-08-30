import { StaffChrome } from "../staff-chrome";

export default function SettledLoading() {
  return (
    <StaffChrome title="Settled" wide>
      <p className="font-mono text-sm text-muted">Loading cases…</p>
    </StaffChrome>
  );
}
