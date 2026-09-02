"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { StatusDot } from "./choice-pill";
import { signOut } from "@/lib/session-actions";
import {
  BOARD_NAV_LINKS,
  PIPELINE_NAV_LINKS,
  isStaffNavActive,
} from "@/lib/staff-nav";

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
      aria-current={active ? "page" : undefined}
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

function NavGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="px-3 pb-1 text-xs text-muted">{label}</p>
      {children}
    </div>
  );
}

export function StaffNav({
  showCreateCase = false,
  showPermissions = false,
  signedIn = false,
  accountLabel = "",
  accountInitials = "",
}: {
  showCreateCase?: boolean;
  showPermissions?: boolean;
  signedIn?: boolean;
  accountLabel?: string;
  accountInitials?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Staff" className="flex flex-col gap-3 px-3 pb-3">
      <NavGroup label="Pipelines">
        {PIPELINE_NAV_LINKS.slice(0, 1).map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            active={isStaffNavActive(pathname, link.href)}
          />
        ))}
        {showCreateCase ? (
          <NavLink
            href="/cases/new"
            label="Create case"
            active={isStaffNavActive(pathname, "/cases/new")}
          />
        ) : null}
        {PIPELINE_NAV_LINKS.slice(1).map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            active={isStaffNavActive(pathname, link.href)}
            caseStatuses={link.caseStatuses}
          />
        ))}
      </NavGroup>

      <NavGroup label="Boards">
        {BOARD_NAV_LINKS.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            active={isStaffNavActive(pathname, link.href)}
          />
        ))}
      </NavGroup>

      <div className="space-y-1">
        <NavLink
          href="/health"
          label="Health"
          active={isStaffNavActive(pathname, "/health")}
        />
      </div>

      <div className="space-y-1 border-t border-border pt-3">
        <div className="flex items-center gap-2 px-1 py-1">
          <span
            aria-hidden
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-wash text-xs font-medium text-muted"
          >
            {accountInitials}
          </span>
          {signedIn ? (
            <p className="truncate text-sm text-foreground">{accountLabel}</p>
          ) : null}
        </div>
        {showPermissions ? (
          <NavLink
            href="/permissions"
            label="Permissions"
            active={isStaffNavActive(pathname, "/permissions")}
          />
        ) : null}
        {signedIn ? (
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-[12px] px-3 py-2 text-left text-sm text-muted hover:bg-wash hover:text-accent"
            >
              Sign out
            </button>
          </form>
        ) : (
          <NavLink
            href="/login"
            label="Temporary login"
            active={isStaffNavActive(pathname, "/login")}
          />
        )}
      </div>
    </nav>
  );
}
