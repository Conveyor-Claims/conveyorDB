"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PIPELINE_LIST } from "@/lib/pipelines";

const LINKS = [
  { href: "/cases", label: "All Cases", matchPrefix: "/cases" },
  ...PIPELINE_LIST.map((pipeline) => ({
    href: pipeline.href,
    label: pipeline.navLabel,
  })),
  { href: "/health", label: "Health" },
] as const;

function isActive(pathname: string, href: string, matchPrefix?: string) {
  if (pathname === href) return true;
  if (matchPrefix) {
    return pathname === matchPrefix || pathname.startsWith(`${matchPrefix}/`);
  }
  return false;
}

export function StaffNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Staff" className="flex flex-col gap-1 px-3">
      {LINKS.map((link) => {
        const active = isActive(
          pathname,
          link.href,
          "matchPrefix" in link ? link.matchPrefix : undefined,
        );
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-[12px] px-3 py-2 text-sm ${
              active
                ? "bg-wash text-accent"
                : "text-muted hover:bg-wash hover:text-accent"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
