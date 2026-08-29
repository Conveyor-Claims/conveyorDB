import { checkSchemaHealth, type TableProbe } from "@/lib/health";
import {
  P11_CABINETS,
  P12_HIGH_TABLES,
  type PublicTableName,
} from "@/lib/schema/tables";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffChrome } from "../staff-chrome";

export const dynamic = "force-dynamic";

function statusLabel(exists: boolean, error: string | null) {
  if (exists && !error) return "exists";
  if (exists) return "reachable";
  return "missing";
}

function StatusDot({
  exists,
  error,
}: {
  exists: boolean;
  error: string | null;
}) {
  const tone =
    exists && !error
      ? "bg-emerald-500"
      : exists
        ? "bg-amber-400"
        : "bg-red-500";
  return (
    <span
      aria-hidden
      className={`inline-block h-2 w-2 rounded-full ${tone}`}
    />
  );
}

function TableList({
  title,
  names,
  probes,
}: {
  title: string;
  names: readonly { name: PublicTableName }[];
  probes: TableProbe[];
}) {
  const byName = new Map(probes.map((probe) => [probe.name, probe]));

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      <ul className="divide-y overflow-hidden rounded-md border bg-card">
        {names.map(({ name }) => {
          const probe = byName.get(name);
          if (!probe) return null;
          return (
            <li
              key={probe.name}
              className="grid grid-cols-[1fr_auto] items-start gap-4 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_7rem_6rem_6rem]"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm">{probe.name}</p>
                {probe.error ? (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {probe.error}
                  </p>
                ) : null}
              </div>
              <p className="hidden font-mono text-sm text-muted-foreground sm:block">
                {probe.columnCount} cols
              </p>
              <p className="hidden font-mono text-sm text-muted-foreground sm:block">
                {probe.rowCount === null ? "—" : `${probe.rowCount} rows`}
              </p>
              <p className="flex items-center justify-end gap-2 font-mono text-sm">
                <StatusDot exists={probe.exists} error={probe.error} />
                <Badge variant="outline">{statusLabel(probe.exists, probe.error)}</Badge>
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default async function HealthPage() {
  const health = await checkSchemaHealth();
  const p11Names = new Set(P11_CABINETS.map((table) => table.name));
  const p12Names = new Set(P12_HIGH_TABLES.map((table) => table.name));

  return (
    <StaffChrome title="Schema health">
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
        Live check against conveyordb-testing. Tables are listed by name
        only. Empty tables stay empty.
      </p>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <Card className="gap-2 py-3">
            <CardHeader className="px-4 py-0">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                Overall
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 font-medium">
              {health.ok ? "All expected tables exist" : "Check failed"}
            </CardContent>
          </Card>
          <Card className="gap-2 py-3">
            <CardHeader className="px-4 py-0">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                Project
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 font-mono">
              {health.projectRef ?? "not configured"}
            </CardContent>
          </Card>
          <Card className="gap-2 py-3">
            <CardHeader className="px-4 py-0">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                Client
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              {health.usingServiceRole ? "service role" : "anon"}
            </CardContent>
          </Card>
          <Card className="gap-2 py-3">
            <CardHeader className="px-4 py-0">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                Checked
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 font-mono">
              {health.checkedAt}
            </CardContent>
          </Card>
        </div>

        {health.missingEnv.length > 0 ? (
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
            Missing env: {health.missingEnv.join(", ")}
          </p>
        ) : null}

        <TableList
          title="P11 cabinets"
          names={health.tables.filter((table) => p11Names.has(table.name))}
          probes={health.tables}
        />
        <TableList
          title="P12 High tables"
          names={health.tables.filter((table) => p12Names.has(table.name))}
          probes={health.tables}
        />

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Storage
          </h2>
          <div className="flex items-center justify-between rounded-md border bg-card px-4 py-3">
            <div>
              <p className="font-mono text-sm">{health.storage.bucket}</p>
              {health.storage.public === false ? (
                <p className="mt-1 text-xs text-muted-foreground">private</p>
              ) : null}
              {health.storage.error ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {health.storage.error}
                </p>
              ) : null}
            </div>
            <p className="flex items-center gap-2 font-mono text-sm">
              <StatusDot
                exists={health.storage.exists}
                error={health.storage.error}
              />
              <Badge variant="outline">
                {statusLabel(health.storage.exists, health.storage.error)}
              </Badge>
            </p>
          </div>
        </section>
    </StaffChrome>
  );
}
