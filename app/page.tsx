import Link from "next/link";
import { CasesListScreen } from "./cases/cases-list-screen";
import { StaffChrome } from "./staff-chrome";
import { getSession, isSignedIn } from "@/lib/session";
import { listAllCases } from "@/lib/visible-cases";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  if (isSignedIn(await getSession())) {
    return {
      title: "All Cases · ConveyorDB",
      description: "All Cases.",
    };
  }
  return {
    title: "ConveyorDB",
    description: "Conveyor Claims case lists and boards.",
  };
}

export default async function Home() {
  const session = await getSession();

  if (isSignedIn(session)) {
    const list = await listAllCases();
    return <CasesListScreen title="All Cases" list={list} />;
  }

  return (
    <StaffChrome title="ConveyorDB">
      <p className="max-w-xl text-sm leading-6 text-muted">
        Temporary login stubs live on the login page. No passwords. Google
        sign-in comes later.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/login"
          className="w-fit rounded-[12px] bg-accent px-5 py-2.5 text-sm font-medium text-accent-on hover:bg-accent-hover"
        >
          Temporary login
        </Link>
        <Link
          href="/cases"
          className="w-fit rounded-[12px] border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground"
        >
          All Cases
        </Link>
      </div>
    </StaffChrome>
  );
}
