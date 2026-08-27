import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, isAdmin, signInTemporaryAdmin } from "@/lib/session";
import { StaffChrome } from "../staff-chrome";

export const metadata = {
  title: "Temporary login · ConveyorDB",
  description: "Temporary admin login stub.",
};

export default async function LoginPage() {
  if (isAdmin(await getSession())) {
    redirect("/cases");
  }

  return (
    <StaffChrome title="Temporary login">
      <p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        Temporary login. The button signs you in as admin. This is a stub
        until real user levels are set.
      </p>
      <div className="max-w-sm space-y-3">
        <form action={signInTemporaryAdmin}>
          <button
            type="submit"
            className="w-full rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-950"
          >
            Temporary login
          </button>
        </form>
        <Link
          href="/cases"
          className="inline-block text-sm text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
        >
          All Cases
        </Link>
      </div>
    </StaffChrome>
  );
}
