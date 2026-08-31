import { createAdminClient } from "@/lib/clients/admin";
import type { Database } from "@/lib/database.types";
import { getSession, isAdmin } from "@/lib/session";

export const PARALEGAL_ROLE = "paralegal" as const;

export type GrantableRole = typeof PARALEGAL_ROLE;

export type RolePermissionRow =
  Database["public"]["Tables"]["role_permissions"]["Row"];
export type CaseViewGrantRow =
  Database["public"]["Tables"]["case_view_grants"]["Row"];

export type PermissionCase = {
  id: string;
  case_number: string | null;
};

export type PermissionsState = {
  ok: boolean;
  message: string;
};

function adminOrError():
  | { ok: true; admin: NonNullable<ReturnType<typeof createAdminClient>> }
  | { ok: false; message: string } {
  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }
  return { ok: true, admin };
}

export async function requireAdminPermissions(): Promise<
  { ok: true } | { ok: false; message: string }
> {
  const session = await getSession();
  if (!isAdmin(session)) {
    return { ok: false, message: "Temporary admin login required." };
  }
  return { ok: true };
}

export async function listRolePermissions(): Promise<{
  rows: RolePermissionRow[];
  error: string | null;
}> {
  const gate = adminOrError();
  if (!gate.ok) return { rows: [], error: gate.message };

  const { data, error } = await gate.admin
    .from("role_permissions")
    .select("*")
    .eq("role_type", PARALEGAL_ROLE)
    .order("role_type", { ascending: true });

  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function listGrantableCases(): Promise<{
  rows: PermissionCase[];
  error: string | null;
}> {
  const gate = adminOrError();
  if (!gate.ok) return { rows: [], error: gate.message };

  const { data, error } = await gate.admin
    .from("cases")
    .select("id, case_number")
    .order("case_number", { ascending: true });

  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function listCaseViewGrants(
  roleType: GrantableRole = PARALEGAL_ROLE,
): Promise<{
  rows: CaseViewGrantRow[];
  error: string | null;
}> {
  const gate = adminOrError();
  if (!gate.ok) return { rows: [], error: gate.message };

  const { data, error } = await gate.admin
    .from("case_view_grants")
    .select("*")
    .eq("role_type", roleType)
    .order("created_at", { ascending: true });

  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function setParalegalCanViewGrantedCases(
  enabled: boolean,
): Promise<PermissionsState> {
  const allowed = await requireAdminPermissions();
  if (!allowed.ok) return allowed;

  const gate = adminOrError();
  if (!gate.ok) return gate;

  const { error } = await gate.admin
    .from("role_permissions")
    .update({
      can_view_granted_cases: enabled,
      updated_at: new Date().toISOString(),
    })
    .eq("role_type", PARALEGAL_ROLE);

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: enabled ? "Paralegal viewing on." : "Paralegal viewing off." };
}

export async function grantCaseView(
  caseId: string,
  roleType: GrantableRole = PARALEGAL_ROLE,
): Promise<PermissionsState> {
  const allowed = await requireAdminPermissions();
  if (!allowed.ok) return allowed;

  const gate = adminOrError();
  if (!gate.ok) return gate;

  const { error } = await gate.admin.from("case_view_grants").insert({
    role_type: roleType,
    case_id: caseId,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: true, message: "Already granted." };
    }
    return { ok: false, message: error.message };
  }
  return { ok: true, message: "Granted." };
}

export async function revokeCaseView(
  caseId: string,
  roleType: GrantableRole = PARALEGAL_ROLE,
): Promise<PermissionsState> {
  const allowed = await requireAdminPermissions();
  if (!allowed.ok) return allowed;

  const gate = adminOrError();
  if (!gate.ok) return gate;

  const { error } = await gate.admin
    .from("case_view_grants")
    .delete()
    .eq("role_type", roleType)
    .eq("case_id", caseId);

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Revoked." };
}
