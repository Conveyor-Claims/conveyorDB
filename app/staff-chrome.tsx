import Link from "next/link";
import type { ReactNode } from "react";
import { getSession, isAdmin, signOut } from "@/lib/session";

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
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div
          className={`mx-auto flex w-full items-center justify-between gap-4 px-6 py-4 ${
            wide ? "max-w-7xl" : "max-w-3xl"
          }`}
        >
          <Link
            href="/"
            className="font-mono text-sm tracking-wide text-muted uppercase hover:text-foreground"
          >
            Conveyor Claims
          </Link>
          <nav className="flex items-center gap-4 font-mono text-sm">
            <Link
              href="/cases"
              className="text-muted hover:text-accent"
            >
              All Cases
            </Link>
            {signedIn ? (
              <>
                <span className="text-muted">
                  Temporary admin
                </span>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="text-muted hover:text-accent"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="text-muted hover:text-accent"
              >
                Temporary login
              </Link>
            )}
            <Link
              href="/health"
              className="text-muted hover:text-accent"
            >
              Health
            </Link>
          </nav>
        </div>
      </header>
      <main
        className={`mx-auto flex w-full flex-1 flex-col gap-8 px-6 py-12 ${
          wide ? "max-w-7xl" : "max-w-3xl"
        }`}
      >
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {children}
      </main>
    </div>
  );
}
