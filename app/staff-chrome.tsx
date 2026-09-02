import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import {
  getSession,
  isAdmin,
  isSignedIn,
  type Session,
} from "@/lib/session";
import { StaffNav } from "./staff-nav";
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
    <div className="flex min-h-svh flex-1 bg-background text-foreground">
      <aside className="sticky top-0 flex h-dvh w-56 shrink-0 flex-col overflow-hidden border-r border-border bg-background">
        <div className="shrink-0 px-4 py-4">
          <Link
            href="/"
            className="font-mono text-sm tracking-wide text-muted uppercase hover:text-foreground"
          >
            Conveyor Claims
          </Link>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <Suspense
            fallback={
              <nav
                aria-label="Staff"
                className="flex min-h-0 flex-1 flex-col"
              >
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
            }
          >
            <StaffNav
              showCreateCase={admin}
              showPermissions={admin}
              signedIn={signedIn}
              accountLabel={accountLabel(session)}
              accountInitials={accountInitials(session)}
            />
          </Suspense>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col xl:flex-row">
        <main
          className={`mx-auto flex w-full flex-1 flex-col gap-8 px-6 py-12 ${
            wide ? "max-w-7xl" : "max-w-3xl"
          }`}
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              {titleAccessory}
            </div>
            {header}
          </div>
          {children}
        </main>
        {rail ? (
          <aside className="flex min-h-[28rem] flex-col border-t border-border bg-background xl:sticky xl:top-0 xl:h-dvh xl:w-[22rem] xl:shrink-0 xl:border-t-0 xl:border-l">
            {rail}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
