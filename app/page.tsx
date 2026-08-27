import Link from "next/link";
import { getSession, isAdmin, signInTemporaryAdmin, signOut } from "@/lib/session";
import { StaffChrome } from "./staff-chrome";

export default async function Home() {
  const signedIn = isAdmin(await getSession());

  return (
    <StaffChrome title="ConveyorDB">
      <p className="max-w-xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">
        In-house Airtable replacement. All Cases reads{" "}
        <span className="font-mono text-base">public.cases</span>. Cabinets stay
        blank until rows are copied.
      </p>
      {signedIn ? (
        <p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Signed in as temporary admin. Full access for now, until real user
          levels are set.
        </p>
      ) : (
        <p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Temporary login. The button signs you in as admin. This is a stub
          until real user levels are set.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {signedIn ? (
          <form action={signOut}>
            <button
              type="submit"
              className="w-fit rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-950"
            >
              Sign out
            </button>
          </form>
        ) : (
          <form action={signInTemporaryAdmin}>
            <button
              type="submit"
              className="w-fit rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-950"
            >
              Temporary login
            </button>
          </form>
        )}
        <Link
          href="/cases"
          className="w-fit rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
        >
          All Cases
        </Link>
        <Link
          href="/health"
          className="w-fit rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
        >
          Schema health
        </Link>
      </div>
    </StaffChrome>
  );
}
