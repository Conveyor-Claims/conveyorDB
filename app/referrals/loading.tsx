import { StaffChrome } from "../staff-chrome";

export default function ReferralsLoading() {
  return (
    <StaffChrome title="Referrals" wide>
      <p className="font-mono text-sm text-muted">Loading cases…</p>
    </StaffChrome>
  );
}
