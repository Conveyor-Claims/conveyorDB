import Link from "next/link";
import {
  getSession,
  isAdmin,
  isSignedIn,
  signOut,
} from "@/lib/session";
import { ChoicePill } from "./choice-pill";
import { StaffChrome } from "./staff-chrome";
import { PIPELINE_LIST, pipelineStatuses } from "@/lib/pipelines";

export default async function Home() {
  const session = await getSession();
  const signedIn = isSignedIn(session);
  const admin = isAdmin(session);

  return (
    <StaffChrome title="ConveyorDB">
      {admin ? (
        <p className="max-w-xl text-sm leading-6 text-muted">
          Signed in as temporary admin. Full access for now, until real user
          levels are set.
        </p>
      ) : signedIn ? (
        <p className="max-w-xl text-sm leading-6 text-muted">
          Signed in as temporary paralegal. Lists show only cases an admin has
          granted.
        </p>
      ) : (
        <p className="max-w-xl text-sm leading-6 text-muted">
          Temporary login stubs live on the login page. No passwords. Google
          sign-in comes later.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {signedIn ? (
          <form action={signOut}>
            <button
              type="submit"
              className="w-fit rounded-[12px] bg-accent px-5 py-2.5 text-sm font-medium text-accent-on hover:bg-accent-hover"
            >
              Sign out
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="w-fit rounded-[12px] bg-accent px-5 py-2.5 text-sm font-medium text-accent-on hover:bg-accent-hover"
          >
            Temporary login
          </Link>
        )}
        <Link
          href="/cases"
          className="w-fit rounded-[12px] border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground"
        >
          All Cases
        </Link>
        {admin ? (
          <Link
            href="/cases/new"
            className="w-fit rounded-[12px] border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground"
          >
            Create case
          </Link>
        ) : null}
        {PIPELINE_LIST.map((pipeline) => (
          <Link
            key={pipeline.href}
            href={pipeline.href}
            className="inline-flex w-fit items-center gap-2 rounded-[12px] border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground"
          >
            {pipeline.navLabel}
            {pipelineStatuses(pipeline).map((status) => (
              <ChoicePill key={status} value={status} field="case_status" />
            ))}
          </Link>
        ))}
        <Link
          href="/health"
          className="w-fit rounded-[12px] border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground"
        >
          Health
        </Link>
      </div>
    </StaffChrome>
  );
}
