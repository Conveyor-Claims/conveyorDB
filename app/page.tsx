import Link from "next/link";
import { StaffChrome } from "./staff-chrome";

export default function Home() {
  return (
    <StaffChrome title="ConveyorDB">
      <p className="max-w-xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">
        In-house Airtable replacement. All Cases reads{" "}
        <span className="font-mono text-base">public.cases</span>. Cabinets stay
        blank until rows are copied.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/cases"
          className="w-fit rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-950"
        >
          All Cases
        </Link>
        <Link
          href="/login"
          className="w-fit rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
        >
          Staff sign in
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
