"use server";

import { refresh, revalidatePath } from "next/cache";
import {
  updateCaseFromForm,
  type UpdateCaseState,
} from "@/lib/case-save";

export async function updateCaseAction(
  _prev: UpdateCaseState | null,
  formData: FormData,
): Promise<UpdateCaseState> {
  const result = await updateCaseFromForm(formData);
  if (result.ok) {
    const idRaw = formData.get("caseRowId");
    const id = typeof idRaw === "string" ? idRaw : "";
    if (id) {
      revalidatePath(`/cases/${id}`);
    }
    revalidatePath("/cases");
    revalidatePath("/referrals");
    revalidatePath("/pre-lit");
    revalidatePath("/litigation");
    refresh();
  }
  return result;
}
