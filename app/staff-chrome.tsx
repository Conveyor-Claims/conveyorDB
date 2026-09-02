import { Suspense, type ReactNode } from "react";
import {
  getSession,
  isAdmin,
  isSignedIn,
  type Session,
} from "@/lib/session";
import { StaffNav } from "./staff-nav";
import { StaffShell } from "./staff-shell";
import { PIPELINE_LIST } from "@/lib/pipelines";

function accountLabel(session: Session | null): string {
  if (session?.role === "admin") return "Temporary admin";
  if (session?.role === "paralegal") return "Temporary paralegal";
  return "";
}

function accountInitials(session: Session | null): string {
  if (session?.role === "admin") return "TA";
  if (session?.role === "paralegal") return "TP";
  return "";
}

function StaffNavFallback() {
  return (
    <nav aria-label="Staff" className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3">
        <div className="space-y-1">
          <p className="px-3 pb-1 text-xs text-muted">Pipelines</p>
          <span className="rounded-[12px] px-3 py-2 text-sm text-muted">
            All Cases
          </span>
          {PIPELINE_LIST.map((pipeline) => (
            <span
              key={pipeline.href}
              className="rounded-[12px] px-3 py-2 text-sm text-muted"
            >
              {pipeline.navLabel}
            </span>
          ))}
        </div>
        <div className="space-y-1">
          <p className="px-3 pb-1 text-xs text-muted">Boards</p>
        </div>
      </div>
    </nav>
  );
}

export async function StaffChrome({
  title,
  children,
  wide = false,
  titleAccessory,
  header,
  rail,
}: {
  title: string;
  children: ReactNode;
  wide?: boolean;
  titleAccessory?: ReactNode;
  header?: ReactNode;
  rail?: ReactNode;
}) {
  const session = await getSession();
  const admin = isAdmin(session);
  const signedIn = isSignedIn(session);

  return (
    <StaffShell
      title={title}
      wide={wide}
      titleAccessory={titleAccessory}
      header={header}
      rail={rail}
      nav={
        <Suspense fallback={<StaffNavFallback />}>
          <StaffNav
            showCreateCase={admin}
            showPermissions={admin}
            signedIn={signedIn}
            accountLabel={accountLabel(session)}
            accountInitials={accountInitials(session)}
          />
        </Suspense>
      }
    >
      {children}
    </StaffShell>
  );
}
