"use client";

import { Children, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export type CaseSectionChrome = {
  name: string;
  anchor: string;
  defaultOpen: boolean;
};

export function CaseSections({
  sections,
  children,
}: {
  sections: readonly CaseSectionChrome[];
  children: ReactNode;
}) {
  const panels = Children.toArray(children);
  const [openNames, setOpenNames] = useState<string[]>(() =>
    sections.filter((section) => section.defaultOpen).map((section) => section.name),
  );

  function isOpen(name: string) {
    return openNames.includes(name);
  }

  function toggle(name: string) {
    setOpenNames((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  }

  function reveal(name: string) {
    setOpenNames((current) =>
      current.includes(name) ? current : [...current, name],
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <nav
        aria-label="Case sections"
        className="flex gap-1 overflow-x-auto border-b pb-2"
      >
        {sections.map((section) => (
          <Button
            key={section.anchor}
            asChild
            variant={isOpen(section.name) ? "secondary" : "outline"}
            size="xs"
          >
            <a
              href={`#${section.anchor}`}
              onClick={() => reveal(section.name)}
            >
              {section.name}
            </a>
          </Button>
        ))}
      </nav>

      <div className="flex flex-col gap-3">
        {sections.map((section, index) => {
          const open = isOpen(section.name);
          return (
            <Card
              key={section.anchor}
              id={section.anchor}
              className="scroll-mt-6 gap-0 py-0"
            >
              <CardHeader className="p-0">
                <h2>
                  <Button
                    type="button"
                    variant="ghost"
                    aria-expanded={open}
                    onClick={() => toggle(section.name)}
                    className="h-auto w-full justify-between rounded-none px-4 py-2.5 text-left font-medium"
                  >
                    <span>{section.name}</span>
                    <span aria-hidden className="text-muted-foreground">
                      {open ? "▾" : "▸"}
                    </span>
                  </Button>
                </h2>
              </CardHeader>
              {open ? (
                <CardContent className="px-0 pb-0">{panels[index]}</CardContent>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
