import { redirect } from "next/navigation";
import {
  listCaseViewGrants,
  listGrantableCases,
  listRolePermissions,
} from "@/lib/permissions";
import { getSession, isAdmin, isSignedIn } from "@/lib/session";
import { StaffChrome } from "../staff-chrome";
import { PermissionsForm } from "./permissions-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Permissions · ConveyorDB",
  description: "Admin grants which cases a paralegal can view.",
};

export default async function PermissionsPage() {
  const session = await getSession();
  if (!isAdmin(session)) {
    redirect(isSignedIn(session) ? "/cases" : "/login");
  }

  const [permissions, cases, grants] = await Promise.all([
    listRolePermissions(),
    listGrantableCases(),
    listCaseViewGrants(),
  ]);

  const paralegal = permissions.rows.find((row) => row.role_type === "paralegal");
  const canViewGrantedCases = paralegal?.can_view_granted_cases ?? false;
  const error = permissions.error ?? cases.error ?? grants.error;

  return (
    <StaffChrome title="Permissions" wide>
      <p className="max-w-2xl text-sm leading-6 text-muted">
        Toggle permissions for other user types. Only{" "}
        <span className="font-medium text-foreground">Paralegal</span> exists
        now. Grant or revoke which Managed Cases that type can view. Per case.
        Not automatic. Not by firm.
      </p>

      {error ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <PermissionsForm
        canViewGrantedCases={canViewGrantedCases}
        cases={cases.rows}
        grantedCaseIds={grants.rows.map((row) => row.case_id)}
      />
    </StaffChrome>
  );
}
