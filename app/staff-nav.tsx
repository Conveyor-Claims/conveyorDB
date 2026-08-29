"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

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
          <Button
            key={link.href}
            asChild
            variant={active ? "secondary" : "ghost"}
            size="sm"
            className="justify-start"
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        );
      })}
    </nav>
  );
}
