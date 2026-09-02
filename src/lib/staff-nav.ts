import {
  DUE_DATE_BOARD_LIST,
  type DueDateBoard,
} from "@/lib/due-date-boards";
import { PIPELINE_LIST, pipelineStatuses } from "@/lib/pipelines";

export type StaffNavLink = {
  href: string;
  label: string;
  caseStatuses?: readonly string[];
};

export const ALL_CASES_HREF = "/cases";

export const PIPELINE_NAV_LINKS: readonly StaffNavLink[] = [
  { href: ALL_CASES_HREF, label: "All Cases" },
  ...PIPELINE_LIST.map((pipeline) => ({
    href: pipeline.href,
    label: pipeline.navLabel,
    caseStatuses: pipelineStatuses(pipeline),
  })),
];

export const BOARD_NAV_LINKS: readonly StaffNavLink[] =
  DUE_DATE_BOARD_LIST.map((board: DueDateBoard) => ({
    href: board.href,
    label: board.navLabel,
  }));

/** After login, `/` is All Cases. Signed-out `/` is the login landing. */
export function isAllCasesPath(pathname: string, signedIn = false): boolean {
  return pathname === ALL_CASES_HREF || (signedIn && pathname === "/");
}

export function isStaffNavActive(
  pathname: string,
  href: string,
  signedIn = false,
): boolean {
  if (href === ALL_CASES_HREF) {
    return isAllCasesPath(pathname, signedIn);
  }
  return pathname === href;
}
