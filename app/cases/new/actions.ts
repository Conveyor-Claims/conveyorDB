"use server";

import { redirect } from "next/navigation";
import {
  createCaseFromForm,
  type CreateCaseState,
} from "@/lib/case-create";
import { revalidateCaseLists } from "@/lib/revalidate-cases";

export async function createCaseAction(
  _prev: CreateCaseState | null,
  formData: FormData,
): Promise<CreateCaseState> {
  const result = await createCaseFromForm(formData);
  if (result.ok && result.id) {
    revalidateCaseLists(result.id);
    redirect(`/cases/${result.id}`);
  }
  return result;
}
