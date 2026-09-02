import { listAllCases } from "@/lib/visible-cases";
import { CasesListScreen } from "./cases-list-screen";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Cases · ConveyorDB",
  description: "All Cases.",
};

export default async function AllCasesPage() {
  const list = await listAllCases();
  return <CasesListScreen title="All Cases" list={list} />;
}
