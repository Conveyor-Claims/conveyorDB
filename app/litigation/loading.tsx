import { StaffChrome } from "../staff-chrome";

export default function LitigationLoading() {
  return (
    <StaffChrome title="Litigation" wide>
      <p className="font-mono text-sm text-muted">Loading cases…</p>
    </StaffChrome>
  );
}
