import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, isAdmin, signInTemporaryAdmin } from "@/lib/session";
import { Button } from "@/components/ui/button";
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
      <p className="max-w-xl text-sm leading-6 text-muted-foreground">
        Temporary login. The button signs you in as admin. This is a stub
        until real user levels are set.
      </p>
      <div className="flex max-w-sm flex-col gap-3">
        <form action={signInTemporaryAdmin}>
          <Button type="submit" className="w-full">
            Temporary login
          </Button>
        </form>
        <Button asChild variant="link" className="h-auto justify-start px-0">
          <Link href="/cases">All Cases</Link>
        </Button>
      </div>
    </StaffChrome>
  );
}
