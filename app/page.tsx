import Link from "next/link";
import { getSession, isAdmin, signInTemporaryAdmin, signOut } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { StaffChrome } from "./staff-chrome";

export default async function Home() {
  const signedIn = isAdmin(await getSession());

  return (
    <StaffChrome title="ConveyorDB">
      <p className="max-w-xl text-lg leading-7 text-muted-foreground">
        In-house Airtable replacement. All Cases reads{" "}
        <span className="font-mono text-base">public.cases</span>. Cabinets stay
        blank until rows are copied.
      </p>
      {signedIn ? (
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Signed in as temporary admin. Full access for now, until real user
          levels are set.
        </p>
      ) : (
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Temporary login. The button signs you in as admin. This is a stub
          until real user levels are set.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {signedIn ? (
          <form action={signOut}>
            <Button type="submit">Sign out</Button>
          </form>
        ) : (
          <form action={signInTemporaryAdmin}>
            <Button type="submit">Temporary login</Button>
          </form>
        )}
        <Button asChild variant="outline">
          <Link href="/cases">All Cases</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/health">Schema health</Link>
        </Button>
      </div>
    </StaffChrome>
  );
}
