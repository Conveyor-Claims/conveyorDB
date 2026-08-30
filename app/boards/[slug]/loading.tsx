import { StaffChrome } from "../../staff-chrome";

export default function DueDateBoardLoading() {
  return (
    <StaffChrome title="Due-date" wide>
      <p className="font-mono text-sm text-muted">Loading cases…</p>
    </StaffChrome>
  );
}
