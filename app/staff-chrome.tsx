import Link from "next/link";
import type { ReactNode } from "react";

export function StaffChrome({
  title,
  children,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div
          className={`mx-auto flex w-full items-center justify-between gap-4 px-6 py-4 ${
            wide ? "max-w-7xl" : "max-w-3xl"
          }`}
        >
          <Link
            href="/"
            className="font-mono text-sm tracking-wide text-zinc-500 uppercase hover:text-zinc-900 dark:hover:text-zinc-200"
          >
            Conveyor Claims
          </Link>
          <nav className="flex items-center gap-4 font-mono text-sm">
            <Link
              href="/cases"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              All Cases
            </Link>
            <Link
              href="/login"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Staff sign in
            </Link>
            <Link
              href="/health"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
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
