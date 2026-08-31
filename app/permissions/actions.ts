"use server";

import { refresh, revalidatePath } from "next/cache";
import {
  grantCaseView,
  revokeCaseView,
  setParalegalCanViewGrantedCases,
  type PermissionsState,
} from "@/lib/permissions";
import { revalidateCaseLists } from "@/lib/revalidate-cases";

export async function toggleParalegalViewAction(
  _prev: PermissionsState | null,
  formData: FormData,
): Promise<PermissionsState> {
  const enabled = formData.get("can_view_granted_cases") === "true";
  const result = await setParalegalCanViewGrantedCases(enabled);
  if (result.ok) {
    revalidateCaseLists();
    revalidatePath("/permissions");
    refresh();
  }
  return result;
}

export async function grantCaseViewAction(
  _prev: PermissionsState | null,
  formData: FormData,
): Promise<PermissionsState> {
  const caseId = String(formData.get("case_id") ?? "");
  const result = await grantCaseView(caseId);
  if (result.ok) {
    revalidateCaseLists(caseId);
    revalidatePath("/permissions");
    refresh();
  }
  return result;
}

export async function revokeCaseViewAction(
  _prev: PermissionsState | null,
  formData: FormData,
): Promise<PermissionsState> {
  const caseId = String(formData.get("case_id") ?? "");
  const result = await revokeCaseView(caseId);
  if (result.ok) {
    revalidateCaseLists(caseId);
    revalidatePath("/permissions");
    refresh();
  }
  return result;
}
