import Link from "next/link";
import { StaffChrome } from "../../staff-chrome";

export default function DueDateBoardNotFound() {
  return (
    <StaffChrome title="Board not found">
      <p className="text-sm leading-6 text-muted">
        No due-date board at this URL. Appraisal Client is skipped — there is
        no dest column for it.
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
