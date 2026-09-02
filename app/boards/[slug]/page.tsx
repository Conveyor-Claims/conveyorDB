import { redirect } from "next/navigation";
import { CasesListScreen } from "../../cases/cases-list-screen";
import { StaffMissingPage } from "../../staff-missing";
import { listCases } from "@/lib/visible-cases";
import {
  DUE_DATE_BOARD_LIST,
  dueDateBoardBySlug,
  isSkippedDueDateBoardSlug,
} from "@/lib/due-date-boards";

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
  if (isSkippedDueDateBoardSlug(slug)) {
    return { title: "All Cases · ConveyorDB" };
  }
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
  if (isSkippedDueDateBoardSlug(slug)) {
    redirect("/cases");
  }
  const board = dueDateBoardBySlug(slug);
  if (!board) {
    return (
      <StaffMissingPage
        title="Board not found"
        message="No due-date board at this URL."
      />
    );
  }

  const list = await listCases({ dueDateColumn: board.dateColumn });
  return <CasesListScreen title={board.title} list={list} board={board} />;
}
