"use server";

import { refresh, revalidatePath } from "next/cache";
import {
  updateCaseFromForm,
  type UpdateCaseState,
} from "@/lib/case-save";
import { PIPELINE_LIST } from "@/lib/pipelines";

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
    for (const pipeline of PIPELINE_LIST) {
      revalidatePath(pipeline.href);
    }
    refresh();
  }
  return result;
}
