import { revalidatePath } from "next/cache";
import { DUE_DATE_BOARD_LIST } from "@/lib/due-date-boards";
import { PIPELINE_LIST } from "@/lib/pipelines";

/** Lists that read public.cases. Grouping keeps blank referred_firm. */
export function revalidateCaseLists(caseId?: string) {
  revalidatePath("/");
  revalidatePath("/cases");
  for (const pipeline of PIPELINE_LIST) {
    revalidatePath(pipeline.href);
  }
  for (const board of DUE_DATE_BOARD_LIST) {
    revalidatePath(board.href);
  }
  if (caseId) {
    revalidatePath(`/cases/${caseId}`);
  }
}
