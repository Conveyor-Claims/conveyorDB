import { StaffChrome } from "../staff-chrome";

export default function NonResponsiveLoading() {
  return (
    <StaffChrome title="Non-Responsive" wide>
      <p className="font-mono text-sm text-muted">Loading cases…</p>
    </StaffChrome>
  );
}
