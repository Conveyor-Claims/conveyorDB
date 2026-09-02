import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Presentational staff chrome. Sync — no cookies — so 404 can keep the
 * sidebar when Next.js prerenders /_not-found without a request.
 */
export function StaffShell({
  title,
  children,
  wide = false,
  titleAccessory,
  header,
  rail,
  nav,
}: {
  title: string;
  children: ReactNode;
  wide?: boolean;
  titleAccessory?: ReactNode;
  header?: ReactNode;
  rail?: ReactNode;
  nav: ReactNode;
}) {
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
        <div className="flex min-h-0 flex-1 flex-col">{nav}</div>
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
