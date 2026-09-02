import type { AllCasesRow, DueDateFilterKey } from "@/lib/cases";
import { DUE_DATE_SELECT_KEYS } from "@/lib/cases";

/**
 * Dest date columns that exist on public.cases.
 * Do not invent dest columns. Appraisal Client has none.
 */
export const DUE_DATE_DEST_COLUMNS = [
  ...DUE_DATE_SELECT_KEYS,
  "sol_deadline",
] as const satisfies ReadonlyArray<DueDateFilterKey>;

const DEST_DATE_COLUMN_SET = new Set<string>(DUE_DATE_DEST_COLUMNS);

export function destDateColumnExists(
  column: string | null | undefined,
): column is DueDateFilterKey {
  return Boolean(column && DEST_DATE_COLUMN_SET.has(column));
}

type DueDateBoardDef = {
  slug: string;
  href: string;
  title: string;
  navLabel: string;
  dateColumn: DueDateFilterKey | null;
  dateLabel: string;
  extraColumns: ReadonlyArray<{ key: keyof AllCasesRow; label: string }>;
};

/**
 * Intended due-date boards, including those with no dest column.
 * Appraisal Client is listed so it can be skipped — there is no
 * appraisal_client_date / appraisal_client_due_date.
 */
const DUE_DATE_BOARD_CANDIDATES = [
  {
    slug: "cid",
    href: "/boards/cid",
    title: "CID",
    navLabel: "CID",
    dateColumn: "cid_due_date",
    dateLabel: "CID Due Date",
    extraColumns: [{ key: "cid_due_date", label: "CID Due Date" }],
  },
  {
    slug: "pl",
    href: "/boards/pl",
    title: "PL",
    navLabel: "PL",
    dateColumn: "pl_due_date",
    dateLabel: "PL Due Date",
    extraColumns: [{ key: "pl_due_date", label: "PL Due Date" }],
  },
  {
    slug: "litigation",
    href: "/boards/litigation",
    title: "Litigation due",
    navLabel: "Litigation due",
    dateColumn: "atty_due_date",
    dateLabel: "Atty Due Date",
    extraColumns: [{ key: "atty_due_date", label: "Atty Due Date" }],
  },
  {
    slug: "euo",
    href: "/boards/euo",
    title: "EUO",
    navLabel: "EUO",
    dateColumn: "euo_date",
    dateLabel: "EUO Date",
    extraColumns: [{ key: "euo_date", label: "EUO Date" }],
  },
  {
    slug: "atty-client-appt",
    href: "/boards/atty-client-appt",
    title: "Atty Client Appt",
    navLabel: "Atty Client Appt",
    dateColumn: "atty_client_appt",
    dateLabel: "Atty Client Appt",
    extraColumns: [{ key: "atty_client_appt", label: "Atty Client Appt" }],
  },
  {
    slug: "rs",
    href: "/boards/rs",
    title: "RS",
    navLabel: "RS",
    dateColumn: "rs_due_date",
    dateLabel: "RS Due Date",
    extraColumns: [{ key: "rs_due_date", label: "RS Due Date" }],
  },
  {
    slug: "client-comm",
    href: "/boards/client-comm",
    title: "Client Comm",
    navLabel: "Client Comm",
    dateColumn: "next_client_comm_due_date",
    dateLabel: "Next Client Comm Due Date",
    extraColumns: [
      { key: "next_client_comm_due_date", label: "Next Client Comm Due Date" },
      { key: "recent_client_comm_date", label: "Recent Client Comm Date" },
    ],
  },
  {
    slug: "sol",
    href: "/boards/sol",
    title: "SOL",
    navLabel: "SOL",
    dateColumn: "sol_deadline",
    dateLabel: "SOL Deadline",
    extraColumns: [],
  },
  {
    slug: "appraisal-client",
    href: "/boards/appraisal-client",
    title: "Appraisal Client",
    navLabel: "Appraisal Client",
    dateColumn: null,
    dateLabel: "Appraisal Client",
    extraColumns: [],
  },
] as const satisfies ReadonlyArray<DueDateBoardDef>;

export type DueDateBoard = Extract<
  (typeof DUE_DATE_BOARD_CANDIDATES)[number],
  { dateColumn: DueDateFilterKey }
>;

export type DueDateBoardSlug = DueDateBoard["slug"];

export function boardHasDestColumn(
  board: DueDateBoardDef,
): board is DueDateBoard {
  return destDateColumnExists(board.dateColumn);
}

/** Boards staff can open. Skips any candidate with no dest column. */
export const DUE_DATE_BOARD_LIST = DUE_DATE_BOARD_CANDIDATES.filter(
  boardHasDestColumn,
);

export const DUE_DATE_BOARDS = Object.fromEntries(
  DUE_DATE_BOARD_LIST.map((board) => [board.slug, board]),
) as { [K in DueDateBoardSlug]: Extract<DueDateBoard, { slug: K }> };

export function dueDateBoardBySlug(slug: string): DueDateBoard | undefined {
  return DUE_DATE_BOARD_LIST.find((board) => board.slug === slug);
}

export function isSkippedDueDateBoardSlug(slug: string): boolean {
  return DUE_DATE_BOARD_CANDIDATES.some(
    (board) => board.slug === slug && !boardHasDestColumn(board),
  );
}
