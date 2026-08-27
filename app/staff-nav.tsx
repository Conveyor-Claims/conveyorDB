"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/cases", label: "All Cases", match: "/cases" },
  { href: "/health", label: "Health", match: "/health" },
] as const;

export function StaffNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Staff" className="flex flex-col gap-1 px-3">
      {LINKS.map((link) => {
        const active =
          pathname === link.match || pathname.startsWith(`${link.match}/`);
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
