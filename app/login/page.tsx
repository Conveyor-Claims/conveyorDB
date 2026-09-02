import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, isSignedIn } from "@/lib/session";
import {
  signInTemporaryAdmin,
  signInTemporaryParalegal,
} from "@/lib/session-actions";
import { StaffChrome } from "../staff-chrome";

export const metadata = {
  title: "Temporary login · ConveyorDB",
  description: "Temporary admin and paralegal login stubs.",
};

export default async function LoginPage() {
  if (isSignedIn(await getSession())) {
    redirect("/");
  }

  return (
    <StaffChrome title="Temporary login">
      <div className="max-w-xl space-y-4 text-sm leading-6 text-muted">
        <p>
          These are temporary stubs, not real accounts. There are no passwords
          and no Google sign-in yet. Each button sets a session cookie and
          lands on All Cases.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">Temporary admin</span>{" "}
            sees every stored case, can create cases, and can grant or revoke
            which cases a paralegal may view.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Temporary paralegal
            </span>{" "}
            sees only cases an admin has granted. Create case and Permissions
            stay hidden.
          </li>
        </ul>
      </div>
      <div className="max-w-sm space-y-3">
        <form action={signInTemporaryAdmin}>
          <button
            type="submit"
            className="w-full rounded-[12px] bg-accent px-5 py-2.5 text-sm font-medium text-accent-on hover:bg-accent-hover"
          >
            Temporary admin login
          </button>
        </form>
        <form action={signInTemporaryParalegal}>
          <button
            type="submit"
            className="w-full rounded-[12px] border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-wash"
          >
            Temporary paralegal login
          </button>
        </form>
        <Link
          href="/cases"
          className="inline-block text-sm text-accent underline-offset-4 hover:text-accent-hover hover:underline"
        >
          All Cases
        </Link>
      </div>
    </StaffChrome>
  );
}
