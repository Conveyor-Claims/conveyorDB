import { listCases } from "@/lib/cases";
import { CASE_PIPELINES } from "@/lib/pipelines";
import { CasesListScreen } from "../cases/cases-list-screen";

export const dynamic = "force-dynamic";

const pipeline = CASE_PIPELINES["non-responsive"];

export const metadata = {
  title: `${pipeline.title} · ConveyorDB`,
  description: `All Cases filtered to Case Status ${pipeline.caseStatus}.`,
};

export default async function NonResponsivePage() {
  const list = await listCases({ caseStatus: pipeline.caseStatus });
  return <CasesListScreen title={pipeline.title} list={list} pipeline={pipeline} />;
}
