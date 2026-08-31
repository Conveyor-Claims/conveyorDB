import { listAllCases } from "@/lib/visible-cases";
import { CasesListScreen } from "./cases-list-screen";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Cases · ConveyorDB",
  description: "Read-only list of public.cases.",
};

export default async function AllCasesPage() {
  const list = await listAllCases();
  return <CasesListScreen title="All Cases" list={list} />;
}
