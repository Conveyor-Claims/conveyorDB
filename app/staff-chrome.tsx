import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { getSession, isAdmin, signOut } from "@/lib/session";
import { StaffNav } from "./staff-nav";

function AccountSlot({ signedIn }: { signedIn: boolean }) {
  return (
    <div className="shrink-0 border-t border-border px-3 py-3">
      <div className="flex items-center gap-2 px-1 py-1">
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-wash text-xs font-medium text-muted"
        >
          {signedIn ? "TA" : ""}
        </span>
        {signedIn ? (
          <p className="truncate text-sm text-foreground">Temporary admin</p>
        ) : null}
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <Link
          href="/preferences"
          className="rounded-[12px] px-3 py-2 text-sm text-muted hover:bg-wash hover:text-accent"
        >
          Preferences
        </Link>
        {signedIn ? (
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-[12px] px-3 py-2 text-left text-sm text-muted hover:bg-wash hover:text-accent"
            >
              Sign out
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="rounded-[12px] px-3 py-2 text-sm text-muted hover:bg-wash hover:text-accent"
          >
            Temporary login
          </Link>
        )}
      </div>
    </div>
  );
}

export async function StaffChrome({
  title,
  children,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const session = await getSession();
  const signedIn = isAdmin(session);

  return (
    <div className="flex min-h-svh flex-1 bg-background text-foreground">
      <aside className="sticky top-0 flex h-dvh w-56 shrink-0 flex-col overflow-hidden border-r border-border bg-background pb-2">
        <div className="px-4 py-4">
          <Link
            href="/"
            className="font-mono text-sm tracking-wide text-muted uppercase hover:text-foreground"
          >
            Conveyor Claims
          </Link>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Suspense
            fallback={
              <nav aria-label="Staff" className="flex flex-col gap-1 px-3">
                <span className="rounded-[12px] px-3 py-2 text-sm text-muted">
                  All Cases
                </span>
                <span className="rounded-[12px] px-3 py-2 text-sm text-muted">
                  Health
                </span>
              </nav>
            }
          >
            <StaffNav />
          </Suspense>
        </div>
        <AccountSlot signedIn={signedIn} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <main
          className={`mx-auto flex w-full flex-1 flex-col gap-8 px-6 py-12 ${
            wide ? "max-w-7xl" : "max-w-3xl"
          }`}
        >
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
