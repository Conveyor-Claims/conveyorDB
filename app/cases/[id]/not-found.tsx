import Link from "next/link";
import { StaffChrome } from "../../staff-chrome";

export default function CaseNotFound() {
  return (
    <StaffChrome title="Case not found">
      <p className="text-sm leading-6 text-muted">
        No row on <span className="font-mono">public.cases</span> matches this
        id.
      </p>
      <Link
        href="/cases"
        className="font-mono text-sm text-accent hover:text-accent-hover"
      >
        All Cases
      </Link>
    </StaffChrome>
  );
}
