"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StatusDot } from "./choice-pill";
import { PIPELINE_LIST } from "@/lib/pipelines";

const LINKS = [
  { href: "/cases", label: "All Cases" },
  ...PIPELINE_LIST.map((pipeline) => ({
    href: pipeline.href,
    label: pipeline.navLabel,
    caseStatus: pipeline.caseStatus,
  })),
  { href: "/health", label: "Health" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href;
}

export function StaffNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Staff" className="flex flex-col gap-1 px-3">
      {LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 rounded-[12px] px-3 py-2 text-sm ${
              active
                ? "bg-wash text-accent"
                : "text-muted hover:bg-wash hover:text-accent"
            }`}
          >
            {"caseStatus" in link ? (
              <StatusDot status={link.caseStatus} />
            ) : null}
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
