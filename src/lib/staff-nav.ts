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

/** All Cases lives at `/` after login and at `/cases`. */
export function isAllCasesPath(pathname: string): boolean {
  return pathname === "/" || pathname === ALL_CASES_HREF;
}

export function isStaffNavActive(pathname: string, href: string): boolean {
  if (href === ALL_CASES_HREF) {
    return isAllCasesPath(pathname);
  }
  return pathname === href;
}
