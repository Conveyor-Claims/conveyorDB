"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StatusDot } from "./choice-pill";
import { DUE_DATE_BOARD_LIST } from "@/lib/due-date-boards";
import { PIPELINE_LIST, pipelineStatuses } from "@/lib/pipelines";

const CASE_LINKS = [
  { href: "/cases", label: "All Cases" },
  ...PIPELINE_LIST.map((pipeline) => ({
    href: pipeline.href,
    label: pipeline.navLabel,
    caseStatuses: pipelineStatuses(pipeline),
  })),
] as const;

const DUE_DATE_LINKS = DUE_DATE_BOARD_LIST.map((board) => ({
  href: board.href,
  label: board.navLabel,
}));

function isActive(pathname: string, href: string) {
  return pathname === href;
}

function NavLink({
  href,
  label,
  active,
  caseStatuses,
}: {
  href: string;
  label: string;
  active: boolean;
  caseStatuses?: readonly string[];
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-[12px] px-3 py-2 text-sm ${
        active
          ? "bg-wash text-accent"
          : "text-muted hover:bg-wash hover:text-accent"
      }`}
    >
      {caseStatuses?.map((status) => (
        <StatusDot key={status} status={status} />
      ))}
      {label}
    </Link>
  );
}

export function StaffNav({
  showCreateCase = false,
}: {
  showCreateCase?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Staff" className="flex flex-col gap-1 px-3">
      {CASE_LINKS.slice(0, 1).map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          active={isActive(pathname, link.href)}
        />
      ))}
      {showCreateCase ? (
        <NavLink
          href="/cases/new"
          label="Create case"
          active={isActive(pathname, "/cases/new")}
        />
      ) : null}
      {CASE_LINKS.slice(1).map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          active={isActive(pathname, link.href)}
          caseStatuses={"caseStatuses" in link ? link.caseStatuses : undefined}
        />
      ))}
      <div className="mt-3 space-y-1">
        <p className="px-3 pb-1 text-xs text-muted">Due-date</p>
        {DUE_DATE_LINKS.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            active={isActive(pathname, link.href)}
          />
        ))}
      </div>
      <div className="mt-3">
        <NavLink
          href="/health"
          label="Health"
          active={isActive(pathname, "/health")}
        />
      </div>
    </nav>
  );
}
