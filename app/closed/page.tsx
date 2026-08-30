import { listCases } from "@/lib/cases";
import { CASE_PIPELINES, pipelineStatusLabel } from "@/lib/pipelines";
import { CasesListScreen } from "../cases/cases-list-screen";

export const dynamic = "force-dynamic";

const pipeline = CASE_PIPELINES.closed;

export const metadata = {
  title: `${pipeline.title} · ConveyorDB`,
  description: `All Cases filtered to Case Status ${pipelineStatusLabel(pipeline)}.`,
};

export default async function ClosedPage() {
  const list = await listCases({ caseStatus: pipeline.caseStatus });
  return <CasesListScreen title={pipeline.title} list={list} pipeline={pipeline} />;
}
