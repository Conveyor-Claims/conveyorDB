"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCaseFromForm,
  type CreateCaseState,
} from "@/lib/case-create";
import { PIPELINE_LIST } from "@/lib/pipelines";

export async function createCaseAction(
  _prev: CreateCaseState | null,
  formData: FormData,
): Promise<CreateCaseState> {
  const result = await createCaseFromForm(formData);
  if (result.ok && result.id) {
    revalidatePath("/cases");
    revalidatePath(`/cases/${result.id}`);
    for (const pipeline of PIPELINE_LIST) {
      revalidatePath(pipeline.href);
    }
    redirect(`/cases/${result.id}`);
  }
  return result;
}
