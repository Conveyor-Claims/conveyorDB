import { StaffChrome } from "../staff-chrome";

export default function AppraisalLoading() {
  return (
    <StaffChrome title="Appraisal" wide>
      <p className="font-mono text-sm text-muted">Loading cases…</p>
    </StaffChrome>
  );
}
