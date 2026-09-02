import { listCases } from "@/lib/visible-cases";
import { CASE_PIPELINES } from "@/lib/pipelines";
import { CasesListScreen } from "../cases/cases-list-screen";

export const dynamic = "force-dynamic";

const pipeline = CASE_PIPELINES["pre-lit"];

export const metadata = {
  title: `${pipeline.title} · ConveyorDB`,
  description: pipeline.title,
};

export default async function PreLitPage() {
  const list = await listCases({ caseStatus: pipeline.caseStatus });
  return <CasesListScreen title={pipeline.title} list={list} pipeline={pipeline} />;
}
