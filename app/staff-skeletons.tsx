import { StaffNav } from "./staff-nav";
import { StaffShell } from "./staff-shell";

function Bone({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-[12px] bg-wash ${className}`}
      aria-hidden
    />
  );
}

function ListBones() {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading cases…</span>
      <div className="flex items-center justify-between gap-3">
        <Bone className="h-5 w-28" />
        <Bone className="h-8 w-56" />
      </div>
      <div className="space-y-2 rounded-xl border border-border bg-background p-3">
        <Bone className="h-9 w-full" />
        {Array.from({ length: 6 }, (_, index) => (
          <Bone key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

export function CasesListSkeleton({ title }: { title: string }) {
  return (
    <StaffShell title={title} wide nav={<StaffNav />}>
      <ListBones />
    </StaffShell>
  );
}

export function CaseDetailSkeleton() {
  return (
    <StaffShell title="" nav={<StaffNav />}>
      <div className="space-y-4" aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading case…</span>
        <Bone className="h-8 w-64" />
        <div className="flex flex-wrap gap-6 rounded-xl border border-border bg-wash px-4 py-3">
          <Bone className="h-10 w-28" />
          <Bone className="h-10 w-36" />
          <Bone className="h-10 w-28" />
        </div>
        <div className="space-y-3 rounded-xl border border-border bg-background px-4 py-3">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="flex gap-4">
              <Bone className="h-5 w-40" />
              <Bone className="h-5 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </StaffShell>
  );
}
