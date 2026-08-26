import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[var(--background)] text-[var(--foreground)]">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-6 py-16">
        <p className="font-mono text-sm tracking-wide text-zinc-500 uppercase">
          Conveyor Claims
        </p>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">ConveyorDB</h1>
          <p className="max-w-xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">
            In-house Airtable replacement. This revision stands the app up
            against the live empty schema. Cabinets and High tables stay blank.
          </p>
        </div>
        <Link
          href="/health"
          className="w-fit rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-950"
        >
          Schema health
        </Link>
      </main>
    </div>
  );
}
