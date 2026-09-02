import { notFound } from "next/navigation";
import { CasesListScreen } from "../../cases/cases-list-screen";
import { listCases } from "@/lib/visible-cases";
import { DUE_DATE_BOARD_LIST, dueDateBoardBySlug } from "@/lib/due-date-boards";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return DUE_DATE_BOARD_LIST.map((board) => ({ slug: board.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const board = dueDateBoardBySlug(slug);
  if (!board) {
    return { title: "Due-date · ConveyorDB" };
  }
  return {
    title: `${board.title} · ConveyorDB`,
    description: `${board.title} due-date board.`,
  };
}

export default async function DueDateBoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const board = dueDateBoardBySlug(slug);
  if (!board) notFound();

  const list = await listCases({ dueDateColumn: board.dateColumn });
  return <CasesListScreen title={board.title} list={list} board={board} />;
}
