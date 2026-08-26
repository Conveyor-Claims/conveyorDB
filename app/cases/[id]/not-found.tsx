import Link from "next/link";
import { StaffChrome } from "../../staff-chrome";

export default function CaseNotFound() {
  return (
    <StaffChrome title="Case not found">
      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        No row on <span className="font-mono">public.cases</span> matches this
        id.
      </p>
      <Link
        href="/cases"
        className="font-mono text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        All Cases
      </Link>
    </StaffChrome>
  );
}
