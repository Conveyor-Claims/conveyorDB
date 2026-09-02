import Link from "next/link";
import { StaffNav } from "./staff-nav";
import { StaffShell } from "./staff-shell";

const BACK_HREF = "/cases";
const BACK_LABEL = "Back to All Cases";

export function StaffMissingPage({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <StaffShell title={title} nav={<StaffNav />}>
      <p className="text-sm leading-6 text-muted">{message}</p>
      <p>
        <Link
          href={BACK_HREF}
          className="font-mono text-sm text-accent hover:text-accent-hover"
        >
          {BACK_LABEL}
        </Link>
      </p>
    </StaffShell>
  );
}
