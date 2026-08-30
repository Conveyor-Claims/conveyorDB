import type { AllCasesRow, DueDateFilterKey } from "@/lib/cases";

/**
 * P23 due-date boards: All Cases filtered/sorted by an existing dest date.
 * Labels match docs/catalog/fields.csv. Do not invent dest columns.
 * Appraisal Client is skipped — no appraisal_client_date / appraisal_client_due_date.
 */
export const DUE_DATE_BOARDS = {
  cid: {
    slug: "cid",
    href: "/boards/cid",
    title: "CID",
    navLabel: "CID",
    dateColumn: "cid_due_date",
    dateLabel: "CID Due Date",
    extraColumns: [{ key: "cid_due_date", label: "CID Due Date" }],
  },
  pl: {
    slug: "pl",
    href: "/boards/pl",
    title: "PL",
    navLabel: "PL",
    dateColumn: "pl_due_date",
    dateLabel: "PL Due Date",
    extraColumns: [{ key: "pl_due_date", label: "PL Due Date" }],
  },
  litigation: {
    slug: "litigation",
    href: "/boards/litigation",
    title: "Litigation due",
    navLabel: "Litigation due",
    dateColumn: "atty_due_date",
    dateLabel: "Atty Due Date",
    extraColumns: [{ key: "atty_due_date", label: "Atty Due Date" }],
  },
  euo: {
    slug: "euo",
    href: "/boards/euo",
    title: "EUO",
    navLabel: "EUO",
    dateColumn: "euo_date",
    dateLabel: "EUO Date",
    extraColumns: [{ key: "euo_date", label: "EUO Date" }],
  },
  "atty-client-appt": {
    slug: "atty-client-appt",
    href: "/boards/atty-client-appt",
    title: "Atty Client Appt",
    navLabel: "Atty Client Appt",
    dateColumn: "atty_client_appt",
    dateLabel: "Atty Client Appt",
    extraColumns: [{ key: "atty_client_appt", label: "Atty Client Appt" }],
  },
  rs: {
    slug: "rs",
    href: "/boards/rs",
    title: "RS",
    navLabel: "RS",
    dateColumn: "rs_due_date",
    dateLabel: "RS Due Date",
    extraColumns: [{ key: "rs_due_date", label: "RS Due Date" }],
  },
  "client-comm": {
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
  sol: {
    slug: "sol",
    href: "/boards/sol",
    title: "SOL",
    navLabel: "SOL",
    dateColumn: "sol_deadline",
    dateLabel: "SOL Deadline",
    extraColumns: [],
  },
} as const satisfies Record<
  string,
  {
    slug: string;
    href: string;
    title: string;
    navLabel: string;
    dateColumn: DueDateFilterKey;
    dateLabel: string;
    extraColumns: ReadonlyArray<{ key: keyof AllCasesRow; label: string }>;
  }
>;

export type DueDateBoardSlug = keyof typeof DUE_DATE_BOARDS;
export type DueDateBoard = (typeof DUE_DATE_BOARDS)[DueDateBoardSlug];

export const DUE_DATE_BOARD_LIST = [
  DUE_DATE_BOARDS.cid,
  DUE_DATE_BOARDS.pl,
  DUE_DATE_BOARDS.litigation,
  DUE_DATE_BOARDS.euo,
  DUE_DATE_BOARDS["atty-client-appt"],
  DUE_DATE_BOARDS.rs,
  DUE_DATE_BOARDS["client-comm"],
  DUE_DATE_BOARDS.sol,
] as const;

export function dueDateBoardBySlug(slug: string): DueDateBoard | undefined {
  return DUE_DATE_BOARD_LIST.find((board) => board.slug === slug);
}
