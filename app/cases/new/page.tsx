import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, isAdmin, isParalegal } from "@/lib/session";
import { StaffChrome } from "../../staff-chrome";
import { CreateCaseForm } from "./create-case-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create case · ConveyorDB",
  description: "Staff create a case. Case Number is assigned on save.",
};

export default async function CreateCasePage() {
  const session = await getSession();
  if (isParalegal(session)) {
    redirect("/cases");
  }
  const canCreate = isAdmin(session);

  return (
    <StaffChrome title="Create case">
      <p className="max-w-2xl text-sm leading-6 text-muted">
        Enter Client Name. Next Steps defaults to the existing{" "}
        <span className="font-medium text-foreground">
          Prepare/Update Claim Summary - CNVR
        </span>{" "}
        option; staff can change it to another existing name. Case Number is
        assigned on save and is not typed.
        Case Status is stored{" "}
        <span className="font-medium text-foreground">Referral</span> so the
        row appears on{" "}
        <Link href="/new-cases" className="text-accent hover:text-accent-hover">
          New cases
        </Link>
        . Blank fields stay blank.
      </p>

      <p>
        <Link
          href="/cases"
          className="font-mono text-sm text-accent hover:text-accent-hover"
        >
          All Cases
        </Link>
      </p>

      {canCreate ? (
        <CreateCaseForm />
      ) : (
        <p className="text-sm text-muted">
          <Link href="/login" className="text-accent hover:text-accent-hover">
            Temporary login
          </Link>{" "}
          to create a case.
        </p>
      )}
    </StaffChrome>
  );
}
