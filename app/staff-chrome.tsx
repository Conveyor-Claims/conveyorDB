import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { getSession, isAdmin, signOut } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { StaffNav } from "./staff-nav";

function AccountSlot({ signedIn }: { signedIn: boolean }) {
  return (
    <div className="shrink-0 border-t px-3 py-3">
      <div className="flex items-center gap-2 px-1 py-1">
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground"
        >
          {signedIn ? "TA" : ""}
        </span>
        {signedIn ? (
          <p className="truncate text-sm text-foreground">Temporary admin</p>
        ) : null}
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <Button asChild variant="ghost" size="sm" className="justify-start">
          <Link href="/preferences">Preferences</Link>
        </Button>
        {signedIn ? (
          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              Sign out
            </Button>
          </form>
        ) : (
          <Button asChild variant="ghost" size="sm" className="justify-start">
            <Link href="/login">Temporary login</Link>
          </Button>
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
      <aside className="sticky top-0 flex h-dvh w-56 shrink-0 flex-col overflow-hidden border-r bg-sidebar pb-2 text-sidebar-foreground">
        <div className="px-4 py-4">
          <Link
            href="/"
            className="font-mono text-sm tracking-wide text-muted-foreground uppercase hover:text-foreground"
          >
            Conveyor Claims
          </Link>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Suspense
            fallback={
              <nav aria-label="Staff" className="flex flex-col gap-1 px-3">
                <span className="rounded-md px-3 py-2 text-sm text-muted-foreground">
                  All Cases
                </span>
                <span className="rounded-md px-3 py-2 text-sm text-muted-foreground">
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
          className={`mx-auto flex w-full flex-1 flex-col gap-6 px-6 py-8 ${
            wide ? "max-w-7xl" : "max-w-3xl"
          }`}
        >
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
