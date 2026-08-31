"use server";

import { refresh, revalidatePath } from "next/cache";
import {
  addPersonFromForm,
  type AddPersonState,
} from "@/lib/contacts";
import {
  createCommentFromForm,
  type CreateCommentState,
} from "@/lib/comments";
import {
  updateCaseFromForm,
  type UpdateCaseState,
} from "@/lib/case-save";
import {
  uploadFileFromForm,
  type UploadFileState,
} from "@/lib/files";
import {
  addNextStepFromForm,
  claimNextStepFromForm,
  type NextStepState,
} from "@/lib/next-steps";
import { revalidateCaseLists } from "@/lib/revalidate-cases";

export async function updateCaseAction(
  _prev: UpdateCaseState | null,
  formData: FormData,
): Promise<UpdateCaseState> {
  const result = await updateCaseFromForm(formData);
  if (result.ok) {
    const idRaw = formData.get("caseRowId");
    const id = typeof idRaw === "string" ? idRaw : "";
    revalidateCaseLists(id || undefined);
    refresh();
  }
  return result;
}

export async function createCommentAction(
  _prev: CreateCommentState | null,
  formData: FormData,
): Promise<CreateCommentState> {
  const result = await createCommentFromForm(formData);
  if (result.ok && result.id) {
    const idRaw = formData.get("caseRowId");
    const id = typeof idRaw === "string" ? idRaw : "";
    if (id) {
      revalidatePath(`/cases/${id}`);
    }
    refresh();
  }
  return result;
}

export async function addPersonAction(
  _prev: AddPersonState | null,
  formData: FormData,
): Promise<AddPersonState> {
  const result = await addPersonFromForm(formData);
  if (result.ok && result.id) {
    const idRaw = formData.get("caseRowId");
    const id = typeof idRaw === "string" ? idRaw : "";
    if (id) {
      revalidatePath(`/cases/${id}`);
    }
    refresh();
  }
  return result;
}

export async function uploadFileAction(
  _prev: UploadFileState | null,
  formData: FormData,
): Promise<UploadFileState> {
  const result = await uploadFileFromForm(formData);
  if (result.ok && result.id) {
    const idRaw = formData.get("caseRowId");
    const id = typeof idRaw === "string" ? idRaw : "";
    if (id) {
      revalidatePath(`/cases/${id}`);
    }
    refresh();
  }
  return result;
}

export async function claimNextStepAction(
  _prev: NextStepState | null,
  formData: FormData,
): Promise<NextStepState> {
  const result = await claimNextStepFromForm(formData);
  if (result.ok && result.id) {
    const idRaw = formData.get("caseRowId");
    const id = typeof idRaw === "string" ? idRaw : "";
    if (id) {
      revalidatePath(`/cases/${id}`);
    }
    refresh();
  }
  return result;
}

export async function addNextStepAction(
  _prev: NextStepState | null,
  formData: FormData,
): Promise<NextStepState> {
  const result = await addNextStepFromForm(formData);
  if (result.ok && result.id) {
    const idRaw = formData.get("caseRowId");
    const id = typeof idRaw === "string" ? idRaw : "";
    if (id) {
      revalidatePath(`/cases/${id}`);
    }
    refresh();
  }
  return result;
}
